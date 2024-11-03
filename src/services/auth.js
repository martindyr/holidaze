const baseUrl = "https://v2.api.noroff.dev/auth";
const headers = {
    'Content-Type': 'application/json',
}

// Function to register a new user
export async function registerUser(userData) {
    const url = `${baseUrl}/register`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(userData),
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


// Function to log in a user and store user info in local storage
export async function loginUser(userData) {
    const url = `${baseUrl}/login?_holidaze=true`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(userData),
        });
        if (response.ok) {
            const data = await response.json();
            if (data && data.data && data.data.accessToken) {
                const { accessToken, name, venueManager } = data.data;
                const apiKey = createApiKey();
                // Save user info to localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('apiKey', apiKey);
                localStorage.setItem('name', name);
                localStorage.setItem('venueManager', venueManager);
                // Check and save API key if not already stored
                if (!localStorage.getItem('apiKey')) {
                    const apiKeyData = await createApiKey(accessToken);
                    if (apiKeyData.apiKey) {
                        localStorage.setItem('apiKey', apiKeyData.apiKey);
                    }
                }
            }
            return data;
        } else {
            const errorData = await response.json();
            return Promise.reject(errorData);
        }
    } catch (error) {
        return { error: "Network Error", message: error.message };
    }
}


// Function to create an API key
// ! Should have been using request provided by noroff, but i got a 500 from the server - even in swagger.
export function createApiKey() {
    const apiKey = 'db9e7b5a-4cf1-4d0d-8be6-f625cfc61f44';
    return apiKey;
}

// Utility function to get the saved token
export function getToken() {
    return localStorage.getItem('accessToken');
}

// Utility function to get the saved API key
export function getApiKey() {
    return localStorage.getItem('apiKey');
}

// Utility function to get the saved name
export function getName() {
    return localStorage.getItem('name');
}

// Utility function to check if user is a venue manager
export function isVenueManager() {
    return localStorage.getItem('venueManager') === 'true';
  }

// Utility function to log out (clear the token, API key, and name)
export function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('name');
    localStorage.removeItem('venueManager');
    console.log('User logged out, token, API key, and name removed');
}
