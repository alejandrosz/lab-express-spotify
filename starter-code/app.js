require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
//////////
app.get("/", (req, res) => res.render("index"));

app.get("/artist-search", (req, res) => {
  let { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const artistsFound = data.body.artists.items;
      res.render("artist-search-results", { artistsFound });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  let { artistId } = req.params;
  spotifyApi.getArtistAlbums(artistId).then(data => {
    const albums = data.body.items;
    res.render("albums", { albums });
    // res.json(albums);
  });
  // let { artist } = req.query;
  // spotifyApi
  //   .searchArtists(artist)
  //   .then(data => {
  //     const artistsFound = data.body.artists.items;
  //     res.render("artist-search-results", { artistsFound });
  //   })
  //   .catch(err =>
  //     console.log("The error while searching artists occurred: ", err)
  //   );
});

//   console.log(req.query);

//   Services.find({ nif: req.query.nif }).then(service => {
//     res.render("servicesAndEmployees", {
//       services: service
//     });
//   });
// });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
