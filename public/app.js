const app = angular.module('movies', []);

app.controller('MainController', ['$http', function($http){
  const controller = this;
  this.url = 'https://moviereviewerbackend.herokuapp.com/';
  // this.url = 'http://localhost:3000/';
  this.allMovies = [];
  this.newUser = {};
  this.user = {};
  this.allUsers = [];
  this.allReviews = [];
  this.fiveMostRecentMovies = [];
  this.searchResults = [];
  this.currentMovie = {};
  this.currentReview = {};
  this.targetUser = {};
  this.targetUserReviews = [];
  this.newReviewText = '';
  this.requestedMovieId = 0;
  // Center Div Displays
  this.displaySearchForm = true;
  this.displaySearchResults = false;
  this.displaySingleMovie = false;
  this.displayReviewEdit = false;
  this.displayIndividualPage = false;
  // Right Div Displays
  this.displayLogin = true;
  this.displayRegistration = false;
  this.displayLogOut = false;
  this.hideAllCenterDivs = function(){
    this.displaySearchResults = false;
    this.displaySingleMovie = false;
    this.displaySearchForm = false;
    this.displayReviewEdit = false;
    this.displayIndividualPage = false;
  };
  this.hideAllLogin = function(){
    this.displayLogin = false;
    this.displayRegistration = false;
    this.displayLogOut = false;
  }
  this.getAllApiMovies = function(){
    // Return the data for all of the movies in our database
    $http({
      method: 'get',
      url: this.url + 'movies'
    }).then(function(response){
      controller.allMovies = response.data;
      controller.getFiveMostRecent();
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
      url: 'https://www.omdbapi.com/?s=' + data + '&apikey=68da6914'
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
        controller.reverseReviewOrder(controller.currentMovie.reviews);
        controller.displaySingleMovie = true;
      }, function(error){
        console.log(error);
      })
    } else {
      // If the movie is not in our database, send a request to OMDB to get the movie's data and put the relevant data into the controller's currentMovie object.
      $http({
        method: 'get',
        url: 'https://www.omdbapi.com/?i=' + imdbid + '&apikey=68da6914'
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
      controller.getAllApiMovies();
      controller.hideAllCenterDivs();
      controller.displaySearchForm = true;
    }, function(error){
      console.log(error)
    })
  };
  this.getFiveMostRecent = function(){
    this.fiveMostRecentMovies = [];
    for (let i = 0; i < 5; i++){
      this.fiveMostRecentMovies.push(this.allMovies[this.allMovies.length - (i + 1)]);
    }
  };
  this.addReviewToMovie = function(imdbid){
    //First, check to see if the movie exists in our database.
    //If the movie is in our database, post the review to the reviews table (linked to the current movie)
    //If the movie is not in our database, add the movie to the database, then add the review to the newly-created movie.
    if (this.checkMovieList(imdbid) == true) {
      $http({
        method: 'post',
        url: this.url + 'reviews',
        data: {
          user_id: this.user.id,
          movie_id: this.currentMovie.id,
          review_text: this.newReviewText
        }
      }).then(function(response){
        controller.getAllApiMovies();
        controller.hideAllCenterDivs();
        controller.getUserList();
        controller.newReviewText = '';
        controller.displaySearchForm = true;
      }, function(error){
        console.log(error, 'error from add review to existing movie')
      })
    } else {
      $http({
        method: 'post',
        url: this.url + 'movies',
        data: this.currentMovie
      }).then(function(response){
        controller.currentMovie.id = response.data.id;
          $http({
            method: 'post',
            url: controller.url + 'reviews',
            data: {
              user_id: controller.user.id,
              movie_id: controller.currentMovie.id,
              review_text: controller.newReviewText
            }
          })
        }).then(function(response){
          controller.newReviewText = '';
          controller.getAllApiMovies();
          controller.hideAllCenterDivs();
          controller.getUserList();
          controller.displaySearchForm = true;
        },function(error){
          console.log(error, 'error from adding review to new movie');
        })
      }
    };
  this.deleteReview = function(id){
    $http({
      method: 'delete',
      url: this.url + 'reviews/' + id
    }).then(function(response){
      controller.hideAllCenterDivs();
      controller.displaySearchForm = true;
    }, function(error){
      console.log(error, 'error from delete route');
    })
  };
  this.reverseReviewOrder = function(array){
    newArray = [];
    for (let i = array.length - 1; i >= 0; i--){
      newArray.push(array[i]);
    }
    this.currentMovie.reviews = newArray;
  };
  this.editReview = function(id){
    $http({
      method: 'get',
      url: this.url + 'reviews/' + id
    }).then(function(response){
      controller.currentReview = response.data;
      controller.hideAllCenterDivs();
      controller.displayReviewEdit = true;
    }, function(error){
      console.log(error,'review error')
    })
  };
  this.publishReviewEdit = function(){
    $http({
      method: 'put',
      url: this.url + 'reviews/' + this.currentReview.id,
      data: this.currentReview
    }).then(function(response){
      controller.hideAllCenterDivs();
      controller.displaySearchForm = true;
    }, function(error){
      console.log(error, 'error from review edit');
    })
  };
  this.displayRegistrationDiv = function(){
    this.displayRegistration = true;
    this.displayLogin = false;
  };


  this.returnToSearch = function(){
    controller.hideAllCenterDivs();

    this.displaySearchForm = true;
  };
  this.getUserList = function(){
    $http({
      method: 'get',
      url: this.url + 'reviews'
    }).then(function(response){
      array = response.data;
      controller.allReviews = response.data;
      // The next two lines of code were adapted from a search on stackoverflow.
      // https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
      //sort through the response array and return
      let ids = array.map(function(obj) {return obj.user_id});
      ids = ids.filter(function(i,j) { return ids.indexOf(i) == j});
      for (let i = 0; i < array.length; i++) {
        for (let j=0; j < ids.length; j++) {
          if (array[i].user_id == ids[j]) {
            controller.allUsers[j] = array[i].user
          }
        }
      }
    },function(error){
      console.log(error)
    })
  };
  this.getTargetUserReviews = function(user_id){
    for (let i = 0; i < this.allReviews.length; i++) {
      if (this.allReviews[i].user_id == user_id) {
        this.targetUserReviews.push(this.allReviews[i]);
      }
    }
  };
  this.setTargetUser = function(user_id){
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.allUsers[i].id == user_id) {
        this.targetUser = this.allUsers[i];
      }
    }
  };
  this.displayUserPage = function(user_id){
    this.targetUserReviews = [];
    this.targetUser = {};
    this.getTargetUserReviews(user_id);
    this.setTargetUser(user_id);
    this.hideAllCenterDivs();
    this.displayIndividualPage = true;


  };




// ============LOGIN METHODS BELOW=========

//user account create///
   this.CreateUser = function(userPass) {
     this.displayLogout = true;
    //  console.log('creating user');
     $http({
       method: 'POST',
       url: this.url + 'users',
       data: { user: { username: userPass.username, password: userPass.password, first_name: userPass.first_name, last_name: userPass.last_name, age: userPass.age, gender: userPass.gender }},
     }).then(function(response) {
       controller.user = response.data;
      //  console.log(controller.user,'logged user');
       controller.hideAllLogin();
       controller.displayLogOut = true;

     })
   };

// /user login///

this.login = function(userPass) {
//      console.log('login user');
// console.log(userPass);

$http({

  method: 'POST',
  url: this.url + 'users/login',
  data: { user: { username: userPass.username, password: userPass.password }},
}).then(function(response) {
  // console.log(response);
  // console.log('response on login');
  controller.user = response.data.user;
  // console.log(controller.user,'logged user')
  localStorage.setItem('token', JSON.stringify(response.data.token));
  controller.hideAllLogin();
  controller.displayLogOut = true;
}, function(error){
  console.log('I skipped the response')
});
// }
};


// ===test method below. may want to disable once login tests sucessful===
// this.getUsers = function() {
//   $http({
//     url: this.url + '/users',
//     method: 'GET',
//     headers: {
//       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
//     }
//   }).then(function(response) {
//     console.log(response);
//     if (response.data.status == 401) {
//         this.error = "Unauthorized";
//     } else {
//       controller.users = response.data;
//     }
//   });
// }

//logout //

this.logout = function() {
  // console.log('logout');
localStorage.clear('token');
location.reload();
this.hideAllLogin();
this.displayLogin = true;
};

// ============END LOGIN METHODS=========


this.getAllApiMovies();
this.getUserList();
}])
