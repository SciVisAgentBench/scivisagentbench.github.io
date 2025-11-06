// Firebase Integration - Simple and Clean
// Replaces localStorage functions with Firebase versions

// Helper: Generate unique ID
function generateFirebaseId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Helper: Upload a file to Firebase Storage
async function uploadFileToStorage(file, path) {
    const storageRef = window.firebaseStorage.ref(path);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();
    return url;
}

// Helper: Show upload progress
function showUploadProgress(message, percent) {
    let progressEl = document.getElementById('upload-progress-bar');

    if (!progressEl) {
        const overlay = document.createElement('div');
        overlay.id = 'upload-progress-bar';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        overlay.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 0.5rem; min-width: 350px; text-align: center;">
                <div id="progress-message" style="margin-bottom: 1rem; font-weight: 600; color: #2563eb;">${message}</div>
                <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div id="progress-fill" style="width: ${percent}%; height: 100%; background: #2563eb; transition: width 0.3s;"></div>
                </div>
                <div id="progress-percent" style="margin-top: 0.5rem; color: #64748b;">${percent}%</div>
            </div>
        `;

        document.body.appendChild(overlay);
        progressEl = overlay;
    } else {
        document.getElementById('progress-message').textContent = message;
        document.getElementById('progress-fill').style.width = percent + '%';
        document.getElementById('progress-percent').textContent = percent + '%';
    }

    if (percent >= 100) {
        setTimeout(() => {
            if (progressEl && progressEl.parentNode) {
                progressEl.parentNode.removeChild(progressEl);
            }
        }, 1000);
    }
}

// OVERRIDE: Save submission to Firebase
if (window.firebaseReady) {
    console.log('🔥 Firebase integration active - using cloud storage');

    // Replace saveSubmission function
    const originalSaveSubmission = saveSubmission;
    saveSubmission = async function(submission, files) {
        try {
            const submissionId = generateFirebaseId();

            showUploadProgress('Preparing upload...', 10);

            // Upload source data file
            let sourceDataUrl = null;
            if (files.sourceData) {
                showUploadProgress('Uploading source data...', 20);
                sourceDataUrl = await uploadFileToStorage(
                    files.sourceData,
                    `submissions/${submissionId}/source/${files.sourceData.name}`
                );
            }

            // Upload ground truth images
            showUploadProgress('Uploading ground truth images...', 50);
            const groundTruthUrls = [];
            if (files.groundTruthImages && files.groundTruthImages.length > 0) {
                for (const file of files.groundTruthImages) {
                    const url = await uploadFileToStorage(
                        file,
                        `submissions/${submissionId}/groundtruth/${file.name}`
                    );
                    groundTruthUrls.push({ name: file.name, url: url, size: file.size });
                }
            }

            // Upload visualization state (optional)
            let vizStateUrl = null;
            if (files.vizEngineState) {
                showUploadProgress('Uploading visualization state...', 70);
                vizStateUrl = await uploadFileToStorage(
                    files.vizEngineState,
                    `submissions/${submissionId}/state/${files.vizEngineState.name}`
                );
            }

            // Upload user's additional metadata file (optional)
            let additionalMetadataUrl = null;
            if (files.metadataFile) {
                showUploadProgress('Uploading additional metadata...', 75);
                additionalMetadataUrl = await uploadFileToStorage(
                    files.metadataFile,
                    `submissions/${submissionId}/additional/${files.metadataFile.name}`
                );
            }

            // Generate and upload metadata.json
            showUploadProgress('Generating metadata...', 80);
            const metadataJson = {
                submissionId: submissionId,
                timestamp: new Date().toISOString(),
                contributor: {
                    name: submission.contributorName,
                    email: submission.contributorEmail,
                    institution: submission.contributorInstitution
                },
                dataset: {
                    name: submission.datasetName,
                    description: submission.datasetDescription,
                    applicationDomain: submission.applicationDomain
                },
                taxonomy: {
                    dataType: submission.dataType,
                    temporalDimension: submission.temporalDimension,
                    attributeType: submission.attributeType,
                    taskTaxonomy: submission.taskTaxonomy,
                    dataTypeOther: submission.dataTypeOther || null
                },
                task: {
                    description: submission.taskDescription,
                    complexity: submission.taskComplexity,
                    evaluationCriteria: submission.evalCriteria
                },
                files: {
                    sourceData: files.sourceData ? {
                        name: files.sourceData.name,
                        size: files.sourceData.size,
                        type: files.sourceData.type
                    } : null,
                    groundTruthImages: files.groundTruthImages.map(f => ({
                        name: f.name,
                        size: f.size,
                        type: f.type
                    })),
                    vizEngineState: files.vizEngineState ? {
                        name: files.vizEngineState.name,
                        size: files.vizEngineState.size,
                        type: files.vizEngineState.type
                    } : null,
                    additionalMetadata: files.metadataFile ? {
                        name: files.metadataFile.name,
                        size: files.metadataFile.size,
                        type: files.metadataFile.type
                    } : null
                }
            };

            // Upload metadata.json as a file
            const metadataBlob = new Blob([JSON.stringify(metadataJson, null, 2)], { type: 'application/json' });
            const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
            const metadataJsonUrl = await uploadFileToStorage(
                metadataFile,
                `submissions/${submissionId}/metadata.json`
            );

            // Save to Firestore
            showUploadProgress('Saving to database...', 90);

            // Prepare submission data for Firestore
            const submissionData = {
                ...submission,
                id: submissionId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                files: {
                    metadataJson: {
                        name: 'metadata.json',
                        url: metadataJsonUrl,
                        size: metadataBlob.size
                    },
                    sourceData: sourceDataUrl ? {
                        name: files.sourceData.name,
                        url: sourceDataUrl,
                        size: files.sourceData.size
                    } : null,
                    groundTruthImages: groundTruthUrls,
                    vizEngineState: vizStateUrl ? {
                        name: files.vizEngineState.name,
                        url: vizStateUrl,
                        size: files.vizEngineState.size
                    } : null,
                    additionalMetadata: additionalMetadataUrl ? {
                        name: files.metadataFile.name,
                        url: additionalMetadataUrl,
                        size: files.metadataFile.size
                    } : null
                }
            };

            await window.firebaseDB.collection('submissions').doc(submissionId).set(submissionData);

            showUploadProgress('Complete!', 100);
            console.log('✅ Saved to Firebase:', submissionId);

        } catch (error) {
            console.error('❌ Firebase save failed:', error);
            showUploadProgress('Upload failed', 0);
            throw error;
        }
    };

    // Replace loadSubmissions function
    const originalLoadSubmissions = loadSubmissions;
    loadSubmissions = async function() {
        try {
            const snapshot = await window.firebaseDB.collection('submissions')
                .orderBy('timestamp', 'desc')
                .get();

            const submissions = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                submissions.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString()
                });
            });

            appState.submissions = submissions;
            console.log('📂 Loaded from Firebase:', submissions.length, 'submissions');

            // Update dashboard after loading data
            updateDashboard();

        } catch (error) {
            console.error('❌ Firebase load failed:', error);
            console.log('⚠️ Falling back to localStorage');
            originalLoadSubmissions();
            updateDashboard();
        }
    };

} else {
    console.log('💾 Firebase not available - using localStorage');
}
