const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const cookieparser = require("cookie-parser");
const { response } = require("express");
const port = "8888"
const youtubeRouter = require("./youtubeRouter");
const spotifyRouter = require("./spotifyRouter");
const session = require("express-session");

const app = express();

app.use(express.static(__dirname + "/public"))
.use(cors())
.use(cookieparser())
.use(session({
    secret: "user-logged",
    resave: false,
    saveUninitialized: false
}))
.use("/youtube", youtubeRouter)
.use("/spotify", spotifyRouter);

app.get("/loginCheck", (req, res) => {
    if(req.session.spotify && req.session.youtube){
        console.log("spotify and youtube logged in")
        res.redirect("/#" + querystring.stringify({
            spotify: true,
            youtube:true
        }));
    }else if(req.session.spotify){
        res.redirect("/#" + querystring.stringify({
            spotify: true
        }));
    }else if(req.session.youtube){
        res.redirect("/#" + querystring.stringify({
            youtube: true
        }));
    }else{
        res.redirect("/#" + querystring.stringify({
            log_in: true
        }));
    }
})

app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}/`)
})