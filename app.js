console.log("App.js is running");

// Simulated user state
let isLoggedIn = false;

// Get elements
const userPromptInput = document.getElementById('userPrompt');
const submitButton = document.getElementById('submitButton');
const responseText = document.getElementById('responseText');

// Modal elements
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementsByClassName('close')[0];

// Enable the submit button when there's input
userPromptInput.addEventListener('input', function() {
  if (userPromptInput.value.trim() !== "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
});

// Simulate querying ChatGPT API
async function queryChatGPT(prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("ChatGPT Response: " + prompt);
    }, 1000);
  });
}

// Handle submit button click
submitButton.addEventListener('click', async function() {
  const userInput = userPromptInput.value;
  responseText.innerText = "Loading...";
  const chatGPTResponse = await queryChatGPT(userInput);
  responseText.innerText = chatGPTResponse;
});

// Open settings modal
settingsButton.onclick = function() {
  settingsModal.style.display = "block";
}

// Close settings modal
closeModal.onclick = function() {
  settingsModal.style.display = "none";
}

// Handle form submission and save settings
document.getElementById('settingsForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const githubToken = document.getElementById('githubToken').value;
  const platformDetails = document.getElementById('platformDetails').value;

  // Store settings locally (you can later store them to the cloud if needed)
  localStorage.setItem('github-token', githubToken);
  localStorage.setItem('platform-details', platformDetails);

  // Close modal after saving
  settingsModal.style.display = "none";
});

// DOM elements
const settingsForm = document.getElementById('settingsForm');
const githubTokenInput = document.getElementById('githubToken');
const openAIKeyInput = document.getElementById('openAIKey');

// Function to save settings
function saveSettings(event) {
  event.preventDefault();
  if (isLoggedIn) {
    sessionStorage.setItem('githubToken', githubTokenInput.value);
    sessionStorage.setItem('openAIKey', openAIKeyInput.value);
    alert('Settings saved successfully!');
    closeSettingsModal();
  } else {
    alert('You must be logged in to save settings.');
  }
}

// Function to load settings
function loadSettings() {
  if (isLoggedIn) {
    const githubToken = sessionStorage.getItem('githubToken');
    const openAIKey = sessionStorage.getItem('openAIKey');
    if (githubToken) githubTokenInput.value = githubToken;
    if (openAIKey) openAIKeyInput.value = openAIKey;
  }
}

// Function to clear settings on logout
function clearSettings() {
  sessionStorage.removeItem('githubToken');
  sessionStorage.removeItem('openAIKey');
  githubTokenInput.value = '';
  openAIKeyInput.value = '';
}

// Modify the login function to load settings after login
function login(provider) {
  // Here you would typically implement actual OAuth login
  console.log(`Logging in with ${provider}...`);
  isLoggedIn = true;
  updateUIForLoginState();
  loadSettings();
}

// Add a logout function
function logout() {
  isLoggedIn = false;
  clearSettings();
  updateUIForLoginState();
  closeSettingsModal(); // Ensure settings modal is closed on logout
}

// Event listeners
settingsForm.addEventListener('submit', saveSettings);

// Initial UI update and settings load
updateUIForLoginState();
if (isLoggedIn) {
  loadSettings();
}

// Simulated login function
function login(provider) {
  // Here you would typically implement actual OAuth login
  console.log(`Logging in with ${provider}...`);
  isLoggedIn = true;
  updateUIForLoginState();
  loadSettings(); // Assuming you have this function from the previous example
}

// Simulated logout function
function logout() {
  isLoggedIn = false;
  clearSettings(); // Assuming you have this function from the previous example
  updateUIForLoginState();
}

// Event listeners for login buttons
googleLoginBtn.addEventListener('click', () => login('Google'));
facebookLoginBtn.addEventListener('click', () => login('Facebook'));

// Initial UI update
updateUIForLoginState();

// Function to update UI based on login state
function updateUIForLoginState() {
  if (isLoggedIn) {
    loginPrompt.style.display = 'none';
    app.style.display = 'block';
    settingsButton.style.display = 'block';
  } else {
    loginPrompt.style.display = 'block';
    app.style.display = 'none';
    settingsButton.style.display = 'none';
    settingsModal.style.display = 'none'; // Hide settings modal when logged out
  }
}

// Function to open settings modal
function openSettingsModal() {
  if (isLoggedIn) {
    settingsModal.style.display = 'block';
  } else {
    alert('You must be logged in to access settings.');
  }
}

// Function to close settings modal
function closeSettingsModal() {
  settingsModal.style.display = 'none';
} 

// Event listener for settings button
settingsButton.addEventListener('click', openSettingsModal);

// Event listener for close button in settings modal
document.querySelector('.close').addEventListener('click', closeSettingsModal);

// Event listener for clicking outside the modal to close it
window.addEventListener('click', (event) => {
  if (event.target === settingsModal) {
    closeSettingsModal();
  }
});

const loginError = document.getElementById('loginError');

function onSignIn(googleUser) {
  try {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());

    // Here you would typically send the ID token to your server
    var id_token = googleUser.getAuthResponse().id_token;
    
    // Update your UI
    isLoggedIn = true;
    currentUser = {
      name: profile.getName(),
      email: profile.getEmail(),
      provider: 'Google'
    };
    updateUIForLoginState();
    loginError.textContent = ''; // Clear any previous error messages
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    onSignInFailure(error);
  }
}


function onSignInFailure(error) {
  console.error('Google Sign-In failed:', error);
  isLoggedIn = false;
  currentUser = null;
  loginError.textContent = 'Sign-in failed. Please try again.';
  updateUIForLoginState();
}

// Facebook login (simulated for this example)
function facebookLogin() {
  // Simulate a Facebook login process
  setTimeout(() => {
    // Randomly succeed or fail
    if (Math.random() > 0.5) {
      isLoggedIn = true;
      currentUser = {
        name: 'Facebook User',
        email: 'facebook@example.com',
        provider: 'Facebook'
      };
      loginError.textContent = ''; // Clear any previous error messages
      updateUIForLoginState();
    } else {
      loginError.textContent = 'Facebook login failed. Please try again.';
    }
  }, 1000);
}

function updateUIForLoginState() {
  if (isLoggedIn) {
    loginPrompt.style.display = 'none';
    app.style.display = 'block';
    settingsButton.style.display = 'block';
    userInfoDisplay.textContent = `Logged in as: ${currentUser.name}`;
    loginError.textContent = ''; // Clear error message on successful login
  } else {
    loginPrompt.style.display = 'block';
    app.style.display = 'none';
    settingsButton.style.display = 'none';
    settingsModal.style.display = 'none';
    userInfoDisplay.textContent = '';
    // Don't clear error message here, as we want it to persist if login failed
  }
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    isLoggedIn = false;
    currentUser = null;
    loginError.textContent = ''; // Clear error message on sign out
    updateUIForLoginState();
  });
}

// Event listeners
document.getElementById('facebookLogin').addEventListener('click', facebookLogin);
