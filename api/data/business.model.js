
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var votesSchema = new Schema ({
    funny : Number,
    useful : Number,
    cool : Number
});

var reviewSchema = new Schema ({
    username : String,
    votes : votesSchema,
    text : String,
    stars : Number,
    date :{
        type : Date,
        default : Date.now
    }
});

var businessSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    stars : {
        type : Number,
        min : 0,
        max : 5,
        default : 0
    },
    city : String,
    review_count : Number,
    categories : [String],
    reviews: [reviewSchema],
    location :{
        address : String,
        coordinates :{
            type: [Number],
            index : '2dsphere'
        }
    }
        
});

mongoose.model('Business', businessSchema, 'business');