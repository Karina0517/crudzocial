// Users Page Logic (Admin Panel)
import { getCurrentUser, addLog, logout } from './auth.js';
import { getUsers, getLogs, getImages, getNotes, deleteImage as storageDeleteImage, deleteNote as storageDeleteNote } from './storage.js';

// Variables para elementos del DOM
let usersTab, logsTab, allImagesTab, allNotesTab;
let usersContent, logsContent, allImagesContent, allNotesContent;
let usersCount, logsCount, imagesCount, notesCount;
let userNameDisplay, adminBadge, logoutButton;
let currentUser, activeTab = 'users';

// Función declarada para inicializar elementos del DOM
function initializeElements() {
    usersTab = document.getElementById('usersTab');
    logsTab = document.getElementById('logsTab');
    allImagesTab = document.getElementById('allImagesTab');
    allNotesTab = document.getElementById('allNotesTab');
    usersContent = document.getElementById('usersContent');
    logsContent = document.getElementById('logsContent');
    allImagesContent = document.getElementById('allImagesContent');
    allNotesContent = document.getElementById('allNotesContent');
    usersCount = document.getElementById('usersCount');
    logsCount = document.getElementById('logsCount');
    imagesCount = document.getElementById('imagesCount');
    notesCount = document.getElementById('notesCount');
    userNameDisplay = document.getElementById('userNameDisplay');
    adminBadge = document.getElementById('adminBadge');
    logoutButton = document.getElementById('logoutButton');
}

// Función declarada para verificar acceso de administrador
function checkAdminAccess() {
    currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'images.html';
        return false;
    }
    return true;
}

// Función declarada para mostrar información del usuario
function displayUserInfo() {
    userNameDisplay.innerHTML = currentUser.firstName;
    adminBadge.classList.remove('hidden');
}

// Función declarada para cambiar pestañas
function switchTab(tabName) {
    // Ocultar todos los contenidos
    const contents = [usersContent, logsContent, allImagesContent, allNotesContent];
    contents.forEach(content => content.classList.add('hidden'));

    // Resetear estilos de las pestañas
    const tabs = [usersTab, logsTab, allImagesTab, allNotesTab];
    tabs.forEach(tab => {
        tab.classList.remove('border-purple-500', 'text-purple-600');
        tab.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    });

    // Activar pestaña seleccionada
    activeTab = tabName;
    let activeTabElement, activeContentElement;

    switch (tabName) {
        case 'users':
            activeTabElement = usersTab;
            activeContentElement = usersContent;
            loadUsers();
            break;
        case 'logs':
            activeTabElement = logsTab;
            activeContentElement = logsContent;
            loadLogs();
            break;
        case 'images':
            activeTabElement = allImagesTab;
            activeContentElement = allImagesContent;
            loadAllImages();
            break;
        case 'notes':
            activeTabElement = allNotesTab;
            activeContentElement = allNotesContent;
            loadAllNotes();
            break;
    }

    activeTabElement.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    activeTabElement.classList.add('border-purple-500', 'text-purple-600');
    activeContentElement.classList.remove('hidden');
}

// Función declarada para actualizar contadores
function updateCounts() {
    const users = getUsers();
    const logs = getLogs();
    const images = getImages();
    const notes = getNotes();

    usersCount.innerHTML = users.length;
    logsCount.innerHTML = logs.length;
    imagesCount.innerHTML = images.length;
    notesCount.innerHTML = notes.length;
}

// Función declarada para cargar usuarios
function loadUsers() {
    const users = getUsers();
    
    usersContent.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Todos los Usuarios</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${users.map(user => `
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-semibold text-gray-900">
                            ${user.firstName} ${user.lastName}
                        </h3>
                        ${user.role === 'admin' ? `
                            <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                Admin
                            </span>
                        ` : ''}
                    </div>
                    <p class="text-sm text-gray-600 mb-2">${user.email}</p>
                    ${user.phone ? `<p class="text-sm text-gray-600 mb-2">${user.phone}</p>` : ''}
                    ${user.city && user.country ? `<p class="text-sm text-gray-600">${user.city}, ${user.country}</p>` : ''}
                    <p class="text-xs text-gray-500 mt-2">
                        Registrado: ${new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
            `).join('')}
        </div>
    `;
}

// Función declarada para cargar logs
function loadLogs() {
    const logs = getLogs().reverse();
    const users = getUsers();
    
    logsContent.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Logs de Actividad</h2>
        <div class="space-y-3">
            ${logs.length === 0 ? `
                <p class="text-gray-500">No hay logs de actividad</p>
            ` : logs.map(log => {
                const user = users.find(u => u.id === log.userId);
                return `
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-medium text-gray-900">${log.action}</p>
                                <p class="text-sm text-gray-600">${log.details}</p>
                                <p class="text-xs text-blue-600 mt-1">
                                    Usuario: ${user ? `${user.firstName} ${user.lastName}` : 'Usuario Desconocido'}
                                </p>
                            </div>
                            <p class="text-xs text-gray-500">
                                ${new Date(log.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Función declarada para cargar todas las imágenes
function loadAllImages() {
    const images = getImages();
    const users = getUsers();
    
    allImagesContent.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Todas las Imágenes</h2>
        ${images.length === 0 ? `
            <p class="text-gray-500">No hay imágenes en el sistema</p>
        ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${images.map(image => {
                    const user = users.find(u => u.id === image.userId);
                    return `
                        <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
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
                                <p class="text-xs text-blue-600 mb-2">
                                    Por: ${user ? `${user.firstName} ${user.lastName}` : 'Usuario Desconocido'}
                                </p>
                                <button
                                    onclick="window.adminPageInstance.deleteImage('${image.id}', '${image.description}')"
                                    class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `}
    `;
}

// Función declarada para cargar todas las notas
function loadAllNotes() {
    const notes = getNotes();
    const users = getUsers();
    
    allNotesContent.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Todas las Notas</h2>
        ${notes.length === 0 ? `
            <p class="text-gray-500">No hay notas en el sistema</p>
        ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${notes.map(note => {
                    const user = users.find(u => u.id === note.userId);
                    return `
                        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                            <h3 class="font-semibold text-gray-900 mb-2">${note.title}</h3>
                            <p class="text-gray-700 mb-4 whitespace-pre-wrap">${note.content}</p>
                            <div class="text-sm text-gray-500 mb-4">
                                <p>Creada: ${new Date(note.createdAt).toLocaleDateString()}</p>
                                ${note.updatedAt !== note.createdAt ? `
                                    <p>Actualizada: ${new Date(note.updatedAt).toLocaleDateString()}</p>
                                ` : ''}
                                <p class="text-blue-600">
                                    Por: ${user ? `${user.firstName} ${user.lastName}` : 'Usuario Desconocido'}
                                </p>
                            </div>
                            <button
                                onclick="window.adminPageInstance.deleteNote('${note.id}', '${note.title}')"
                                class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Eliminar
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `}
    `;
}

// Función declarada para eliminar imagen (como admin)
export function deleteImage(imageId, description) {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
        storageDeleteImage(imageId);
        addLog('Acción de Admin', `Eliminó imagen: ${description}`);
        updateCounts();
        if (activeTab === 'images') {
            loadAllImages();
        }
    }
}

// Función declarada para eliminar nota (como admin)
export function deleteNote(noteId, title) {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
        storageDeleteNote(noteId);
        addLog('Acción de Admin', `Eliminó nota: ${title}`);
        updateCounts();
        if (activeTab === 'notes') {
            loadAllNotes();
        }
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
        if (!checkAdminAccess()) return;
        
        initializeElements();
        displayUserInfo();
        updateCounts();
        switchTab('users');

        // Event listeners usando addEventListener
        usersTab.addEventListener('click', function() { switchTab('users'); });
        logsTab.addEventListener('click', function() { switchTab('logs'); });
        allImagesTab.addEventListener('click', function() { switchTab('images'); });
        allNotesTab.addEventListener('click', function() { switchTab('notes'); });
        logoutButton.addEventListener('click', handleLogout);
    });
}

// Exponer funciones necesarias para uso global
window.adminPageInstance = {
    deleteImage: deleteImage,
    deleteNote: deleteNote
};

// Inicializar la página
initializePage();