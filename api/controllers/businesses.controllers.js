var mongoose = require('mongoose');
var Business = mongoose.model('Business');

var runGeoQuery =function(req,res){
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	var point = {
		type : "Point",
		coordinates : [lng,lat]
	};

	var geoOptions = {
		spherical : true,
		maxDistance : 10000,
		num : 5
	};

	Business 
		.geoNear(point, geoOptions, function(err, results, stats){
			console.log("Geo stats: ", stats);

			res 
				.status(200)
				.json(results);
		});
};


module.exports.businessesGetAll = function(req, res) {
	var start = 0;
	var number = 0;
	if(req.query && req.query.lng && req.query.lat){
		runGeoQuery(req,res);
		return;
	}

 	if (req.query && req.query.start) {
 		start = parseInt(req.query.start);
 	}
	if (req.query && req.query.number) {
 		number = parseInt(req.query.number);
	}
	if(isNaN(start) || isNaN(number)){
		res
			.status(400)
			.json({"message" : "If supplied query string, start and number should be numeric"});
			return;
	}
	Business
		.find()
		.skip(start)
		.limit(number)
		.exec(function(err, docs) {
			if (err) {
				console.log("Error finding businesses");
				res
				.status(500)
				.json(err)
			}
			else{
				console.log("Retrieved data for "+ docs.length +" businesses");
				res
				.status(200)
				.json(docs);
			}
			
		})
};

module.exports.businessesGetOne = function(req, res) {
	var businessID = req.params.businessID;
    console.log("GET business " + businessID);
	Business
		.findById(businessID)
		.exec(function(err, doc) {
			var response = {
				status : 200,
				message : doc
			}
			if (err) {
				response.status = 500;
				response.message = err
			}else  if (!doc) {
				response.status = 404;
				response.message = { "message":"Business ID not found"};
			}
			res
				.status(response.status)
				.json(response.message);
			});
};

var splitArray = function(input){
	var output;
	if(input && input.length > 0){
		output = input.split(";");
	}else {
		output = [];
	}
}

module.exports.businessesAddOne = function(req, res) {
	
	Business
		.create({
			name : req.body.name,
			starts :parseInt(req.body.stars),
			city : req.body.city,
			review_count: 0,
			categories : splitArray(req.body.categories),
			reviews : [],
			location : {
				address : req.body.address,
				coordinates : [
					parseFloat(req.body.lng),
					parseFloat(req.body.lat),
				]
			}

		}, function(err,newBusiness){
			if(err){
				console.log("Error Creating Business");
				res
					.status(400)
					.json(err);
			} else{
				res
					.status(201)
					.json(newBusiness);
			}
		});
};

module.exports.fixDatabase = function(req, res) {
	var db = dbConnect.get();
	var collection = db.collection('business');
	
	collection
		.find()
		.toArray(function(err, docs) {
			for (var i = 0; i < docs.length; i++) {
				business = docs[i];
				_id = business._id;
				full_address = business.full_address;
				longitude = business.longitude;
				latitude = business.latitude;
				collection.updateOne (
					{ "_id" : _id },
					{ $set : {
						"location" : {
							"address" : full_address,
							"coordinates" : [longitude, latitude ]
						}
					}
				});
		};
		res
			.status(200)
			.json({"Message" : "Database updated"});
 	})
};

module.exports.addReviewIDs = function(req, res) {
	var db = dbConnect.get();
	var collection = db.collection('business');

	collection
		.find()
		.toArray(function(err, docs) {
			for (var i=0; i< docs.length; i++) {
				businessID = docs[i]._id;
				if (docs[i].reviews) {
					reviews  = docs[i].reviews;
					for (var thisReview =0; thisReview< reviews.length; thisReview++ ){ 
						reviewID = reviews[thisReview].review_id;
						collection.update(
							{ "_id" : businessID, "reviews.review_id" : reviewID},
							{ $set : { "reviews.$._id" : ObjectId()
							}}
						);
					}
				}
			}
			res
				.status(200)
				.json( { "Message" : "Review IDs added"});
		})
};

module.exports.fixDatabase = function(req, res) {
	var db = dbConnect.get();
    var collection = db.collection('business');
	
	collection
		.find()
		.toArray(function(err,docs){
			for(var i = 0; i< docs.length ; i++){
				business = docs[i];
				_id = business._id;
				full_address = business.full_address;
				longitude = business.longitude;
				latitude = business.latitude;
				collection.updateOne(
					{"_id" : _id},
					{$set :{
						"location" : {
							"address" : full_address,
							"coordinates" : [longitude,latitude]
						}
					}
				});

			};
			res
				.status(200)
				.json({Message : "Database Updated"});
		})
};

module.exports.businessesUpdateOne = function(req, res) {
	var businessID = req.params.businessID;
    console.log("GET business " + businessID);
	Business
		.findById(businessID)
		.select("-reviews")
		.exec(function(err, doc) {
			var response = {
				status : 200,
				message : doc
			}
			if (err) {
				response.status = 500;
				response.message = err
			}else  if (!doc) {
				response.status = 404;
				response.message = { "message":"Business ID not found"};
			}
			console.log("Found Business "+ businessID);
			if(response.status!= 200){
				res
				.status(response.status)
				.json(response.message);
			} else{
				doc.name = req.body.name;
				doc.starts = parseInt(req.body.stars);
				doc.city = req.body.city;
				doc.categories = splitArray(req.body.categories);
				doc.location = {
					address : req.body.address,
					coordinates : [
						parseFloat(req.body.lng),
						parseFloat(req.body.lat),
					]
				};
				doc.save(function (err, updatedBusiness){
					if(err){
						res
							.status(500)
							.json(err);
					}else{
						res	
							.status(204)
							.json();
					}
				})
			};
			
		});
};

module.exports.businessesDeleteOne = function (req,res) {
		var businessID = req.params.businessID;
		Business
			.findByIdAndRemove(businessID)
			.exec(function (err, thisBusiness) {
				if(err) {
					res
						.status(404)
						.json(err);
				}
				else {
					console.log("Business" + businessID + "deleted");
					res
						.status(204)
						.json();
				}
			})
	};