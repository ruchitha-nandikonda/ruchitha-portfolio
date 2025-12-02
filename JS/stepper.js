document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const stepPanels = document.querySelectorAll(".step-panel");
    const progressFill = document.getElementById("progressFill");
    const stepCounter = document.getElementById("stepCounter");
    const satisfactionSlider = document.getElementById("satisfactionSlider");
    
    let currentStep = 0;
    const totalSteps = 6; // Now includes hero step (0) + 5 feedback steps
    let formData = {
        timeOfVisit: null,
        stations: [],
        whatNailedIt: [],
        dietaryNeeds: null,
        dietaryHandling: '',
        satisfaction: 3,
        hasTime: null,
        improvements: '',
        lineWait: '',
        cleanliness: 3,
        visitFrequency: '',
        triedNew: false,
        newItem: '',
        wishlist: '',
        favoriteDish: '',
        email: ''
    };

    // Initialize the form
    initializeForm();
    
    // Force dropdown styling to match matcha theme
    forceDropdownTheme();
    
    // Navigation event listeners
    nextBtn.addEventListener("click", () => {
        if (validateCurrentStep() && currentStep < totalSteps - 1) {
            currentStep++;
            updateStepper();
        }
        // Step 5 is the final step - no more navigation needed
    });

    prevBtn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepper();
            
            // If going back to step 0 (hero), show hero container and hide feedback container
            if (currentStep === 0) {
                const heroContainer = document.getElementById('heroContainer');
                const feedbackContainer = document.getElementById('feedbackContainer');
                
                if (heroContainer) {
                    heroContainer.classList.remove('hidden');
                }
                if (feedbackContainer) {
                    feedbackContainer.style.display = 'none';
                }
            }
        }
    });

    // Initialize form interactions
    function initializeForm() {
        // Hero step: Start survey button
        const startSurveyBtn = document.getElementById('startSurveyBtn');
        if (startSurveyBtn) {
            startSurveyBtn.addEventListener('click', function() {
                // Hide hero container and show feedback container
                const heroContainer = document.getElementById('heroContainer');
                const feedbackContainer = document.getElementById('feedbackContainer');
                
                if (heroContainer) {
                    heroContainer.classList.add('hidden');
                }
                if (feedbackContainer) {
                    feedbackContainer.style.display = 'block';
                }
                
                currentStep = 1; // Move to first feedback step
                updateStepper();
            });
        }

        // Step 1: Time of visit options
        document.querySelectorAll('.option-btn[data-value]').forEach(btn => {
            // Check if this button is in step 1 by looking at its parent structure
            const stepPanel = btn.closest('.step-panel');
            if (stepPanel && stepPanel.textContent.includes('When did you drop by')) {
                btn.addEventListener('click', function() {
                    // Only remove selected from other buttons in the same step
                    stepPanel.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                    formData.timeOfVisit = this.dataset.value;
                    updateStepper(); // Update validation state
                });
            }
        });

        // Step 2: Station buttons (multiple selection)
        document.querySelectorAll('.station-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('selected');
                const value = this.dataset.value;
                if (this.classList.contains('selected')) {
                    if (!formData.stations.includes(value)) {
                        formData.stations.push(value);
                    }
                } else {
                    formData.stations = formData.stations.filter(s => s !== value);
                }
                updateStepper(); // Update validation state
            });
        });

        // Step 3: What nailed it options (multiple selection)
        // Use a more reliable approach - target all option buttons and check their context
        document.querySelectorAll('.option-btn').forEach(btn => {
            // Check if this button is in step 3 by looking at its parent structure
            const stepPanel = btn.closest('.step-panel');
            if (stepPanel && stepPanel.textContent.includes('What nailed it')) {
                btn.addEventListener('click', function() {
                    console.log('Step 3 button clicked:', this.dataset.value); // Debug log
                    this.classList.toggle('selected');
                    const value = this.dataset.value;
                    if (this.classList.contains('selected')) {
                        if (!formData.whatNailedIt.includes(value)) {
                            formData.whatNailedIt.push(value);
                        }
                    } else {
                        formData.whatNailedIt = formData.whatNailedIt.filter(s => s !== value);
                    }
                    console.log('Step 3 selection updated:', formData.whatNailedIt); // Debug log
                    console.log('Current step:', currentStep); // Debug log
                    updateStepper(); // Update validation state
                });
            }
        });

        // Step 4: Binary options
        document.querySelectorAll('.binary-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.binary-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                formData.dietaryNeeds = this.dataset.value === 'yes';
                
                // Show/hide follow-up question based on selection
                const followUpQuestion = document.getElementById('dietaryFollowUp');
                if (followUpQuestion) {
                    if (this.dataset.value === 'yes') {
                        followUpQuestion.style.display = 'block';
                    } else {
                        followUpQuestion.style.display = 'none';
                        // Clear the textarea when "No" is selected
                        const textarea = followUpQuestion.querySelector('.feedback-textarea');
                        if (textarea) {
                            textarea.value = '';
                            formData.dietaryHandling = '';
                        }
                    }
                }
                
                updateStepper(); // Update validation state
            });
        });

        // Step 5: Satisfaction slider
        if (satisfactionSlider) {
            satisfactionSlider.addEventListener('input', function() {
                formData.satisfaction = parseInt(this.value);
                updateSatisfactionDisplay();
            });
        }

        // Step 5: Time options (now in Step 5 itself)
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                formData.hasTime = this.dataset.value === 'time';
                
                if (this.dataset.value === 'hurry') {
                    // Submit form immediately
                    submitForm();
                } else if (this.dataset.value === 'time') {
                    // Show optional questions page
                    showOptionalQuestions();
                }
            });
        });

        // Dietary follow-up textarea
        const dietaryTextarea = document.querySelector('#dietaryFollowUp .feedback-textarea');
        if (dietaryTextarea) {
            dietaryTextarea.addEventListener('input', function() {
                formData.dietaryHandling = this.value;
            });
        }
    }

    // Function to show optional questions page
    function showOptionalQuestions() {
        // Hide the main feedback card container (this was the missing piece!)
        const feedbackCard = document.querySelector('.feedback-card');
        if (feedbackCard) {
            feedbackCard.style.display = 'none';
        }
        
        // Hide the progress container
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        
        // Hide the step panels (redundant but keeping for safety)
        const stepPanels = document.querySelectorAll('.step-panel');
        stepPanels.forEach(panel => panel.style.display = 'none');
        
        // Hide navigation buttons
        const buttonRow = document.querySelector('.button-row');
        if (buttonRow) {
            buttonRow.style.display = 'none';
        }
        
        // Hide progress bar and counter
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
        
        const stepCounter = document.querySelector('#stepCounter');
        if (stepCounter) {
            stepCounter.style.display = 'none';
        }
        
        // Show the optional questions page
        const optionalPage = document.getElementById('optionalQuestionsPage');
        if (optionalPage) {
            optionalPage.style.display = 'block';
        }
        
        // Initialize optional page event listeners
        initializeOptionalPage();
    }

    // Function to initialize optional page event listeners
    function initializeOptionalPage() {
        // Improvements textarea
        const improvementsTextarea = document.getElementById('improvementsTextarea');
        if (improvementsTextarea) {
            improvementsTextarea.addEventListener('input', function() {
                formData.improvements = this.value;
            });
        }

        // Line wait select
        const lineWaitSelect = document.getElementById('lineWaitSelect');
        if (lineWaitSelect) {
            lineWaitSelect.addEventListener('change', function() {
                formData.lineWait = this.value;
            });
        }

        // Visit frequency select
        const visitFrequencySelect = document.getElementById('visitFrequencySelect');
        if (visitFrequencySelect) {
            visitFrequencySelect.addEventListener('change', function() {
                formData.visitFrequency = this.value;
            });
        }

        // Tried new binary options
        document.querySelectorAll('#optionalQuestionsPage .binary-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove selected class from all buttons in this card
                const card = this.closest('.optional-card');
                card.querySelectorAll('.binary-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                
                formData.triedNew = this.dataset.value === 'yes';
                
                // Show/hide follow-up question
                const followUpQuestion = document.getElementById('newItemFollowUp');
                if (followUpQuestion) {
                    if (this.dataset.value === 'yes') {
                        followUpQuestion.style.display = 'block';
                    } else {
                        followUpQuestion.style.display = 'none';
                        // Clear the input when "No" is selected
                        const newItemInput = document.getElementById('newItemInput');
                        if (newItemInput) {
                            newItemInput.value = '';
                            formData.newItem = '';
                        }
                    }
                }
            });
        });

        // New item input
        const newItemInput = document.getElementById('newItemInput');
        if (newItemInput) {
            newItemInput.addEventListener('input', function() {
                formData.newItem = this.value;
            });
        }

        // Wishlist input
        const wishlistInput = document.getElementById('wishlistInput');
        if (wishlistInput) {
            wishlistInput.addEventListener('input', function() {
                formData.wishlist = this.value;
            });
        }

        // Favorite dish input
        const favoriteDishInput = document.getElementById('favoriteDishInput');
        if (favoriteDishInput) {
            favoriteDishInput.addEventListener('input', function() {
                formData.favoriteDish = this.value;
            });
        }

        // Email input
        const emailInput = document.getElementById('emailInput');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                formData.email = this.value;
            });
        }
    }

    // Function to update cleanliness rating
    function updateCleanliness(value) {
        formData.cleanliness = parseInt(value);
        
        // Update star display
        const stars = document.querySelectorAll('#cleanlinessStars .star');
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Function to go back to Step 6 from optional questions
    function goBackToStep6() {
        // Hide the optional questions page
        const optionalPage = document.getElementById('optionalQuestionsPage');
        if (optionalPage) {
            optionalPage.style.display = 'none';
        }
        
        // Show the main feedback card container
        const feedbackCard = document.querySelector('.feedback-card');
        if (feedbackCard) {
            feedbackCard.style.display = 'block';
        }
        
        // Show the feedback container
        const feedbackContainer = document.getElementById('feedbackContainer');
        if (feedbackContainer) {
            feedbackContainer.style.display = 'block';
        }
        
        // Show navigation buttons
        const buttonRow = document.querySelector('.button-row');
        if (buttonRow) {
            buttonRow.style.display = 'flex';
        }
        
        // Update stepper to show Step 5 with a small delay to ensure DOM is ready
        currentStep = 4; // Step 5 (0-indexed)
        setTimeout(() => {
            updateStepper();
            
            // Manually ensure Step 5 is visible (backup approach)
            const stepPanels = document.querySelectorAll('.step-panel');
            if (stepPanels[4]) {
                stepPanels[4].style.display = 'block';
                stepPanels[4].classList.add('active');
            }
            
            // Re-apply dropdown theme for optional questions
            setTimeout(() => {
                forceDropdownTheme();
            }, 100);
        }, 10);
    }

    // Functions removed - Step 5 now contains the "Got another minute?" section

    // Function to go back to previous step
    function goBackToPreviousStep() {
        if (currentStep > 0) {
            currentStep--;
            updateStepper();
        }
    }

    // Force dropdown theme to match matcha colors
    function forceDropdownTheme() {
        // Inject CSS to override browser defaults
        const style = document.createElement('style');
        style.id = 'dropdown-theme-override';
        style.textContent = `
            /* Force matcha theme on all select elements */
            select.select-input option {
                background-color: #f0fdf4 !important;
                color: #065f46 !important;
                background: #f0fdf4 !important;
                background-image: none !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }
            
            select.select-input option:hover {
                background-color: #dcfce7 !important;
                color: #064e3b !important;
                background: #dcfce7 !important;
                background-image: none !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }
            
            select.select-input option:focus,
            select.select-input option:active,
            select.select-input option:checked,
            select.select-input option:selected {
                background-color: #bbf7d0 !important;
                color: #064e3b !important;
                background: #bbf7d0 !important;
                background-image: none !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }
            
            /* Target all possible selectors */
            form select option,
            .form-field select option,
            .optional-main-card select option,
            #optionalQuestionsPage select option {
                background-color: #f0fdf4 !important;
                color: #065f46 !important;
                background: #f0fdf4 !important;
            }
            
            form select option:hover,
            .form-field select option:hover,
            .optional-main-card select option:hover,
            #optionalQuestionsPage select option:hover {
                background-color: #dcfce7 !important;
                color: #064e3b !important;
                background: #dcfce7 !important;
            }
        `;
        
        // Remove existing override if it exists
        const existingStyle = document.getElementById('dropdown-theme-override');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Add the new style
        document.head.appendChild(style);
        
        // Also try to set styles directly on select elements
        const selectElements = document.querySelectorAll('select.select-input');
        selectElements.forEach(select => {
            // Force the select to re-render
            select.style.display = 'none';
            select.offsetHeight; // Trigger reflow
            select.style.display = '';
            
            // Add event listeners to force styling on interaction
            select.addEventListener('mouseover', function() {
                const options = this.querySelectorAll('option');
                options.forEach(option => {
                    option.style.backgroundColor = '#f0fdf4';
                    option.style.color = '#065f46';
                });
            });
            
            select.addEventListener('change', function() {
                const options = this.querySelectorAll('option');
                options.forEach(option => {
                    option.style.backgroundColor = '#f0fdf4';
                    option.style.color = '#065f46';
                });
            });
        });
    }

    // Make functions globally accessible
    window.updateCleanliness = updateCleanliness;
    window.submitForm = submitForm;
    window.goBackToStep6 = goBackToStep6;
    window.goBackToPreviousStep = goBackToPreviousStep;
    window.forceDropdownTheme = forceDropdownTheme;

    function updateSatisfactionDisplay() {
        const emoji = document.querySelector('.emoji-rating');
        const label = document.querySelector('.rating-label');
        const labels = ['😞', '😐', '😐', '😊', '😍'];
        const labelTexts = ['Terrible', 'Meh', 'Okay', 'Tasty', "Chef's Kiss"];
        
        if (emoji && label) {
            emoji.textContent = labels[formData.satisfaction - 1];
            label.textContent = labelTexts[formData.satisfaction - 1];
        }
    }

    function validateCurrentStep() {
        let isValid = false;
        switch (currentStep) {
            case 0: // Hero step - always valid (just needs to click start button)
                isValid = true;
                console.log('Step 0 (Hero) validation:', isValid);
                break;
            case 1: // Time of visit
                isValid = formData.timeOfVisit !== null;
                console.log('Step 1 validation:', isValid, 'timeOfVisit:', formData.timeOfVisit);
                break;
            case 2: // Stations
                isValid = formData.stations.length > 0;
                console.log('Step 2 validation:', isValid, 'stations:', formData.stations);
                break;
            case 3: // What nailed it
                isValid = formData.whatNailedIt.length > 0;
                console.log('Step 3 validation:', isValid, 'whatNailedIt:', formData.whatNailedIt);
                break;
            case 4: // Dietary needs
                isValid = formData.dietaryNeeds !== null;
                console.log('Step 4 validation:', isValid, 'dietaryNeeds:', formData.dietaryNeeds);
                break;
            case 5: // Satisfaction rating
                isValid = true; // Always valid as it has a default value
                console.log('Step 5 validation:', isValid);
                break;
            default:
                isValid = true;
                break;
        }
        return isValid;
    }

    function updateStepper() {
        // Get fresh reference to step panels to ensure we have the latest DOM elements
        const currentStepPanels = document.querySelectorAll('.step-panel');
        const progressContainer = document.querySelector('.progress-container');
        
        // Update step panels (only for feedback steps, not hero)
        currentStepPanels.forEach((panel, index) => {
            if (index === currentStep - 1) { // Adjust index since hero is step 0
                panel.classList.add("active");
            } else {
                panel.classList.remove("active");
            }
        });

        // Update progress bar (only for feedback steps)
        if (currentStep > 0) {
            const progressPercentage = ((currentStep - 1) / (totalSteps - 2)) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }

        // Update step counter
        if (currentStep === 0) {
            stepCounter.textContent = "Welcome";
        } else {
            stepCounter.textContent = `Step ${currentStep} of ${totalSteps - 1}`;
        }

        // Update navigation buttons
        prevBtn.disabled = currentStep === 0; // Only disable on hero step
        
        if (currentStep === totalSteps - 1) {
            nextBtn.textContent = "Send Feedback • Upgrade My Next Meal";
            nextBtn.innerHTML = "✈️ Send Feedback • Upgrade My Next Meal";
        } else {
            nextBtn.textContent = "Next →";
        }

        // Update button state based on validation
        const isValid = validateCurrentStep();
        console.log('updateStepper - currentStep:', currentStep, 'isValid:', isValid); // Debug log
        nextBtn.style.opacity = isValid ? '1' : '0.5';
        nextBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
        nextBtn.disabled = !isValid;
    }

    function submitForm() {
        // Collect all form data including optional fields
        const improvementsTextarea = document.getElementById('improvementsTextarea');
        if (improvementsTextarea) {
            formData.improvements = improvementsTextarea.value;
        }

        const lineWaitSelect = document.getElementById('lineWaitSelect');
        if (lineWaitSelect) {
            formData.lineWait = lineWaitSelect.value;
        }

        const visitFrequencySelect = document.getElementById('visitFrequencySelect');
        if (visitFrequencySelect) {
            formData.visitFrequency = visitFrequencySelect.value;
        }

        const newItemInput = document.getElementById('newItemInput');
        if (newItemInput) {
            formData.newItem = newItemInput.value;
        }

        const wishlistInput = document.getElementById('wishlistInput');
        if (wishlistInput) {
            formData.wishlist = wishlistInput.value;
        }

        const favoriteDishInput = document.getElementById('favoriteDishInput');
        if (favoriteDishInput) {
            formData.favoriteDish = favoriteDishInput.value;
        }

        const emailInput = document.getElementById('emailInput');
        if (emailInput) {
            formData.email = emailInput.value;
        }

        // Log form data
        console.log('Form submitted with data:', formData);
        
        // Show feedback popup
        showFeedbackPopup();
        
        // Update AI analysis text
        const aiText = document.getElementById("aiAnalysisText");
        if (aiText) {
            aiText.textContent = "Analyzing your feedback...";
            
            // Simulate AI analysis delay and update text
            setTimeout(() => {
                aiText.textContent = generateAIResponse();
            }, 2000);
        }
    }

    // Function to show feedback popup
    function showFeedbackPopup() {
        const popup = document.getElementById('feedbackPopup');
        if (popup) {
            popup.style.display = 'block';
        }
    }

    // Function to hide feedback popup
    function hideFeedbackPopup() {
        const popup = document.getElementById('feedbackPopup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    // Function to generate AI response based on form data
    function generateAIResponse() {
        const responses = [
            "Based on your feedback, we're prioritizing fresh ingredient rotation at your favorite stations and adjusting portion sizes during peak hours. Your input helps us serve better meals faster!",
            "Thanks for the detailed feedback! We're already working on improving line wait times and enhancing the cleanliness standards you mentioned. Keep the suggestions coming!",
            "Your feedback is gold! We're implementing your suggestions about menu variety and will be rolling out some new options based on your preferences. Stay tuned for updates!",
            "We love hearing from students like you! Your insights about service speed and food quality are driving our next improvements. Thanks for helping us level up!",
            "Amazing feedback! We're taking your comments about dietary options and station organization seriously. Expect to see positive changes very soon!"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Function to reset form (called from popup)
    function resetForm() {
        // Hide popup
        hideFeedbackPopup();
        
        // Reset all form data
        formData = {
            stations: [],
            timeOfVisit: "",
            overallExperience: 3,
            enjoyed: [],
            dietaryNeeds: false,
            dietaryHandling: "",
            highlight: "",
            improvements: "",
            lineWait: "",
            cleanliness: 3,
            visitFrequency: "",
            triedNew: false,
            newItem: "",
            wishlist: "",
            favoriteDish: "",
            email: ""
        };
        
        // Reset to hero step
        currentStep = 0;
        
        // Show hero container and hide feedback container
        const heroContainer = document.getElementById('heroContainer');
        const feedbackContainer = document.getElementById('feedbackContainer');
        
        if (heroContainer) {
            heroContainer.classList.remove('hidden');
        }
        if (feedbackContainer) {
            feedbackContainer.style.display = 'none';
        }
        
        updateStepper();
        
        // Clear all form inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        
        // Reset button states
        const buttons = document.querySelectorAll('.option-btn, .station-btn, .binary-btn, .time-btn');
        buttons.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Reset rating sliders
        const ratingSliders = document.querySelectorAll('.rating-slider');
        ratingSliders.forEach(slider => {
            slider.value = 3;
        });
    }

    // Make functions globally accessible
    window.resetForm = resetForm;
    window.showFeedbackPopup = showFeedbackPopup;
    window.hideFeedbackPopup = hideFeedbackPopup;

    // Initialize the stepper
    updateStepper();
});