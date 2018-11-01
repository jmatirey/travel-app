const mongoose = require('mongoose');

 const tripSchema = new mongoose.Schema({
  originPlace: {
    type: String
  },
  destinationPlace: {
    type: String
  },
  originLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  destinationLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  gallery: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, `Trip needs a user`]
  },
  pois: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Poi'
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;

      const originCoordinates = ret.originLocation.coordinates;
      delete ret.originLocation;
      ret.originLocation = originCoordinates;

      const destinationCoordinates = ret.destinationLocation.coordinates;
      delete ret.destinationLocation;
      ret.destinationLocation = destinationCoordinates;

      return ret;

    }
  }
});

const trip = mongoose.model('Trip', tripSchema);
module.exports = trip;  