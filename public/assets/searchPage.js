$(document).ready(function() {

    $('#movie-name').on('keydown', function(event) {
        
      });

    $('#search-btn').click(function(event) {
        //const search = $('#movie-name').val();
        //sendData(search);
    });

});

function sendData(e){
    fetch('search',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({payload:e.value})
        }).then(res => res.json()).then(data => {
        return data.payload;
      //console.log('payload: '+payload[0].title);

  })
  }

function search(event) {
    if (event.keyCode === 13) {
        event.stopImmediatePropagation();
        const search = $('#movie-name').val();
        const limit = 5;
        const page = 0;
        let sort = "rating";
        let genres =  "All";

        $.ajax({
            url: "/search",
            data: { 
                page:page, 
                limit:limit,
                search:search, 
                sort:sort, 
                genres:genres, 

            },
            method: "POST",
            success: function(response) {
                console.log('reload');
            },
            error: function(xhr) {
                console.log('error');
            }
        });
    }
  }