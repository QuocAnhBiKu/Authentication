// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBhRZAqF5rDbB4e_b-BWy6b9G-tyPLwEHQ",
  authDomain: "oauth-47997.firebaseapp.com",
  projectId: "oauth-47997",
  storageBucket: "oauth-47997.appspot.com",
  messagingSenderId: "370544026992",
  appId: "1:370544026992:web:253a0f3a9405cdf43a5bb5",
  measurementId: "G-88LB7B1LS1"
};

firebase.initializeApp(firebaseConfig);

let isSignInInProgress = false;

document.getElementById('googleSignIn').addEventListener('click', () => {
  if (isSignInInProgress) return;
  isSignInInProgress = true;

  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(async (result) => {
      const user = result.user;
      const idToken = await user.getIdToken();
      document.getElementById('logoutButton').style.display = 'inline-block'; // Show logout button
      document.getElementById('userInfo').innerHTML = `
        Logged in as: ${user.displayName}<br>
        Email: ${user.email}<br>
        UID: ${user.uid}<br>
      `;
      console.log('ID Token:', idToken);
      localStorage.setItem('authToken', idToken);
      checkUserRole(user.uid, idToken);
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById('userInfo').innerHTML = `Error: ${error.message}`;
    })
    .finally(() => {
      isSignInInProgress = false;
    });
});

function checkUserRole(uid, idToken) {
  fetch(`http://localhost:3000/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify({ idToken })
  })
    .then(response => response.json())
    .then(data => {
      console.log('User data:', data);
      const role = data.user.role;
      document.getElementById('userInfo').innerHTML += `<br>Role: ${role}`;

      // Show or hide buttons based on the role
      if (role === 'admin') {
        document.getElementById('addButton').style.display = 'inline-block';
        document.getElementById('deleteButton').style.display = 'inline-block';
      } else {
        document.getElementById('addButton').style.display = 'none';
        document.getElementById('deleteButton').style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error checking role:', error);
    });
}

function verifyToken(token) {
  fetch('http://localhost:3000/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.verified) {
        showLoggedInInterface(data.user);
        document.getElementById('logoutButton').style.display = 'inline-block'; // Show logout button
      } else {
        localStorage.removeItem('authToken');
        showLoginInterface();
      }
    })
    .catch(error => {
      console.error('Error verifying token:', error);
      showLoginInterface();
    });
}

function showLoggedInInterface(user) {
  document.getElementById('userInfo').innerHTML = `
    Logged in as: ${user.displayName}<br>
    Email: ${user.email}<br>
    UID: ${user.uid}
  `;
  checkUserRole(user.uid, localStorage.getItem('authToken'));
  document.getElementById('logoutButton').style.display = 'inline-block'; // Show logout button
}

function showLoginInterface() {
  document.getElementById('userInfo').innerHTML = '';
  document.getElementById('addButton').style.display = 'none';
  document.getElementById('deleteButton').style.display = 'none';
  document.getElementById('logoutButton').style.display = 'none';
}

function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    localStorage.removeItem('authToken'); // Clear stored token
    showLoginInterface(); // Update UI to logged-out state

    // Call API to logout on the server
    fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Optionally pass any additional data in the body if required by your backend
      body: JSON.stringify({ /* any additional data */ }),
    })
    .then(response => {
      if (response.ok) {
        console.log('Logged out successfully on server');
      } else {
        console.error('Failed to logout on server');
      }
    })
    .catch(error => {
      console.error('Error logging out on server:', error);
    });
  }).catch((error) => {
    console.error('Sign out error:', error);
  });
}

// Add event listener for logout button
document.getElementById('logoutButton').addEventListener('click', () => {
  logout();
});

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    verifyToken(token);
  } else {
    showLoginInterface();
  }
});
