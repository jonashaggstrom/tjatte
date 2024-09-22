
async function createRepo(repoName) {
  const token = localStorage.getItem('github-token');
  const response = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: repoName,
      private: false
    })
  });

  const data = await response.json();
  if (data.id) {
    console.log('Repository created successfully:', data);
  } else {
    console.error('Failed to create repository:', data);
  }
}

// Example: Create a new repository
createRepo('new-repo-name');
    