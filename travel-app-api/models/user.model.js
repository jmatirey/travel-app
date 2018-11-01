const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const constants = require('../constants')
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL;

const userSchema =  new mongoose.Schema({
  firstName: {
    type: String,
    required: "name is required"
  },
  surname: {
    type: String,
    required: "surname is required"
  },
  image: {
    type: String,
    default: "https://www.ienglishstatus.com/wp-content/uploads/2018/04/Sad-Profile-Pic-for-Whatsapp.png"
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number
  },
  tags: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: [constants.ROLE_ADMIN, constants.ROLE_GUEST],
    default: constants.ROLE_GUEST
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    next();
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
      })
      .then(hash => {
        user.password = hash;
        next();
      })
      .catch(error => next(error));
  }
  
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User; 