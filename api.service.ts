
/**
 * API Service - Conexión con el Backend PHP
 */

const API_BASE_URL = '/api'; // Al estar en el mismo servidor, usamos ruta relativa

export const api = {
    // Configuración de la empresa
    getSettings: () => fetch(`${API_BASE_URL}/settings.php`).then(res => res.json()),
    updateSettings: (data: any) => fetch(`${API_BASE_URL}/settings.php`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),

    // Gestión de Tickets
    getTickets: (status?: string) => {
        const url = status ? `${API_BASE_URL}/tickets.php?status=${status}` : `${API_BASE_URL}/tickets.php`;
        return fetch(url).then(res => res.json());
    },
    createTicket: (data: any) => fetch(`${API_BASE_URL}/tickets.php`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),
    updateTicket: (data: any) => fetch(`${API_BASE_URL}/tickets.php`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),

    // Usuarios
    getUsers: () => fetch(`${API_BASE_URL}/users.php`).then(res => res.json()),
    login: (credentials: any) => fetch(`${API_BASE_URL}/users.php`, {
        method: 'POST',
        body: JSON.stringify({ ...credentials, action: 'login' }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),

    // Clientes
    getClients: () => fetch(`${API_BASE_URL}/clients.php`).then(res => res.json()),

    // Flota
    getFleet: () => fetch(`${API_BASE_URL}/fleet.php`).then(res => res.json()),
    updateFleetKm: (id: number, km: number) => fetch(`${API_BASE_URL}/fleet.php`, {
        method: 'PUT',
        body: JSON.stringify({ id, current_km: km }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),
};
