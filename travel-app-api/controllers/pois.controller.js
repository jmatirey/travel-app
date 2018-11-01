const Poi = require('../models/poi.model');
const User = require('../models/user.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

module.exports.create = (req, res, next) => {    
    Poi.findOne({ location: req.body.location })
      .then(poi => {
        if (poi) {
          throw createError(409, `Point of interest already exists`)
        } else {
          poi = new Poi(req.body);
          poi.user = req.user.id;

          poi.location = {
            coordinates: req.body.location
          }

          if (req.files) {
            for (const file of req.files) {
              poi.gallery.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            }
          }

          return poi.save()
            .then(poi => {
             return User.findByIdAndUpdate(req.user._id, { $inc: {rating: 1} })
                .then(user => {
                  if(!user) {
                    throw createError(404, 'User not found');
                  } else {
                    res.status(201).json(poi)
                  }
                })
            })
        }
      })    
      .catch(error => next(error))
    
}

module.exports.detail = (req, res, next) => {
    Poi.findById(req.params.id)
      .then(poi => {
        if(!poi){
          throw createError(404, 'Point of interest not found');
        } else {
            res.json(poi)
        }
      })
      .catch(error => next(error));
}

module.exports.list = (req, res, next) => {
    Poi.find()
      .then(pois => res.json(pois))
      .catch(error => next(error));
}


module.exports.edit = (req, res, next) => {

    const id = req.params.id;

    Poi.findById(id)
    .then(poi => {
      if (poi) {
        const location = {
          coordinates: req.body.location
        }
        Object.assign(poi, {
          name: req.body.name,
          poiType: req.body.poiType,
          description: req.body.description,
          location: location,
          tags: req.body.tags,
          
        })

        if (req.files) {
          for (const file of req.files) {
            poi.gallery.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
          }
        }

        poi.save()
          .then(() => {
            res.json(poi);
          })
          .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              next(createError(400, error.errors));
            } else {
              next(error);
            }
          })
      } else {
        next(createError(404, `Poi with id ${id} not found`));
      }
    })
    .catch(error => next(error));
}


  