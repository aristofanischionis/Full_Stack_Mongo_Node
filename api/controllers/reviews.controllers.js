var mongoose = require('mongoose');
var Business = mongoose.model('Business');

module.exports.reviewsGetAll = function(req,res){
    var businessID = req.params.businessID;
    console.log("GET reviews for business " + businessID);
	Business
        .findById(businessID)
        .select("reviews")
		.exec(function(err, doc) {
			var response ={
				status : 200,
				message : []
			};
			if(err){
				console.log("Error finding Business "+ businessID);
				response.status = 500;
				response.message = err;
			}else if(!doc){
				console.log("Error finding Business "+ businessID);
				response.status = 404;
				response.message = {"message" : "Business ID not found " + businessID};
			}else{
				response.message = doc.reviews ? doc.reviews : [];
			}
			console.log("Found Business " + businessID);
			res
				.status(200)
				.json(doc.reviews);
		});	
};

module.exports.reviewsGetOne = function(req,res){
    var businessID = req.params.businessID;
    var reviewID = req.params.reviewID;
    console.log("GET reviews for business " + businessID);
	Business
        .findById(businessID)
        .select("reviews")
		.exec(function(err, doc) {
            var review = doc.reviews.id(reviewID);
			console.log("Found review " + reviewID);
			res
				.status(200)
				.json(reviews);
		});	
};

var addReview = function(req,res, thisBusiness){
	thisBusiness.reviews.push({
		username : req.body.username,
		votes : {"funny" : 0 ,"useful" : 0, "cool" : 0},
		text : req.body.text,
		stars:parseInt( req.body.stars)
	});
	thisBusiness.save(function(err, updatedBusiness){
		var newReviewPosiiton = updatedBusiness.reviews.length -1;
		var newReview = updatedBusiness.reviews[newReviewPosiiton];
		if(err){
			res 
				.status(500)
				.json(err);
		}
		else{
			res
				.status(201)
				.json(newReview);
		};
	});
};

module.exports.reviewsAddOne = function(req,res){
    var businessID = req.params.businessID;
    console.log("GET reviews for business " + businessID);
	Business
        .findById(businessID)
        .select("reviews")
		.exec(function(err, doc) {
			var response ={
				status : 200,
				message : []
			};
			if(err){
				console.log("Error finding Business "+ businessID);
				response.status = 500;
				response.message = err;
			}else if(!doc){
				console.log("Error finding Business "+ businessID);
				response.status = 404;
				response.message = {"message" : "Business ID not found " + businessID};
			};
			if(doc){
				addReview(req,res,doc);
			} else{
				console.log("Found Business " + businessID);
				res
					.status(200)
					.json(doc.reviews);
			}
			
		});	
};


module.exports.reviewsUpdateOne = function(req, res){
	var businessID = req.params.businessID;
	var reviewID = req.params.reviewID;
	console.log('PUT reviewID'+reviewID+'for businessID'+businessID);
	Business
		.findById(businessID)
		.select('reviews')
		.exec(function (err,thisBusiness) {
			var thisReview;
			var response = {
				status : 200,
				message : {}
			};
			if (err) {
				console.log("Error finding business");
				response.status = 500;
				response.message = err;		
			}
			else if (!thisBusiness) {
				console.log("BusinessID not found",id);
				response.status = 404;
				response.message ={"message":"BusinessID not found "+ id};
				}
			else {
					// get review and edit
				thisReview = thisBusiness.reviews.id(reviewID);
				if(!thisReview){
					response.status = 404;
					response.message = {"message":"ReviewID not found"+reviewId};
				}
				// now check for an error and save
				if(response.status !== 200){
					res
						.status(response.status)
						.json(response.message);
				} else {
					thisReview.username	= req.body.username;
					thisReview.text = req.body.text;
					thisReview.stars = parseInt(req.body.stars);
					doc.save(function(err,updatedBusiness){
						if(err){
							res
								.status(500)
								.json(err);
						}else {
							res
								.status(204)
								.json();
						}
				
				})
			}
		}
})};

module.exports.reviewsDeleteOne = function (req,res) {
	var businessID = req.params.businessID;
	var reviewID = req.params.reviewID;
	console.log('DELETE reviewID'+reviewID+'for businessID'+businessID);
	Business
		.findById(businessID)
		.select('reviews')
		.exec(function (err,thisBusiness) {
			var thisReview;
			var response = {
				status : 200,
				message : {}
			};
			if (err) {
				console.log("Error finding business");
				response.status = 500;
				response.message = err;		
			}
			else if (!thisBusiness) {
				console.log("BusinessID not found",id);
				response.status = 404;
				response.message ={"message":"BusinessID not found "+ id};
				}
			else {
					// get review and edit
				thisReview = thisBusiness.reviews.id(reviewID);
				if(!thisReview){
					response.status = 404;
					response.message = {"message":"ReviewID not found"+reviewId};
				}
				// now check for an error and save
				if(response.status !== 200){
					res
						.status(response.status)
						.json(response.message);
				} else {
					doc.reviews.id(reviewID).remove();
					doc.save(function(err,updatedBusiness){
						if(err){
							res
								.status(500)
								.json(err);
						}else {
							res
								.status(204)
								.json();
						}
				
				})
			}
		}
})
};