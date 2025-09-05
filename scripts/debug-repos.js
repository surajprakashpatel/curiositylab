// Script to debug repositories and check for githubRepo fields
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

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

async function debugRepositories() {
  try {
    // First check the token
    const tokenDocRef = doc(db, 'users', TOKEN_DOC_ID);
    const tokenDoc = await getDoc(tokenDocRef);
    
    if (tokenDoc.exists()) {
      console.log('Token document exists');
      const data = tokenDoc.data();
      console.log('Token field exists:', !!data.token);
      if (data.token) {
        console.log('Token type:', typeof data.token);
        console.log('Token starts with:', data.token.substring(0, 4) + '...');
      }
    } else {
      console.log('Token document does not exist!');
    }
    
    // Get all projects
    console.log('\nChecking projects...');
    const projectsRef = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsRef);
    
    if (projectsSnapshot.empty) {
      console.log('No projects found in the database');
      return;
    }
    
    console.log(`Found ${projectsSnapshot.size} total projects`);
    
    // Check for githubRepo field
    let projectsWithRepo = 0;
    let repoUrls = [];
    
    projectsSnapshot.forEach((projectDoc) => {
      const project = projectDoc.data();
      if (project.githubRepo) {
        projectsWithRepo++;
        repoUrls.push(project.githubRepo);
      }
    });
    
    console.log(`Found ${projectsWithRepo} projects with githubRepo field`);
    
    if (repoUrls.length > 0) {
      console.log('\nRepository URLs:');
      repoUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url}`);
        
        // Try to parse the URL
        try {
          const parsedUrl = new URL(url);
          const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
          
          if (pathParts.length >= 2) {
            console.log(`   - Owner: ${pathParts[0]}`);
            console.log(`   - Repo: ${pathParts[1]}`);
            console.log(`   - API URL: https://api.github.com/repos/${pathParts[0]}/${pathParts[1]}/commits`);
          } else {
            console.log(`   - Invalid path format: ${parsedUrl.pathname}`);
          }
        } catch (error) {
          console.log(`   - Invalid URL format: ${error.message}`);
        }
      });
    }
    
    console.log('\nDebug complete!');
  } catch (error) {
    console.error('Error debugging repositories:', error);
  }
}

debugRepositories(); 