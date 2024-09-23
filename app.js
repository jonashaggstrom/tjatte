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

    // Login state manager
    const loginManager = (function() {
        let isLoggedIn = false;
        return {
            toggle: function() {
                isLoggedIn = !isLoggedIn;
                return isLoggedIn;
            },
            status: function() {
                return isLoggedIn;
            }
        };
    })();

    // Function to update UI based on login state
    function updateUIForLoginState() {
        const isLoggedIn = loginManager.status();
        console.log('Updating UI. isLoggedIn:', isLoggedIn);
        loginToggleBtn.textContent = isLoggedIn ? 'Logout' : 'Login';
        settingsButton.style.display = isLoggedIn ? 'block' : 'none';
        inputSection.style.display = isLoggedIn ? 'block' : 'none';
        responseSection.style.display = isLoggedIn ? 'block' : 'none';
        if (!isLoggedIn) {
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

    // Function to open settings modal
    function openSettingsModal() {
        settingsModal.style.display = 'block';
    }

    // Function to close settings modal
    function closeSettingsModal() {
        settingsModal.style.display = 'none';
    }

    // Function to call ChatGPT API
    async function callChatGPT(prompt) {
        const apiKey = document.getElementById('openAIKey').value;
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
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: prompt}],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error:', error);
            return 'An error occurred while calling the ChatGPT API.';
        }
    }

    // Function to handle submit button click
    async function handleSubmit() {
        const prompt = userPrompt.value;
        if (!prompt) {
            alert('Please enter a prompt.');
            return;
        }

        submitButton.disabled = true;
        responseText.textContent = 'Thinking...';

        const response = await callChatGPT(prompt);
        responseText.textContent = response;

        submitButton.disabled = false;
    }

    // Event listeners
    loginToggleBtn.addEventListener('click', toggleLogin);
    settingsButton.addEventListener('click', openSettingsModal);
    closeButton.addEventListener('click', closeSettingsModal);
    submitButton.addEventListener('click', handleSubmit);

    // Event listener for clicking outside the modal to close it
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            closeSettingsModal();
        }
    });

    // Initial UI update
    console.log('Initial UI update');
    updateUIForLoginState();

    console.log('Script loaded. Login button should be visible and functional.');
});
