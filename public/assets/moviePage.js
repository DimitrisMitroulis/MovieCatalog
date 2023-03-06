var isFav;
var auth;
$(document).ready(function() {
    var movie_id = document.getElementById("movie_id");
    
    window.onload = function() {
        isFavourite(movie_id);
        
    };
    

}); 

var favButton = document.getElementById("favButton");
favButton.addEventListener('click', () => {
    changeFavStatus(favButton.innerHTML)
  });


function isFavourite(movie_id){
    fetch('http://localhost:7000/isFavourite?mov_id='+movie_id.value).then(res => res.json()).then(data => {
        console.log(data);
        if(data.isFavourite){
            changeButtonText();
        }


    });
}


function changeFavStatus(favButtonValue){
    //var favButton = document.getElementById("favButton");
    if(favButtonValue ==="Add to Favorites"){
        var url = 'http://localhost:7000/addToFavourites?mov_id='+movie_id.value;     
    } else{
        var url = 'http://localhost:7000/removeFromFavourites?mov_id='+movie_id.value; 
    }

    fetch(url).then(res => res.json()).then(data => {
        if(data.updated===true){
            changeButtonText();
        }else if(data.authenticated == false){
            //console.log('You need to sign in to add to your favourites!');
            alert('You need to sign in to add to your favourites!');
        }
        
    });
    



}


function changeButtonText(){
    var favButton = document.getElementById("favButton");
    if(favButton.innerHTML === "Add to Favorites"){
        favButton.innerHTML = "Remove from Favourites";
    }else {
        favButton.innerHTML = "Add to Favorites";
    }
}


// 
//     let result = document.getElementById("result");

    
//     });
    
//     $('#commentButton').on('click', function() {
//         // Get the value of the name input field
//         const comment = $('#name').val();
//         //Send an AJAX request to insert the data to MongoDB

//         if (comment.length <= 0) {
//             result.innerHTML = `<h3 class="msg">Please Enter a comment</h3>`;
//           }else{
 
//             // get the last part of the path
//             const parts = window.location.href.split("/");
//             const movieId = parts.pop();

//             // $.ajax({
//             //     url: '/addComment',
//             //     method: 'POST',
//             //     data:{  movieId : movieId,
//             //             text: comment,
//             //             rating : 1,
//             //         },  
//             //     success: function(response) {
//             //         //this does get reached, prob after handling post request
//             //         console.log('before_reload');
//             //         location.reload();
//             //     },
//             //     error: function(error) {
//             //         result.innerHTML = `<h3 class="msg">There has been an error</h3>`;
//             //         console.log(error);
//             //         }
//             //     });
//             }
//     });
    
// 