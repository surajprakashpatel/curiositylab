import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const GithubContext = createContext();

export function useGithub() {
  return useContext(GithubContext);
}

export function GithubProvider({ children }) {
  const { currentUser } = useAuth();
  const [githubToken, setGithubToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Document ID of the user document containing the GitHub token
  const TOKEN_DOC_ID = 'hFdQ0IPRkOhOpxiKLmpUp7AEYqk1'; // Replace with the correct ID prefix
  
  // Load GitHub token from Firestore - from a specific document
  useEffect(() => {
    const loadGithubToken = async () => {
      try {
        setIsLoading(true);
        
        // Load token from the specific document in users collection
        const tokenDocRef = doc(db, 'users', TOKEN_DOC_ID);
        const tokenDoc = await getDoc(tokenDocRef);
        
        if (tokenDoc.exists() && tokenDoc.data().token) {
          console.log('GitHub token loaded from admin document');
          setGithubToken(tokenDoc.data().token);
        } else {
          console.warn('GitHub token not found in admin document');
          setGithubToken(null);
        }
      } catch (error) {
        console.error('Error loading GitHub token:', error);
        setGithubToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadGithubToken();
  }, []);

  // Make authenticated GitHub API request
  const fetchGithubApi = async (endpoint, options = {}) => {
    const baseUrl = 'https://api.github.com';
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers
    };
    
    // Add authorization if we have a token
    if (githubToken) {
      // GitHub API requires "token" prefix for personal access tokens
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    try {
      console.log(`Making GitHub API request to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      // For debugging - print the response status
      console.log(`GitHub API response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        // For 404 errors, provide more context
        if (response.status === 404) {
          console.error(`Repository not found. Check if the repository exists and is accessible to the token.`);
          throw new Error(`GitHub API error: Repository not found (404). Verify the repository exists and your token has access.`);
        }
        
        // For authentication errors
        if (response.status === 401 || response.status === 403) {
          console.error(`Authentication failed. Check if your token is valid and has the required permissions.`);
          throw new Error(`GitHub API authentication error (${response.status}). Verify your token is valid and has the required permissions.`);
        }
        
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('GitHub API request failed:', error);
      throw error;
    }
  };

  const value = {
    githubToken,
    isLoading,
    fetchGithubApi
  };

  return (
    <GithubContext.Provider value={value}>
      {children}
    </GithubContext.Provider>
  );
} 