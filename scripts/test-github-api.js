// Script to test GitHub API with the stored token
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const fetch = require('node-fetch');

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
const TOKEN_DOC_ID = 'hFdQ0IPRkOhOpxiKLmpUp7AEYqk1';

// Repository to test - get from command line or use default
const owner = process.argv[2] || 'speedhacker47';
const repo = process.argv[3] || 'CuriosityLab';

async function testGithubApi() {
  try {
    console.log(`Testing GitHub API for repository: ${owner}/${repo}`);
    
    // Get the token from Firestore
    const tokenDocRef = doc(db, 'users', TOKEN_DOC_ID);
    const tokenDoc = await getDoc(tokenDocRef);
    
    if (!tokenDoc.exists() || !tokenDoc.data().token) {
      console.error('GitHub token not found in Firestore');
      process.exit(1);
    }
    
    const token = tokenDoc.data().token;
    console.log(`Token loaded: ${token.substring(0, 4)}...`);
    
    // Test GitHub API with token
    console.log('\nTesting GitHub API endpoints:');
    
    // Test 1: Repository exists
    await testEndpoint(`https://api.github.com/repos/${owner}/${repo}`, token, 'Repository info');
    
    // Test 2: Commits
    await testEndpoint(`https://api.github.com/repos/${owner}/${repo}/commits`, token, 'Repository commits');
    
    // Test 3: User info
    await testEndpoint(`https://api.github.com/user`, token, 'User info');
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Error testing GitHub API:', error);
  }
}

async function testEndpoint(url, token, description) {
  console.log(`\nTesting: ${description}`);
  console.log(`URL: ${url}`);
  
  try {
    // Try with token prefix first (the format used in our application)
    const responseTokenAuth = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
      }
    });
    
    console.log(`Response with 'token' prefix: ${responseTokenAuth.status} ${responseTokenAuth.statusText}`);
    
    if (responseTokenAuth.ok) {
      const data = await responseTokenAuth.json();
      console.log('Request successful with token prefix!');
      console.log('Data sample:', JSON.stringify(data).substring(0, 100) + '...');
      return; // Success with the format we use in our app
    } else {
      console.log('Token prefix authentication failed');
      
      // Try with Bearer token auth
      const responseBearerAuth = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`Response with Bearer token: ${responseBearerAuth.status} ${responseBearerAuth.statusText}`);
      
      if (responseBearerAuth.ok) {
        const data = await responseBearerAuth.json();
        console.log('Request successful with Bearer token!');
        console.log('Data sample:', JSON.stringify(data).substring(0, 100) + '...');
        console.log('NOTE: Our application uses "token" prefix but Bearer works too');
      } else {
        console.log('Both authentication methods failed');
        
        // Try without authentication
        const responseNoAuth = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        console.log(`Response without auth: ${responseNoAuth.status} ${responseNoAuth.statusText}`);
        
        if (responseNoAuth.ok) {
          const data = await responseNoAuth.json();
          console.log('Request successful without authentication!');
          console.log('Data sample:', JSON.stringify(data).substring(0, 100) + '...');
          console.log('NOTE: This is a public resource - authentication not required');
        } else {
          console.log('All request methods failed');
        }
      }
    }
  } catch (error) {
    console.error(`Error testing ${description}:`, error);
  }
}

testGithubApi(); 