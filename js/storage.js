// Storage Service - Manejo de localStorage y sessionStorage

// Funciones declaradas para manejo de usuarios
export function getUsers() {
    const users = localStorage.getItem('crudzocial_users');
    return users ? JSON.parse(users) : [];
}

export function saveUsers(users) {
    localStorage.setItem('crudzocial_users', JSON.stringify(users));
}

export function addUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
}

export function updateUser(updatedUser) {
    const users = getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
        return true;
    }
    return false;
}

// Funciones declaradas para manejo de sesiones
export function setActiveSession(user) {
    sessionStorage.setItem('crudzocial_session', JSON.stringify(user));
}

export function getActiveSession() {
    const session = sessionStorage.getItem('crudzocial_session');
    return session ? JSON.parse(session) : null;
}

export function clearSession() {
    sessionStorage.removeItem('crudzocial_session');
}

// Funciones declaradas para manejo de imágenes
export function getImages() {
    const images = localStorage.getItem('crudzocial_images');
    return images ? JSON.parse(images) : [];
}

export function saveImages(images) {
    localStorage.setItem('crudzocial_images', JSON.stringify(images));
}

export function addImage(image) {
    const images = getImages();
    images.push(image);
    saveImages(images);
}

export function deleteImage(imageId) {
    const images = getImages();
    const filteredImages = images.filter(img => img.id !== imageId);
    saveImages(filteredImages);
}

// Funciones declaradas para manejo de notas
export function getNotes() {
    const notes = localStorage.getItem('crudzocial_notes');
    return notes ? JSON.parse(notes) : [];
}

export function saveNotes(notes) {
    localStorage.setItem('crudzocial_notes', JSON.stringify(notes));
}

export function addNote(note) {
    const notes = getNotes();
    notes.push(note);
    saveNotes(notes);
}

export function updateNote(updatedNote) {
    const notes = getNotes();
    const index = notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
        notes[index] = updatedNote;
        saveNotes(notes);
        return true;
    }
    return false;
}

export function deleteNote(noteId) {
    const notes = getNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    saveNotes(filteredNotes);
}

// Funciones declaradas para manejo de logs
export function getLogs() {
    const logs = localStorage.getItem('crudzocial_logs');
    return logs ? JSON.parse(logs) : [];
}

export function saveLogs(logs) {
    localStorage.setItem('crudzocial_logs', JSON.stringify(logs));
}

export function addLog(log) {
    const logs = getLogs();
    logs.push(log);
    saveLogs(logs);
}

// Función para inicializar usuario admin por defecto
function initializeDefaultAdmin() {
    const users = getUsers();
    const adminExists = users.some(user => user.role === 'admin');
    
    if (!adminExists) {
        const adminUser = {
            id: 'admin-001',
            email: 'admin@crudzocial.com',
            firstName: 'Administrador',
            lastName: 'Sistema',
            phone: '+1-555-0100',
            country: 'España',
            city: 'Madrid',
            address: 'Calle Admin 123',
            postalCode: '28001',
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        addUser(adminUser);

        // Crear también un usuario regular de ejemplo
        const regularUser = {
            id: 'user-001',
            email: 'usuario@crudzocial.com',
            firstName: 'Usuario',
            lastName: 'Regular',
            phone: '+1-555-0200',
            country: 'España',
            city: 'Barcelona',
            address: 'Calle Usuario 456',
            postalCode: '08001',
            role: 'user',
            createdAt: new Date().toISOString()
        };
        addUser(regularUser);
    }
}

// Inicializar admin por defecto cuando se carga el módulo
initializeDefaultAdmin();