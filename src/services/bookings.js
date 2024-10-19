import { getToken, getApiKey } from './auth';
const baseUrl = "https://v2.api.noroff.dev/holidaze/bookings";

const accessToken = getToken();
const apiKey = getApiKey();

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'X-Noroff-API-Key': apiKey,              
}

// Function to get all bookings
export async function getAllBookings() {
    const url = baseUrl
    try {
        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        if (response.ok) {
            return await response.json();
        } else {
            return { error: response.status, message: response.statusText };
        }
    } catch(error){
        return { error: "Network Error", message: error.message }; 
    }
}

// Function to create a new booking
export async function createBooking(data, params = {}, accessToken) {
    const query = new URLSearchParams(params).toString();
    const url = `${baseUrl}/${query}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            return Promise.reject(errorData);
        }
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}

  

// Function to get a single booking
export async function getBookingById(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${baseUrl}/${id}?${query}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers,
        });
        if (response.ok) {
            return await response.json();
        } else {
            return { error: response.status, message: response.statusText };
        }
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}


// Function to update a booking
export async function updateBooking(id, data, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${baseUrl}/${id}?${query}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.json();
            return Promise.reject(errorData);
        }
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}


// Function to delete a booking
export async function deleteBooking(id) {
    const url = `${baseUrl}/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers, 
        });

        if (response.ok) {
            return response.status === 204 ? Promise.resolve() : await response.json();
        } else {
            const errorData = await response.json();
            return Promise.reject(errorData);
        }
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}
