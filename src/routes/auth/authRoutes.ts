const authRoutes = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

// Get JWT Secret
const jwtSecret: String = config.get('JWT').secret;

authRoutes.post('/user', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        user,
        message: 'Something is not right',
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user, jwtSecret, {expiresIn: '20s'});
      return res.json({ user, token });
    });
  })(req, res);
});

authRoutes.post('/app', (req, res, next) => {
  passport.authenticate('app', { session: false }, (err, deviceID, info) => {
    if (err || !deviceID) {
      return res.status(400).json({
        deviceID,
        message: 'Something is not right',
      });
    }
    req.login(deviceID, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ deviceID }, jwtSecret);
      return res.json({ token, deviceID });
    });
  })(req, res);
});

export default authRoutes;
