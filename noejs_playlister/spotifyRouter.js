const express = require("express");
const fetch = require("node-fetch");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const spotifyRouter = express.Router();

const clientId = "YOUR CLIENT ID";
const clientSecret = "YOUR CLIENT SECRET";
const redirectUri = "YOUR REDIRECT URI";
const port = "8888";
const stateKey = "spotify_auth_state";

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

spotifyRouter.get("/login", (req, res) =>{
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = "playlist-read-private";

    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    }));
});

spotifyRouter.get("/callback", (req, res) => {
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if(state === null || state != storedState){
        res.redirect("/#" +
        querystring.stringify({
            error: "state_mismatch"
        }));

    }else{
        res.clearCookie(stateKey);

        fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: querystring.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret
            })
        })
        .then(response =>{
            return response.json();
        })
        .then(responseJson => {
            //accessToken = responseJson.access_token;
            //refreshToken = responseJson.refresh_token;

            req.session.access_token = responseJson.access_token;
            req.session.refresh_token = responseJson.refresh_token;
            
            req.session.spotify = "true";

            /*
            return res.redirect("/#" + querystring.stringify({
                logged_in: true
            }));
            */
           res.redirect("/loginCheck")
        });

        
    };
});
 
spotifyRouter.get("/userInfo", (req, res) => {
    fetch("https://api.spotify.com/v1/me", {
        headers:{
            "Authorization": "Bearer " + req.session.access_token,
            "Content-Type": "application/json"
        }
    })
    .then(response=> {
        return response.json();
    })
    .then(responseJson =>{
        res.send(responseJson)
    });
});

spotifyRouter.get("/playlists", (req, res) =>{
    fetch("https://api.spotify.com/v1/me/playlists", {
        headers:{
            "Authorization": "Bearer " + req.session.access_token,
            "Content-Type": "application/json"
        }
    })
    .then(response=> {
        return response.json();
    })
    .then(responseJson =>{
        res.send(responseJson)
    });
});

spotifyRouter.get("/playlistTracks/:uri", (req, res) => {
    fetch(`https://api.spotify.com/v1/playlists/${req.params.uri}/tracks`, {
        headers:{
            "Authorization": "Bearer " + req.session.access_token,
            "Content-Type": "application/json"
        }
    })
    .then(response=>{
        return response.json();
    })
    .then(responseJson =>{
        res.send(responseJson)
    })
} )


module.exports = spotifyRouter;
