import AccessDeviceService from "../accessDevice/AccessDeviceService";

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

// Odoo Service init
const config = require('config');
import UserService from '../user/UserService';
import UnauthorizedError from '../../errors/UnauthorizedError';
import AccessDevice from "../../entities/AccessDevice";

// Get API Key
const apiKey: string = config.get('JWT').apiKey;
// Get JWT Secret
const jwtSecret: string = config.get('JWT').secret;

class PassportService {

  private userService: UserService;
  private accessDeviceService: AccessDeviceService;

  constructor(userService: UserService, accessDeviceService: AccessDeviceService) {
    this.userService = userService;
    this.accessDeviceService = accessDeviceService
  }

  public initStragies = () => {
    passport.use('user', new LocalStrategy(
        {
          usernameField: 'userID',
          passwordField: 'apiKey',
        },
        async (userID: string, clientApiKey: string, cb: Function) => {
          try {
            const user: object = await this.userService.getUserDataByUUID(userID);
            const isAllowedToUseMachine: boolean = await this.userService.isUserAllowedToUse(userID);
            const accessDevice = Object.assign(
              new AccessDevice(),
              await this.accessDeviceService.getAccessDeviceByApiKey(clientApiKey)
            );
            // @TODO: Rethink APIKey handling
            if(accessDevice) {
              if(accessDevice.apiKey) {
                if (user && clientApiKey === accessDevice.apiKey && isAllowedToUseMachine) {
                  return cb(null, user, { message: 'Logged In Successfully' });
                }
              }
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
          usernameField: 'accessDeviceIdentifier',
          passwordField: 'apiKey',
        },
        async (accessDeviceIdentifier: string, clientApiKey: string, cb: Function) => {
          try {
            const accessDevice = Object.assign(
              new AccessDevice(),
              await this.accessDeviceService.getAccessDeviceByIdentifier(accessDeviceIdentifier)
            );
            if(accessDevice) {
              if (accessDevice.apiKey === clientApiKey) {
                return cb(null, accessDevice, {message: 'Logged In Successfully'});
              }
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
        async (jwtPayload, cb) => {
          const accessDevice: AccessDevice = await this.accessDeviceService.getAccessDeviceByIdentifier(jwtPayload.accessDeviceIdentifier);
          if (accessDevice) {
            return cb(null, jwtPayload.accessDeviceIdentifier);
          }
          return cb(new Error('invalid device'));
        },
    ));

    return passport;
  }

}

export default PassportService;
