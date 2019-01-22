const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

// Odoo Service init
const config = require('config');
const odooXmlRpc = require('./libs/odoo-xmlrpc');
import OdooClient from './clients/odoo/OdooClient';
import OdooService from './services/odoo/OdooService';

const odooService = new OdooService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

// Get API Key
const apiKey : String = config.get('JWT').apiKey
// Get JWT Secret
const jwtSecret : String = config.get('JWT').secret

passport.use(new LocalStrategy({
    usernameField: 'rfiduuid',
    passwordField: 'apiKey'
}, 
async (rfiduuid, clientApiKey, cb) => {
    try {
        const user : Object =  await odooService.getUserDataByUUID(rfiduuid);
        if(user && clientApiKey ===  apiKey) {
            return cb(null, user, {message: 'Logged In Successfully'});
        }
        return cb(new Error('Either credentials or api key are wrong'));
    } catch (e) {
        cb(e);
    }
    
    return odooService.getUserDataByUUID(rfiduuid)
        .then(user => {
            return cb(null, user, {message: 'Logged In Successfully'});
        })
        .catch(err => cb(err));
}
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : jwtSecret
},
function (jwtPayload, cb) {

    //find the user in db if needed
    return odooService.getUserDataByUUID(jwtPayload.RFIDUUID)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));

export default passport