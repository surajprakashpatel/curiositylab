import React from 'react';
import './PrivacyPolicy.css'; // We will create this CSS file next

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy for Kartavya</h1>
      <p><strong>Last Updated:</strong> September 9, 2025</p>

      <div className="policy-section">
        <p>
          Curiosity Lab ("us", "we", or "our") operates the Kartavya mobile application (the "Service").
          This page informs you of our policies regarding the collection, use, and disclosure of personal
          data when you use our Service and the choices you have associated with that data.
        </p>
      </div>

      <div className="policy-section">
        <h2>Information Collection and Use</h2>
        <p>
          We collect several different types of information for various purposes to provide and improve our
          Service to you and your institution.
        </p>

        <h3>Types of Data Collected:</h3>
        <ul>
          <li>
            <strong>Personal Identifiable Information (PII):</strong> While registering for an account, we ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This includes, but is not limited to:
            <ul>
              <li>Email address</li>
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Employee Role & Department</li>
              <li>Institution ID</li>
            </ul>
          </li>
          <li>
            <strong>Biometric Data (Face Data):</strong> For the core attendance functionality, our Service requires the collection of your facial biometric data. We DO NOT store your photos. Instead, we capture 5 images during registration to create a secure, mathematical representation of your face (an "embedding"). This embedding is stored securely and is used solely for the purpose of verifying your identity during check-in and check-out.
          </li>
          <li>
            <strong>Location Data:</strong> We collect your precise GPS location data (latitude and longitude) ONLY at the moment you perform a check-in or check-out action. This data is used exclusively to verify that you are within the designated work premises. Location tracking is not active at any other time.
          </li>
          <li>
            <strong>Camera and Photo Data:</strong> We require access to your device's camera to perform face recognition. Photos taken for check-in and check-out are uploaded to our secure servers as part of your attendance record for verification by your administrator.
          </li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>How We Use Your Data</h2>
        <p>Kartavya uses the collected data for the following purposes:</p>
        <ul>
          <li>To provide and maintain the core attendance service.</li>
          <li>To verify your identity for secure check-in and check-out.</li>
          <li>To prevent fraudulent attendance through location and biometric verification.</li>
          <li>To allow your institution's administrator to manage and verify attendance records.</li>
          <li>To create a secure user account and communicate with you.</li>
        </ul>
      </div>
      
      <div className="policy-section">
        <h2>Data Storage and Security</h2>
        <p>
          The security of your data is our highest priority. All data, including your personal information and face embeddings, is transmitted securely and stored on encrypted servers provided by Google Firebase. We implement industry-standard security measures to protect against unauthorized access, alteration, or disclosure of your data. However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
        </p>
      </div>

      <div className="policy-section">
        <h2>Third-Party Service Providers</h2>
        <p>
          We use Google Firebase as our backend service provider for authentication, database, and storage. They have their own strict privacy policies. You can view their policy here: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
        </p>
        <p>
          We do not share your Personal Identifiable Information with any other third parties except as required by law or your institution.
        </p>
      </div>

      <div className="policy-section">
        <h2>User Rights and Data Deletion</h2>
        <p>
          You have the right to access, update, or request deletion of your personal data. These actions are managed by your institution's administrator. Please contact your administrator for any data-related requests. Upon termination of your account, your personal data will be deleted in accordance with your institution's data retention policy.
        </p>
      </div>

      <div className="policy-section">
        <h2>Children's Privacy</h2>
        <p>
          Our Service is not intended for use by anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from children under 13.
        </p>
      </div>

      <div className="policy-section">
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </div>

      <div className="policy-section">
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul>
          <li>By email: contact@curiositylab.in</li>
          <li>By visiting this page on our website: curiositylab.in</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;