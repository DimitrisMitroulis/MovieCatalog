var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MovieSchema = require('../models/movieSchema');
var profileSchema = require('../models/profileSchema');
const url = require('url');
const movieRoutes = require('../routes/search-movies');


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
        MovieSchema.findById("64007be418f30d1eb80d6548").then((movie) => {
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
        const m = new MovieSchema({
            title : 'Movie1',
            year : 2000,
            genres : ["Drama" , "Comedy"],
            director : 'no',
            actors : [
                    "Biggus dickus" ,
                    "Morgan Freeman" ,
                    "Bob Gunton"
                    ],
            plot : 'another',
            poster : 'anotherimage.jpg',
            rating : 1,
            trailer : "link",
            comments : [
                {
                Name: "Name1",
                text: "bad",
                rating : 1,
                PersonId: "aaskjdabsdkjabsd"
                },
                {
                Name: "Namee",
                text: "i liked it",
                rating : 1,
                PersonId: "asdasdasda"
                },
            ],
            nowPlaying:true
});


        var schema = MovieSchema(m).save(function(err,data){
            st = true;
            if (err) {
                st = false;
                res.render('add-movie',{st:st});
                throw err;
            }
            res.render('add-movie',{st:st});
        });
    });

    app.get('/add-person/',function(req,res){
        const member = new profileSchema({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            username: 'johndoe',
            favourites:[
                        {
                            movieID: "1231askdn",
                        },
                        {
                            movieID: "asdaasd",
                        }],
            UserType: 'Admin'
        });     
        

        var schema = profileSchema(member).save(function(err,data){
            st = true;
            if (err) {
                st = false;
                throw err;
            }
            res.render('add-person',{st:st});
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
        //req.get('referer')
        MovieSchema.updateOne({ _id:req.body.movieId },{$push:{comments:{
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
                    res.redirect(req.get('referer'));
                }
        });

        
        
        
    });

    app.get(('/error-page'),function(req,res){
        res.render('error-page');

    });

    app.get("/search", async (req, res) => {
        try {
            const page = parseInt(req.query.page) - 1 || 0;
            const limit = parseInt(req.query.limit) || 5;
            const search = req.query.search || "";
            let sort = req.query.sort || "rating";
            let genres = req.query.genres || "All";
            const genresOptions = [
                "Action",
                "Romance",
                "Fantasy",
                "Drama",
                "Crime",
                "Adventure",
                "Thriller",
                "Sci-fi",
                "Music",
                "Family",
            ];

            genres === "All"
                    ? (genres = [...genresOptions])
                    : (genres = req.query.genres.split(","));
                req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

                let sortBy = {};
                if (sort[1]) {
                    sortBy[sort[0]] = sort[1];
                } else {
                    sortBy[sort[0]] = "asc";
                }

            const movies = await MovieSchema.find({ title: { $regex: search, $options: "i" } })
                    .where("genres")
                    .in([...genres])
                    .sort(sortBy)
                    .skip(0)
                    .limit(limit);

                const total = await MovieSchema.countDocuments({
                    genres: { $in: [...genres] },
                    name: { $regex: search, $options: "i" },
                });


                const response = {
                    error: false,
                    total : total,
                    page: page + 1,
                    limit,
                    genress: genresOptions,
                    movies: movies
                };

                //res.status(200).json(response);
                res.render('searchPage',{res:response});
            
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: true, message: "Internal Server Error" });
        }
    });

    app.post('/search', async function(req,res){
        try {
            let payload = req.body.payload.trim();
            
            let search = await MovieSchema.find({ title: { $regex: new RegExp('^'+payload+'.*','i')}}).exec();
            search = search.slice(0,10);
            res.send({payload: search});
               
            
        } catch (err) {
            res.status(500).json({ error: true, message: "Internal Server Error" });
        }
    });
};  







//returns if movie is in person's favourite List
function isFavourite() {   
    return true;
}


function lastPart(req) {
    const parsedUrl = url.parse(req.get('referer'));
    // get the last part of the path
    const parts = parsedUrl.pathname.split('/');
    return parts[parts.length - 1];

}
