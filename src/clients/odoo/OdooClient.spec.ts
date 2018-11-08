import OdooClient from './OdooClient';
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(sinonChai);

const config = require('config');
const odooXmlRpc = require('../../libs/odoo-xmlrpc');

const xmlRpcclient = new odooXmlRpc(config.get('odoo-client'));
const odooClient : OdooClient = new OdooClient(xmlRpcclient);
let executeKwStub;
let connectStub;

beforeEach(() : void => {
  executeKwStub = sinon.stub(xmlRpcclient, 'execute_kw');
  connectStub = sinon.stub(xmlRpcclient, 'connect');
});

afterEach(() : void => {
  executeKwStub.restore();
  connectStub.restore();
});

describe('odooClient.findUserByRfidUuid', async () : Promise<any> => {
  it('calls the odoo-xmlrpc client with valid arguments', async () => {
    executeKwStub.returns([{ x_RFID_Card_UUID: '9D:90:9C:1E', name: 'Fabian Meyer', id: 43 }]);
    const testRfidUuid = '9D:90:9C:1E';
    const expectedParamsArray : any[] = [
      [['is_company', '=', false], ['customer', '=', true],
       ['x_RFID_Card_UUID', '=', testRfidUuid]],
       ['x_RFID_Card_UUID', 'name']];

    try {
      await odooClient.findUserByRfidUuid(testRfidUuid);
    } catch (e) {
      console.error(e);
    }

    expect(executeKwStub)
    .to.have.been.calledWith('res.partner', 'search_read', expectedParamsArray);
  });

  it('returns a valid JSON for a valid RFID Card UUID', async () => {
    const testRfidUuid = '9D:90:9C:1E';
    executeKwStub.returns([{ x_RFID_Card_UUID: testRfidUuid, name: 'Fabian Meyer', id: 43 }]);
    const expectedOutput = { x_RFID_Card_UUID: testRfidUuid, name: 'Fabian Meyer', id: 43 };
    let user;

    try {
      user = await odooClient.findUserByRfidUuid(testRfidUuid);
    } catch (e) {
      console.error(e);
    }

    expect(user).to.deep.equal(expectedOutput);
  });

  it('should throw an exception if the no user with the given UUID was found', async () => {
    const testRfidUuid = '9D:90:9C:1X';
    executeKwStub.returns([]);

    return (expect(odooClient.findUserByRfidUuid(testRfidUuid))
    .to.be.rejectedWith(Error, 'User not found'));
  });
});

describe('odooClient.getSecurityBriefingState', async () => {
  it('returns true if the user with the given UUID had a security briefing', async () => {
    const testRfidUuid = '9D:90:9C:1E';
    executeKwStub.returns([{ x_hadSecurityBriefing: true, id: 43 }]);

    const securityBriefingState = await odooClient.getSecurityBriefingState(testRfidUuid);
    expect(securityBriefingState).to.be.true;
  });

  it('returns false if the user with the given UUID hadn\'t a security briefing', async () => {
    const testRfidUuid = '9D:90:9C:1F';
    executeKwStub.returns([{ x_hadSecurityBriefing: false, id: 43 }]);

    const securityBriefingState = await odooClient.getSecurityBriefingState(testRfidUuid);
    expect(securityBriefingState).to.be.false;
  });

  it('should throw an exception if the no user with the given UUID was found', async () => {
    const testRfidUuid = '9D:90:9C:1X';
    executeKwStub.returns([]);

    // return nessecary for mocha to compute the promise
    return (expect(odooClient.getSecurityBriefingState(testRfidUuid))
    .to.be.rejectedWith(Error, 'User not found'));
  });
});
