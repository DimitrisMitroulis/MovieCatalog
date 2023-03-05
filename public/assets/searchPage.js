const APIKEY = 'api_key=132908b07cbc33575b9983cfc84f9178';
const BASE_URL = 'https://api.themoviedb.org/3/';
const DISCOVER_URL = BASE_URL + 'discover/movie?sort_by=popularity.desc&'+ APIKEY;
var SEARCH_URL =  BASE_URL + 'search/movie?'+ APIKEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500'
const NOW_PLAYING_URL = BASE_URL+'movie/now_playing?'+ APIKEY;

var TMDB_URL;

$(document).ready(function() {

    const movieName = document.getElementById('movie-name');
    const searchResults = document.getElementById('searchResults');

    
    window.onload = function() {
        getMovies(DISCOVER_URL);
      };
      
    

    //on enter press, send get request to the same page with search term
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            var genre = document.querySelector("#genre").value;
            var orderBy = document.querySelector("#order-by").value;
            var AscDesc = document.querySelector("#ascdesc").value;
            var playingStatus = document.querySelector("#playingStatus").value;
            

            var MyUrl = 'http://localhost:7000/api/search?search='+movieName.value;
            MyUrl += '&genres='+genre;
            MyUrl += '&sort='+orderBy;
            MyUrl += '&ascdesc='+AscDesc;
            MyUrl += '&playingNow='+playingStatus;


            SEARCH_URL += '&query='+movieName.value;
            
            (playingStatus == "true")
                ? TMDB_URL = NOW_PLAYING_URL
                : TMDB_URL = SEARCH_URL;

            

            //set asc desc option according to field
            // var discover = BASE_URL+ 'discover/movie?sort_by='
            // +(order)
            // +'.'
            // +(AscDesc === "-1") ?'desc' : 'asc'
           
            if(movieName.value === ""){
                getMyMovies(MyUrl);  
                getMovies(DISCOVER_URL);
         
            }else{

                getMyMovies(MyUrl);  
                getMovies(TMDB_URL);
                
                
                //getMovies(SEARCH_URL);
            
                //var e = document.getElementById("movie-name");
                //   fetch(`/search?search=${e.value.toString()}`)
                //   .then(response => {
                //     if (response.ok) {
                        
                //         //window.location.href = response.url;
                //     }
                //   })
                }
            }
      });
    

    function getMyMovies(url){
        fetch(url).then(res => res.json()).then(data => {
            showMyMovies(data.movies)
        })
    }

    function getMovies(url){
        fetch(url).then(res => res.json()).then(data => {
            showMovies(data.results)
        })
    }

    function showMovies(data){
       //get main elemet and clear it
        const main = document.getElementById('APImovies');
        main.innerHtml = '';
        main.textContent = '';

        

        
        //filter movies based from search term
        var res = data.filter(movie => movie.title.toLowerCase().includes(movieName.value.toLowerCase()));
       
        //show every retrieved movie
        res.forEach(movie => {
            const {title, poster_path, vote_average,overview} = movie;
            const movieEl = document.createElement('APImovies');
            const html= `<hr class='solid'>
                <div class='movie-block'>
                    <div class='movie-info'>
                    <img src='${IMG_URL+poster_path}' alt='${title}'>
                    <h3 class='movie-title'>${title}</h3>
                    <p class='movie-description'>${overview}</p>
                    <p style=color:${getColor(vote_average)} class='movie-rating'>Rating: ${vote_average}/10</p>
                    </div>
                </div>`;

            movieEl.innerHTML += html;
            main.appendChild(movieEl);
        })
    }

    function showMyMovies(data){
        //get main elemet and clear it
         const main = document.getElementById('MYmovies');
         main.innerHtml = '';
         main.textContent = '';
 
         //show every retrieved movie
         data.forEach(movie => {
            const {title, poster_path, rating,plot} = movie;
             const movieEl = document.createElement('MYmovies');
             const html= `<hr class='solid'>
                 <div class='movie-block'>
                     <div class='movie-info'>
                     <img src='${IMG_URL+poster_path}' alt='${title}'>
                     <h3 class='movie-title'>${title}</h3>
                     <p class='movie-description'>${plot}</p>
                     <p style=color:${getColor(rating)} class='movie-rating'>Rating: ${rating}/10</p>
                     </div>
                 </div>`;
 
             movieEl.innerHTML += html;
             main.appendChild(movieEl);
         })
     }
 


    function getColor(vote){
        if(vote>=8){
            return 'green';
        
        }else if(vote>=5){
            return 'orange';

        }else{
            return 'red';
        }
    }
});

//on button press update dropdown list
function sendData(e) {
    fetch('/search',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({payload:e.value})
      }).then(res => res.json()).then(data => {
        //fetch results from database
        let payload = data.payload;
        searchResults.innerHTML = '';
        if(payload.length < 1 ){
            searchResults.innerHTML = '<p>Nothing Found</p>';
            return;
        }else{
            payload.forEach((item,index)=>{
                if(index>0) searchResults.innerHTML += '<hr>';
                searchResults.innerHTML += `<p>${item.title}</p>`;
            });
            return;
        }
  })



 
}


    
