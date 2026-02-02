// Application State
const appState = {
    submissions: [],
    currentPage: 'statistics',
    testCases: [],
    filteredTestCases: [],
    stats: {
        totalDatasets: 0,
        totalContributors: 0,
        totalTasks: 0,
        applicationDomains: {
            'simulation': 0,
            'medical': 0,
            'molecular': 0,
            'climate': 0,
            'materials': 0,
            'astronomy': 0,
            'geoscience': 0,
            'other': 0
        },
        attributeTypes: {
            'scalar-fields': 0,
            'vector-fields': 0,
            'tensor-fields': 0,
            'multivariate': 0,
            'other': 0
        }
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeForm();
    loadSubmissions(); // Will call updateDashboard() after loading
    loadTestCases(); // Load test cases from CSV
    initializeFilters(); // Initialize filter functionality
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
        });
    });
}

function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageName;
    }

    // Update nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// Form Handling
function initializeForm() {
    const form = document.getElementById('submission-form');
    const applicationDomainRadios = document.querySelectorAll('input[name="applicationDomain"]');
    const attributeTypeCheckboxes = document.querySelectorAll('input[name="attributeType"]');

    // Show/hide "other" field for application domain
    applicationDomainRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const otherField = document.getElementById('application-domain-other');
            otherField.style.display = this.value === 'other' ? 'block' : 'none';
        });
    });

    // Show/hide "other" field for attribute type
    attributeTypeCheckboxes.forEach(checkbox => {
        if (checkbox.value === 'other') {
            checkbox.addEventListener('change', function() {
                const otherField = document.getElementById('attribute-type-other');
                otherField.style.display = this.checked ? 'block' : 'none';
            });
        }
    });

    // Show/hide camera position field when image metrics checkbox is checked
    const imageMetricsCheckbox = document.getElementById('use-image-metrics');
    if (imageMetricsCheckbox) {
        imageMetricsCheckbox.addEventListener('change', function() {
            const cameraPositionField = document.getElementById('camera-position-info');
            cameraPositionField.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(form);
    });
}

async function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submission = {};

    // Collect form data
    for (let [key, value] of formData.entries()) {
        if (key === 'attributeType') {
            if (!submission[key]) {
                submission[key] = [];
            }
            submission[key].push(value);
        } else {
            submission[key] = value;
        }
    }

    // Validate submission
    if (!validateSubmission(submission)) {
        showError('Please fill in all required fields.');
        return;
    }

    // Collect file objects (not FormData entries) - all now support multiple files
    const files = {
        sourceData: Array.from(document.getElementById('source-data').files),
        groundTruthImages: Array.from(document.getElementById('ground-truth-images').files),
        groundTruthCode: Array.from(document.getElementById('ground-truth-code').files),
        vizEngineState: Array.from(document.getElementById('viz-engine-state').files),
        metadataFile: Array.from(document.getElementById('metadata-file').files)
    };

    try {
        // Save submission
        await saveSubmission(submission, files);

        // Show success message
        showSuccess('Thank you for your contribution! Your dataset submission has been received.');

        // Reset form
        form.reset();

        // Update dashboard
        await loadSubmissions();
        updateDashboard();

        // Navigate to statistics
        navigateToPage('statistics');

    } catch (error) {
        console.error('Submission error:', error);
        showError('Submission failed: ' + error.message);
    }
}

function validateSubmission(submission) {
    const requiredFields = [
        'contributorName',
        'contributorEmail',
        'contributorInstitution',
        'datasetName',
        'datasetDescription',
        'applicationDomain',
        'taskDescription',
        'evalCriteria'
    ];

    for (let field of requiredFields) {
        if (!submission[field] || submission[field].trim() === '') {
            return false;
        }
    }

    if (!submission.attributeType || submission.attributeType.length === 0) {
        return false;
    }

    return true;
}

async function saveSubmission(submission, files) {
    // Add ID and timestamp
    submission.id = generateId();
    submission.timestamp = new Date().toISOString();

    // Store file metadata only (can't store actual files in localStorage)
    submission.files = {
        sourceData: files.sourceData.map(f => ({ name: f.name, size: f.size })),
        groundTruthImages: files.groundTruthImages.map(f => ({ name: f.name, size: f.size })),
        groundTruthCode: files.groundTruthCode.map(f => ({ name: f.name, size: f.size })),
        vizEngineState: files.vizEngineState.map(f => ({ name: f.name, size: f.size })),
        metadataFile: files.metadataFile.map(f => ({ name: f.name, size: f.size }))
    };

    let submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('submissions', JSON.stringify(submissions));
    appState.submissions = submissions;

    console.log('💾 Saved to localStorage');
}

function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    appState.submissions = submissions;
    console.log('📂 Loaded from localStorage:', submissions.length, 'submissions');

    // Update dashboard after loading data
    updateDashboard();
}

// Dashboard Updates
function updateDashboard() {
    calculateStats();
    updateStatsDisplay();
    updateCategoryStats();
    updateContributorsTable();
}

function calculateStats() {
    const submissions = appState.submissions;

    // Reset stats
    appState.stats = {
        totalDatasets: submissions.length,
        totalContributors: new Set(submissions.map(s => s.contributorEmail)).size,
        totalTasks: submissions.length,
        applicationDomains: {
            'simulation': 0,
            'medical': 0,
            'molecular': 0,
            'climate': 0,
            'materials': 0,
            'astronomy': 0,
            'geoscience': 0,
            'other': 0
        },
        attributeTypes: {
            'scalar-fields': 0,
            'vector-fields': 0,
            'tensor-fields': 0,
            'multivariate': 0,
            'other': 0
        }
    };

    // Calculate category stats
    submissions.forEach(submission => {
        // Application domains
        if (submission.applicationDomain && appState.stats.applicationDomains[submission.applicationDomain] !== undefined) {
            appState.stats.applicationDomains[submission.applicationDomain]++;
        }

        // Attribute types
        if (submission.attributeType) {
            submission.attributeType.forEach(type => {
                if (appState.stats.attributeTypes[type] !== undefined) {
                    appState.stats.attributeTypes[type]++;
                }
            });
        }
    });
}

function updateStatsDisplay() {
    document.getElementById('total-datasets').textContent = appState.stats.totalDatasets;
    document.getElementById('total-contributors').textContent = appState.stats.totalContributors;
    document.getElementById('total-tasks').textContent = appState.stats.totalTasks;
}

function updateCategoryStats() {
    const domainLabels = {
        'simulation': 'Simulation',
        'medical': 'Medical',
        'molecular': 'Molecular',
        'climate': 'Climate',
        'materials': 'Materials Science',
        'astronomy': 'Astronomy',
        'geoscience': 'Geoscience',
        'other': 'Other'
    };

    const attributeLabels = {
        'scalar-fields': 'Scalar Fields',
        'vector-fields': 'Vector Fields',
        'tensor-fields': 'Tensor Fields',
        'multivariate': 'Multivariate/Multi-field',
        'other': 'Other'
    };

    // Application Domains - only show items with count > 0
    const applicationDomainContainer = document.getElementById('application-domain-stats');
    if (applicationDomainContainer) {
        const domainItems = Object.entries(appState.stats.applicationDomains)
            .filter(([key, count]) => count > 0)
            .map(([key, count]) => `
                <div class="stat-item">
                    <span class="count">${count}</span>
                    <span class="label">${domainLabels[key]}</span>
                </div>
            `).join('');

        applicationDomainContainer.innerHTML = domainItems || '<div class="stat-item"><span class="label" style="color: var(--text-tertiary);">No data yet</span></div>';
    }

    // Attribute Types - only show items with count > 0
    const attributeTypesContainer = document.getElementById('attribute-types-stats');
    if (attributeTypesContainer) {
        const attributeItems = Object.entries(appState.stats.attributeTypes)
            .filter(([key, count]) => count > 0)
            .map(([key, count]) => `
                <div class="stat-item">
                    <span class="count">${count}</span>
                    <span class="label">${attributeLabels[key]}</span>
                </div>
            `).join('');

        attributeTypesContainer.innerHTML = attributeItems || '<div class="stat-item"><span class="label" style="color: var(--text-tertiary);">No data yet</span></div>';
    }
}

function updateContributorsTable() {
    const tbody = document.getElementById('contributors-tbody');

    if (appState.submissions.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">No contributions yet. Be the first to contribute!</td>
            </tr>
        `;
        return;
    }

    // Group submissions by contributor
    const contributorMap = new Map();
    appState.submissions.forEach(submission => {
        const email = submission.contributorEmail;
        if (!contributorMap.has(email)) {
            contributorMap.set(email, {
                name: submission.contributorName,
                institution: submission.contributorInstitution,
                contributions: [],
                subjects: new Set()
            });
        }

        const contributor = contributorMap.get(email);
        contributor.contributions.push(submission);

        // Add subjects (application domains)
        if (submission.applicationDomain) {
            const domainLabel = {
                'climate': 'Climate',
                'sem': 'SEM',
                'ct-objects': 'CT Objects',
                'medical': 'Medical',
                'simulation': 'Simulation',
                'molecular': 'Molecular',
                'other': 'Other'
            }[submission.applicationDomain] || submission.applicationDomain;
            contributor.subjects.add(domainLabel);
        }
    });

    const totalQuestions = appState.submissions.length;

    // Create table rows
    const rows = Array.from(contributorMap.values())
        .sort((a, b) => b.contributions.length - a.contributions.length)
        .map(contributor => {
            const numQuestions = contributor.contributions.length;
            const percentage = totalQuestions > 0 ? Math.round((numQuestions / totalQuestions) * 100) : 0;

            // Format subjects with counts
            const subjectCounts = {};
            contributor.contributions.forEach(submission => {
                const domainLabel = {
                    'climate': 'Climate',
                    'sem': 'SEM',
                    'ct-objects': 'CT Objects',
                    'medical': 'Medical',
                    'simulation': 'Simulation',
                    'molecular': 'Molecular',
                    'other': 'Other'
                }[submission.applicationDomain] || submission.applicationDomain;

                subjectCounts[domainLabel] = (subjectCounts[domainLabel] || 0) + 1;
            });

            const subjectsText = Object.entries(subjectCounts)
                .map(([subject, count]) => `${subject} (${count}) ${Math.round((count / totalQuestions) * 100)}%`)
                .join(', ');

            return `
                <tr>
                    <td>${escapeHtml(contributor.name)}</td>
                    <td>${escapeHtml(contributor.institution)}</td>
                    <td>${numQuestions} (${percentage}%)</td>
                    <td>${subjectsText}</td>
                </tr>
            `;
        })
        .join('');

    tbody.innerHTML = rows;
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;

    // Insert at top of current page
    const currentPageEl = document.querySelector('.page.active section');
    if (currentPageEl) {
        const container = currentPageEl.querySelector('.container');
        if (container) {
            container.insertBefore(successDiv, container.firstChild);
        }
    }

    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

function showError(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;

    // Insert at top of submit page
    const submitSection = document.querySelector('#page-submit section');
    if (submitSection) {
        const container = submitSection.querySelector('.container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    }

    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Export data functionality (for admin use)
function exportSubmissions() {
    const data = JSON.stringify(appState.submissions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scivisagentbench-submissions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Make export function available globally (can be called from console)
window.exportSubmissions = exportSubmissions;

// Load sample data for demonstration (can be removed in production)
function loadSampleData() {
    if (appState.submissions.length === 0) {
        const sampleSubmissions = [
            {
                id: 'sample1',
                contributorName: 'Dr. Jane Smith',
                contributorEmail: 'jane.smith@university.edu',
                contributorInstitution: 'University of Notre Dame',
                datasetName: 'Cardiac MRI Isosurface',
                datasetDescription: 'High-resolution cardiac MRI scan for isosurface extraction and visualization',
                applicationDomain: 'medical',
                attributeType: ['scalar-fields'],
                taskDescription: 'Load the cardiac MRI dataset and extract isosurfaces at intensity value 150 to visualize the heart chambers. Apply appropriate color mapping.',
                evalCriteria: 'Correct isosurface value (10 pts), Chamber visibility (10 pts), Color mapping quality (5 pts)',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'sample2',
                contributorName: 'Prof. John Doe',
                contributorEmail: 'john.doe@lab.gov',
                contributorInstitution: 'Lawrence Livermore National Laboratory',
                datasetName: 'CFD Flow Analysis',
                datasetDescription: 'Computational fluid dynamics simulation with velocity and vorticity fields',
                applicationDomain: 'simulation',
                attributeType: ['vector-fields'],
                taskDescription: 'Compute vorticity from the velocity field and visualize using streamlines. Identify and track vortex cores across timesteps.',
                evalCriteria: 'Correct vorticity computation (15 pts), Streamline quality (10 pts), Vortex identification (10 pts)',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'sample3',
                contributorName: 'Dr. Emily Chen',
                contributorEmail: 'emily.chen@medschool.edu',
                contributorInstitution: 'Vanderbilt University Medical Center',
                datasetName: 'Brain Tumor Segmentation',
                datasetDescription: 'MRI brain scan with tumor region requiring segmentation and quantification',
                applicationDomain: 'medical',
                attributeType: ['scalar-fields'],
                taskDescription: 'Threshold the MRI data to segment tumor tissue (intensity > 200), extract the connected region, and compute tumor volume.',
                evalCriteria: 'Correct segmentation threshold (10 pts), Tumor extraction (15 pts), Volume measurement accuracy (10 pts)',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'sample4',
                contributorName: 'Dr. Maria Garcia',
                contributorEmail: 'maria.garcia@research.org',
                contributorInstitution: 'Max Planck Institute',
                datasetName: 'Molecular Stress Tensor Analysis',
                datasetDescription: 'Molecular dynamics simulation with stress tensor fields',
                applicationDomain: 'molecular',
                attributeType: ['tensor-fields'],
                taskDescription: 'Compute eigenvalues and eigenvectors of the stress tensor field. Visualize using tensor glyphs and track principal stress directions over time.',
                evalCriteria: 'Correct eigenvalue computation (15 pts), Tensor glyph visualization (10 pts), Temporal tracking (10 pts)',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        localStorage.setItem('submissions', JSON.stringify(sampleSubmissions));
        appState.submissions = sampleSubmissions;
        updateDashboard();
    }
}

// Uncomment to load sample data on first visit
// loadSampleData();

// Test Cases Loading and Filtering

async function loadTestCases() {
    try {
        // Load all CSV files from the sheets directory
        const csvFiles = [
            'statistics/sheets/SciVisAgentBench_Statistics - main.csv',
            'statistics/sheets/SciVisAgentBench_Statistics - chatvis_bench.csv',
            'statistics/sheets/SciVisAgentBench_Statistics - sci_volume_data.csv',
            'statistics/sheets/SciVisAgentBench_Statistics - topology.csv',
            'statistics/sheets/SciVisAgentBench_Statistics - bioimage_data.csv',
            'statistics/sheets/SciVisAgentBench_Statistics - molecular_vis.csv'
        ];

        let allTestCases = [];

        for (const file of csvFiles) {
            try {
                const response = await fetch(file);
                const csvText = await response.text();
                const cases = parseCSV(csvText, file);
                allTestCases = allTestCases.concat(cases);
            } catch (err) {
                console.warn(`Failed to load ${file}:`, err);
            }
        }

        // Filter to only include Task and Workflow entries (exclude Operation)
        const filteredCases = allTestCases.filter(tc =>
            tc.taskDifficulty.includes('Task') || tc.taskDifficulty.includes('Workflow')
        );

        appState.testCases = filteredCases;
        appState.filteredTestCases = filteredCases;
        renderTestCases(filteredCases);
        updateFilterCount();
        updateTotalCasesCount(filteredCases.length);
    } catch (error) {
        console.error('Error loading test cases:', error);
        document.getElementById('test-cases-tbody').innerHTML = `
            <tr class="loading-state">
                <td colspan="6">Error loading test cases. Please check the CSV file paths.</td>
            </tr>
        `;
    }
}

function updateTotalCasesCount(count) {
    const totalCasesEl = document.getElementById('total-test-cases');
    if (totalCasesEl) {
        totalCasesEl.textContent = count;
    }
    const browseTotalEl = document.getElementById('browse-total-cases');
    if (browseTotalEl) {
        browseTotalEl.textContent = count;
    }
}

function parseCSV(csvText, filename) {
    const lines = csvText.split('\n');
    const testCases = [];

    // Skip the header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) continue;

        // Parse case data
        const parts = parseCSVLine(line);
        if (parts.length >= 6 && parts[0]) {
            const caseName = parts[0];
            const application = parts[1];
            const data = parts[2];
            const complexityLevel = parts[3];
            const operations = parts[4];
            const operationCount = parts[5];

            // Skip if case name is empty or is header
            if (!caseName || caseName === 'Case Name') continue;

            testCases.push({
                category: extractCategoryFromFilename(filename),
                caseName: caseName,
                application: extractApplicationDomains(application),
                data: data,
                taskDifficulty: extractTaskDifficultyNew(complexityLevel),
                visualizationOps: extractVisualizationOpsNew(operations),
                dataTypes: extractDataTypes(data),
                operationCount: operationCount || '0'
            });
        }
    }

    return testCases;
}

function extractCategoryFromFilename(filename) {
    if (filename.includes('main.csv')) return 'main';
    if (filename.includes('chatvis_bench.csv')) return 'chatvis_bench';
    if (filename.includes('sci_volume_data.csv')) return 'sci_volume_data';
    if (filename.includes('topology.csv')) return 'topology';
    if (filename.includes('bioimage_data.csv')) return 'bioimage_data';
    if (filename.includes('molecular_vis.csv')) return 'molecular_vis';
    return 'unknown';
}

function parseCSVLine(line) {
    const parts = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            parts.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    parts.push(current.trim());
    return parts;
}

function extractApplicationDomains(applicationString) {
    // Split by semicolon and clean up
    return applicationString.split(';').map(domain => domain.trim()).filter(domain => domain);
}

function extractTaskDifficulty(taskString) {
    const difficulties = [];
    if (taskString.includes('Atomic operation')) difficulties.push('Atomic operation');
    if (taskString.includes('Workflow')) difficulties.push('Workflow');
    if (taskString.includes('Scientific Insights')) difficulties.push('Scientific Insights');
    return difficulties;
}

function extractTaskDifficultyNew(complexityLevel) {
    // The new format has complexity level in a single column
    const difficulties = [];
    if (complexityLevel.includes('Operation')) difficulties.push('Operation');
    if (complexityLevel.includes('Task')) difficulties.push('Task');
    if (complexityLevel.includes('Workflow')) difficulties.push('Workflow');
    return difficulties;
}

function extractVisualizationOps(taskString) {
    const operations = [];
    const operationTypes = [
        'Color Mapping', 'Volume Representation', 'Object identification',
        'Spatial/temporal Extraction', 'View / Rendering Manipulation',
        'Structural Operations', 'Glyph-Based Representation',
        'Geometric Primitives', 'Scalar Operations', 'Value-Based Selection',
        'Advanced Computations', 'Time-Dependent Processing',
        'Smoothing & enhancement', 'Field Derivatives', 'Plot Drawing',
        'Topological Changes', 'Sampling', 'Geometric Modification'
    ];

    for (const op of operationTypes) {
        if (taskString.includes(op)) {
            operations.push(op);
        }
    }

    return operations;
}

function extractVisualizationOpsNew(operationsString) {
    // The new format has operations separated by semicolons
    return operationsString.split(';').map(op => op.trim()).filter(op => op);
}

function extractDataTypes(dataString) {
    // Handle both old and new formats
    // New format uses semicolons to separate types
    if (dataString.includes(';')) {
        return dataString.split(';').map(type => type.trim()).filter(type => type);
    }

    // Old format - check for specific strings
    const types = [];
    if (dataString.includes('Scalar Fields')) types.push('Scalar Fields');
    if (dataString.includes('Vector Fields')) types.push('Vector Fields');
    if (dataString.includes('Multi-variate')) types.push('Multi-variate');
    if (dataString.includes('Multivariate')) types.push('Multi-variate');
    if (dataString.includes('Time-varying')) types.push('Time-varying');
    if (dataString.includes('Tensor Fields')) types.push('Tensor Fields');
    return types;
}

function renderTestCases(testCases) {
    const tbody = document.getElementById('test-cases-tbody');

    if (!testCases || testCases.length === 0) {
        tbody.innerHTML = `
            <tr class="loading-state">
                <td colspan="6">No test cases found.</td>
            </tr>
        `;
        return;
    }

    // Operation descriptions mapping
    const operationDescriptions = {
        'Color & Opacity Mapping': 'Assign colors, opacity, or textures to data elements',
        'Surface & Contour Extraction': 'Generate isosurfaces, contour lines, ribbons, or tubes',
        'Volume Rendering': 'Render volumetric data directly using ray casting or splatting',
        'View & Camera Control': 'Adjust camera position, orientation, zoom, or lighting',
        'Field Computation': 'Derive new scalar, vector, or tensor fields from existing data',
        'Data Subsetting & Extraction': 'Isolate spatial regions or value-based subsets from a dataset',
        'Scientific Insight Derivation': 'Interpret results to answer domain-specific questions',
        'Glyph & Marker Placement': 'Place oriented, scaled, or typed glyphs at data points',
        'Dataset Restructuring': 'Combine, partition, or reorganize multiple datasets',
        'Temporal Processing': 'Perform computations involving the time dimension of data',
        'Feature Identification & Segmentation': 'Detect, extract, or label discrete structures or regions',
        'Data Smoothing & Filtering': 'Reduce noise, enhance features, or apply statistical filters',
        'Plot & Chart Generation': 'Produce 2D statistical plots, histograms, or line charts',
        'Data Sampling & Resolution Control': 'Modify data density or sampling resolution for efficiency',
        'Geometric & Topological Transformation': 'Modify the geometry or connectivity structure of a dataset'
    };

    const rows = testCases.map(testCase => {
        const applicationTags = testCase.application && testCase.application.length > 0
            ? testCase.application.map(app => `<span class="tag">${escapeHtml(app)}</span>`).join('')
            : '-';

        const taskDifficultyTags = testCase.taskDifficulty.map(d =>
            `<span class="tag">${d}</span>`
        ).join('');

        const visualizationOpsTags = testCase.visualizationOps.map(op => {
            return `<span class="tag">${escapeHtml(op)}</span>`;
        }).join('');

        const dataTypesTags = testCase.dataTypes.map(dt =>
            `<span class="tag">${dt}</span>`
        ).join('');

        return `
            <tr>
                <td><span class="case-name">${escapeHtml(testCase.caseName)}</span></td>
                <td>${applicationTags}</td>
                <td>${taskDifficultyTags || '-'}</td>
                <td>${visualizationOpsTags || '-'}</td>
                <td>${dataTypesTags || '-'}</td>
                <td style="text-align: center;">${escapeHtml(testCase.operationCount)}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

function initializeFilters() {
    const clearButton = document.getElementById('clear-filters');

    if (clearButton) {
        clearButton.addEventListener('click', clearFilters);
    }

    // Add change event listeners to all checkboxes for real-time filtering
    const allCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    // Get selected checkboxes from each filter group
    const domainCheckboxes = document.querySelectorAll('#filter-domain-options input[type="checkbox"]:checked');
    const difficultyCheckboxes = document.querySelectorAll('#filter-difficulty-options input[type="checkbox"]:checked');
    const operationCheckboxes = document.querySelectorAll('#filter-operation-options input[type="checkbox"]:checked');
    const dataTypeCheckboxes = document.querySelectorAll('#filter-datatype-options input[type="checkbox"]:checked');

    const domainFilter = Array.from(domainCheckboxes).map(cb => cb.value);
    const difficultyFilter = Array.from(difficultyCheckboxes).map(cb => cb.value);
    const operationFilter = Array.from(operationCheckboxes).map(cb => cb.value);
    const dataTypeFilter = Array.from(dataTypeCheckboxes).map(cb => cb.value);

    let filtered = appState.testCases;

    // Apply domain filter - case must have ALL selected domains
    // Application domain can be single or multiple values (array)
    if (domainFilter.length > 0) {
        filtered = filtered.filter(tc =>
            domainFilter.every(domain => tc.application.includes(domain))
        );
    }

    // Apply difficulty filter - case must have ALL selected difficulties
    if (difficultyFilter.length > 0) {
        filtered = filtered.filter(tc =>
            difficultyFilter.every(difficulty => tc.taskDifficulty.includes(difficulty))
        );
    }

    // Apply operation filter - case must have ALL selected operations
    if (operationFilter.length > 0) {
        filtered = filtered.filter(tc =>
            operationFilter.every(operation => tc.visualizationOps.includes(operation))
        );
    }

    // Apply data type filter - case must have ALL selected data types
    if (dataTypeFilter.length > 0) {
        filtered = filtered.filter(tc =>
            dataTypeFilter.every(dataType => tc.dataTypes.includes(dataType))
        );
    }

    appState.filteredTestCases = filtered;
    renderTestCases(filtered);
    updateFilterCount();
}

function clearFilters() {
    // Uncheck all checkboxes
    const allCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset filtered cases
    appState.filteredTestCases = appState.testCases;
    renderTestCases(appState.testCases);
    updateFilterCount();
}

function updateFilterCount() {
    const countElement = document.getElementById('filter-count');
    if (countElement) {
        const total = appState.testCases.length;
        const filtered = appState.filteredTestCases.length;
        countElement.textContent = `Showing ${filtered} of ${total} cases`;
    }
}
