let authenticated = false;
let ids;
let names;
let artists;
let previews; 
let songs;
let links;
let images;
let counter = 0;
let index = 0;
let playlistID;

const official_url = 'INSERT YOUR PROJECT URL HERE';

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
       changeSong(1,0);
    }
    else if (e.keyCode == '39') {
       changeSong(0,0);
    }
}


function addToPlaylist(){
  playlistID = document.getElementById("userPlaylists").value;
  const http = new XMLHttpRequest();
  const url = official_url + "add/"+playlistID+'/'+ids[index-1];
  http.open("GET",url);
  http.send();
  http.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      let status = http.responseText;
      if(status.indexOf('error')!=-1){
        if(status.indexOf("You cannot add tracks to a playlist you don't own..")!=-1){
          window.alert(status);
        } else{
          window.alert(status); 
        }
      } else{
        console.log('added '+names[index-1]+' to playlist '+playlistID);
      }
    }
  };
  
}
function changeSong(back,likeDislike){
  if(back==0){
    index++;
  }else{
    if(index>0){
      index--;
    }
  };
  if(names[index]==undefined){
    console.log(names);
    window.location.reload();
  }
  else{
    document.getElementById('songName').innerHTML=names[index];
    document.getElementById('songArtist').innerHTML=artists[index];
    document.getElementById('audioElement').setAttribute('src',previews[index]);
    document.getElementById('albumImage').setAttribute('src',images[index]);
    document.getElementById('songLink').href=links[index];
  }
  if(likeDislike==1){
    addToPlaylist();
  }
  }


function getSongs(){
  if(authenticated){
    const http = new XMLHttpRequest();
    const url = official_url+"getUser";
    http.open("GET",url);
    http.send();
    http.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(http.responseText);
        songs = response.data.songs
        console.log(songs)
        ids = songs.songIDs;
        names = songs.songNames;
        artists = songs.songArtists;
        previews = songs.songPreviews;
        images = songs.songImages;
        links = songs.songLinks;
        if(counter!=-123){
          let userPlaylists = response.user.playlistsNames
          let userPlaylistsIDs = response.user.playlistsIDs
          let selectElement = document.getElementById('userPlaylists');
          let option;
            for(let i=0; i < userPlaylistsIDs.length; i++){
              option = document.createElement('option');
              option.text = userPlaylists[i];
              option.value = userPlaylistsIDs[i];
              selectElement.add(option, 0);
            }
        }
      }
    };
  }
}

function is_auth(){
  if(document.cookie==''){
    authenticated=false;
  } else{
    authenticated=true;
    if(counter==0){
      getSongs();
      counter++;
    }
  }
}

setInterval(is_auth,500);