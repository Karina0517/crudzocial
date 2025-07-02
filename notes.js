// Notes Page Logic
import { getCurrentUser, addLog, logout } from './auth.js';
import { getNotes, addNote, updateNote, deleteNote as storageDeleteNote } from './storage.js';

// Variables para elementos del DOM
let addNoteButton, addNoteForm, noteTitle, noteContent;
let submitNoteButton, cancelNoteButton, notesContainer;
let userNameDisplay, adminBadge, logoutButton, adminPanelLink;
let currentUser;

// Función declarada para inicializar elementos del DOM
function initializeElements() {
    addNoteButton = document.getElementById('addNoteButton');
    addNoteForm = document.getElementById('addNoteForm');
    noteTitle = document.getElementById('noteTitle');
    noteContent = document.getElementById('noteContent');
    submitNoteButton = document.getElementById('submitNoteButton');
    cancelNoteButton = document.getElementById('cancelNoteButton');
    notesContainer = document.getElementById('notesContainer');
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

// Función declarada para mostrar formulario de agregar nota
function showAddForm() {
    addNoteForm.classList.remove('hidden');
    noteTitle.focus();
}

// Función declarada para ocultar formulario de agregar nota
function hideAddForm() {
    addNoteForm.classList.add('hidden');
    noteTitle.value = '';
    noteContent.value = '';
}

// Función declarada para manejar envío de nota
function handleNoteSubmit(event) {
    event.preventDefault();
    
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    if (!title || !content) {
        return;
    }

    const newNote = {
        id: Date.now().toString(),
        userId: currentUser.id,
        title: title,
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    addNote(newNote);
    addLog('Nota Creada', `Creó nota: ${title}`);
    
    hideAddForm();
    loadNotes();
}

// Función declarada para editar nota
export function editNote(noteId) {
    const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
    const notes = getNotes();
    const note = notes.find(n => n.id === noteId);
    
    if (!note || !canEditNote(note)) return;

    noteElement.innerHTML = createEditNoteHTML(note);
}

// Función declarada para guardar edición de nota
export function saveNoteEdit(noteId) {
    const titleInput = document.getElementById(`editTitle_${noteId}`);
    const contentInput = document.getElementById(`editContent_${noteId}`);
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) return;

    const notes = getNotes();
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        note.title = title;
        note.content = content;
        note.updatedAt = new Date().toISOString();
        
        updateNote(note);
        addLog('Nota Actualizada', `Actualizó nota: ${title}`);
        loadNotes();
    }
}

// Función declarada para cancelar edición
export function cancelEdit() {
    loadNotes();
}

// Función declarada para eliminar nota
export function deleteNote(noteId, title) {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
        storageDeleteNote(noteId);
        addLog('Nota Eliminada', `Eliminó nota: ${title}`);
        loadNotes();
    }
}

// Función declarada para verificar si puede editar nota
function canEditNote(note) {
    return currentUser.role === 'admin' || note.userId === currentUser.id;
}

// Función declarada para crear HTML de nota en modo edición
function createEditNoteHTML(note) {
    return `
        <div class="space-y-4">
            <input
                type="text"
                id="editTitle_${note.id}"
                value="${note.title}"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-semibold"
            />
            <textarea
                id="editContent_${note.id}"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >${note.content}</textarea>
            <div class="flex space-x-2">
                <button
                    onclick="window.notesPageInstance.saveNoteEdit('${note.id}')"
                    class="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Guardar
                </button>
                <button
                    onclick="window.notesPageInstance.cancelEdit()"
                    class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancelar
                </button>
            </div>
        </div>
    `;
}

// Función declarada para crear HTML de nota
function createNoteHTML(note) {
    const canEdit = canEditNote(note);
    const isOwnedByOther = currentUser.role === 'admin' && note.userId !== currentUser.id;
    
    return `
        <div data-note-id="${note.id}" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200 card-hover">
            <h3 class="font-semibold text-gray-900 mb-2">${note.title}</h3>
            <p class="text-gray-700 mb-4 whitespace-pre-wrap">${note.content}</p>
            <div class="text-sm text-gray-500 mb-4">
                <p>Creada: ${new Date(note.createdAt).toLocaleDateString()}</p>
                ${note.updatedAt !== note.createdAt ? `
                    <p>Actualizada: ${new Date(note.updatedAt).toLocaleDateString()}</p>
                ` : ''}
                ${isOwnedByOther ? `
                    <p class="text-purple-600">Propiedad del usuario: ${note.userId}</p>
                ` : ''}
            </div>
            ${canEdit ? `
                <div class="flex space-x-2">
                    <button
                        onclick="window.notesPageInstance.editNote('${note.id}')"
                        class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Editar
                    </button>
                    <button
                        onclick="window.notesPageInstance.deleteNote('${note.id}', '${note.title}')"
                        class="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Eliminar
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// Función declarada para cargar notas
function loadNotes() {
    const allNotes = getNotes();
    let userNotes;
    
    if (currentUser.role === 'admin') {
        userNotes = allNotes;
    } else {
        userNotes = allNotes.filter(note => note.userId === currentUser.id);
    }

    if (userNotes.length === 0) {
        notesContainer.innerHTML = `
            <div class="text-center py-12">
                <svg class="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay notas aún</h3>
                <p class="text-gray-500">¡Crea tu primera nota para comenzar!</p>
            </div>
        `;
    } else {
        notesContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 responsive-grid">
                ${userNotes.map(note => createNoteHTML(note)).join('')}
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
        loadNotes();

        // Event listeners usando addEventListener
        addNoteButton.addEventListener('click', showAddForm);
        cancelNoteButton.addEventListener('click', hideAddForm);
        addNoteForm.addEventListener('submit', handleNoteSubmit);
        logoutButton.addEventListener('click', handleLogout);
    });
}

// Exponer funciones necesarias para uso global
window.notesPageInstance = {
    editNote: editNote,
    saveNoteEdit: saveNoteEdit,
    cancelEdit: cancelEdit,
    deleteNote: deleteNote
};

// Inicializar la página
initializePage();