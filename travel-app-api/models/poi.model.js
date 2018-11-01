const mongoose = require('mongoose');

const poiSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  poiType: {
    type: String,
    enum: ['Museum', 'Town', 'Monument', 'Scenary', 'Walk'],  
    required: 'poiType is required'
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
  rating: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, `Point of interest needs a user`]
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      
      const coordinates = ret.location.coordinates;
      delete ret.location;
      ret.location = coordinates;
      
      return ret;
    }
  }
});


const poi = mongoose.model('Poi', poiSchema);
module.exports = poi; 