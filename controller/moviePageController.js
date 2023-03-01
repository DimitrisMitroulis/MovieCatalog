var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MovieSchema = require('./movieSchema');
const url = require('url');


module.exports = function(app){
    var urlencodedParser = bodyParser.urlencoded({extended:false});

    const uri = 'mongodb+srv://user1:user1@moviecatalog.vyyguoc.mongodb.net/TodoList?retryWrites=true&w=majority';
    mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(7000),
                    console.log('connected to db'))
    .catch((err) => console.error(err));



    app.get('/movie/:id', function(req,res){ 
                
        console.log(req.params.id);
        MovieSchema.findById(req.params.id).then((movie) => {
                if(!movie){
                    console.log('movie not found');
                    res.render('error-page');    
                    
                }
                
                res.render('moviePage',{movieId:req.params.id, data:movie });
            
            }).catch((error) => {
                var error = new Error('Resource not found');
                error.status = 404;
                res.render('error-page');    
                // Pass the error to the next function
                console.log(error);      
                
            })
        
    });
    

    app.get('/ejs/:name',function(req,res){
        var data = {name : 'json', age : 23, hobbie: ['1','2','3']};
        res.render('profile', {person : req.params.name, data:data});
    });

    app.get('/test/:id',function(req,res){
        MovieSchema.findById("63fcfbbcf8edb1319c569cf9").then((movie) => {
            if(!movie){
                console.log('some rror');
                return res.status(404).send();
            }
            res.render('test-search',{movieId:req.params.id, data:movie });
            
            }).catch((error) => {
                console.log(error);      
            })
    });

    app.get('/add-movie/',function(req,res){
        const m = new MovieSchema;
        m.title = 'title2';
        m.year = 20012310;
        m.genres = ["Drama" , "Comedy"];
        m.director = 'no';
        m.actors = [
            "Biggus dickus",
            "Morgan Freeman",
            "Bob Gunton"
        ];
        m.plot = 'some plot';
        m.poster = 'anotherimage.jpg';
        m.ratings = [
                        {
                            "source": "mad it up",
                            "value": "1/10"
                        },
                        {
                            "source": "Rotten Tomatoes",
                            "value": "123%"
                        }
                    ];
        m.trailer = "link";
        m.comments = [
            {
            "Name": "Deez nuts",
            "text": "good",
            "rating" : 1,
            "PersonId": "aaskjdabsdkjabsd"
            },
            {
            "Name": "Person 2",
            "text": "bad",
            "rating" : 1,
            "PersonId": "asdasdasda"
            },
        ]

        var schema = MovieSchema(m).save(function(err,data){
            st = true;
            if (err) {
                throw err;
                st = false;
            }
            res.render('add-movie',{st:st});
        });
    });

    app.get('/test-comment/:id',function(req,res){
        
    //ads on comment to object with id 
    MovieSchema.updateOne({ _id: req.params.id },{$push:{comments:{
        "Name": "Name2",
        "text": "comm2",
        "rating" : 1,
        "PersonId": "asdasdasda"
        }}}
        , { new: true }
        , function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                res.render('add-comment',{st:docs});
            }
    });

    });

    app.post('/addComment',function(req,res){



       
        
        const parsedUrl = url.parse(req.get('referer'));

        // get the last part of the path
        const parts = parsedUrl.pathname.split('/');
        const movieId = parts[parts.length - 1];

        MovieSchema.updateOne({ _id:movieId },{$push:{comments:{
            "Name": req.body.Name,
            "text": req.body.text,
            "rating" : req.body.rating1,
            "PersonId": req.body.PersonId
            }}}
            , { new: true }
            , function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    //res.render('add-comment',{st:docs});
                    console.log('here '+movieId);
                    res.redirect(req.get('referer'));
                }
        });

        
        
        
    });

};  


//returns current ulr
function fullUrl(req) {
    return url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.originalUrl
    });
}
