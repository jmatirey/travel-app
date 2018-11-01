const User = require('../models/user.model');
const createError = require('http-errors');
const mongoose = require('mongoose');
const Trip = require('../models/trip.model');
const Poi = require('../models/poi.model');

module.exports.create = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        throw createError(409, `User with email ${req.body.email} already exists`);
      } else {
        user = new User(req.body);

        user.save()
          .then(user => {
            res.status(201).json(user)
          })
          .catch(error => {
            next(error)
          });
      }
    })
    .catch(error => next(error));
  
}

module.exports.detail = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if(!user){
        throw createError(404, 'User not found');
      } else {
        const tripPromise = Trip.find( {user: user.id} )
        const poiPromise = Poi.find( {user: user.id} )

        Promise.all([tripPromise, poiPromise])
          .then(([trips, pois])=> {
            const allInfo = {
              user: user,
              trips: trips,
              pois: pois
            }
            res.json(allInfo);
          })
          .catch(error => next(error));
      }
    })
    .catch(error => next(error));
  }

// module.exports.edit = (req, res, next) => {

//     const id = req.params.id;

//     User.findById(id)
//     .then(user => {
//       if (user) {
//         Object.assign(user, {
//           firstName: req.body.firstName,
//           surname: req.body.surname,
//           tags: req.body.tags
//         });

//         if (req.files) {
//           user.image = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
//         }

//         user.save()
//           .then(() => {
//             res.json(user);
//           })
//           .catch(error => {
//             if (error instanceof mongoose.Error.ValidationError) {
//               next(createError(400, error.errors));
//             } else {
//               next(error);
//             }
//           })
//       } else {
//         next(createError(404, `User with id ${id} not found`));
//       }
//     })
//     .catch(error => next(error));
// }

module.exports.edit = (req, res, next) => {

  const id = req.params.id;
  const updateSet = {
    firstName: req.body.firstName,
    surname: req.body.surname,
    tags: req.body.tags,
  };

  if (req.file) {
    updateSet.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
 
  }

  User.findByIdAndUpdate(id, { $set: updateSet }, {runValidators: true, new: true })
    .then(user => {
      if (!user) {
        throw createError(404, 'User not found')
      } else {
        res.json(user);
      }
    })
    .catch(error => next(error));
}
