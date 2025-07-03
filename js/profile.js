// Profile Page Logic
import { getCurrentUser, updateUserData, logout } from './auth.js';
import { getLogs } from './storage.js';

// Variables para elementos del DOM
let editProfileButton, profileView, profileEdit;
let editFirstName, editLastName, editEmail, editPhone;
let editCountry, editCity, editAddress, editPostalCode;
let saveProfileButton, cancelEditButton;
let userNameDisplay, adminBadge, logoutButton, adminPanelLink;
let activityLogs;
let currentUser;

// Función declarada para inicializar elementos del DOM
function initializeElements() {
    editProfileButton = document.getElementById('editProfileButton');
    profileView = document.getElementById('profileView');
    profileEdit = document.getElementById('profileEdit');
    editFirstName = document.getElementById('editFirstName');
    editLastName = document.getElementById('editLastName');
    editEmail = document.getElementById('editEmail');
    editPhone = document.getElementById('editPhone');
    editCountry = document.getElementById('editCountry');
    editCity = document.getElementById('editCity');
    editAddress = document.getElementById('editAddress');
    editPostalCode = document.getElementById('editPostalCode');
    saveProfileButton = document.getElementById('saveProfileButton');
    cancelEditButton = document.getElementById('cancelEditButton');
    userNameDisplay = document.getElementById('userNameDisplay');
    adminBadge = document.getElementById('adminBadge');
    logoutButton = document.getElementById('logoutButton');
    adminPanelLink = document.getElementById('adminPanelLink');
    activityLogs = document.getElementById('activityLogs');
}

// Función declarada para mostrar información del usuario
function displayUserInfo() {
    currentUser = getCurrentUser();
    if (currentUser) {
        userNameDisplay.innerHTML = currentUser.firstName;
        if (currentUser.role === 'admin') {
            adminBadge.classList.remove('hidden');
            adminPanelLink.classList.remove('hidden');
        }
    }
}

// Función declarada para mostrar información del perfil
function displayProfile() {
    profileView.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <div>
                    <p class="text-sm text-gray-500">Nombre</p>
                    <p class="font-medium">${currentUser.firstName} ${currentUser.lastName}</p>
                </div>
            </div>
            
            <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="font-medium">${currentUser.email}</p>
                </div>
            </div>
            
            <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <div>
                    <p class="text-sm text-gray-500">Teléfono</p>
                    <p class="font-medium">${currentUser.phone || 'No especificado'}</p>
                </div>
            </div>
            
            <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div>
                    <p class="text-sm text-gray-500">Ubicación</p>
                    <p class="font-medium">
                        ${currentUser.city && currentUser.country 
                            ? `${currentUser.city}, ${currentUser.country}`
                            : 'No especificado'
                        }
                    </p>
                </div>
            </div>
            
            ${currentUser.address ? `
                <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-gray-500">Dirección</p>
                        <p class="font-medium">${currentUser.address}</p>
                        ${currentUser.postalCode ? `
                            <p class="text-sm text-gray-500">${currentUser.postalCode}</p>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
            
            <div class="pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-500">Tipo de Cuenta</p>
                <p class="font-medium capitalize">${currentUser.role}</p>
            </div>
        </div>
    `;
}

// Función declarada para mostrar formulario de edición
function showEditForm() {
    // Llenar formulario con datos actuales
    editFirstName.value = currentUser.firstName;
    editLastName.value = currentUser.lastName;
    editEmail.value = currentUser.email;
    editPhone.value = currentUser.phone || '';
    editCountry.value = currentUser.country || '';
    editCity.value = currentUser.city || '';
    editAddress.value = currentUser.address || '';
    editPostalCode.value = currentUser.postalCode || '';

    profileView.classList.add('hidden');
    profileEdit.classList.remove('hidden');
    editProfileButton.classList.add('hidden');
}

// Función declarada para ocultar formulario de edición
function hideEditForm() {
    profileView.classList.remove('hidden');
    profileEdit.classList.add('hidden');
    editProfileButton.classList.remove('hidden');
}

// Función declarada para manejar guardado del perfil
function handleSaveProfile(event) {
    event.preventDefault();
    
    const updatedData = {
        firstName: editFirstName.value.trim(),
        lastName: editLastName.value.trim(),
        email: editEmail.value.trim(),
        phone: editPhone.value.trim(),
        country: editCountry.value.trim(),
        city: editCity.value.trim(),
        address: editAddress.value.trim(),
        postalCode: editPostalCode.value.trim()
    };

    if (updateUserData(updatedData)) {
        currentUser = getCurrentUser();
        hideEditForm();
        displayProfile();
        displayUserInfo();
        loadActivityLogs();
    }
}

// Función declarada para cargar logs de actividad
function loadActivityLogs() {
    const allLogs = getLogs();
    const userLogs = allLogs.filter(log => log.userId === currentUser.id);
    const recentLogs = userLogs.slice(-10).reverse();

    if (recentLogs.length === 0) {
        activityLogs.innerHTML = '<p class="text-gray-500">No hay actividad reciente</p>';
    } else {
        activityLogs.innerHTML = `
            <div class="space-y-3">
                ${recentLogs.map(log => `
                    <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-medium text-gray-900">${log.action}</p>
                                <p class="text-sm text-gray-600">${log.details}</p>
                            </div>
                            <p class="text-xs text-gray-500">
                                ${new Date(log.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Función declarada para manejar logout
function handleLogout() {
    logout();
    window.location.href = 'index.html';
}

// Función para inicializar la página
function initializePage() {
    document.addEventListener('DOMContentLoaded', function() {
        initializeElements();
        displayUserInfo();
        displayProfile();
        loadActivityLogs();

        // Event listeners usando addEventListener
        editProfileButton.addEventListener('click', showEditForm);
        cancelEditButton.addEventListener('click', hideEditForm);
        profileEdit.addEventListener('submit', handleSaveProfile);
        logoutButton.addEventListener('click', handleLogout);
    });
}

// Inicializar la página
initializePage();