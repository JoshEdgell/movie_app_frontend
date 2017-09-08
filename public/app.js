const app = angular.module('movies', []);

app.controller('MainController', ['$http', function($http){
  const controller = this;
  this.foundMovie = {};
  this.newMovie = {}
  this.searchByTitle = function(data){
    data = data.replace(' ', '+');
    $http({
      method: 'get',
      url: 'http://www.omdbapi.com/?t=' + data + '&apikey=bea723f3'
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
  );
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
  }
  }
}])
