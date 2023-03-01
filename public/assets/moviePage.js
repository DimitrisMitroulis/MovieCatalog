$(document).ready(function() {
    let result = document.getElementById("result");
    $('#commentButton').on('click', function() {
        // Get the value of the name input field
        const comment = $('#name').val();
        //Send an AJAX request to insert the data to MongoDB

        if (comment.length <= 0) {
            result.innerHTML = `<h3 class="msg">Please Enter a comment</h3>`;
          }else{
            $.ajax({
                url: '/addComment',
                method: 'POST',
                data:{  Name: "Name2",
                        text: comment,
                        rating : 1,
                        PersonId: "asdasdasda"
                    },  
                success: function(response) {
                    //this does get reached, prob after handling post request
                    console.log('before_reload');
                    location.reload();
                },
                error: function(error) {
                    result.innerHTML = `<h3 class="msg">There has been an error</h3>`;
                    console.log(error);
                    }
                });
            }
    });
    
});