import * as express from 'express';

// Routes
import userRoutes from './users/userRoutes';
import deviceRoutes from './devices/deviceRoutes';
import devicesRoutes from './devices/devicesRoutes';
import authRoutes from './auth/authRoutes';
import bookingRoutes from './bookings/bookingRoutes';
import placeRoutes from './place/placeRoutes';

// Load passport and authentication configuration
const passport = require('passport');
require('../passport');

// Load Config & necessary parameters
const config = require('config');

// Odoo Init
import UserService from '../services/user/UserService';
const odooXmlRpc = require('../libs/odoo-xmlrpc');
import OdooClient from '../clients/odoo/OdooClient';
const userService = new UserService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

// Actor init
import OpenhabClient from '../clients/openhab/OpenhabClient';
import DeviceService from '../services/device/DeviceService';
import { DeviceBookingService } from '../services/deviceBooking/DeviceBookingService';
import { ActorService } from '../interfaces/ActorService';
import OpenhabService from '../services/actor/OpenhabService';
import { DeviceRepository } from '../repositories/DeviceRepository';

// DB imports
import { MongoClient, Db } from 'mongodb';
import { DeviceBookingRepository } from '../repositories/DeviceBookingRepository';
import { PlaceRepository } from '../repositories/PlaceRepository';
import PlaceService from '../services/place/PlaceService';

const init = async (app: express.Application) => {
  /**
   * Database
   */
  let db: Db;
  const { host, port, user, password, database } = config.get('mongodb');
  const dbConnection = await MongoClient.connect(`mongodb://${user}:${password}@${host}:${port}/`, {
    useNewUrlParser: true
  });
  db = dbConnection.db(database);

  // Place service ini
  const placeService: PlaceService = new PlaceService(new PlaceRepository(db, 'places'));

  // Actorservices Init
  const actorServices: ActorService[] = [
    new OpenhabService(new OpenhabClient(config.get('openhab-client')), 'openhab')
  ];
  const deviceService = new DeviceService(actorServices, new DeviceRepository(db, 'devices'));

  // DeviceBooking Service init
  const deviceBookingService = new DeviceBookingService(
    new DeviceBookingRepository(db, 'deviceBookings'),
    deviceService,
    userService
  );

  app.use('/users', passport.authenticate('jwt', { session: false }), userRoutes(userService));
  app.use(
    '/device',
    //passport.authenticate('jwt', { session: false }),
    deviceRoutes(deviceService)
  );
  app.use(
    '/devices',
    //passport.authenticate('jwt', { session: false }),
    devicesRoutes(deviceService)
  );
  app.use(
    '/bookings',
    //passport.authenticate('jwt', { session: false }),
    bookingRoutes(deviceBookingService)
  );
  app.use(
    '/place',
    //passport.authenticate('jwt', { session: false }),
    placeRoutes(placeService)
  );
  app.use('/auth', authRoutes);
};

export default { init };
