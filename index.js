//entrance file
//customization insturctions:
//1. Change redirect uri (line 22)
//2. Change client id (line 23)
//3. Change client secret (line 24)
//4. Change mongodb uri (line 28)
//5. IMPORTANT!!!! Change secret key (line 6 crypto.js)
//6. Change official_url (line 13 in www/javascript/index.js)
let express = require('express');
let cookieParser = require('cookie-parser');
let querystring = require('querystring');
let SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
//let database = require('./db.js');
let app = express()


//attention-----------------------------------------------------

//spotify api-
const redirect_uri = 'PLEASE CHANGE THIS TO YOUR OWN REDIRECT URI';
const client_id = 'PLEASE CHANGE THIS TO YOUR CLIENT ID';
const client_secret = 'PLEASE CHANGE THIS TO YOUR CLIENT SECRET';


//mongodb-----
const uri = "CHANGE THIS TO YOUR MONGODB URI";
//-----------------------------------------------------


const { encrypt, decrypt } = require('./crypto');
const { read } = require('fs');

//db stuffs
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const newUser = (db,email,auth,refresh,data={},callback)=> {
  // Get the customers collection
  const collection = db.collection('users');
  const dataArray = {email:email,auth:auth,refresh:refresh,data:data};
  // Insert some customers
  collection.insertOne(dataArray).then((err, result)=> {
    if(err){
      console.log(err);
    };
    console.log(result);
  });
}
const getUser = (db, email, callback)=>{
  // Get the customers collection
  const collection = db.collection('users');
  // Find some customers
  collection.find({email: email}).toArray((err, users) =>{
    if(err){
      console.log(err);
    }
    callback(users);
  });
}
const updateUser = (db,email,newData,callback)=>{
  const collection = db.collection('users');
  collection.updateOne({email:email},{$set:newData}).then((err,result)=>{
    if(err){
      console.log(err);
    }
    callback(result);
  });

}

// end db

app.set('view engine', 'ejs');
app.set('views',(__dirname+'/www/views'));
app.use(cookieParser())
app.use(express.static('www'));

// credentials are optional

app.get("/", function (req, res) {
  let spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
  });
  let iv = req.cookies.iv;
  let content = req.cookies.content;
  let authorized = false;
  if(content!=undefined&&iv!=undefined){
    authorized=true;
    let email = decrypt({content:content,iv:iv});
    let user;
    MongoClient.connect(uri,{ useUnifiedTopology: true}, (err, client) => {
      const db = client.db('shuffle');
      console.log("Connected successfully to server ('/')");
      //read user data and extract access tokens
      getUser(db,email,(result)=>{
        console.log(result);
        spotifyApi.setAccessToken(result[0].auth);
        spotifyApi.setRefreshToken(result[0].refresh);
        console.log("set tokens")
        spotifyApi.getAvailableGenreSeeds().then(function(data) {
          console.log("got seeds");
          let seed_genres = data.body.genres;
          spotifyApi.getMyTopTracks({time_range: "medium_term"}).then(function(data) {
          console.log('got tops');
          let seed_artists = [];
          let seed_tracks = [];
          let topTracks = data.body.items;

          for(let i=0;i<topTracks.length;i++){
            seed_tracks.push(topTracks[i].id);
            seed_artists.push(topTracks[i].artists[0].id);
      
          }
          spotifyApi.getRecommendations({seed_artists:[choose(seed_artists),choose(seed_artists)],seed_tracks:[choose(seed_tracks),choose(seed_tracks)],seed_genres:[choose(seed_genres)],min_popularity: 20}).then(function(data) {
            console.log('got recommendations')
            let currentSong;
            let previews = [];
            let preview;
            let images = [];
            let songNames = [];
            let artists = [];
            let songIDs = [];
            let artist='';
            let artistsTemp = [];
            let playlistsNames = [];
            let playlistsIDs = [];
            let songLinks = [];
            let songLink;
            let recommendations = data.body.tracks;
          
            spotifyApi.getMe().then(function(response1) {
              spotifyApi.getUserPlaylists(response1.body.id).then(function(response2){
                for(let z=0;z<response2.body.items.length;z++){
                  playlistsNames.push(response2.body.items[z].name);
                  playlistsIDs.push(response2.body.items[z].id);  
                }
                for(let b=0;b<recommendations.length;b++){
                  currentSong = recommendations[b]
                  preview = currentSong.preview_url;
                  
                  if (preview!=null){
                    images.push(currentSong.album.images[0].url);
                    songNames.push(currentSong.name);
                    previews.push(preview);
                    songLink=currentSong.external_urls.spotify;
                    songLinks.push(songLink);
                    artistsTemp = [];
                    for(let g=0;g<currentSong.artists.length;g++){
                      artistsTemp.push(currentSong.artists[g].name)
                  }
                    artist= artistsTemp.join([separator = ', '])
                    artists.push(artist);
                    songIDs.push(currentSong.id);
                  }
                }
                res.render("index",{auth:authorized,images:images,artists:artists,songIDs:songIDs,songNames:songNames,previews:previews,songLinks:songLinks});
                updateUser(db,email,{data:{songs:{songNames:songNames,songImages:images,songPreviews:previews,songIDs:songIDs,songArtists:artists,songLinks:songLinks}},user:{playlistsNames:playlistsNames,playlistsIDs:playlistsIDs}},(result3)=>{console.log(result3);});
                
              });


            
            });
          });
        });            
      
      });
    });
  });
  }else{
    res.render("index",{auth:authorized});
  }
});

app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public user-top-read streaming user-follow-modify';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));

});

app.get('/callback', function(req, res) {
  console.log('bp1');
  let spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
  });
  console.log('bp2');
  let code = req.query.code;
  let state = req.query.state;
  let refreshToken;
  let auth;
  spotifyApi.authorizationCodeGrant(code).then(function(result) {
    auth=result.body.access_token;
    refreshToken=result.body.refresh_token;
    console.log(auth,'\n',refreshToken)
    spotifyApi.setAccessToken(auth);
    spotifyApi.setRefreshToken(refreshToken);
    console.log('done auth')
    axios({method: 'get',
           url: 'https://api.spotify.com/v1/me',headers:{'Accept':"application/json","Content-Type": "application/json","Authorization": "Bearer "+auth}}).then(function(meresponse) {
      data = meresponse.data 
      console.log('data : \n\n'+ data+'\n');
      MongoClient.connect(uri,{ useUnifiedTopology: true}, (err, client) => {
        const db = client.db('shuffle');
        console.log('bp1');
        console.log("Connected successfully to server");
        getUser(db,data.email,(result)=>{
          console.log(result);
          if(result[0]==undefined){ //if user doesnt exist
            newUser(db,data.email,auth,refreshToken,(result1)=>{
              console.log(result1)
            });
          } else{ // if user exitst
            //console.log(result);
            updateUser(db,data.email,{auth:auth,refresh:refreshToken},(result2)=>{
              console.log(result2);
            })
          } 
          //happens regardless
          let encrypted = encrypt(data.email);
          res.redirect('/set/iv/'+encrypted.iv+'/content/'+encrypted.content);
        });
      });  
    },function(err){
      res.send('err');
      console.log(String(err));
    });
  });
});

app.get('/set/:cookie_name/:cookie/:cookie_name_2/:cookie_2', function(req, res) {
  let expiryDate = new Date(Date.now() + 60 * 60 * 1000)
  res.cookie(req.params.cookie_name,req.params.cookie,{expires:expiryDate});
  res.cookie(req.params.cookie_name_2,req.params.cookie_2,{expires:expiryDate});
  res.redirect('/');
});

app.get('/getUser',function(req,res){
  if(req.cookies.content!=undefined){
    let email = decrypt({content:req.cookies.content,iv:req.cookies.iv});
    MongoClient.connect(uri,{ useUnifiedTopology: true}, (err, client) => {
      const db = client.db('shuffle');
      console.log('bp1');
      console.log("Connected successfully to server");
      getUser(db,email,(result)=>{
      res.json(result[0]);
      });
    });
  } else{
    res.send('not auth');
  }
  
});

app.get('/add/:pid/:sid',function(req,res){
  if(req.cookies.content!=undefined){
    let email = decrypt({content:req.cookies.content,iv:req.cookies.iv}); 
    MongoClient.connect(uri,{ useUnifiedTopology: true}, (err, client) => {
      const db = client.db('shuffle');
      console.log("Connected successfully to server");
      getUser(db,email,(result)=>{
        let spotifyApi = new SpotifyWebApi({
          clientId: client_id,
          clientSecret: client_secret,
          redirectUri: redirect_uri
        });
        spotifyApi.setAccessToken(result[0].auth);
        spotifyApi.setRefreshToken(result[0].refresh);
        let playlist=req.params.pid
        let song=req.params.sid
        spotifyApi.addTracksToPlaylist(playlist, ["spotify:track:"+song]).then(function(data){
          res.send("success");
        }, function(err) {
          res.send('error: '+err);
          console.log(err);
        });
      });
    });
  } else{
    res.send('error: not authenticated. please refresh.')
  }
});


function generateRandomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

var server = app.listen(8000, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Express app listening at http://%s:%s', host, port)

});

