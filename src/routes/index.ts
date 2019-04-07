import * as express from 'express';

// Route imports
import deviceRoutes from './device/deviceRoutes';
import devicesRoutes from './device/devicesRoutes';
import authRoutes from './auth/authRoutes';
import bookingRoutes from './booking/bookingRoutes';
import bookingsRoutes from './booking/bookingsRoutes';
import placeRoutes from './place/placeRoutes';

// Load passport and authentication configuration
const passport = require('passport');
require('../passport');

// Load Config & necessary parameters
const config = require('config');

// Client imports
const odooXmlRpc = require('../libs/odoo-xmlrpc');
import OdooClient from '../clients/odoo/OdooClient';
import OpenhabClient from '../clients/openhab/OpenhabClient';

// Service imports
import DeviceService from '../services/device/DeviceService';
import DeviceBookingService from '../services/deviceBooking/DeviceBookingService';
import ActorService from '../interfaces/ActorService';
import OpenhabService from '../services/actor/OpenhabService';
import PlaceService from '../services/place/PlaceService';
import UserService from '../services/user/UserService';


// Database and repository imports
import { MongoClient, Db } from 'mongodb';
import DeviceBookingRepository from '../repositories/DeviceBookingRepository';
import PlaceRepository from '../repositories/PlaceRepository';
import ProductReferenceRepository from '../repositories/ProductReferenceRepository';
import DeviceRepository from '../repositories/DeviceRepository';

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

  /**
   * Service initialization and depenedency injection
   */
  // User service Init
  const userService = new UserService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));

  // Place service init
  const placeService: PlaceService = new PlaceService(new PlaceRepository(db, 'places'));

  // Actor services Init
  const actorServices: ActorService[] = [
    new OpenhabService(new OpenhabClient(config.get('openhab-client')), 'openhab')
  ];
  const deviceService = new DeviceService(actorServices, new DeviceRepository(db, 'devices'));

  // DeviceBooking Service init
  const deviceBookingService = new DeviceBookingService(
    new DeviceBookingRepository(db, 'deviceBookings'),
    new ProductReferenceRepository(db, 'productReferences'),
    deviceService,
    userService
  );

  app.use('/device', passport.authenticate('jwt', { session: false }), deviceRoutes(deviceService));
  app.use(
    '/devices',
    passport.authenticate('jwt', { session: false }),
    devicesRoutes(deviceService)
  );
  app.use(
    '/booking',
    passport.authenticate('jwt', { session: false }),
    bookingRoutes(deviceBookingService)
  );
  app.use(
    '/bookings',
    passport.authenticate('jwt', { session: false }),
    bookingsRoutes(deviceBookingService)
  );
  app.use('/place', passport.authenticate('jwt', { session: false }), placeRoutes(placeService));
  app.use('/auth', authRoutes);
};

export default { init };
