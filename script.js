// JavaScript for Interactive Program Assessment Plan Tool

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const progressItems = document.querySelectorAll('.progress-item');
    const moduleContainer = document.getElementById('module-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const beginBtn = document.getElementById('begin-btn');
    const saveProgressBtn = document.getElementById('save-progress-btn');
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeModal = document.querySelector('.close-modal');
    const aiAssistant = document.getElementById('ai-assistant');
    const toggleAssistantBtn = document.getElementById('toggle-assistant-btn');
    const aiSubmitBtn = document.getElementById('ai-submit-btn');
    const aiQuestionInput = document.getElementById('ai-question-input');

    // Module content paths
    const modulePaths = {
        'dashboard': 'dashboard-module',
        'program-profile': 'program_profile.html',
        'learning-outcomes': 'learning_outcomes.html',
        'curriculum-mapping': 'curriculum_mapping.html',
        'assessment-methods': 'assessment_methods.html',
        'data-collection': 'data_collection.html',
        'action-planning': 'action_planning.html'
    };

    // State
    let currentModuleIndex = 0;
    const moduleIds = Array.from(progressItems).map(item => item.dataset.module);
    let userProgress = {
        currentModule: moduleIds[currentModuleIndex],
        completedModules: [],
        formData: {}
    };

    // Initialize
    function init() {
        loadSavedProgress();
        updateNavigationButtons();
        setupEventListeners();
    }

    // Load saved progress from localStorage
    function loadSavedProgress() {
        const savedProgress = localStorage.getItem('assessmentPlanProgress');
        if (savedProgress) {
            try {
                userProgress = JSON.parse(savedProgress);
                currentModuleIndex = moduleIds.indexOf(userProgress.currentModule);
                if (currentModuleIndex === -1) currentModuleIndex = 0;
                
                // Mark completed modules
                userProgress.completedModules.forEach(moduleId => {
                    const item = document.querySelector(`.progress-item[data-module="${moduleId}"]`);
                    if (item) item.classList.add('completed');
                });
                
                // Activate current module
                activateModule(userProgress.currentModule);
            } catch (e) {
                console.error('Error loading saved progress:', e);
            }
        }
    }

    // Save progress to localStorage
    function saveProgress() {
        localStorage.setItem('assessmentPlanProgress', JSON.stringify(userProgress));
        showNotification('Progress saved successfully!');
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }, 10);
    }

    // Activate a module
    function activateModule(moduleId) {
        // Update progress items
        progressItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.module === moduleId) {
                item.classList.add('active');
            }
        });

        // Update current module index
        currentModuleIndex = moduleIds.indexOf(moduleId);
        userProgress.currentModule = moduleId;

        // Load module content
        loadModuleContent(moduleId);
        
        // Update navigation buttons
        updateNavigationButtons();
    }

    // Load module content
    function loadModuleContent(moduleId) {
        // If it's the dashboard, it's already in the HTML
        if (moduleId === 'dashboard') {
            showModuleContent('dashboard-module');
            return;
        }

        // For other modules, load from separate files
        const modulePath = modulePaths[moduleId];
        
        // If the module is already loaded, just show it
        const existingModule = document.getElementById(`${moduleId}-module`);
        if (existingModule) {
            showModuleContent(`${moduleId}-module`);
            return;
        }

        // Otherwise, fetch and load the module
        fetch(modulePath)
            .then(response => response.text())
            .then(html => {
                const moduleDiv = document.createElement('div');
                moduleDiv.id = `${moduleId}-module`;
                moduleDiv.className = 'module-content';
                moduleDiv.innerHTML = html;
                moduleContainer.appendChild(moduleDiv);
                
                // Show the newly loaded module
                showModuleContent(`${moduleId}-module`);
                
                // Initialize any module-specific functionality
                initModuleSpecificFunctionality(moduleId);
            })
            .catch(error => {
                console.error('Error loading module:', error);
                // Fallback: create a basic module container with error message
                const moduleDiv = document.createElement('div');
                moduleDiv.id = `${moduleId}-module`;
                moduleDiv.className = 'module-content';
                moduleDiv.innerHTML = `
                    <h2>${moduleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
                    <p>Sorry, there was an error loading this module. Please try again later.</p>
                `;
                moduleContainer.appendChild(moduleDiv);
                showModuleContent(`${moduleId}-module`);
            });
    }

    // Show a specific module content
    function showModuleContent(moduleId) {
        const moduleContents = document.querySelectorAll('.module-content');
        moduleContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const targetModule = document.getElementById(moduleId);
        if (targetModule) {
            targetModule.classList.add('active');
        }
    }

    // Initialize module-specific functionality
    function initModuleSpecificFunctionality(moduleId) {
        // Add module-specific initialization here
        switch(moduleId) {
            case 'program-profile':
                initProgramProfileModule();
                break;
            case 'learning-outcomes':
                initLearningOutcomesModule();
                break;
            case 'curriculum-mapping':
                initCurriculumMappingModule();
                break;
            case 'assessment-methods':
                initAssessmentMethodsModule();
                break;
            case 'data-collection':
                initDataCollectionModule();
                break;
            case 'action-planning':
                initActionPlanningModule();
                break;
        }
    }

    // Module-specific initializations
    function initProgramProfileModule() {
        // Initialize program profile specific functionality
        const formElements = document.querySelectorAll('#program-profile-module input, #program-profile-module textarea, #program-profile-module select');
        
        // Load saved form data
        if (userProgress.formData['program-profile']) {
            formElements.forEach(element => {
                if (userProgress.formData['program-profile'][element.id]) {
                    element.value = userProgress.formData['program-profile'][element.id];
                }
            });
        }
        
        // Add event listeners to save form data
        formElements.forEach(element => {
            element.addEventListener('change', () => {
                saveFormData('program-profile');
            });
        });
    }

    function initLearningOutcomesModule() {
        // Initialize learning outcomes specific functionality
        // Similar to program profile initialization
    }

    function initCurriculumMappingModule() {
        // Initialize curriculum mapping specific functionality
    }

    function initAssessmentMethodsModule() {
        // Initialize assessment methods specific functionality
    }

    function initDataCollectionModule() {
        // Initialize data collection specific functionality
    }

    function initActionPlanningModule() {
        // Initialize action planning specific functionality
    }

    // Save form data for a specific module
    function saveFormData(moduleId) {
        const formElements = document.querySelectorAll(`#${moduleId}-module input, #${moduleId}-module textarea, #${moduleId}-module select`);
        
        if (!userProgress.formData[moduleId]) {
            userProgress.formData[moduleId] = {};
        }
        
        formElements.forEach(element => {
            userProgress.formData[moduleId][element.id] = element.value;
        });
        
        // Auto-save
        saveProgress();
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        prevBtn.disabled = currentModuleIndex === 0;
        nextBtn.disabled = currentModuleIndex === moduleIds.length - 1;
    }

    // Navigate to previous module
    function navigateToPrevious() {
        if (currentModuleIndex > 0) {
            currentModuleIndex--;
            activateModule(moduleIds[currentModuleIndex]);
        }
    }

    // Navigate to next module
    function navigateToNext() {
        if (currentModuleIndex < moduleIds.length - 1) {
            // Mark current module as completed
            const currentModuleId = moduleIds[currentModuleIndex];
            if (!userProgress.completedModules.includes(currentModuleId)) {
                userProgress.completedModules.push(currentModuleId);
                const item = document.querySelector(`.progress-item[data-module="${currentModuleId}"]`);
                if (item) item.classList.add('completed');
            }
            
            // Move to next module
            currentModuleIndex++;
            activateModule(moduleIds[currentModuleIndex]);
            
            // Save progress
            saveProgress();
        }
    }

    // Toggle AI assistant
    function toggleAIAssistant() {
        aiAssistant.classList.toggle('collapsed');
        toggleAssistantBtn.textContent = aiAssistant.classList.contains('collapsed') ? '+' : '-';
    }

    // Submit question to AI assistant
    function submitQuestion() {
        const question = aiQuestionInput.value.trim();
        if (!question) return;
        
        // Clear input
        aiQuestionInput.value = '';
        
        // Add user question to chat
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `<strong>You:</strong> ${question}`;
        
        const aiContent = document.querySelector('.ai-assistant-content');
        aiContent.appendChild(userMessage);
        
        // Add loading indicator
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'ai-message loading';
        loadingMessage.innerHTML = '<strong>Assessment Assistant:</strong> Thinking...';
        aiContent.appendChild(loadingMessage);
        
        // Scroll to bottom
        aiContent.scrollTop = aiContent.scrollHeight;
        
        // Simulate AI response (in a real implementation, this would call an API)
        setTimeout(() => {
            // Remove loading indicator
            aiContent.removeChild(loadingMessage);
            
            // Add AI response
            const aiMessage = document.createElement('div');
            aiMessage.className = 'ai-message';
            
            // Generate response based on question
            let response = getAIResponse(question, moduleIds[currentModuleIndex]);
            
            aiMessage.innerHTML = `<strong>Assessment Assistant:</strong> ${response}`;
            aiContent.appendChild(aiMessage);
            
            // Scroll to bottom
            aiContent.scrollTop = aiContent.scrollHeight;
        }, 1000);
    }

    // Get AI response based on question and current module
    function getAIResponse(question, currentModule) {
        // Simple rule-based responses
        question = question.toLowerCase();
        
        // General assessment questions
        if (question.includes('what is assessment') || question.includes('why is assessment important')) {
            return "Assessment is the systematic process of documenting and using empirical data to measure knowledge, skills, attitudes, and beliefs. It's important because it helps programs understand what students are learning, identify areas for improvement, and demonstrate program effectiveness to stakeholders.";
        }
        
        if (question.includes('direct') && question.includes('indirect')) {
            return "Direct assessment measures examine actual student work or performances that demonstrate learning outcomes. Examples include exams, papers, projects, and presentations. Indirect assessment gathers perceptions or opinions about learning through surveys, focus groups, or interviews. A comprehensive assessment plan typically includes both types.";
        }
        
        // Module-specific responses
        switch(currentModule) {
            case 'program-profile':
                if (question.includes('mission statement')) {
                    return "A strong program mission statement articulates the purpose and values of your program. It should clearly state the program's purpose, identify primary functions, reflect its distinctive character, align with institutional mission, and be concise (typically 3-5 sentences).";
                }
                break;
                
            case 'learning-outcomes':
                if (question.includes('bloom') || question.includes('taxonomy')) {
                    return "Bloom's Taxonomy is a framework for categorizing educational goals. It's useful for writing learning outcomes because it provides action verbs at different cognitive levels: Remember (define, list), Understand (explain, describe), Apply (implement, use), Analyze (differentiate, examine), Evaluate (assess, judge), and Create (design, develop).";
                }
                if (question.includes('measurable')) {
                    return "Measurable learning outcomes use specific action verbs that indicate observable behaviors or products. Avoid vague terms like 'understand' or 'appreciate' and instead use verbs like 'analyze,' 'evaluate,' 'create,' or 'demonstrate' that can be directly assessed through student work.";
                }
                break;
                
            case 'curriculum-mapping':
                if (question.includes('curriculum map')) {
                    return "A curriculum map visually represents how courses contribute to student achievement of learning outcomes. It typically shows where outcomes are introduced (I), reinforced (R), and mastered (M) across the curriculum. This helps identify gaps or redundancies in outcome coverage and ensures appropriate progression of learning.";
                }
                break;
                
            case 'assessment-methods':
                if (question.includes('rubric')) {
                    return "Rubrics provide clear criteria and standards for evaluating student work. Effective rubrics define specific criteria aligned with learning outcomes, describe performance levels for each criterion, use clear language, and maintain a consistent scale. They help ensure consistent evaluation across different raters.";
                }
                break;
                
            case 'data-collection':
                if (question.includes('sample size') || question.includes('sampling')) {
                    return "For programs with large enrollments, sampling can make assessment manageable. For small programs (<50 students), assess all students. For medium programs (50-100), sample 40-50%. For large programs (>100), sample 25-30% or at least 30 students. Ensure your sample is representative of the student population.";
                }
                break;
                
            case 'action-planning':
                if (question.includes('closing the loop')) {
                    return "'Closing the loop' refers to using assessment results to make improvements to your program, then reassessing to see if those improvements were effective. This cyclical process is essential for continuous improvement. Document both the changes made and their impact on student learning.";
                }
                break;
        }
        
        // Default response if no specific match
        return "That's a great question about assessment. While I don't have a specific answer prepared, I recommend checking the resources section for more information on this topic. You might find helpful examples and templates there, or you can ask your assessment coordinator for guidance specific to your program's context.";
    }

    // Setup event listeners
    function setupEventListeners() {
        // Progress item clicks
        progressItems.forEach(item => {
            item.addEventListener('click', () => {
                activateModule(item.dataset.module);
            });
        });
        
        // Navigation buttons
        prevBtn.addEventListener('click', navigateToPrevious);
        nextBtn.addEventListener('click', navigateToNext);
        
        // Begin button
        if (beginBtn) {
            beginBtn.addEventListener('click', () => {
                navigateToNext();
            });
        }
        
        // Save progress button
        saveProgressBtn.addEventListener('click', saveProgress);
        
        // Help button and modal
        helpBtn.addEventListener('click', () => {
            helpModal.style.display = 'flex';
        });
        
        closeModal.addEventListener('click', () => {
            helpModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.style.display = 'none';
            }
        });
        
        // AI Assistant
        toggleAssistantBtn.addEventListener('click', toggleAIAssistant);
        aiSubmitBtn.addEventListener('click', submitQuestion);
        aiQuestionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitQuestion();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + N: Next
            if (e.altKey && e.key === 'n') {
                if (!nextBtn.disabled) navigateToNext();
            }
            // Alt + P: Previous
            if (e.altKey && e.key === 'p') {
                if (!prevBtn.disabled) navigateToPrevious();
            }
            // Alt + S: Save
            if (e.altKey && e.key === 's') {
                saveProgress();
                e.preventDefault(); // Prevent browser save dialog
            }
            // Alt + H: Help
            if (e.altKey && e.key === 'h') {
                helpModal.style.display = 'flex';
            }
        });
    }

    // Initialize the application
    init();
});
