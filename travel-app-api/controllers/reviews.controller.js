const Review = require('../models/review.model');
const Poi = require('../models/poi.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

module.exports.create = (req, res, next) => {

    const poiId = req.params.id;
    debugger;
    Poi.findById(poiId)
        .then(poi => {
            if(!poi) {
                throw createError(404, 'Poi not found');
            } else {
                const review = new Review(req.body)
                review.user = req.user;
                review.poi = poiId;

                return review.save()
                    .then(review => {
                        return poi.update( { $inc: {rating: req.body.rating} } )
                            .then(poi => {
                                res.status(201).json(review)
                            })
                    })
              }
        })
        .catch(error => next(error));
}

  module.exports.list = (req, res, next) => {
    const poiId = req.params.id;
    Poi.findById(poiId)
        .then(poi => {
            if(!poi) {
                throw createError(404, 'Poi not found');
            } else {
               return Review.find( {poi: poiId} )
                    .then(reviews => res.json(reviews))
            }
        })
        .catch(error => next(error));
  }

