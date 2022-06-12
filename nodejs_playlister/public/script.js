let spotifyLogIn = document.getElementById("spotifyLogin");
let spotifyLoggedIn = document.getElementById("spotifyLoggedIn");
let youtubeLogin = document.getElementById("youtubeLogin");
let youtubeLoggedIn = document.getElementById("youtubeLoggedIn");

let youtubeUserInfoTemplate = document.getElementById("youtubeUserInfoTemplate").innerHTML;

//function to display playlists if logged in/ else display login screen

let displayYoutube = () =>{
  fetch("/youtube/channelInfo")
  .then(response => {
      return response.json()

  })
  .then(responseJson => {
      console.log(responseJson)

      const templateFunction = Handlebars.compile(youtubeUserInfoTemplate);
      const html2 = templateFunction({channelInfo: responseJson.data.items[0].snippet});
      youtubeLoggedIn.innerHTML = html2;

  })
}


(function() {

    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    const params = getHashParams();

    const spotify = params.spotify,
        youtube = params.youtube,
        error = params.error;

    if (error) {
      alert('There was an error during the authentication');
    } else {
      if (spotify && youtube) {
        // render logged in screen
        spotifyLogIn.style.display = "none"
        spotifyLoggedIn.style.display = "block"

        youtubeLogin.style.display = "none"
        youtubeLoggedIn.style.display = "block"
        
        displayYoutube();

      }else if(spotify && !youtube){
        //render spotify logged in but not youtube
        spotifyLogIn.style.display = "none"
        spotifyLoggedIn.style.display = "block"
        
        youtubeLogin.style.display = "block"
        youtubeLoggedIn.style.display = "none"
      }else if(youtube && !spotify){
        //render youtube logged in but not spotify
        youtubeLogin.style.display = "none"
        youtubeLoggedIn.style.display = "block"

        spotifyLogIn.style.display = "block";
        spotifyLoggedIn.style.display = "none";

        displayYoutube();

      } else{
        // render initial screen
        spotifyLogIn.style.display = "block";
        spotifyLoggedIn.style.display = "none";

        youtubeLogin.style.display = "block"
        youtubeLoggedIn.style.display = "none"

      };
    }})();




let playlists = document.getElementById("playlists");
let template = document.getElementById("playlists-template").innerHTML;
let userTemplate = document.getElementById("userInfoTemplate").innerHTML;
let userInfo = document.getElementById("userInfo");


async function add(trackName, playlistId){
  let trackId = await fetch(`/youtube/search/${trackName}`)
  let trackIdJson = await trackId.json();
  console.log(trackIdJson);
  let addToPlaylist = await fetch(`/youtube/addToPlaylist/${playlistId}/${trackIdJson.data.items[0].id.videoId}`)
}

const logUri = (uri, playlistName) => {
    //fetch(`/youtube/createPlaylist/${playlistName}`);
    fetch(`/spotify/playlistTracks/${uri}`)
    .then(response =>{
      console.log(response)
      
      return response.json();
    })
    .then(responseJson =>{
        console.log(responseJson)
        console.log(responseJson.items)
        let tracks = responseJson.items.forEach(item =>{
            //eventually use a fetch to youtube api to first find and then add song to playlsit
            //may need to make this an async function to await first the search request to then add to playlist
            add(item.track.name, "PLxPhYfo7A1Eoo0VgI8UVVfdvn5ThKzh85");
            console.log(item.track.name);
        })

    })
    
}

async function create(uri, playlistName){
  let playlistId = await fetch(`/youtube/createPlaylist/${playlistName}`);
  let playlistIdJson = await playlistId.json();

  fetch(`/spotify/playlistTracks/${uri}`)
  .then(response =>{
    console.log(response)
    
    return response.json();
  })
  .then(responseJson =>{
      console.log(responseJson)
      console.log(responseJson.items)
      let tracks = responseJson.items.forEach(item =>{
          //eventually use a fetch to youtube api to first find and then add song to playlsit
          //may need to make this an async function to await first the search request to then add to playlist
          add(item.track.name, playlistIdJson.data.id);
          console.log(item.track.name);
      })

  })
  
}

/*
async function create2(track, playlistIdJson){
  let trackId = await fetch(`youtube/search/${track}`)
  let trackIdJson = await trackId.json();
  await fetch(`/addToPlaylist/${playlistIdJson}/${trackIdJson}`)
}

async function create(uri, playlistName) {
  const playlistId = await fetch(`/youtube/createPlaylist/${playlistName}`)
  console.log(`playlistID: ${playlistId}`)

  //const playlistIdJson = await playlistId.json();
  //console.log(`playlistIDJson: ${playlistIdJson}`)

  const tracks = await fetch(`/spotify/playlistTracks/${uri}`)
  console.log(`tracks: ${tracks}`)
  const tracksJson = await tracks.json();
  console.log(`tracksJson: ${tracksJson}`)
  
  for(let i = 0; i < tracksJson.length; i++) {
    create2(tracksJson[i], playlistId)
  }
  
}
*/

//handlebars function to get spotify user info and list of playlists
if(spotifyLoggedIn.style.display === "block"){
    fetch("/spotify/playlists")
    .then(response => {
        return response.json()

    })
    .then(responseJson => {

        const templateFunction = Handlebars.compile(template);
        const html2 = templateFunction({playlists: responseJson.items});
        playlists.innerHTML = html2;

        let playlistItems = document.querySelectorAll("li").forEach(item => {
            item.addEventListener('click', event => {
              create(item.id.split(":")[2], item.innerHTML);
            })
          })

    })

    fetch("/spotify/userInfo")
    .then(response =>{
        return response.json();
    })
    .then(responseJson => {
        const userTemplateFunction = Handlebars.compile(userTemplate);
        const userHtml = userTemplateFunction({info: responseJson});
        userInfo.innerHTML = userHtml;
        
    })
    
}



/*
if(youtubeLoggedIn.style.display === "block"){
  fetch("/youtube/channelInfo")
  .then(response => {
      return response.json()

  })
  .then(responseJson => {

      const templateFunction = Handlebars.compile(youtubeUserInfoTemplate);
      const html2 = templateFunction({channelInfo: responseJson.data.items[0].snippet.title});
      youtubeLoggedIn.innerHTML = html2;

  })
}
*/
