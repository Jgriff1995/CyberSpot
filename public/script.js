// This file will handle the client-side interactions and user interface updates.

// Event listener for when the "Login with Spotify" button is clicked
document.getElementById('spotifyLoginButton').addEventListener('click', function () {
    // Redirect the user to the '/login' route, which starts the Spotify OAuth flow
    window.location.href = '/login';
});

document.getElementById('play').addEventListener('click', function () {
    playRandomSong();
});
// Check if the URL has the access token parameter (which comes from the /callback route)
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
        // If we have the access token, fetch the user's profile
        fetchProfile(accessToken);
    }
};

// Function to fetch the user's profile using the access token
async function fetchProfile(accessToken) {
    try {
        const response = await fetch(`/profile?access_token=${accessToken}`);
        const profile = await response.text();
        document.getElementById('profile').innerHTML = profile; // Display the profile info
    } catch (error) {
        console.error('Error fetching profile:', error);
        document.getElementById('profile').innerHTML = 'Error fetching profile data';
    }
}








