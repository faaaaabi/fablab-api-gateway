import { expect, sinon } from '../../test-helpers';

const odooXmlRpc = require('../../libs/odoo-xmlrpc');
import OdooService from '../../services/odoo/OdooService';
import OdooClient from '../../clients/odoo/OdooClient';
const config = require('config');
import { isAllowedToUseMachine } from './userController';

const odooService = new OdooService(new OdooClient(new odooXmlRpc(config.get('odoo-client'))));
let isUserAllowedToUseStub;

beforeEach(() : void => {
  isUserAllowedToUseStub = sinon.stub(odooService, 'isUserAllowedToUse');
});

afterEach(() : void => {
  isUserAllowedToUseStub.restore();
});

describe('userController', () => {
  it('should return a valid JSON', async () => {
    isUserAllowedToUseStub.returns(new Promise((resolve) => {
      resolve(true);
    }));
    const req = {
      body: {},
      params: {
        uuid: '9D:90:9C:1E', // for testing get, delete and update vehicle
      },
    };
    const res = {
      send: sinon.spy(),
    };
    const next = sinon.spy();

    await isAllowedToUseMachine(odooService)(req, res, next);
    expect(res.send.firstCall.args[0]).to.deep.equal({ isAllowed: true });
  });

  /*it('should with 404 status code and valid error JSON', async () => {
    //isUserAllowedToUseStub.throws('User not found');
    isUserAllowedToUseStub.returns(new Promise((reject) => {
      reject(new Error('User not found'));
    }));
    const req = {
      body: {},
      params: {
        uuid: '9D:90:9C:1X', // for testing get, delete and update vehicle
      },
    };
    const res = {
      send: sinon.spy(),
      status: sinon.spy(),
    };
    const next = sinon.spy();

    await isAllowedToUseMachine(odooService)(req, res, next);
    //onsole.log('reees', res);
    expect(res.send).to.equal(404);
  });*/

});
