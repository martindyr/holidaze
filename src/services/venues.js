import { getToken, getApiKey } from './auth';


const baseUrl = "https://v2.api.noroff.dev/holidaze/venues";
const accessToken = getToken();
const apiKey = getApiKey();

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`, 
    'X-Noroff-API-Key': apiKey,               
}

// Function to get all venues
export async function getAllVenues() {
    const url = `${baseUrl}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers,
        });
        if(response.ok) {
            return await response.json()
        } else {
            return {error: response.status, message: response.statusText};
        }
    } catch (error) {
        return {error: "Network Error", message: error.message}
    }
}

// Funtion to get a spesific venue
export async function getVenueById(id, params = {}) {
    const queryParams = { ...params, _bookings: true };
    const query = new URLSearchParams(queryParams).toString();
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

// Function to create a new venue
export async function createVenue(data) {
    const url = `${baseUrl}`;
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

  
  // Function to update a venue by ID
  export async function updateVenue(id, data, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${baseUrl}/${id}?${query}`;
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
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

  
// Function to delete a venue by ID
export async function deleteVenue(id) {
    const accessToken = getToken();
    const apiKey = getApiKey();
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'X-Noroff-API-Key': apiKey,
    }
    const url = `${baseUrl}/${id}`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers,
        });
        if (response.ok) {
            /* Returns 204, so needed an extra check */
            if (response.status === 204) {
                return Promise.resolve();
            }
            return await response.json();
        } else {
            const errorData = await response.json();
            return Promise.reject(errorData);
        }
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}


// Function to search for venues
export async function searchVenues(queryParams) {
    const query = new URLSearchParams(queryParams).toString();
    const url = `${baseUrl}/search?${query}`;
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
