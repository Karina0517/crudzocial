// Authentication Service - Manejo de autenticación y autorización
import { 
    getActiveSession, 
    setActiveSession, 
    clearSession, 
    updateUser, 
    addLog as storageAddLog,
    getUsers
} from './storage.js';

let currentUser = null;

// Función declarada para inicializar la sesión
export function initializeSession() {
    const sessionUser = getActiveSession();
    if (sessionUser) {
        currentUser = sessionUser;
        return true;
    }
    return false;
}

// Función declarada para login
export function login(email) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
        currentUser = user;
        setActiveSession(user);
        addLog('Inicio de Sesión', 'Usuario ingresó al sistema');
        return { success: true, user: user };
    }
    return { success: false, error: 'Usuario no encontrado' };
}

// Función declarada para logout
export function logout() {
    if (currentUser) {
        addLog('Cierre de Sesión', 'Usuario salió del sistema');
    }
    currentUser = null;
    clearSession();
}

// Función declarada para obtener usuario actual
export function getCurrentUser() {
    return currentUser;
}

// Función declarada para verificar si está autenticado
export function isAuthenticated() {
    return currentUser !== null;
}

// Función declarada para verificar si es admin
export function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Función declarada para actualizar usuario
export function updateUserData(userData) {
    if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        currentUser = updatedUser;
        updateUser(updatedUser);
        setActiveSession(updatedUser);
        addLog('Actualización de Perfil', 'Información del perfil actualizada');
        return true;
    }
    return false;
}

// Función declarada para agregar log
export function addLog(action, details) {
    if (currentUser) {
        const log = {
            id: Date.now().toString(),
            userId: currentUser.id,
            action: action,
            details: details,
            timestamp: new Date().toISOString()
        };
        storageAddLog(log);
    }
}

// Función declarada para el guardian de sesión
export function sessionGuard() {
    const protectedPages = ['images.html', 'notes.html', 'profile.html', 'users.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!initializeSession()) {
            window.location.href = 'index.html';
            return false;
        }
        
        // Verificar acceso a panel de admin
        if (currentPage === 'users.html' && !isAdmin()) {
            window.location.href = 'images.html';
            return false;
        }
    }
    return true;
}

// Función para inicializar el guard cuando se carga la página
function initializeSessionGuard() {
    document.addEventListener('DOMContentLoaded', function() {
        sessionGuard();
    });
}

// Inicializar el guard de sesión
initializeSessionGuard();