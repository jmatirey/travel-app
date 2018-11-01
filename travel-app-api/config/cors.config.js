const originsAllowed = process.env.CORS_ORIGINS || [
    'http://localhost:3000',
    'http://localhost:4200'
  ];
  
  module.exports = {
    origin: function(origin, next) {
      const allowed = !origin || originsAllowed.indexOf(origin) !== -1;
      if (allowed) {
        next(null, allowed);
      } else {
        next(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  }