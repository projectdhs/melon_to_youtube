const express = require("express");
const querystring = require("querystring");
const {google} = require("googleapis");
const { response } = require("express");
const pRetry = require("p-retry");
const port = "8888"

const youtubeRouter = express.Router();

const clientId = "클라이언트ID"
const clientSecret = "클라이언트시크릿"


const redirectUri = `http://localhost:8888/youtube/callback`

const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

youtubeRouter.get("/login", async (req, res) => {

    const scopes = ["https://www.googleapis.com/auth/youtube"];

    const url = await oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes
    });

    res.redirect(url)

    
    
});

youtubeRouter.get("/callback", (req, res) => {

    async function getParams() {
        const {tokens} = await oauth2Client.getToken(req.query.code);
        oauth2Client.setCredentials(tokens);



        req.session.youtube = "true";
        return res.redirect("/loginCheck");
    }
    getParams();
    
})

youtubeRouter.get("/channelInfo", (req, res) => {
    async function info() {
        const response = await google.youtube("v3").channels.list({
            auth: oauth2Client,
            mine: true,
            part:"snippet, contentDetails"

        })
        .then(response => {
            console.log(response.data.items[0].snippet.title)
            res.send(response)
        })
        .catch(error =>{
            console.log(error)
        })
        
    }
    info();
    
})

youtubeRouter.get("/createPlaylist/:name/:description", (req, res) => {
    async function createPlaylist(){
        const response = await google.youtube("v3").playlists.insert({
            auth: oauth2Client,
            part:"snippet",
            resource: {
                snippet:{
                    title: `${req.params.name}`,
                    description: `${req.params.description}`
                }
            }
        })
        .then(response =>{
            //console.log(response.data.id)
            res.send(response.data.id)
        })
        .catch(error =>{
            //console.log(error)
        })
    };
    createPlaylist();

})

youtubeRouter.get("/search/:title", (req, res)=>{
    async function search(){
        const response = await google.youtube("v3").search.list({
            auth: oauth2Client,
            part:"snippet",
            q: `${req.params.title}`
        })
        .then(response =>{
            //console.log(response.data.items[0].id)
            //console.log(response.data.items[0].id.videoId)
            //res.send(response.data.items[0].id.videoId);
            res.send(response)
        })
    };
    search();

    
})

youtubeRouter.get("/addToPlaylist/:playlistId/:videoId", (req, res) => {
    async function add(){
            const response = await google.youtube("v3").playlistItems.insert({
                auth: oauth2Client,
                part:"snippet",
                resource : {
                    snippet:{
                        playlistId : `${req.params.playlistId}`,
                        resourceId : {
                            kind: "youtube#video",
                            videoId: `${req.params.videoId}`
                        }
                    }
                }
            })
            .then(response =>{
              
              console.log(response.data.snippet.title);
              console.log(response.status);
              if(response.status != 200){
                throw new AbortError(response.statusText)
              }
            })
            .catch(error =>{
                //console.log(error);
                console.log("Err")
                throw new AbortError("err")
            })
     
    };

    (async () => {

            var x = await pRetry(add, {retries: 5})
            console.log(x);
            // if(x != 200) continue;
            // break;
        
    })();

    //add();

    res.redirect("/loginCheck");

})
/*
youtubeRouter.get("/playlists", (req, res) =>{
    async function view(){
        const response = await google.youtube("v3").playlists.list({
            auth: oauth2Client,
            part:"snippet",
            mine: true
            
        })
        .then(response =>{
            console.log(response);
            
        })
        .catch(error =>{
            console.log(error)
        })
    };
    view();
    res.redirect("/#");
}
)
*/

module.exports = youtubeRouter;
