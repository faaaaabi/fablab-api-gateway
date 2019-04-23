import PassportService from "../../services/passportService/passportService";
import AccessDevice from "../../entities/AccessDevice";

const authRoutes = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');

// Get JWT Secret
const jwtSecret: string = config.get('JWT').secret;

const routes = (
    passportService: PassportService
) => {
    const passport = passportService.initStragies();
    authRoutes.post('/user', (req, res, next) => {
        passport.authenticate('user', {session: false}, (err, user, info) => {
            if (!err && user) {
                req.login(user, {session: false}, async err => {
                    if (err) {
                        res.send(err);
                    }
                    const token = await jwt.sign(user, jwtSecret, {expiresIn: '20s'});
                    return res.json({user, token});
                });
            } else {
                next(err);
            }
        })(req, res);
    });

    authRoutes.post('/app', (req, res, next) => {
        passport.authenticate('app', {session: false}, (err, accessDevice: AccessDevice, info) => {
            if (!err && accessDevice) {
                req.login(accessDevice, {session: false}, async err => {
                    if (err) {
                        res.send(err);
                    }
                    const token = await jwt.sign({accessDeviceIdentifier: accessDevice.identifier, placeID: accessDevice.placeID}, jwtSecret);
                    return res.json({token});
                });
            } else {
                next(err);
            }
        })(req, res);
    });
    return authRoutes;
};

export default routes;

