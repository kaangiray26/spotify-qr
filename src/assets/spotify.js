const generateRandomString = (length) => {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
};

class Spotify {
    constructor() {
        this.client_id = "05732c2cc34c4c698a1b57cd493c4f3b";
        this.redirect_uri = "http://localhost:5173/callback";
        console.log("Spotify initialized");
    }

    isAuthenticated() {
        // Check for access token
        const access_token = localStorage.getItem("access_token") || null;
        return access_token !== null;
    }

    async me() {
        // Check for access token
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;

        // Get the user's information
        return await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => res.json())
            .catch((err) => {
                if (err.status === 401) return { error: "Refresh" };
            });
    }

    async auth() {
        // Save the code verifier
        const codeVerifier = generateRandomString(64);
        localStorage.setItem("code_verifier", codeVerifier);

        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed);

        // Authenticate the user
        const authUrl = new URL("https://accounts.spotify.com/authorize");
        const params = {
            response_type: "code",
            client_id: this.client_id,
            scope: "user-read-private user-read-email",
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
            redirect_uri: this.redirect_uri,
        };

        // Open the authentication url
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    async getToken(code) {
        const codeVerifier = localStorage.getItem("code_verifier");
        if (!codeVerifier) return;

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: this.client_id,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: this.redirect_uri,
                code_verifier: codeVerifier,
            }),
        }).then((res) => res.json());

        // Save the access token and refresh token
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        console.log("Authentication successful:", response.access_token);
    }

    async search(query) {
        // Check for access token
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;

        // Search for the query
        const searchParams = new URLSearchParams({
            q: query,
            type: "track",
        });
        return await fetch(
            "https://api.spotify.com/v1/search?" + searchParams.toString(),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            },
        ).then((res) => res.json());
    }

    async refreshToken() {
        const refresh_token = localStorage.getItem("refresh_token");
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: this.client_id,
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            }),
        }).then((res) => res.json());

        // Save the access token
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
    }
}

export { Spotify };
