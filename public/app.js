const app = angular.module('movies', []);

app.controller('MainController', ['$http', function($http){
  const controller = this;
  this.url = 'http://localhost:3000/';
  this.allMovies = [];
  // =====INSERT===
  this.user = {};
  // =====INSERT===
  this.allUsers = [];
  this.searchResults = [];
  this.currentMovie = {};
  this.requestedMovieId = 0;
  this.displaySearchResults = false;
  this.displaySingleMovie = false;
  this.hideAllCenterDivs = function(){
    this.displaySearchResults = false;
    this.displaySingleMovie = false;
  };
  this.getAllApiMovies = function(){
    // Return the data for all of the movies in our database
    $http({
      method: 'get',
      url: this.url + 'movies'
    }).then(function(response){
      controller.allMovies = response.data;
    })
  };
  this.getAllUsers = function(){
    // Returns an array of all of the users in our database (sans passwords);
    $http({
      method: 'get',
      url: this.url + 'users'
    }).then(function(response){
      response.data.forEach(function(a){delete a.password});
      controller.allUsers = response.data;
    }, function(error){
      console.log(error, 'getAllUsers')
    })
  };
  this.checkMovieList = function(input){
      // Check the name of a movie to see if it's in our database - returns 'false' if not, returns movie_id if it is in the database
    for (let i = 0; i < this.allMovies.length; i++){
      if (this.allMovies[i].imdbid == input){
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
  this.selectMovieToAddReview = function(imdbid){
    //When a user clicks on a found movie poster, this function will use the movie's imdbID to find it either in our database or in OMDB's.  It'll set all other center divs to false and display the addReviewToMovie div.
    if(this.checkMovieList(imdbid) == true){
      // If the movie is already in our database, send a request to our database to get the movie's data into the controller's currentMovie object.
      let id = 0;
      for (let i = 0; i < this.allMovies.length; i++){
        if (this.allMovies[i].imdbid === imdbid){
          id = this.allMovies[i].id
        }
      }
      $http({
        method: 'get',
        url: this.url + 'movies/' + id
      }).then(function(response){
        controller.currentMovie = response.data;
        controller.hideAllCenterDivs();
        controller.displaySingleMovie = true;
      }, function(error){
        console.log(error);
      })
    } else {
      // If the movie is not in our database, send a request to OMDB to get the movie's data and put the relevant data into the controller's currentMovie object.
      $http({
        method: 'get',
        url: 'http://www.omdbapi.com/?i=' + imdbid + '&apikey=68da6914'
      }).then(function(response){
        controller.currentMovie.title = response.data.Title;
        controller.currentMovie.rating = response.data.Rated;
        controller.currentMovie.genre = response.data.Genre;
        controller.currentMovie.year_released = response.data.Year;
        controller.currentMovie.director = response.data.Director;
        controller.currentMovie.actors = response.data.Actors;
        controller.currentMovie.poster = response.data.Poster;
        controller.currentMovie.plot = response.data.Plot;
        controller.currentMovie.rotten_tomatoes_score = response.data.Ratings[1].Value;
        // console.log(response.data.imdbID, 'imdbID');
        controller.currentMovie.imdbid = response.data.imdbID;
        controller.hideAllCenterDivs();
        controller.displaySingleMovie = true;
      }, function(error){
        console.log(error);
      })
    }
  };
  this.addMovieToDatabase = function(){
    this.hideAllCenterDivs();
    $http({
      method: 'post',
      url: this.url + 'movies',
      data: this.currentMovie
    }).then(function(response){
      console.log(response, 'response after add movie')
    }, function(error){
      console.log(error)
    })
  };

  this.getAllApiMovies();
  this.getAllUsers();

// ============LOGIN METHODS BELOW=========

//user account create///
   this.CreateUser = function(userPass) {
     $http({
       url: this.url + '/users',
       method: 'POST',
       data: { user: { username: userPass.username, password: userPass.password }},
     }).then(function(response) {
       console.log(response);
       this.user = response.data.user;
     })
   }

// /user login///

this.login = function(userPass) {
console.log(userPass);

$http({
  method: 'POST',
  url: this.url + '/users/login',
  data: { user: { username: userPass.username, password: userPass.password }},
}).then(function(response) {
  console.log(response);
  this.user = response.data.user;
  localStorage.setItem('token', JSON.stringify(response.data.token));
}.bind(this));
// }
}


// ===test method below. may want to disable once login tests sucessful===
this.getUsers = function() {
  $http({
    url: this.url + '/users',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
    }
  }).then(function(response) {
    console.log(response);
    if (response.data.status == 401) {
        this.error = "Unauthorized";
    } else {
      this.users = response.data;
    }
  }.bind(this));
}

//logout //

this.logout = function() {
localStorage.clear('token');
location.reload();
}

// ============END LOGIN METHODS=========

}])
