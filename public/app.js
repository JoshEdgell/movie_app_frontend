const app = angular.module('movies', []);

app.controller('MainController', ['$http', function($http){
  const controller = this;
  this.allMovies = [];
  this.foundMovie = {};
  this.newMovie = {};
  this.requestedMovieId = 0;
  this.searchByTitle = function(data){
    data = data.replace(' ', '+');
    $http({
      method: 'get',
      url: 'http://www.omdbapi.com/?t=' + data + '&apikey=68da6914'
    }).then(function(response){
      controller.foundMovie = {
        title: response.data.Title,
        rating: response.data.Rated,
        genre: response.data.Genre,
        year_released: response.data.Year,
        plot: response.data.Plot,
        director: response.data.Director,
        actors: response.data.Actors,
        poster: response.data.Poster,
        rotten_tomatoes_score: response.data.Ratings[1].Value
      }
    }, function(error){
      console.log(error)
    }
  )};
  this.addMovieToDatabase = function(){
    this.newMovie = this.foundMovie.to_json;
    console.log(this.foundMovie);
    $http({
      method: 'post',
      url: 'http://localhost:3000/movies',
      data: this.foundMovie
    }).then(function(response){
      console.log(response);
    },function(error){
      console.log(error);
    })
  };
  this.getAllApiMovies = function(){
    $http({
      method: 'get',
      url: 'http://localhost:3000/movies'
    }).then(function(response){
      controller.allMovies = response.data;
    })
  };
  // Check the name of a movie to see if it's in our database - returns 'false' if not, returns movie_id if it is in the database
  this.checkMovieList = function(input){
    for (let i = 0; i < this.allMovies.length; i++){
      if (this.allMovies[i].title == input){
        this.requestedMovieId = this.allMovies[i].id
        return true
      }
    }
    return false
  };
  this.searchForMovie = function(data){
    if (this.checkMovieList(data) == false) {
      // If the movie is not in our database, run an AJAX request to OMDB
      data = data.replace(' ', '+');
      $http({
        method: 'get',
        url: 'http://www.omdbapi.com/?t=' + data + '&apikey=68da6914'
      }).then(function(response){
        controller.foundMovie = {
          title: response.data.Title,
          rating: response.data.Rated,
          genre: response.data.Genre,
          year_released: response.data.Year,
          plot: response.data.Plot,
          director: response.data.Director,
          actors: response.data.Actors,
          poster: response.data.Poster,
          rotten_tomatoes_score: response.data.Ratings[1].Value
        }
      }, function(error){
        console.log(error)
      }
    )} else {
      // If the movie is in our database, run the AJAX request to our database
      $http({
        method: 'get',
        url: 'http://localhost:3000/movies/' + this.requestedMovieId
      }).then(function(response){
        controller.foundMovie = response.data;
      }, function(error){
        console.log(error)
      })
    }
  };


  this.getAllApiMovies();
}])
