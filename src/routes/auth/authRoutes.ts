const authRoutes = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

// Get JWT Secret
const jwtSecret : String = config.get('JWT').secret

authRoutes.post('/app', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log('err: ', err)
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign(user, jwtSecret);
           return res.json({user, token});
        });
    })(req, res);
});

export default authRoutes;