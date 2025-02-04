import fetch from 'node-fetch'; // Use ES module syntax for fetch

// Function to get access token by exchanging the authorization code
export async function getAccessToken(code) {
    const clientId = process.env.CLIENT_KEY;  // Replace with your actual client ID
    const clientSecret = process.env.SECRET_KEY;  // Replace with your actual client secret
    const redirectUri = "http://localhost:3050/callback";  // Ensure this matches the redirect URI you set in Spotify Developer Dashboard


    // Prepare URLSearchParams for the POST request to Spotify API
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    // Make the request to get the access token
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    });

    const data = await result.json();

    // Return the access token
    return data.access_token;
}

// Function to fetch the user profile using the access token
export async function fetchProfile(accessToken) {
    // Make the GET request to the Spotify API to fetch user data
    const result = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Return the profile data
    return await result.json();
}

export async function fetchPlayListInfo(accessToken) {
    // Make the GET request to the Spotify API to fetch user data
    const result = await fetch('https://api.spotify.com/v1/playlists/7BlpeSNAjXVhPi5P7SXujS?si=97aee8ca86074d8d', { //hard coded Playlist ID for now
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Return the profile data
    return await result.json();
}

export async function playRandomSong(accessToken) {
    const result = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json', // Add content type header for JSON
        },
        body: JSON.stringify({
            uri: 'spotify:album:7BlpeSNAjXVhPi5P7SXujS?si=97aee8ca86074d8d' // Use JSON format here
        }),
    });

    if (result.ok) {
        console.log('Song is now playing!');
    } else {
        console.error('Error playing song', await result.json());
    }
}