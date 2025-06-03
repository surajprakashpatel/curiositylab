// Script to update GitHub token in Firestore
// Run with: node update-github-token.js YOUR_GITHUB_TOKEN

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKRXtc_NOF9_efSSTeZAQPlKE_V6NT-X0",
  authDomain: "curiositylaberp.firebaseapp.com",
  projectId: "curiositylaberp",
  storageBucket: "curiositylaberp.firebasestorage.app",
  messagingSenderId: "290676223069",
  appId: "1:290676223069:web:949c45d33b3f401c21b1b4",
  measurementId: "G-2JT79710TF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Document ID where the token is stored
const TOKEN_DOC_ID = 'hFdQ0IPRkOhOpxiKLmpUp7AEYqk1'; // Replace with your full document ID

async function updateGithubToken() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token) {
      console.error('Please provide a GitHub token as a command line argument');
      console.error('Usage: node update-github-token.js YOUR_GITHUB_TOKEN');
      console.error('\nIMPORTANT: Use a personal access token (classic) with the "repo" scope');
      console.error('Create one at: https://github.com/settings/tokens');
      console.error('The token should begin with "ghp_" for GitHub personal access tokens');
      process.exit(1);
    }
    
    // Validate token format
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
      console.warn('\nWARNING: Your token does not start with "ghp_" or "github_pat_"');
      console.warn('GitHub personal access tokens typically start with these prefixes');
      console.warn('Make sure you are using a valid GitHub personal access token');
      
      // Ask for confirmation
      console.log('\nDo you want to continue? (y/n)');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('> ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log('Operation cancelled');
        process.exit(0);
      }
    }
    
    // Get the current document to preserve other fields
    const docRef = doc(db, 'users', TOKEN_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    let data = {};
    if (docSnap.exists()) {
      data = docSnap.data();
    }
    
    // Update the token field
    await setDoc(docRef, {
      ...data,
      token: token
    });
    
    console.log('GitHub token updated successfully!');
    console.log('This token will be used for all GitHub API requests.');
    console.log('\nIMPORTANT: GitHub API format used: "token ' + token.substring(0, 4) + '..."');
    console.log('Make sure your token has the "repo" scope for private repositories');
    process.exit(0);
  } catch (error) {
    console.error('Error updating GitHub token:', error);
    process.exit(1);
  }
}

updateGithubToken(); 