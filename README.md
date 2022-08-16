# Spotify-Shuffle

If you've ever had trouble making playlists or are just too lazy, look no further than Spotify Shuffle. Initially conceptualized as a student project for a highschool CS class, a friend and I made it a real thing. Rather than having to go through extensive terms, design guidelines, and etc, we opted in to just open sourcing the project for others to run. 

This is the basic program flow:

1. Open to http:localhost:8000/ 
2. Login With Spotify
3. Select the playlist you'd like to append to
4. Like to add to playlist, Dislike to skip, or use scrubbing icons to skip through selection

 
# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 16.0.0+

# Getting started
- Clone the repository
```
git clone  https://github.com/Zaydo123/Spotify-Shuffle/
```
- Install dependencies
```
cd Spotify-Shuffle-main
npm install
```

- Spotify Api Setup
1. Open up https://developer.spotify.com/dashboard and click "Create An App"
2. Fill in basic app details.
3. Copy Client ID and Client Secret for next steps
4. ![a9b24034-ff1e-4a0f-9984-705badc4871c](https://user-images.githubusercontent.com/26662362/184812832-9a52e79b-7f74-4be4-ab7a-4fdf2b73afc3.gif)
5. If you'd like to allow friends (other accounts besides the developer account) to use the app: Click on "Users And Access" then on "Add New User" in order to add their account information.

- Edit index.js 
 1. Change redirect uri (line 22)
 2. Change client id (line 23)
 3. Change client secret (line 24)
 4. Change mongodb uri (line 28)

- Edit other files
 1. Change secret key (line 6 crypto.js)
 2. Change official_url (line 13 in www/javascript/index.js)

- Run the project
```
node index.js
```
  Navigate to `http://localhost:8000`

- API endpoints (in order of authorization/program flow)
 
  Main interface Endpoint : http://localhost:8000/getUser 
 
  Authorization Endpoint : http://localhost:8000/login
  
  Spotify Api Callback Endpoint : http://localhost:8000/callback
  
  Authorization Cookie Retrieval Endpoint: http://localhost:8000/set/cookie1_name/cookie1_value/cookie2_name/cookie2_value
  
  Spotify Add Song to Playlist Endpoint: http://localhost:8000/Playlist_ID/Song_ID
  
 
