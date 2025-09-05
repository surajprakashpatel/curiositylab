// Script to set up sample repositories collection in Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

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

// Sample repositories to add
const sampleRepositories = [
  {
    githubRepo: 'https://github.com/facebook/react',
    projectName: 'React',
    clientId: '', // Replace with actual client ID when running the script
    description: 'A JavaScript library for building user interfaces'
  },
  {
    githubRepo: 'https://github.com/firebase/firebase-js-sdk',
    projectName: 'Firebase JS SDK',
    clientId: '', // Replace with actual client ID when running the script
    description: 'Firebase JavaScript SDK'
  }
];

// Function to add repositories to Firestore
async function addRepositories() {
  try {
    // First check if the client ID is set
    if (!sampleRepositories[0].clientId) {
      console.error('Please set the clientId in the script before running it');
      return;
    }

    // Check if repositories already exist for this client
    const reposQuery = query(
      collection(db, 'repositories'),
      where('clientId', '==', sampleRepositories[0].clientId)
    );
    const existingRepos = await getDocs(reposQuery);

    if (!existingRepos.empty) {
      console.log(`Repositories already exist for client ${sampleRepositories[0].clientId}`);
      return;
    }

    // Add repositories
    for (const repo of sampleRepositories) {
      await addDoc(collection(db, 'repositories'), {
        ...repo,
        createdAt: new Date().toISOString()
      });
      console.log(`Added repository: ${repo.projectName}`);
    }

    console.log('All repositories added successfully');
  } catch (error) {
    console.error('Error adding repositories:', error);
  }
}

// Run the function
addRepositories(); 