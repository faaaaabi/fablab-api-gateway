const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

// Odoo Service init
const config = require('config');
const odooXmlRpc = require('./libs/odoo-xmlrpc');
import OdooClient from './clients/odoo/OdooClient';
import UserService from './services/user/UserService';
import UnauthorizedError from './errors/UnauthorizedError';

const userService = new UserService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

// Get API Key
const apiKey: String = config.get('JWT').apiKey;
// Get JWT Secret
const jwtSecret: String = config.get('JWT').secret;

passport.use(new LocalStrategy(
  {
    usernameField: 'userID',
    passwordField: 'apiKey',
  },
  async (userID: string, clientApiKey: string, cb: Function) => {
    try {
      const user: Object = await userService.getUserDataByUUID(userID);
      const isAllowedToUseMachine: Boolean = await userService.isUserAllowedToUse(userID);
      if (user && clientApiKey === apiKey && isAllowedToUseMachine) {
        return cb(null, user, { message: 'Logged In Successfully' });
      }
      return cb(new UnauthorizedError('Either credentials or api key are wrong'));
    } catch (e) {
      cb(e);
      return
    }
  },
));

passport.use('app', new LocalStrategy(
  {
    usernameField: 'deviceID',
    passwordField: 'apiKey',
  },
  (deviceID: string, clientApiKey: string, cb: Function) => {
    try {
      // @TODO: Search for device and api key in DB
      if (deviceID === 'AccessDevice1' && clientApiKey === apiKey) {
        return cb(null, deviceID, { message: 'Logged In Successfully' });
      }
      return cb(new UnauthorizedError('Either credentials or api key are wrong'));
    } catch (e) {
      cb(e);
      return;
    }
  },
));

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  },
  (jwtPayload, cb) => {
    console.error('jwtpayload: ', jwtPayload);
    if (jwtPayload.deviceID === 'AccessDevice1') {
      // @TODO: search for devicID in databse
      return cb(null, jwtPayload.deviceID);
    }
    return cb(new Error('invalid device'));
  },
));

export default passport;
