document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginToggleBtn = document.getElementById('loginToggleBtn');
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeButton = document.querySelector('.close');
    const inputSection = document.querySelector('.input-section');
    const responseSection = document.getElementById('responseSection');
    const userPrompt = document.getElementById('userPrompt');
    const submitButton = document.getElementById('submitButton');
    const responseText = document.getElementById('responseText');
    const settingsForm = document.getElementById('settingsForm');

    // Login state manager
    const loginManager = (function() {
        let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        return {
            toggle: function() {
                isLoggedIn = !isLoggedIn;
                localStorage.setItem('isLoggedIn', isLoggedIn);
                return isLoggedIn;
            },
            status: function() {
                return isLoggedIn;
            }
        };
    })();

    // Settings manager
    const settingsManager = (function() {
        let openAIKey = localStorage.getItem('openAIKey') || '';
        let model = localStorage.getItem('chatGPTModel') || 'gpt-3.5-turbo';
        return {
            setOpenAIKey: function(key) {
                openAIKey = key;
                localStorage.setItem('openAIKey', key);
            },
            getOpenAIKey: function() {
                return openAIKey;
            },
            setModel: function(selectedModel) {
                model = selectedModel;
                localStorage.setItem('chatGPTModel', selectedModel);
            },
            getModel: function() {
                return model;
            }
        };
    })();

    // Function to update UI based on login state
    function updateUIForLoginState() {
        const isLoggedIn = loginManager.status();
        console.log('Updating UI. isLoggedIn:', isLoggedIn);
        if (loginToggleBtn) loginToggleBtn.textContent = isLoggedIn ? 'Logout' : 'Login';
        if (settingsButton) settingsButton.style.display = isLoggedIn ? 'block' : 'none';
        if (inputSection) inputSection.style.display = isLoggedIn ? 'block' : 'none';
        if (responseSection) responseSection.style.display = isLoggedIn ? 'block' : 'none';
        if (!isLoggedIn && settingsModal) {
            settingsModal.style.display = 'none';
        }
    }

    // Function to toggle login state
    function toggleLogin() {
        console.log('Toggle login called. Current state:', loginManager.status());
        loginManager.toggle();
        console.log('New state:', loginManager.status());
        updateUIForLoginState();
    }

    // Function to call ChatGPT API
    async function callChatGPT(prompt) {
        const apiKey = settingsManager.getOpenAIKey();
        const model = settingsManager.getModel();
        if (!apiKey) {
            throw new Error('OpenAI API-nyckel saknas. Vänligen ange den i inställningarna.');
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{role: "user", content: prompt}],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Ogiltig API-nyckel. Kontrollera din OpenAI API-nyckel i inställningarna.');
                } else if (response.status === 429) {
                    throw new Error('För många förfrågningar. Vänta en stund innan du försöker igen.');
                } else {
                    throw new Error(`HTTP-fel! status: ${response.status}`);
                }
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Kasta felet vidare för hantering i handleSubmit
        }
    }

    // Function to handle submit button click
    async function handleSubmit() {
        console.log('Submit button clicked');
        const prompt = userPrompt.value;
        if (!prompt) {
            alert('Vänligen ange en fråga.');
            return;
        }

        submitButton.disabled = true;
        responseText.textContent = 'Tänker...';

        try {
            const response = await callChatGPT(prompt);
            responseText.textContent = response;
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            responseText.textContent = `Fel: ${error.message}`;
            if (error.message.includes('API-nyckel')) {
                openSettingsModal(); // Öppna inställningar om API-nyckeln är ogiltig
            }
        } finally {
            submitButton.disabled = false;
        }
    }

    // Function to open settings modal
    function openSettingsModal() {
        const openAIKeyInput = document.getElementById('openAIKey');
        const modelSelect = document.getElementById('modelSelect');
        
        if (openAIKeyInput && modelSelect) {
            openAIKeyInput.value = settingsManager.getOpenAIKey();
            
            // Uppdatera alternativ för modelSelect
            modelSelect.innerHTML = `
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16k</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-32k">GPT-4 32k</option>
                <option value="gpt-4-1106-preview">GPT-4 Turbo (November 2023)</option>
                <option value="gpt-4-0125-preview">GPT-4 Turbo (January 2024)</option>
                <option value="gpt-4-vision-preview">GPT-4 Vision</option>
            `;
            
            modelSelect.value = settingsManager.getModel();
        }
        
        if (settingsModal) {
            settingsModal.style.display = 'block';
        }
    }

    // Function to close settings modal
    function closeSettingsModal() {
        if (settingsModal) {
            settingsModal.style.display = 'none';
        }
    }

    // Function to handle settings form submission
    function handleSettingsSubmit(event) {
        event.preventDefault();
        const openAIKeyInput = document.getElementById('openAIKey');
        const modelSelect = document.getElementById('modelSelect');
        
        if (openAIKeyInput && modelSelect) {
            settingsManager.setOpenAIKey(openAIKeyInput.value);
            settingsManager.setModel(modelSelect.value);
            closeSettingsModal();
            console.log('Settings saved successfully');
        }
    }

    // Event listeners
    if (loginToggleBtn) {
        loginToggleBtn.addEventListener('click', function() {
            toggleLogin();
        });
    }
    if (settingsButton) settingsButton.addEventListener('click', openSettingsModal);
    if (closeButton) closeButton.addEventListener('click', closeSettingsModal);
    if (submitButton) submitButton.addEventListener('click', handleSubmit);
    if (settingsForm) settingsForm.addEventListener('submit', handleSettingsSubmit);

    // Event listener for clicking outside the modal to close it
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            closeSettingsModal();
        }
    });

    // Initial UI update
    updateUIForLoginState();

    console.log('Script loaded. All functionality should be operational.');
});
