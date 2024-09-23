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

    // Function to call ChatGPT API
    async function callChatGPT(prompt) {
        const apiKey = settingsManager.getOpenAIKey();
        const model = settingsManager.getModel();
        if (!apiKey) {
            alert('Please enter your OpenAI API key in the settings.');
            return;
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
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error:', error);
            return `An error occurred while calling the ChatGPT API: ${error.message}`;
        }
    }

    // Function to handle submit button click
    async function handleSubmit() {
        console.log('Submit button clicked');
        const prompt = userPrompt.value;
        if (!prompt) {
            alert('Please enter a prompt.');
            return;
        }

        submitButton.disabled = true;
        responseText.textContent = 'Thinking...';

        try {
            const response = await callChatGPT(prompt);
            responseText.textContent = response;
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            responseText.textContent = `Error: ${error.message}. Please try again later.`;
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
    if (loginToggleBtn) loginToggleBtn.addEventListener('click', toggleLogin);
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

    console.log('Script loaded. All functionality should be operational.');
});
