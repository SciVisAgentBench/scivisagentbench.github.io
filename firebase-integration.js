// Firebase Integration for SciVisAgentBench
// This file replaces localStorage with Firebase Firestore and Storage

// ==========================================
// FIREBASE FUNCTIONS
// ==========================================

/**
 * Save submission to Firebase
 * @param {Object} submission - The submission data
 * @param {Object} files - The file objects from the form
 * @returns {Promise<boolean>} - Success status
 */
async function saveSubmissionToFirebase(submission, files) {
    try {
        const submissionId = generateId();

        // Show progress
        updateProgress('Uploading files...', 10);

        // Upload files to Firebase Storage
        const uploadedFileUrls = await uploadFilesToStorage(submissionId, files);

        updateProgress('Saving submission data...', 80);

        // Prepare submission data
        const submissionData = {
            ...submission,
            id: submissionId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            files: uploadedFileUrls
        };

        // Save to Firestore
        await db.collection('submissions').doc(submissionId).set(submissionData);

        updateProgress('Complete!', 100);

        console.log('Submission saved successfully:', submissionId);
        return true;

    } catch (error) {
        console.error('Error saving submission:', error);
        throw error;
    }
}

/**
 * Upload files to Firebase Storage
 * @param {string} submissionId - Unique submission ID
 * @param {Object} files - File objects
 * @returns {Promise<Object>} - URLs of uploaded files
 */
async function uploadFilesToStorage(submissionId, files) {
    const uploadedFiles = {
        sourceData: null,
        groundTruthImages: [],
        vizEngineState: null,
        metadataFile: null
    };

    let progress = 10;

    // Upload source data file
    if (files.sourceData) {
        updateProgress('Uploading source data...', progress);
        const url = await uploadFile(
            files.sourceData,
            `submissions/${submissionId}/source/${files.sourceData.name}`
        );
        uploadedFiles.sourceData = {
            name: files.sourceData.name,
            url: url,
            size: files.sourceData.size,
            type: files.sourceData.type
        };
        progress += 20;
    }

    // Upload ground truth images
    if (files.groundTruthImages && files.groundTruthImages.length > 0) {
        updateProgress('Uploading ground truth images...', progress);
        for (const file of files.groundTruthImages) {
            const url = await uploadFile(
                file,
                `submissions/${submissionId}/groundtruth/${file.name}`
            );
            uploadedFiles.groundTruthImages.push({
                name: file.name,
                url: url,
                size: file.size,
                type: file.type
            });
        }
        progress += 30;
    }

    // Upload visualization engine state
    if (files.vizEngineState) {
        updateProgress('Uploading visualization state...', progress);
        const url = await uploadFile(
            files.vizEngineState,
            `submissions/${submissionId}/state/${files.vizEngineState.name}`
        );
        uploadedFiles.vizEngineState = {
            name: files.vizEngineState.name,
            url: url,
            size: files.vizEngineState.size,
            type: files.vizEngineState.type
        };
        progress += 10;
    }

    // Upload metadata file
    if (files.metadataFile) {
        updateProgress('Uploading metadata...', progress);
        const url = await uploadFile(
            files.metadataFile,
            `submissions/${submissionId}/metadata/${files.metadataFile.name}`
        );
        uploadedFiles.metadataFile = {
            name: files.metadataFile.name,
            url: url,
            size: files.metadataFile.size,
            type: files.metadataFile.type
        };
        progress += 10;
    }

    return uploadedFiles;
}

/**
 * Upload a single file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path
 * @returns {Promise<string>} - Download URL
 */
async function uploadFile(file, path) {
    const storageRef = storage.ref(path);

    // Upload file
    const uploadTask = await storageRef.put(file, {
        contentType: file.type
    });

    // Get download URL
    const downloadURL = await uploadTask.ref.getDownloadURL();

    return downloadURL;
}

/**
 * Load all submissions from Firebase
 * @returns {Promise<Array>} - Array of submissions
 */
async function loadSubmissionsFromFirebase() {
    try {
        const snapshot = await db.collection('submissions')
            .orderBy('timestamp', 'desc')
            .get();

        const submissions = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            submissions.push({
                id: doc.id,
                ...data,
                // Convert Firestore timestamp to ISO string
                timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString()
            });
        });

        console.log(`Loaded ${submissions.length} submissions from Firebase`);
        return submissions;

    } catch (error) {
        console.error('Error loading submissions:', error);
        return [];
    }
}

/**
 * Delete a submission (admin only - not exposed in UI)
 * @param {string} submissionId - Submission ID to delete
 */
async function deleteSubmission(submissionId) {
    try {
        // Delete from Firestore
        await db.collection('submissions').doc(submissionId).delete();

        // Delete files from Storage (optional - can keep files)
        const folderRef = storage.ref(`submissions/${submissionId}`);
        const fileList = await folderRef.listAll();

        const deletePromises = fileList.items.map(item => item.delete());
        await Promise.all(deletePromises);

        console.log('Submission deleted:', submissionId);
        return true;

    } catch (error) {
        console.error('Error deleting submission:', error);
        return false;
    }
}

// ==========================================
// PROGRESS INDICATOR
// ==========================================

/**
 * Show upload progress to user
 * @param {string} message - Progress message
 * @param {number} percent - Progress percentage (0-100)
 */
function updateProgress(message, percent) {
    // Create or update progress bar
    let progressContainer = document.getElementById('upload-progress');

    if (!progressContainer) {
        progressContainer = document.createElement('div');
        progressContainer.id = 'upload-progress';
        progressContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px;
            text-align: center;
        `;
        document.body.appendChild(progressContainer);
    }

    progressContainer.innerHTML = `
        <div style="margin-bottom: 1rem; font-weight: 600; color: #2563eb;">
            ${message}
        </div>
        <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="width: ${percent}%; height: 100%; background: #2563eb; transition: width 0.3s;"></div>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #64748b;">
            ${percent}%
        </div>
    `;

    // Remove progress bar when complete
    if (percent >= 100) {
        setTimeout(() => {
            if (progressContainer && progressContainer.parentNode) {
                progressContainer.parentNode.removeChild(progressContainer);
            }
        }, 1000);
    }
}

// ==========================================
// OVERRIDE ORIGINAL FUNCTIONS
// ==========================================

// Replace the original saveSubmission function
const originalSaveSubmission = window.saveSubmission;
window.saveSubmission = async function(submission, files) {
    // If Firebase is not initialized, fall back to localStorage
    if (typeof firebase === 'undefined' || !db || !storage) {
        console.warn('Firebase not initialized, using localStorage');
        if (originalSaveSubmission) {
            return originalSaveSubmission(submission);
        }
        return;
    }

    try {
        await saveSubmissionToFirebase(submission, files);
        return true;
    } catch (error) {
        console.error('Firebase save failed:', error);
        showError('Upload failed: ' + error.message);
        return false;
    }
};

// Replace the original loadSubmissions function
const originalLoadSubmissions = window.loadSubmissions;
window.loadSubmissions = async function() {
    // If Firebase is not initialized, fall back to localStorage
    if (typeof firebase === 'undefined' || !db || !storage) {
        console.warn('Firebase not initialized, using localStorage');
        if (originalLoadSubmissions) {
            originalLoadSubmissions();
        }
        return;
    }

    try {
        const submissions = await loadSubmissionsFromFirebase();
        appState.submissions = submissions;
        updateDashboard();
    } catch (error) {
        console.error('Firebase load failed:', error);
        // Fall back to localStorage
        if (originalLoadSubmissions) {
            originalLoadSubmissions();
        }
    }
};

// ==========================================
// AUTO-LOAD ON PAGE READY
// ==========================================

// Load submissions from Firebase when page loads
if (typeof firebase !== 'undefined' && db && storage) {
    console.log('Firebase integration active');

    // Load submissions immediately
    setTimeout(() => {
        loadSubmissions();
    }, 100);
} else {
    console.warn('Firebase not initialized - check firebase-config.js');
}

// Export functions for use in other scripts
window.firebaseIntegration = {
    saveSubmission: saveSubmissionToFirebase,
    loadSubmissions: loadSubmissionsFromFirebase,
    deleteSubmission: deleteSubmission,
    uploadFile: uploadFile
};
