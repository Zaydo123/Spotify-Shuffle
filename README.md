# Spotify-Shuffle

# Configuration 
Index.js (entry file) -
 1. Change redirect uri (line 22)
 2. Change client id (line 23)
 3. Change client secret (line 24)
 4. Change mongodb uri (line 28)
Other files - 
 5. IMPORTANT!!!! Change secret key (line 6 crypto.js)
 6. Change official_url (line 13 in www/javascript/index.js)
 
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
  
 
