var express = require("express");
var router = express.Router();

var businessesController = require('../controllers/businesses.controllers.js');
var reviewsController = require('../controllers/reviews.controllers.js');


router
	.route('/businesses')
	.get(businessesController.businessesGetAll)
	.post(businessesController.businessesAddOne);
	

router
	.route('/businesses/:businessID')
	.get(businessesController.businessesGetOne)
	.put(businessesController.businessesUpdateOne)
	.delete(businessesController.businessesDeleteOne);
	
router
 	.route('/fixDatabase')
 	.get(businessesController.fixDatabase);

router
 	.route('/addReviewIDs')
 	.get(businessesController.addReviewIDs);

router
	.route('/fixDatabase')
	.get(businessesController.fixDatabase);

router
	.route('/businesses/:businessID/reviews')
	.get(reviewsController.reviewsGetAll)
	.post(reviewsController.reviewsAddOne);

router
	.route('/businesses/:businessID/reviews/:reviewID')
	.post(reviewsController.reviewsGetOne)
	.put(reviewsController.reviewsUpdateOne)
	.delete(reviewsController.reviewsDeleteOne);
	

module.exports = router;