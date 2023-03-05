const localStrategy = require('passport-local').Strategy;
var profileSchema = require('../models/profileSchema');



async function initialize(passport,getUserById){
    const authenticateUser = async (email,password,done) =>{
        //check email
        console.log('no email');
        await profileSchema.find({email: email})
            .exec()
            .then(user2 => {
                if (user2 == null){
                    //wrong email
                    console.log('no email');
                    return done(null,false,{message : 'No email'})
                }
                try{

                    profileSchema.findOne({$and:[{email: email},{password: password}]})
                    .exec()
                    .then(user => {
                        if (!user){
                            //wrong pass
                            console.log('wrong pass');
                            console.log('here');
                            return done(null,false,{message : 'Wrong Pass'});
                        }
                        //everything good
                        console.log('everything good');
                        const userData  = {
                            email : user.email,
                            userId : user._id,
                            username : user.username,
                            userType : user.userType,
                            dateCreated : user.dateCreated
                        }

                        return done(null,user);
                            })
                
                }catch(e){
                    return done(null,false,{message : e});

                }

});
    }
    
    passport.use(new localStrategy({usernameField: 'email' }, 
    authenticateUser))
    passport.serializeUser((user,done) => {
        console.log('serialize');
        done(null, user.id)
    })
    passport.deserializeUser((id,done) => {
       return done(null, getUserById(id))
    }) 
}

module.exports =  initialize