import OdooService from './OdooService';
import OdooClient from '../../clients/odoo/OdooClient';
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const config = require('config');
const odooXmlRpc = require('../../libs/odoo-xmlrpc');

describe('odooService.userHadSecurityBriefing', () => {
  const xmlRpcclient = new odooXmlRpc(config.get('odoo-client'));
  const odooClient : OdooClient = new OdooClient(xmlRpcclient);
  const odooService : OdooService = new OdooService(odooClient);
  let findUserByRfidUuidStub;
  let getSecurityBriefingStateStub;

  beforeEach(() : void => {
    findUserByRfidUuidStub = sinon.stub(odooClient, 'findUserByRfidUuid');
    getSecurityBriefingStateStub = sinon.stub(odooClient, 'getSecurityBriefingState');
  });

  afterEach(() : void => {
    findUserByRfidUuidStub.restore();
    getSecurityBriefingStateStub.restore();
  });

  it('should return a valid user object for a valid UUID', async () => {
    findUserByRfidUuidStub
    .returns({ x_RFID_Card_UUID: '9D:90:9C:1E', name: 'Fabian Meyer', id: 43 });

    const testRfidUuid = '9D:90:9C:1E';
    const userObject = await odooService.getUserDataByUUID(testRfidUuid);

    expect(userObject)
    .to.deep.equal({ x_RFID_Card_UUID: '9D:90:9C:1E', name: 'Fabian Meyer', id: 43 });

  });

  it('should return true if a user with a given UUID had a security briefing', async () => {
    getSecurityBriefingStateStub
    .returns(true);

    const testRfidUuid = '9D:90:9C:1E';
    const securityBriefingState = await odooService.isUserAllowedToUse(testRfidUuid);

    expect(securityBriefingState).to.be.true;
  });

  it('should return true if a user with a given UUID had a security briefing', async () => {
    getSecurityBriefingStateStub
    .returns(false);

    const testRfidUuid = '9D:90:9C:1F';
    const securityBriefingState = await odooService.isUserAllowedToUse(testRfidUuid);

    expect(securityBriefingState).to.be.false;
  });

});
