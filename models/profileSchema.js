var mongoose = require('mongoose');



var profileSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: false
      },
      username: {
        type: String,
        required: true,
        unique: false
      },
      dateCreated: {
        type: Date,
        default: Date.now
      },
      favourites: [
        {
            movieID: {
                type:String,
                required : true
            },
            dateCreated: {
                type: Date,
                default: Date.now
            }
        }
      ],
      UserType:{
        type: String,
        required: true
      }   
    });

const Person = mongoose.model('Members', profileSchema);
const member = new Person({
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

// name of table, schema name
module.exports = mongoose.model("Members",profileSchema)