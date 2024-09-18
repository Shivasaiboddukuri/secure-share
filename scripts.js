document.addEventListener('DOMContentLoaded', () => {
  // Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyApZ3aIBQa8XF-ODRlCRCQWjxelMLYfxRo",
    authDomain: "share-83858.firebaseapp.com",
    projectId: "share-83858",
    storageBucket: "share-83858.appspot.com",
    messagingSenderId: "1056985018204",
    appId: "1:1056985018204:web:18ede9e7400daed6311b99"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Ensure Firestore is properly imported
  if (firebase.firestore) {
    console.log('Firestore is available');
  } else {
    console.error('Firestore is not available');
  }

  // Authentication state observer
  firebase.auth().onAuthStateChanged(user => {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const uploadDocLink = document.getElementById('uploadDocLink');
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');

    if (user) {
      // User is signed in
      if (loginLink && registerLink) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
      }
      if (uploadDocLink && profileLink && logoutLink) {
        uploadDocLink.style.display = 'inline';
        profileLink.style.display = 'inline';
        logoutLink.style.display = 'inline';
      }
    } else {
      // No user is signed in
      if (loginLink && registerLink) {
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
      }
      if (uploadDocLink && profileLink && logoutLink) {
        uploadDocLink.style.display = 'none';
        profileLink.style.display = 'none';
        logoutLink.style.display = 'none';
      }
    }
  });

  // Login function
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User logged in');
          window.location.href = 'index.html';  // Redirect to home page on successful login
        })
        .catch(error => {
          console.error('Login error:', error.message);
        });
    });
  }

  // Register function
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const aadhaar = document.getElementById('registerAadhaar').value;
      const password = document.getElementById('registerPassword').value;

      if (!validateAadhaar(aadhaar)) {
        alert('Please enter a valid 12-digit Aadhaar number.');
        return;
      }

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          // Save additional user info to Firestore
          if (firebase.firestore) {
            firebase.firestore().collection('users').doc(user.uid).set({
              name: name,
              aadhaar: aadhaar,
              email: email
            }).then(() => {
              console.log('User registered and data saved to Firestore');
              // Show success message
              alert('Registration successful! Redirecting to login page...');
              // Redirect to login page after a short delay
              setTimeout(() => {
                window.location.href = 'login.html';
              }, 2000); // 2-second delay
            }).catch(error => {
              console.error('Error saving user data:', error.message);
            });
          } else {
            console.error('Firestore is not available');
          }
        })
        .catch(error => {
          console.error('Registration error:', error.message);
        });
    });
  }

  // Validate Aadhaar number (simple length check)
  function validateAadhaar(aadhaar) {
    return aadhaar.length === 12 && /^\d+$/.test(aadhaar);  // Aadhaar should be 12 digits long and contain only numbers
  }

  // Logout function
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      firebase.auth().signOut()
        .then(() => {
          console.log('User logged out');
          window.location.href = 'index.html';  // Redirect to home page on successful logout
        })
        .catch(error => {
          console.error('Logout error:', error.message);
        });
    });
  }

  // Redirect to documents.html when clicking "Upload Document"
  const uploadDocLink = document.getElementById('uploadDocLink');
  if (uploadDocLink) {
    uploadDocLink.addEventListener('click', () => {
      window.location.href = 'documents.html';  // Redirect to document upload page
    });
  }

  // Redirect to profile.html when clicking "Profile"
  const profileLink = document.getElementById('profileLink');
  if (profileLink) {
    profileLink.addEventListener('click', () => {
      window.location.href = 'profile.html';  // Redirect to profile page
    });
  }
});
