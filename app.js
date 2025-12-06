// Blood Testing Laboratory Management System - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Set active navigation
    updateActiveNavigation();
    
    // Load initial data
    loadInitialData();
}

function setupEventListeners() {
    // Patient registration form
    // Registration form id in `index.html` is `testTakerForm`
    const patientForm = document.getElementById('testTakerForm') || document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', handlePatientRegistration);
    }
    
    // Test request form
    const testForm = document.getElementById('testForm');
    if (testForm) {
        testForm.addEventListener('submit', handleTestRequest);
    }
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearchResults);
    }
    
    // Navigation clicks
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Enter key for search (matches `index.html` id)
    const searchInput = document.getElementById('searchTestTakerId') || document.getElementById('searchPatientId');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchResults();
            }
        });
    }
}

function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    
    // Update active navigation
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

function updateActiveNavigation() {
    // Show home section by default
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    const homeSection = document.getElementById('patient-registration');
    if (homeSection) {
        homeSection.style.display = 'block';
    }
}

// Ensure default navigation shows dashboard if available
function ensureDefaultSection() {
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
        dashboard.style.display = 'block';
    }
}

// Quiz and result popup utilities: 10 structured weighted questions
let quizState = {
    questions: [],
    currentIndex: 0,
    scores: { A: 0, B: 0, AB: 0, O: 0 },
    responses: [] // store chosen option index per question
};

function startNewQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    const quizSelection = document.getElementById('quizSelection');
    if (quizContainer && quizSelection) {
        quizSelection.style.display = 'none';
        quizContainer.style.display = 'block';
    }

    // Ten well-structured questions with weighted options for A, B, AB, O
    quizState.questions = [
        {
            text: 'Do you prefer orderly routines and planning?',
            options: [
                { label: 'Often', weights: { A: 2, B: 0, AB: 1, O: 0 } },
                { label: 'Sometimes', weights: { A: 1, B: 0, AB: 1, O: 0 } },
                { label: 'Rarely', weights: { A: 0, B: 2, AB: 0, O: 1 } }
            ]
        },
        {
            text: 'Are you energized by social events and spontaneity?',
            options: [
                { label: 'Yes', weights: { A: 0, B: 2, AB: 1, O: 1 } },
                { label: 'Sometimes', weights: { A: 0, B: 1, AB: 1, O: 1 } },
                { label: 'No', weights: { A: 2, B: 0, AB: 0, O: 0 } }
            ]
        },
        {
            text: 'Do you handle stress by planning and preparation?',
            options: [
                { label: 'Yes', weights: { A: 2, B: 0, AB: 1, O: 0 } },
                { label: 'Sometimes', weights: { A: 1, B: 1, AB: 1, O: 0 } },
                { label: 'No', weights: { A: 0, B: 2, AB: 0, O: 1 } }
            ]
        },
        {
            text: 'Do you prefer variety in food and activities?',
            options: [
                { label: 'Yes', weights: { A: 0, B: 2, AB: 1, O: 1 } },
                { label: 'Occasionally', weights: { A: 1, B: 1, AB: 1, O: 0 } },
                { label: 'No', weights: { A: 2, B: 0, AB: 0, O: 0 } }
            ]
        },
        {
            text: 'Do you find it easy to adapt to new situations?',
            options: [
                { label: 'Very Easy', weights: { A: 0, B: 2, AB: 1, O: 1 } },
                { label: 'Somewhat', weights: { A: 1, B: 1, AB: 1, O: 0 } },
                { label: 'Difficult', weights: { A: 2, B: 0, AB: 0, O: 0 } }
            ]
        },
        {
            text: 'Do you consider yourself community-oriented and outgoing?',
            options: [
                { label: 'Yes', weights: { A: 0, B: 2, AB: 1, O: 2 } },
                { label: 'Somewhat', weights: { A: 1, B: 1, AB: 1, O: 1 } },
                { label: 'No', weights: { A: 2, B: 0, AB: 0, O: 0 } }
            ]
        },
        {
            text: 'Are leadership and decisiveness natural to you?',
            options: [
                { label: 'Yes', weights: { A: 0, B: 2, AB: 1, O: 2 } },
                { label: 'Sometimes', weights: { A: 1, B: 1, AB: 1, O: 1 } },
                { label: 'No', weights: { A: 2, B: 0, AB: 0, O: 0 } }
            ]
        },
        {
            text: 'Do you tend to be cooperative and diplomatic?',
            options: [
                { label: 'Yes', weights: { A: 1, B: 0, AB: 2, O: 0 } },
                { label: 'Sometimes', weights: { A: 1, B: 1, AB: 1, O: 0 } },
                { label: 'No', weights: { A: 0, B: 2, AB: 0, O: 1 } }
            ]
        },
        {
            text: 'Do you prefer calm predictable schedules to excitement?',
            options: [
                { label: 'Prefer calm', weights: { A: 2, B: 0, AB: 1, O: 0 } },
                { label: 'Flexible', weights: { A: 1, B: 1, AB: 1, O: 1 } },
                { label: 'Prefer excitement', weights: { A: 0, B: 2, AB: 1, O: 1 } }
            ]
        },
        {
            text: 'How often do you try new experiences (travel, hobbies)?',
            options: [
                { label: 'Often', weights: { A: 0, B: 2, AB: 1, O: 2 } },
                { label: 'Sometimes', weights: { A: 1, B: 1, AB: 1, O: 1 } },
                { label: 'Rarely', weights: { A: 2, B: 0, AB: 0, O: 0 } }
            ]
        }
    ];

    // reset state
    quizState.currentIndex = 0;
    quizState.scores = { A: 0, B: 0, AB: 0, O: 0 };
    quizState.responses = Array(quizState.questions.length).fill(null);
    renderQuizQuestion();
}

function startBloodTypeDetermination() { document.getElementById('quizTitle').textContent = 'Blood Type Determination'; startNewQuiz(); }
function startCompatibilityQuiz() { document.getElementById('quizTitle').textContent = 'Blood Compatibility'; startNewQuiz(); }

function renderQuizQuestion() {
    const q = quizState.questions[quizState.currentIndex];
    const questionText = document.getElementById('questionText');
    const questionOptions = document.getElementById('questionOptions');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    if (!q || !questionText || !questionOptions) return;

    questionText.textContent = q.text;
    questionOptions.innerHTML = '';

    q.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'btn';
        b.classList.add('btn-secondary');
        b.style.marginRight = '8px';
        b.textContent = opt.label;
        // highlight if already selected
        if (quizState.responses[quizState.currentIndex] === i) {
            b.classList.add('selected');
            b.style.boxShadow = '0 0 0 3px rgba(52,152,219,0.15)';
        }
        b.onclick = () => {
            // record response
            quizState.responses[quizState.currentIndex] = i;
            // recalc scores from responses
            recalcScores();
            // enable next or submit
            nextBtn.disabled = quizState.currentIndex >= quizState.questions.length - 1;
            submitBtn.style.display = (quizState.currentIndex === quizState.questions.length - 1) ? 'inline-block' : 'none';
            // re-render to show selection
            renderQuizQuestion();
        };
        questionOptions.appendChild(b);
    });

    prevBtn.disabled = quizState.currentIndex === 0;
    // Next should be enabled only if an option selected
    nextBtn.disabled = quizState.responses[quizState.currentIndex] === null;
    submitBtn.style.display = 'none';
    if (quizState.currentIndex === quizState.questions.length - 1 && quizState.responses[quizState.currentIndex] !== null) {
        submitBtn.style.display = 'inline-block';
    }

    // update score display (aggregate)
    const totalScore = Object.values(quizState.scores).reduce((s, v) => s + v, 0);
    document.getElementById('currentScore').textContent = totalScore;
    document.getElementById('progressText').textContent = `Question ${quizState.currentIndex + 1} of ${quizState.questions.length}`;
    const fill = document.getElementById('quizProgress');
    if (fill) fill.style.width = ((quizState.currentIndex + 1) / quizState.questions.length * 100) + '%';
}

function recalcScores() {
    quizState.scores = { A: 0, B: 0, AB: 0, O: 0 };
    quizState.responses.forEach((respIndex, qIdx) => {
        if (respIndex === null || respIndex === undefined) return;
        const opt = quizState.questions[qIdx].options[respIndex];
        if (!opt || !opt.weights) return;
        Object.keys(opt.weights).forEach(k => {
            quizState.scores[k] += opt.weights[k];
        });
    });
}

function previousQuestion() { if (quizState.currentIndex > 0) { quizState.currentIndex -= 1; renderQuizQuestion(); } }
function nextQuestion() { if (quizState.currentIndex < quizState.questions.length - 1 && quizState.responses[quizState.currentIndex] !== null) { quizState.currentIndex += 1; renderQuizQuestion(); } }

function submitQuiz() {
    // Ensure scores reflect current responses
    recalcScores();
    // Determine predicted blood type by highest score
    const scores = quizState.scores;
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    let predicted = entries[0][0];
    // If tie or all zero, mark as Unknown
    if (entries.length > 1 && entries[0][1] === entries[1][1]) {
        predicted = 'Unknown';
    }

    showResultPopup({ predictedLabel: predicted, actualLabel: 'N/A', score: JSON.stringify(scores) });
}

function backToQuizSelection() {
    const quizContainer = document.getElementById('quizContainer');
    const quizSelection = document.getElementById('quizSelection');
    if (quizContainer && quizSelection) { quizContainer.style.display = 'none'; quizSelection.style.display = 'block'; }
}

function showResultPopup({ predictedLabel, actualLabel, score }) {
    let popup = document.getElementById('resultPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'resultPopup';
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '18%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = '#fff';
        popup.style.border = '1px solid #ccc';
        popup.style.padding = '16px';
        popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        popup.style.zIndex = 9999;
        popup.style.minWidth = '320px';
        document.body.appendChild(popup);
    }
    const p = String(predictedLabel ?? 'Unknown');
    const a = String(actualLabel ?? 'Unknown');
    const scoreHtml = typeof score === 'string' ? escapeHtml(score) : escapeHtml(JSON.stringify(score));
    popup.innerHTML = `\n        <h3>Test Result</h3>\n        <p><strong>Predicted:</strong> ${escapeHtml(p)}</p>\n        <p><strong>Actual:</strong> ${escapeHtml(a)}</p>\n        <p><strong>Scores:</strong> ${scoreHtml}</p>\n        <div style="text-align:right; margin-top:8px;">\n            <button id="closeResultPopup" class="btn btn-secondary">Close</button>\n        </div>\n    `;
    const closeBtn = document.getElementById('closeResultPopup');
    if (closeBtn) closeBtn.onclick = () => popup.remove();
}

// Expose popup globally
window.showResultPopup = showResultPopup;

async function handlePatientRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const patientData = Object.fromEntries(formData.entries());
    
    try {
        showLoading('Registering patient...');
        
        const response = await fetch('/api/register_patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Patient registered successfully!', 'success');
            e.target.reset();
        } else {
            showMessage(result.error || 'Failed to register patient', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleTestRequest(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const testData = Object.fromEntries(formData.entries());
    
    try {
        showLoading('Submitting test request...');
        
        const response = await fetch('/api/submit_test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Test request submitted successfully!', 'success');
            e.target.reset();
            
            // Automatically process the test (simulation)
            setTimeout(() => {
                processTest(result.testId);
            }, 1000);
        } else {
            showMessage(result.error || 'Failed to submit test request', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function processTest(testId) {
    try {
        showLoading('Processing test...');
        
        const response = await fetch(`/api/process_test/${testId}`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Test processed successfully!', 'success');
        } else {
            showMessage(result.error || 'Failed to process test', 'error');
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleSearchResults() {
    const patientId = document.getElementById('searchPatientId').value.trim();
    
    if (!patientId) {
        showMessage('Please enter a Patient ID', 'error');
        return;
    }
    
    try {
        showLoading('Searching for results...');
        
        const response = await fetch(`/api/search_results/${patientId}`);
        const result = await response.json();
        
        if (result.success) {
            displayResults(result);
        } else {
            showMessage(result.error || 'No results found', 'error');
            clearResultsDisplay();
        }
    } catch (error) {
        showMessage('Network error: ' + error.message, 'error');
        clearResultsDisplay();
    } finally {
        hideLoading();
    }
}

function displayResults(data) {
    const resultsDisplay = document.getElementById('resultsDisplay');
    
    if (!data.results || data.results.length === 0) {
        resultsDisplay.innerHTML = '<p>No test results found for this patient.</p>';
        return;
    }
    
    let html = `
        <div class="patient-info">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${data.patient.firstName} ${data.patient.lastName}</p>
            <p><strong>Patient ID:</strong> ${data.patient.patientId}</p>
            <p><strong>Date of Birth:</strong> ${formatDate(data.patient.dateOfBirth)}</p>
            <p><strong>Gender:</strong> ${data.patient.gender}</p>
        </div>
        <hr>
        <h3>Test Results</h3>
    `;
    
    data.results.forEach(result => {
        html += createResultCard(result);
    });
    
    resultsDisplay.innerHTML = html;
}

function createResultCard(result) {
    let html = `
        <div class="result-item">
            <h4>${getTestTypeName(result.testType)}</h4>
            <p><strong>Test Date:</strong> ${formatDate(result.processedDate)}</p>
            <p><strong>Status:</strong> <span class="status-${result.status}">${result.status}</span></p>
            
            <div class="test-info">
    `;
    
    if (result.analysis) {
        Object.keys(result.analysis).forEach(parameter => {
            const analysis = result.analysis[parameter];
            html += `
                <div class="test-parameter">
                    <div class="parameter-name">${formatParameterName(parameter)}</div>
                    <div class="parameter-value">${analysis.value} ${analysis.unit}</div>
                    <div class="parameter-status status-${analysis.status.toLowerCase()}">${analysis.status}</div>
                    <div class="parameter-range">Normal: ${analysis.normal_range}</div>
                </div>
            `;
        });
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function getTestTypeName(testType) {
    const testNames = {
        'cbc': 'Complete Blood Count (CBC)',
        'lipid': 'Lipid Profile',
        'glucose': 'Blood Glucose',
        'liver': 'Liver Function Test',
        'kidney': 'Kidney Function Test',
        'thyroid': 'Thyroid Function Test',
        'vitamin': 'Vitamin Panel'
    };
    return testNames[testType] || testType;
}

function formatParameterName(parameter) {
    return parameter.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function clearResultsDisplay() {
    const resultsDisplay = document.getElementById('resultsDisplay');
    resultsDisplay.innerHTML = '';
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the main content
    const main = document.querySelector('main');
    main.insertBefore(messageDiv, main.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function showLoading(message = 'Loading...') {
    // Remove existing loading indicators
    const existingLoading = document.querySelectorAll('.loading-indicator');
    existingLoading.forEach(loading => loading.remove());
    
    // Create loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="loading"></div>
            <p style="margin-top: 1rem;">${message}</p>
        </div>
    `;
    
    // Insert at the top of the main content
    const main = document.querySelector('main');
    main.insertBefore(loadingDiv, main.firstChild);
}

function hideLoading() {
    const loadingIndicators = document.querySelectorAll('.loading-indicator');
    loadingIndicators.forEach(loading => loading.remove());
}

async function loadInitialData() {
    // This function can be used to load initial data when the app starts
    // For now, it's empty but can be extended to load patient lists, etc.
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
        
        // Email validation
        if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value && !validatePhone(input.value)) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        }
    });
    
    return isValid;
}
