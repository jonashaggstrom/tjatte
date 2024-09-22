console.log("App.js is running");

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
}

// Event listeners
settingsForm.addEventListener('submit', saveSettings);

// Initial UI update and settings load
updateUIForLoginState();
if (isLoggedIn) {
  loadSettings();
}
