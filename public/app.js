const app = angular.module('movies', []);

app.controller('MainController', ['$http', function($http){
  const controller = this;
  this.allMovies = [];
  this.allUsers = [];
  this.searchResults = [];
  this.currentMovie = {};
  this.requestedMovieId = 0;
  this.displaySearchResults = false;
  this.displayAddReviewToMovie = false;
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
    }, function(error){
      console.log(error, 'getAllUsers')
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
  this.searchAllNames = function(data){
    data = data.replace(' ', '+');
    $http({
      method: 'get',
      url: 'http://www.omdbapi.com/?s=' + data + '&apikey=68da6914'
    }).then(function(response){
      controller.displaySearchResults = true;
      controller.searchResults = response.data.Search;
    }, function(error){
      console.log(error, 'searchAllNames');
    })
  };
  this.selectMovieToAddReview = function(imdb_id){
    //When a user clicks on a found movie poster, this function will use the movie's imdbID to find it either in our database or in OMDB's.  It'll set all other center divs to false and display the addReviewToMovie div.
    if(this.checkMovieList(imdb_id) == true){
      console.log('in database');
      // If the movie is already in our database, send a request to our database to get the movie's data into the controller's currentMovie object.
    } else {
      // If the movie is not in our database, send a request to OMDB to get the movie's data and put the relevant data into the controller's currentMovie object.
      $http({
        method: 'get',
        url: 'http://www.omdbapi.com/?i=' + imdb_id + '&apikey=68da6914'
      }).then(function(response){
        console.log(response.data);
        controller.currentMovie.title = response.data.Title;
        controller.currentMovie.rating = response.data.Rated;
        controller.currentMovie.genre = response.data.Genre;
        controller.currentMovie.year_released = response.data.Year;
        controller.currentMovie.director = response.data.Director;
        controller.currentMovie.actors = response.data.Actors;
        controller.currentMovie.poster = response.data.Poster;
        controller.currentMovie.plot = response.data.Plot;
        controller.currentMovie.rotten_tomatoes_score = response.data.Ratings[1].Value;
        controller.currentMovie.imdb_id = response.data.imdbID;
        console.log(controller.currentMovie, "current movie")
      }, function(error){
        console.log(error);
      })
    }
  };




  this.getAllApiMovies();
  this.getAllUsers();
}])
