const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const dashboardView = document.getElementById('dashboard-view');

const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

const dashboardUsername = document.getElementById('dashboard-username');
const dashboardUsertype = document.getElementById('dashboard-usertype');

const userPanels = {
  profesor: document.getElementById('profesor-panel'),
  alumno: document.getElementById('alumno-panel'),
  oficinista: document.getElementById('oficinista-panel'),
  administrativo: document.getElementById('administrativo-panel'),
  otro: document.getElementById('otro-panel')
};

showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginView.classList.add('hidden');
  registerView.classList.remove('hidden');
  clearMessages();
});

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerView.classList.add('hidden');
  loginView.classList.remove('hidden');
  clearMessages();
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const result = await window.api.loginUser({ username, password });

  if (result.success) {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    dashboardUsername.textContent = username;
    dashboardUsertype.textContent = capitalizeFirst(result.userType);
    
    showUserPanel(result.userType);
    clearMessages();
  } else {
    showMessage(loginMessage, result.message, 'error');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const userType = document.getElementById('user-type').value;

  const result = await window.api.registerUser({ username, password, userType });

  if (result.success) {
    showMessage(registerMessage, result.message, 'success');
    setTimeout(() => {
      registerView.classList.add('hidden');
      loginView.classList.remove('hidden');
      clearMessages();
    }, 1500);
  } else {
    showMessage(registerMessage, result.message, 'error');
  }
});

logoutBtn.addEventListener('click', () => {
  dashboardView.classList.add('hidden');
  loginView.classList.remove('hidden');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  hideAllPanels();
});

function showUserPanel(userType) {
  hideAllPanels();
  if (userPanels[userType]) {
    userPanels[userType].classList.remove('hidden');
  } else {
    userPanels['otro'].classList.remove('hidden');
  }
}

function hideAllPanels() {
  Object.values(userPanels).forEach(panel => {
    panel.classList.add('hidden');
  });
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = 'message ' + type;
}

function clearMessages() {
  loginMessage.textContent = '';
  loginMessage.className = 'message';
  registerMessage.textContent = '';
  registerMessage.className = 'message';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
