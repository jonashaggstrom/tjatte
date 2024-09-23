document.addEventListener('DOMContentLoaded', function() {
    // DOM elements that we use frequently
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeButton = document.querySelector('.close');
    const settingsForm = document.getElementById('settingsForm');

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

    // Function to open settings modal
    function openSettingsModal() {
        const openAIKeyInput = document.getElementById('openAIKey');
        const modelSelect = document.getElementById('modelSelect');
        
        if (!openAIKeyInput || !modelSelect) {
            console.error('Kunde inte hitta nödvändiga inställningselement');
            return;
        }
        
        openAIKeyInput.value = settingsManager.getOpenAIKey();
        modelSelect.value = settingsManager.getModel();
        
        if (settingsModal) {
            settingsModal.style.display = 'block';
        } else {
            console.error('Kunde inte hitta settingsModal');
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
        
        if (!openAIKeyInput || !modelSelect) {
            console.error('Kunde inte hitta nödvändiga inställningselement vid sparande');
            return;
        }
        
        const openAIKey = openAIKeyInput.value;
        const selectedModel = modelSelect.value;
        settingsManager.setOpenAIKey(openAIKey);
        settingsManager.setModel(selectedModel);
        closeSettingsModal();
        console.log('Settings saved successfully');
    }

    // Event listeners
    if (settingsButton) {
        settingsButton.addEventListener('click', openSettingsModal);
    } else {
        console.error('Kunde inte hitta settingsButton');
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeSettingsModal);
    } else {
        console.error('Kunde inte hitta closeButton');
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    } else {
        console.error('Kunde inte hitta settingsForm');
    }

    // Event listener for clicking outside the modal to close it
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            closeSettingsModal();
        }
    });

    console.log('Script loaded. Settings functionality should be operational.');
});
