// Login Page Logic
import { login, initializeSession, addLog } from './auth.js';
import { getUsers, addUser } from './storage.js';

// Variables para elementos del DOM
let loginForm, registerForm;
let emailInput, registerEmailInput;
let errorMessage, errorText, registerError, registerErrorText;
let loginButton, registerButton;
let adminDemoButton;
let showRegisterButton, showLoginButton;
let loginSection, registerSection;
let firstNameInput, lastNameInput, phoneInput, countryInput, cityInput;

// Función declarada para inicializar elementos del DOM
function initializeElements() {
    loginForm = document.getElementById('loginForm');
    registerForm = document.getElementById('registerForm');
    emailInput = document.getElementById('email');
    registerEmailInput = document.getElementById('registerEmail');
    errorMessage = document.getElementById('errorMessage');
    errorText = document.getElementById('errorText');
    registerError = document.getElementById('registerError');
    registerErrorText = document.getElementById('registerErrorText');
    loginButton = document.getElementById('loginButton');
    registerButton = document.getElementById('registerButton');
    adminDemoButton = document.getElementById('adminDemo');
    showRegisterButton = document.getElementById('showRegisterButton');
    showLoginButton = document.getElementById('showLoginButton');
    loginSection = document.getElementById('loginSection');
    registerSection = document.getElementById('registerSection');
    firstNameInput = document.getElementById('firstName');
    lastNameInput = document.getElementById('lastName');
    phoneInput = document.getElementById('phone');
    countryInput = document.getElementById('country');
    cityInput = document.getElementById('city');
}

// Función declarada para mostrar error de login
function showLoginError(message) {
    errorText.innerHTML = message;
    errorMessage.classList.remove('hidden');
}

// Función declarada para ocultar error de login
function hideLoginError() {
    errorMessage.classList.add('hidden');
}

// Función declarada para mostrar error de registro
function showRegisterError(message) {
    registerErrorText.innerHTML = message;
    registerError.classList.remove('hidden');
}

// Función declarada para ocultar error de registro
function hideRegisterError() {
    registerError.classList.add('hidden');
}

// Función declarada para mostrar estado de carga en login
function setLoginLoadingState(isLoading) {
    if (isLoading) {
        loginButton.innerHTML = `
            <div class="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
        `;
        loginButton.disabled = true;
    } else {
        loginButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            <span>Iniciar Sesión</span>
        `;
        loginButton.disabled = false;
    }
}

// Función declarada para mostrar estado de carga en registro
function setRegisterLoadingState(isLoading) {
    if (isLoading) {
        registerButton.innerHTML = `
            <div class="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
        `;
        registerButton.disabled = true;
    } else {
        registerButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            <span>Registrarse</span>
        `;
        registerButton.disabled = false;
    }
}

// Función declarada para mostrar sección de registro
function showRegisterSection() {
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
    hideLoginError();
    hideRegisterError();
}

// Función declarada para mostrar sección de login
function showLoginSection() {
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    hideLoginError();
    hideRegisterError();
}

// Función declarada para manejar el envío del formulario de login
function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showLoginError('Por favor ingresa tu correo electrónico');
        return;
    }

    setLoginLoadingState(true);
    hideLoginError();

    // Simular delay de red
    setTimeout(function() {
        const result = login(email);
        
        if (result.success) {
            // Redirigir a la página de imágenes
            window.location.href = 'images.html';
        } else {
            showLoginError('Usuario no encontrado. ¿Deseas registrarte?');
            setLoginLoadingState(false);
        }
    }, 1000);
}

// Función declarada para manejar el envío del formulario de registro
function handleRegisterSubmit(event) {
    event.preventDefault();
    
    const email = registerEmailInput.value.trim();
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const country = countryInput.value.trim();
    const city = cityInput.value.trim();
    
    if (!email || !firstName || !lastName) {
        showRegisterError('Por favor completa los campos obligatorios (nombre, apellido y email)');
        return;
    }

    // Verificar si el email ya existe
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
        showRegisterError('Este correo ya está registrado. Intenta iniciar sesión.');
        return;
    }

    setRegisterLoadingState(true);
    hideRegisterError();

    // Simular delay de red
    setTimeout(function() {
        const newUser = {
            id: 'user-' + Date.now(),
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone || '',
            country: country || '',
            city: city || '',
            address: '',
            postalCode: '',
            role: 'user',
            createdAt: new Date().toISOString()
        };

        addUser(newUser);
        
        // Iniciar sesión automáticamente después del registro
        const loginResult = login(email);
        
        if (loginResult.success) {
            addLog('Registro de Usuario', 'Usuario se registró en el sistema');
            window.location.href = 'images.html';
        } else {
            showRegisterError('Error al registrar usuario. Intenta nuevamente.');
            setRegisterLoadingState(false);
        }
    }, 1000);
}

// Función declarada para llenar email de demo
function fillDemoEmail(email) {
    emailInput.value = email;
    hideLoginError();
    showLoginSection();
}

// Función declarada para verificar si ya está logueado
function checkExistingSession() {
    if (initializeSession()) {
        window.location.href = 'images.html';
    }
}

// Función para inicializar la página
function initializePage() {
    document.addEventListener('DOMContentLoaded', function() {
        checkExistingSession();
        initializeElements();

        // Event listeners usando addEventListener
        loginForm.addEventListener('submit', handleLoginSubmit);
        registerForm.addEventListener('submit', handleRegisterSubmit);
        
        showRegisterButton.addEventListener('click', showRegisterSection);
        showLoginButton.addEventListener('click', showLoginSection);
        
        adminDemoButton.addEventListener('click', function() {
            fillDemoEmail('admin@crudzocial.com');
        });

        // Focus en el campo de email
        emailInput.focus();
    });
}

// Inicializar la página
initializePage();