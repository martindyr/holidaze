import { getToken, getApiKey, getName } from './auth';

const baseUrl = "https://v2.api.noroff.dev/holidaze/profiles";
const accessToken = getToken();
const apiKey = getApiKey();
const name = getName();

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`, 
    'X-Noroff-API-Key': apiKey,               
}

// Function to get a all profile
export async function getAllProfiles() {
    const url = `${baseUrl}`;
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
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}

// Function to get a single profile
export async function getProfileByName() {
    const url = `${baseUrl}/${name}`;
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
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}

// Function to update a profile
export async function updateProfileByName(name, data) {
    const url = `${baseUrl}/${name}`;
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
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

// Function to search for profiles
export async function searchProfiles(queryParams = {}) {
    const url = `${baseUrl}/search?${new URLSearchParams(queryParams).toString()}`;
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
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}

// Function to get all user venues
export async function getUserVenues(params = {}) {
    const name = getName();
    const queryParams = new URLSearchParams({ ...params, _bookings: true }).toString();
    const url = `${baseUrl}/${name}/venues?${queryParams}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        return { error: response.status, message: errorData.message || response.statusText };
      }
    } catch (error) {
      return { error: "Network Error", message: error.message };
    }
  }

 // Function to get all user bookings
export async function getUserBookings() {
    const name = getName();
    const url = `${baseUrl}/${name}/bookings?_venue=true`;
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
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}