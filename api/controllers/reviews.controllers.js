var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');

module.exports.reviewsGetAll = function (req, res) {
    var ProfileID = req.params.ProfileID;
    console.log("GET reviews for Profile " + ProfileID);
    Profile
        .findById(ProfileID)
        .select("reviews")
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: []
            };
            if (err) {
                console.log("Error finding Profile " + ProfileID);
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                console.log("Error finding Profile " + ProfileID);
                response.status = 404;
                response.message = {"message": "Profile ID not found " + ProfileID};
            } else {
                response.message = doc.reviews ? doc.reviews : [];
                console.log("Found Profile " + ProfileID);
                res
                    .status(200)
                    .json(doc.reviews);
            }

        });
};

module.exports.reviewsGetOne = function (req, res) {
    var ProfileID = req.params.ProfileID;
    var reviewID = req.params.reviewID;
    console.log("GET reviews for Profile " + ProfileID);
    Profile
        .findById(ProfileID)
        .select("reviews")
        .exec(function (err, doc) {
            var review = doc.reviews.id(reviewID);
            console.log("Found review " + reviewID);
            res
                .status(200)
                .json(review);
        });
};

var addReview = function (req, res, thisProfile) {
    thisProfile.reviews.push({
        username: req.body.username,
        votes: {"endorsed_by": 0, "followed_by": 0, "follows": 0},
        text: req.body.text,
        stars: parseInt(req.body.stars)
    });
    thisProfile.save(function (err, updatedProfile) {
        var newReviewPosititon = updatedProfile.reviews.length - 1;
        var newReview = updatedProfile.reviews[newReviewPosititon];
        if (err) {
            res
                .status(500)
                .json(err);
        }
        else {
            res
                .status(201)
                .json(newReview);
        }
        ;
    });
};

module.exports.reviewsAddOne = function (req, res) {
    var ProfileID = req.params.ProfileID;
    console.log("GET reviews for Profile " + ProfileID);
    Profile
        .findById(ProfileID)
        .select("reviews")
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: []
            };
            if (err) {
                console.log("Error finding Profile " + ProfileID);
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                console.log("Error finding Profile " + ProfileID);
                response.status = 404;
                response.message = {"message": "Profile ID not found " + ProfileID};
            }
            ;
            if (doc) {
                addReview(req, res, doc);
            } else {
                console.log("Found Profile " + ProfileID);
                res
                    .status(200)
                    .json(doc.reviews);
            }

        });
};


module.exports.reviewsUpdateOne = function (req, res) {
    var ProfileID = req.params.ProfileID;
    var reviewID = req.params.reviewID;
    console.log('PUT reviewID' + reviewID + 'for ProfileID' + ProfileID);
    Profile
        .findById(ProfileID)
        .select('reviews')
        .exec(function (err, thisProfile) {
            var thisReview;
            var response = {
                status: 200,
                message: {}
            };
            if (err) {
                console.log("Error finding Profile");
                response.status = 500;
                response.message = err;
            }
            else if (!thisProfile) {
                console.log("ProfileID not found", id);
                response.status = 404;
                response.message = {"message": "ProfileID not found " + id};
            }
            else {
                // get review and edit
                thisReview = thisProfile.reviews.id(reviewID);
                if (!thisReview) {
                    response.status = 404;
                    response.message = {"message": "ReviewID not found" + reviewID};
                }
                // now check for an error and save
                if (response.status !== 200) {
                    res
                        .status(response.status)
                        .json(response.message);
                } else {
                    thisReview.username = req.body.username;
                    thisReview.text = req.body.text;
                    thisReview.stars = parseInt(req.body.stars);
                    doc.save(function (err, updatedProfile) {
                        if (err) {
                            res
                                .status(500)
                                .json(err);
                        } else {
                            res
                                .status(204)
                                .json();
                        }

                    })
                }
            }
        })
};

module.exports.reviewsDeleteOne = function (req, res) {
    var ProfileID = req.params.ProfileID;
    var reviewID = req.params.reviewID;
    console.log('DELETE reviewID' + reviewID + 'for ProfileID' + ProfileID);
    Profile
        .findById(ProfileID)
        .select('reviews')
        .exec(function (err, thisProfile) {
            var thisReview;
            var response = {
                status: 200,
                message: {}
            };
            if (err) {
                console.log("Error finding Profile");
                response.status = 500;
                response.message = err;
            }
            else if (!thisProfile) {
                console.log("ProfileID not found", id);
                response.status = 404;
                response.message = {"message": "ProfileID not found " + id};
            }
            else {
                // get review and edit
                thisReview = thisProfile.reviews.id(reviewID);
                if (!thisReview) {
                    response.status = 404;
                    response.message = {"message": "ReviewID not found" + reviewId};
                }
                // now check for an error and save
                if (response.status !== 200) {
                    res
                        .status(response.status)
                        .json(response.message);
                } else {
                    doc.reviews.id(reviewID).remove();
                    doc.save(function (err, updatedProfile) {
                        if (err) {
                            res
                                .status(500)
                                .json(err);
                        } else {
                            res
                                .status(204)
                                .json();
                        }

                    })
                }
            }
        })
};