require('dotenv').config()
const SpotifyWebApi = require("spotify-web-api-node");

const express = require('express');
const hbs = require('hbs');
// hbs.registerPartials(__dirname + "/views/partials");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:



// the routes go here:

app.get('/', (req, res) => {
    res.render("index.hbs")
})

app.get('/artists', (req, res) => {
    // res.send(req.query.artist);
    let searchedArtist = req.query.artist;

    spotifyApi
        .searchArtists(searchedArtist)
        .then(data => {
            console.log("The received data from the API: ", data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artists.hbs', {
                artistsObj: data.body.artists.items
            })

        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });

    //res.render("artists.hbs")
})

app.get('/albums/:artistId', (req, res) => {

    let artId = req.params.artistId;

    spotifyApi.getArtistAlbums(artId)
        .then(function (data) {
                res.render('albums.hbs', {
                    albumsObj: data.body.items
                })

            },
            function (err) {
                console.error(err);
            }
        );

})

app.get('/albumTracks/:albumId', (req, res) => {

    let albId = req.params.albumId;
    console.log(albId)

    spotifyApi.getAlbumTracks(albId)
        .then(function (data) {
                let tracksArr = data.body.items;
                let tracksData = {
                    tracksArr
                };
                console.log(tracksArr);
                res.render('tracks.hbs', {
                    tracksObj: data.body.items
                })
            },

            function (err) {
                console.log('Something went wrong!', err);
            });



})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));