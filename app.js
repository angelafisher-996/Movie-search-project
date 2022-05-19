const request = require('request');
const express = require('express');
const app = express();
const url = require('url');
const path = require('path');
require('dotenv').config();


const api_key = process.env.API_KEY;

const port = 3000;

app.get('/movies', (req, res) => {
  //res.render('movies.ejs');

  var pageNumber = parseInt(req.query.pageNumber);
  if (!pageNumber) pageNumber = 1;
 

  request(
    `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${pageNumber}&append_on_responce=videos`,
    (error, responce, body) => {
      if (error) console.log(error);
      res.render('movies.ejs', {
        moviesData: JSON.parse(body),
        pageNumber: pageNumber,
       
      });
    }
  );
});

app.get('/display', (req, res) => {
  var searchQuery = req.query.searchBy;
  var pageNumber = req.query.pageNumber;
  
  if (!pageNumber) parseInt(pageNumber) = 1;
  
  
  request(
    `https://api.themoviedb.org/3/search/multi?api_key=${api_key}&language=en-US&include_adult=false&query=` +
      searchQuery +
      `&page=` +
      pageNumber,
    (error, responce, body) => {
      if (error) console.log(error);
      

      res.render('searched.ejs', {
        searchData: JSON.parse(body),
        pageNumber: pageNumber,
        searchQuery: searchQuery,
       
      });
    }
  );
});

app.get('/shows', (req, res) => {
  //res.render('movies.ejs');
  var pageNumber = parseInt(req.query.pageNumber);
  if (!pageNumber) pageNumber = 1;
  
  request(
    `https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&language=en-US&page=${pageNumber}&append_on_responce=videos`,
    (error, responce, body) => {
      if (error) console.log(error);
      res.render('shows.ejs', {
        showsData: JSON.parse(body),
        pageNumber: pageNumber,
        
      });
    }
  );
});
app.get('/details/:id', (req, res) => {
  const movieId = req.params.id;
  request(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=en-US&append_to_response=videos`,
    (error, responce, body) => {
      if (error) console.log(error);
      res.render('details.ejs', {
        detailsData: JSON.parse(body),
      });
    }
  );
});
app.get('/showdetails/:id', (req, res) => {
  const showId = req.params.id;
  request(
    `https://api.themoviedb.org/3/tv/${showId}?api_key=${api_key}&append_to_response=videos`,
    (error, responce, body) => {
      if (error) console.log(error);
      res.render('shows-details.ejs', {
        showsDetailsData: JSON.parse(body),
      });
    }
  );
});

app.get('/searchDetails/:id/:media_type', (req, res) => {
  const showId = req.params.id;
  const type = req.params.media_type;
  request(
    `https://api.themoviedb.org/3/${type}/${showId}?api_key=${api_key}&append_to_response=videos`,
    (error, responce, body) => {
      if (error) console.log(error);
      if (type === 'tv') {
        res.render('shows-details.ejs', {
          showsDetailsData: JSON.parse(body),
        });
      } else {
        res.render('details.ejs', {
          detailsData: JSON.parse(body),
        });
      }
    }
  );
});
app.get('*', (req, res) => {
  res.statusCode = 400;
  res.send('<h1>Page Not Found: 404</h1>');
});
app.listen(port, (err) => {
  if (err) console.log('Error starting the server');
  console.log(`Listening on port ${port}`);
});
