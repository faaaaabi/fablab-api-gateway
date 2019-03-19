const authRoutes = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

// Get JWT Secret
const jwtSecret: String = config.get('JWT').secret;

authRoutes.post('/user', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (!err && user) {
      req.login(user, { session: false }, async err => {
        if (err) {
          res.send(err);
        }
        const token = await jwt.sign(user, jwtSecret, { expiresIn: '20s' });
        return res.json({ user, token });
      });
    } else {
      next(err);
    }
  })(req, res);
});

authRoutes.post('/app', (req, res, next) => {
  passport.authenticate('app', { session: false }, (err, deviceID, info) => {
    if (!err && deviceID) {
      req.login(deviceID, { session: false }, async err => {
        if (err) {
          res.send(err);
        }
        const token = await jwt.sign({ deviceID }, jwtSecret);
        return res.json({ token, deviceID });
      });
    } else {
      next(err);
    }
  })(req, res);
});

export default authRoutes;
