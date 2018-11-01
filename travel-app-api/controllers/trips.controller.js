const Trip = require('../models/trip.model');
const createError = require('http-errors');
const mongoose = require('mongoose');

module.exports.create = (req, res, next) => {    
    const trip = new Trip(req.body);
    trip.user = req.user.id;

    trip.originLocation = {
      coordinates: req.body.originLocation
    }

    trip.destinationLocation = {
      coordinates: req.body.destinationLocation
    }

    if (req.files) {
      for (const file of req.files) {
        trip.gallery.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
      }
    }

    trip.save()
      .then(trip => {
        res.status(201).json(trip);
        })
      .catch(error => next(error));
}


module.exports.detail = (req, res, next) => {
    Trip.findById(req.params.id)
      .then(trip => {
        if(!trip){
          throw createError(404, 'User not found');
        } else {
          res.json(trip);
        }
      })   
      .catch(error => next(error));
}


module.exports.list = (req, res, next) => {
  Trip.find()
    .then(trips => res.json(trips))
    .catch(error => next(error));
}

  
module.exports.edit = (req, res, next) => {

    const id = req.params.id;

    Trip.findById(id)
    .then(trip => {
      if (trip) {
        Object.assign(trip, {
          name: req.body.name,
          description: req.body.description,
          tags: req.body.tags
        })

        trip.originLocation = {
          coordinates: req.body.originLocation
        }
    
        trip.destinationLocation = {
          coordinates: req.body.destinationLocation
        }

        if (req.files) {
          for (const file of req.files) {
            trip.gallery.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
          }
        }

        trip.save()
          .then(() => {
            res.json(trip);
          })
          .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              next(createError(400, error.errors));
            } else {
              next(error);
            }
          })
      } else {
        next(createError(404, `Trip with id ${id} not found`));
      }
    })
    .catch(error => next(error));
}


  