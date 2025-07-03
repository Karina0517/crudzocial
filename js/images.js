// Images Page Logic
import { getCurrentUser, addLog, logout } from './auth.js';
import { getImages, addImage, deleteImage as storageDeleteImage } from './storage.js';

// Variables para elementos del DOM
let addImageButton, addImageForm, imageUrl, imageDescription, imageError, imageErrorText;
let submitImageButton, cancelImageButton, imagesContainer;
let userNameDisplay, adminBadge, logoutButton, adminPanelLink;
let currentUser;

// Función declarada para inicializar elementos del DOM
function initializeElements() {
    addImageButton = document.getElementById('addImageButton');
    addImageForm = document.getElementById('addImageForm');
    imageUrl = document.getElementById('imageUrl');
    imageDescription = document.getElementById('imageDescription');
    imageError = document.getElementById('imageError');
    imageErrorText = document.getElementById('imageErrorText');
    submitImageButton = document.getElementById('submitImageButton');
    cancelImageButton = document.getElementById('cancelImageButton');
    imagesContainer = document.getElementById('imagesContainer');
    userNameDisplay = document.getElementById('userNameDisplay');
    adminBadge = document.getElementById('adminBadge');
    logoutButton = document.getElementById('logoutButton');
    adminPanelLink = document.getElementById('adminPanelLink');
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

// Función declarada para mostrar error
function showError(message) {
    imageErrorText.innerHTML = message;
    imageError.classList.remove('hidden');
}

// Función declarada para ocultar error
function hideError() {
    imageError.classList.add('hidden');
}

// Función declarada para mostrar formulario de agregar imagen
function showAddForm() {
    addImageForm.classList.remove('hidden');
    imageUrl.focus();
}

// Función declarada para ocultar formulario de agregar imagen
function hideAddForm() {
    addImageForm.classList.add('hidden');
    imageUrl.value = '';
    imageDescription.value = '';
    hideError();
}

// Función declarada para validar URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Función declarada para manejar envío de imagen
function handleImageSubmit(event) {
    event.preventDefault();
    
    const url = imageUrl.value.trim();
    const description = imageDescription.value.trim();
    
    if (!url || !description) {
        showError('Por favor completa todos los campos');
        return;
    }

    if (!isValidUrl(url)) {
        showError('Por favor ingresa una URL válida');
        return;
    }

    const newImage = {
        id: Date.now().toString(),
        userId: currentUser.id,
        url: url,
        description: description,
        createdAt: new Date().toISOString()
    };

    addImage(newImage);
    addLog('Imagen Creada', `Agregó nueva imagen: ${description}`);
    
    hideAddForm();
    loadImages();
}

// Función declarada para eliminar imagen
export function deleteImage(imageId, description) {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
        storageDeleteImage(imageId);
        addLog('Imagen Eliminada', `Eliminó imagen: ${description}`);
        loadImages();
    }   
}

// Función declarada para verificar si puede eliminar imagen
function canDeleteImage(image) {
    return currentUser.role === 'admin' || image.userId === currentUser.id;
}

// Función declarada para crear HTML de imagen
function createImageHTML(image) {
    const canDelete = canDeleteImage(image);
    const isOwnedByOther = currentUser.role === 'admin' && image.userId !== currentUser.id;
    
    return `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-200 card-hover">
            <div class="aspect-w-16 aspect-h-9">
                <img
                    src="${image.url}"
                    alt="${image.description}"
                    class="w-full h-48 object-cover"
                    onerror="this.src='https://via.placeholder.com/400x300?text=Imagen+No+Encontrada'"
                />
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-900 mb-2">${image.description}</h3>
                <p class="text-sm text-gray-500 mb-2">
                    Agregada el ${new Date(image.createdAt).toLocaleDateString()}
                </p>
                ${isOwnedByOther ? `
                    <p class="text-xs text-purple-600 mb-2">
                        Propiedad del usuario: ${image.userId}
                    </p>
                ` : ''}
                ${canDelete ? `
                    <button
                        onclick="window.imagesPageInstance.deleteImage('${image.id}', '${image.description}')"
                        class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Eliminar
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// Función declarada para cargar imágenes
function loadImages() {
    const allImages = getImages();
    let userImages;
    
    if (currentUser.role === 'admin') {
        userImages = allImages;
    } else {
        userImages = allImages.filter(img => img.userId === currentUser.id);
    }

    if (userImages.length === 0) {
        imagesContainer.innerHTML = `
            <div class="text-center py-12">
                <svg class="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay imágenes aún</h3>
                <p class="text-gray-500">¡Comienza agregando tu primera imagen!</p>
            </div>
        `;
    } else {
        imagesContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 responsive-grid">
                ${userImages.map(image => createImageHTML(image)).join('')}
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
        loadImages();

        // Event listeners usando addEventListener
        addImageButton.addEventListener('click', showAddForm);
        cancelImageButton.addEventListener('click', hideAddForm);
        addImageForm.addEventListener('submit', handleImageSubmit);
        logoutButton.addEventListener('click', handleLogout);
    });
}

// Exponer funciones necesarias para uso global
window.imagesPageInstance = {
    deleteImage: deleteImage
};

// Inicializar la página
initializePage();