var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');

var runGeoQuery = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };

    var geoOptions = {
        spherical: true,
        maxDistance: 10000,
        num: 5
    };

    Profile
        .geoNear(point, geoOptions, function (err, results, stats) {
            console.log("Geo stats: ", stats);

            res
                .status(200)
                .json(results);
        });
};


module.exports.ProfilesGetAll = function (req, res) {
    var start = 0;
    var number = 0;
    if (req.query && req.query.lng && req.query.lat) {
        runGeoQuery(req, res);
        return;
    }

    if (req.query && req.query.start) {
        start = parseInt(req.query.start);
    }
    if (req.query && req.query.number) {
        number = parseInt(req.query.number);
    }
    if (isNaN(start) || isNaN(number)) {
        res
            .status(400)
            .json({"message": "If supplied query string, start and number should be numeric"});
        return;
    }
    Profile
        .find()
        .skip(start)
        .limit(number)
        .exec(function (err, docs) {
            if (err) {
                console.log("Error finding Profiles");
                res
                    .status(500)
                    .json(err)
            }
            else {
                console.log("Retrieved data for " + docs.length + " Profiles");
                res
                    .status(200)
                    .json(docs);
            }

        })
};

module.exports.ProfilesGetOne = function (req, res) {
    var ProfileID = req.params.ProfileID;
    console.log("GET Profile " + ProfileID);
    Profile
        .findById(ProfileID)
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: doc
            }
            if (err) {
                response.status = 500;
                response.message = err
            } else if (!doc) {
                response.status = 404;
                response.message = {"message": "Profile ID not found"};
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

var splitArray = function (input) {
    var output;
    if (input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
}

module.exports.ProfilesAddOne = function (req, res) {

    Profile
        .create({
            name: req.body.name,
            starts: parseInt(req.body.stars),
            username: req.body.username,
            avatar: req.body.avatar,
            email: req.body.email,
            dob: req.body.dob,
            phone: req.body.phone,
            address: req.body.address,
            review_count: 0,
            job: splitArray(req.body.job),
            reviews: [],
            Skills: req.body.skills,
            Finance: req.body.finance,
            location: {
                address: req.body.address,
                coordinates: [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat),
                ]
            }

        }, function (err, newProfile) {
            if (err) {
                console.log("Error Creating Profile");
                res
                    .status(400)
                    .json(err);
            } else {
                res
                    .status(201)
                    .json(newProfile);
            }
        });
};

module.exports.addReviewIDs = function (req, res) {
    Profile
        .find()
        .exec(function (err, docs) {
            for (var i = 0; i < docs.length; i++) {
                ProfileID = docs[i]._id;
                if (docs[i].reviews) {
                    reviews = docs[i].reviews;
                    for (var thisReview = 0; thisReview < reviews.length; thisReview++) {
                        reviewID = reviews[thisReview].review_id;
                        Profile.update(
                            {"_id": ProfileID, "reviews.review_id": reviewID},
                            {
                                $set: {
                                    "reviews.$._id": ObjectId()
                                }
                            }
                        );
                    }
                }
            }
            res
                .status(200)
                .json({"Message": "Review IDs added"});
        })
};


module.exports.ProfilesUpdateOne = function (req, res) {
    var ProfileID = req.params.ProfileID;
    console.log("GET Profile " + ProfileID);
    Profile
        .findById(ProfileID)
        .select("-reviews")
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: doc
            }
            if (err) {
                response.status = 500;
                response.message = err
            } else if (!doc) {
                response.status = 404;
                response.message = {"message": "Profile ID not found"};
            }
            console.log("Found Profile " + ProfileID);
            if (response.status != 200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {

                doc.name = req.body.name,
                    doc.starts = parseInt(req.body.stars),
                    doc.username = req.body.username,
                    doc.avatar = req.body.avatar,
                    doc.email = req.body.email,
                    doc.dob = req.body.dob,
                    doc.phone = req.body.phone,
                    doc.address = req.body.address,
                    doc.review_count = 0,
                    doc.job = splitArray(req.body.job),
                    doc.reviews = [],
                    doc.Skills = req.body.skills,
                    doc.Finance = req.body.finance
                // doc.location = {
                //     doc.address : req.body.address,
                //     doc.coordinates = [
                //     parseFloat(req.body.lng),
                //     parseFloat(req.body.lat),
                // ]
            }
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
        });
}

module.exports.ProfilesDeleteOne = function (req, res) {
    var ProfileID = req.params.ProfileID;
    Profile
        .findByIdAndRemove(ProfileID)
        .exec(function (err, thisProfile) {
            if (err) {
                res
                    .status(404)
                    .json(err);
            }
            else {
                console.log("Profile" + ProfileID + "deleted");
                res
                    .status(204)
                    .json();
            }
        })
};