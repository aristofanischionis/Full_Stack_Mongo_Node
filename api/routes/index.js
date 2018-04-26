var express = require("express");
var router = express.Router();

var ProfilesController = require('../controllers/profiles.controllers.js');
var reviewsController = require('../controllers/reviews.controllers.js');


router
	.route('/Profiles')
	.get(ProfilesController.ProfilesGetAll)
	.post(ProfilesController.ProfilesAddOne);
	

router
	.route('/Profiles/:ProfileID')
	.get(ProfilesController.ProfilesGetOne)
	.put(ProfilesController.ProfilesUpdateOne)
	.delete(ProfilesController.ProfilesDeleteOne);

router
 	.route('/addReviewIDs')
 	.get(ProfilesController.addReviewIDs);


router
	.route('/Profiles/:ProfileID/reviews')
	.get(reviewsController.reviewsGetAll)
	.post(reviewsController.reviewsAddOne);

router
	.route('/Profiles/:ProfileID/reviews/:reviewID')
	.post(reviewsController.reviewsGetOne)
	.put(reviewsController.reviewsUpdateOne)
	.delete(reviewsController.reviewsDeleteOne);
	

module.exports = router;