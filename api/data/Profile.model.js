
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var votesSchema = new Schema ({
    endorsed_by : Number,
    followed_by : Number,
    follows : Number
});

var reviewSchema = new Schema ({
    username : String,
    text : String,
    stars : Number,
    date :{
        type : Date,
        default : Date.now
    }
});
var ProfcardSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    username: {
        type : String,
        required : true
    },

    avatar: {
        type : String,
        required : true
    },
    email:  {
        type : String,
        required : true
    },
    dob: String,
    phone: String,
    address: {
        street: String,
        suite: String,
        city: String,
        zipcode: Number,
        geo: {
            lat: String,
            lng: String
        }
    },
    website: String,
    company: {
        name: String,
        catchPhrase: String,
        bs: String
    }
});

var ProfileSchema = new Schema({
    ProfileCard : ProfcardSchema,
    Skills : String,
    Finance : String,
    reviews : [reviewSchema],
    votes : votesSchema
});

mongoose.model('Profile', ProfileSchema, 'Profile');