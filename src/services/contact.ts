import { getAuthToken } from './auth';

const API_URL = 'https://localhost:7272/api/user/contacts';

export type EmergencyContact = {
    id: number;
    name: string;
    description: string;
    phonenumber: string;
}

export type NewEmergencyContact = Omit<EmergencyContact, 'id'>;

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!response.ok) {
        throw new Error('Não foi possível carregar os contatos de emergência');
    }

    return response.json();
}

export async function addEmergencyContact(contact: NewEmergencyContact): Promise<void> {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
    });

    if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!response.ok) {
        throw new Error('Não foi possível adicionar o contato de emergência');
    }
}
