const app = angular.module('movies', []);

app.controller('MainController', ['$http', function($http){
  const controller = this;
  this.allMovies = [];
  this.allUsers = [];
  this.foundMovie = {};
  this.foundMovieReviews = [];
  this.newMovie = {};
  this.requestedMovieId = 0;
  this.getAllApiMovies = function(){
    // Return the data for all of the movies in our database
    $http({
      method: 'get',
      url: 'http://localhost:3000/movies'
    }).then(function(response){
      controller.allMovies = response.data;
    })
  };
  this.getAllUsers = function(){
    // Returns an array of all of the users in our database (sans passwords);
    $http({
      method: 'get',
      url: 'http://localhost:3000/users'
    }).then(function(response){
      response.data.forEach(function(a){delete a.password});
      controller.allUsers = response.data;
      console.log(controller.allUsers)
    }, function(error){
      console.log(error)
    })
  }
  this.checkMovieList = function(input){
      // Check the name of a movie to see if it's in our database - returns 'false' if not, returns movie_id if it is in the database
    for (let i = 0; i < this.allMovies.length; i++){
      if (this.allMovies[i].title == input){
        this.requestedMovieId = this.allMovies[i].id
        return true
      }
    }
    return false
  };
  this.searchForMovie = function(data){
    // When a user searches for a movie, if the movie is not already in our database, we'll send a request to our database for the movie and its reviews.  If the movie is not already in our database, a request is made to OMDB.
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
        controller.foundMovieReviews = response.data.reviews;
      }, function(error){
        console.log(error)
      })
    }
  };


  this.getAllApiMovies();
  this.getAllUsers();
}])
