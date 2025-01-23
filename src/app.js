import * as dotenv from 'dotenv';
import express from 'express'; // Use import for ES modules
import { fetchPlayListInfo, fetchProfile, getAccessToken } from './spotifyAuth.js'; // Correct path for the import
dotenv.config();

const clientId = process.env.CLIENT_KEY;
const clientSecret = process.env.SECRET_KEY;


const app = express();
const port = 3050;

const redirectUri = "http://localhost:3050/callback";  // Make sure this matches the redirect URI set in your Spotify developer dashboard

// Serve static files from the 'public' folder (index.html, script.js)
app.use(express.static('public'));

// Route to start the authorization flow
app.get('/login', (req, res) => {
    const clientId = process.env.CLIENT_KEY;  // Replace with your actual client ID
    const scope = "user-read-private user-read-email";  // Define the necessary scopes

    // Redirect user to Spotify login
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'code');
    params.append('redirect_uri', redirectUri);
    params.append('scope', scope);

    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

// Callback route for Spotify to redirect back with the code
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (code) {
        try {
            // Get access token by calling getAccessToken
            const accessToken = await getAccessToken(code);

            // Redirect to /profile with the access token
            res.redirect(`/profile?access_token=${accessToken}`);
        } catch (error) {
            console.error('Error obtaining access token:', error);
            res.send('Error obtaining access token');
        }
    } else {
        res.send('No code received');
    }
});

// Profile route to display user profile data
app.get('/profile', async (req, res) => {
    const accessToken = req.query.access_token;

    if (accessToken) {
        try {
            const profile = await fetchProfile(accessToken);
            const playlist = await fetchPlayListInfo(accessToken);

            // Send back a simple HTML with profile data
            res.send(`
        <h1>Spotify Profile</h1>
        <p>Name: ${profile.display_name}</p>
        <p>Email: ${profile.email}</p>
        <p>ID: ${profile.id}</p>
        <img src="${profile.images[0]?.url}" alt="Profile Image" width="200" />
        <a href="${profile.external_urls.spotify}" target="_blank">Open in Spotify</a>
        <div class = "playlists">
        <h1>PlayList Name: ${playlist.name}</h1>
        <h2>PlaysList Owner: Moonclan! <h2>
        <button id= "play">Click here to play a song from the list</button>
        </div>
      `);
        } catch (error) {
            res.send('Error fetching profile data');
        }
    } else {
        res.send('Access token is missing');
    }
});

app.get('/player', async (req, res) => {

})


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
