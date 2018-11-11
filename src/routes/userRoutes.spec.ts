import { expect, sinon, chai } from '../test-helpers';
const chaiHttp = require('chai-http');
const supertest = require('supertest');
chai.use(chaiHttp);

import userRoutes from './userRoutes';

const config = require('config');
const odooXmlRpc = require('../libs/odoo-xmlrpc');
import OdooService from '../services/odoo/OdooService';
import OdooClient from '../clients/odoo/OdooClient';

const odooService = new OdooService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));
let isUserAllowedToUseStub;

const express = require('express');

beforeEach(() : void => {
  isUserAllowedToUseStub = sinon.stub(odooService, 'isUserAllowedToUse');
});

afterEach(() : void => {
  isUserAllowedToUseStub.restore();
});

describe('Route GET /user/:uuid/checkMachinePermission', () => {
  it('should return a vlaid JSON for a valid UUID', async () => {
    isUserAllowedToUseStub.returns(new Promise((resolve) => {
      resolve(true);
    }));

    const routes = userRoutes(odooService);
    const app = express();
    app.use('/user', routes);
    const request = supertest(app);

    const res = await request.get('/user/9D:90:9C:1X/checkMachinePermission');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ isAllowed : true });
  });

  it('should return a vlaid JSON for a valid UUID', async () => {
    isUserAllowedToUseStub.returns(new Promise((resolve) => {
      resolve(true);
    }));

    const routes = userRoutes(odooService);
    const app = express();
    app.use('/user', routes);
    const request = supertest(app);

    const res = await request.get('/user/9D:90:9C:1X/checkMachinePermission');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ isAllowed : true });
  });
});
