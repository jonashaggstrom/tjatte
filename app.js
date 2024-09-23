document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginToggleBtn = document.getElementById('loginToggleBtn');
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeButton = document.querySelector('.close');
    const inputSection = document.querySelector('.input-section');
    const responseSection = document.getElementById('responseSection');

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

    // Event listeners
    loginToggleBtn.addEventListener('click', toggleLogin);
    settingsButton.addEventListener('click', openSettingsModal);
    closeButton.addEventListener('click', closeSettingsModal);

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
