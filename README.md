MOVIEReviewr - A place to search, review, and recommend awesome movies.
https://moviereviewr.herokuapp.com/

Github:
Frontend: https://github.com/JoshEdgell/movie_app_frontend
Backend: https://github.com/JoshEdgell/movie_app_api

Collaborators:
Rick Neely
Josh Edgell


Technologies Used -----------------------------------------
MovieReviewr was built with both a front end and a backend.  The backend database was built using rails.  Since our intent was to provide users an opportunity to write reviews on movies, we created tables with multiple attributes for both users and movies.  The focus of MovieReviewr is for users to write reviews, so we created a table to relate the text of a review to both the user and the movie to which the review belongs.  For user authentication, we used Javascript Web Tokens.  The frontend app was built using Angular with a focus on single-page use.  The app's controller calls users, reviews, and movies from the backend, as well as from the Open Movie Database API.


Approach -----------------------------------------
We built the basic framework of the backend server together.  Since user authentication was a goal we both had from the beginning, Rick took on the challenge of learning, implementing, coding, and testing that aspect of the application.  Josh got to work on setting up the angular frontend and managing the controller. After each partner had handled his share, we got back together to discuss the existing functions of the application and styling goals.  From there, we each worked on goals one at a time until testing and review for bugs.

Unsolved Problems -----------------------------------------
In the future, we would like to add the ability for users to favorite their movies.  A stretch goal that might involve a fair amount of other coding and data manipulation would be to connect users to one another based on favorite movie preferences, and to recommend movies to users based on their favorites.

Future Notes -----------------------------------------
