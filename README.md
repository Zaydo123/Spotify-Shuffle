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

- Setup Spotify API
 1. Open up https://developer.spotify.com/dashboard and click "Create An App"
 2. Fill in basic app details.
 3. Copy Client ID and Client Secret for next steps
 4. Add a redirect URI
 ![Recording 2022-08-16 at 01 58 53](https://user-images.githubusercontent.com/26662362/184817093-0ac51ce4-21b7-4b98-8dd0-70ddeaba1c8c.gif)
 5 (optional). If you'd like to allow friends (other accounts besides the developer account) to use the app: Click on "Users And Access" then on "Add New User" in order to add their account information.

- Edit index.js 
 1. Change redirect uri to your callback url (line 22)
 2. Change client id to the one provided by spotify (line 23)
 3. Change client secret to the one provided by spotify (line 24)
 4. Change mongodb uri (line 28)

- Edit other files
 1. Change secret key to anything (line 6 crypto.js)
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
  
 
