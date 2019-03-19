import * as express from 'express';

// Routes
import userRoutes from './users/userRoutes';
import devicesRoutes from './devices/devicesRoutes';
import authRoutes from './auth/authRoutes';
import bookingRoutes from './bookings/bookingRoutes';
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

// OpenHAB init
import OpenhabClient from '../clients/openhab/OpenhabClient';
import DeviceService from '../services/device/DeviceService';
import { MongoClient, Db } from 'mongodb';
import { DeviceBookingRepository } from '../repositories/DeviceBookingRepository';
import { DeviceBookingService } from '../services/deviceBooking/DeviceBookingService';
const deviceService = new DeviceService(new OpenhabClient(config.get('openhab-client')));

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

  const deviceBookingRepository = new DeviceBookingRepository(db, 'deviceBookings');

  // DeviceBooking Service init
  const deviceBookingService = new DeviceBookingService(
    deviceBookingRepository,
    deviceService,
    userService
  );

  app.use('/users', passport.authenticate('jwt', { session: false }), userRoutes(userService));
  app.use(
    '/devices',
    passport.authenticate('jwt', { session: false }),
    devicesRoutes(deviceService, userService, deviceBookingService)
  );
  app.use(
    '/bookings',
    passport.authenticate('jwt', { session: false }),
    bookingRoutes(deviceBookingService)
  );
  app.use('/auth', authRoutes);
};

export default { init };
