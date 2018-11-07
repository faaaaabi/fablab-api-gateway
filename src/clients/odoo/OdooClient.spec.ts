import OdooClient from './OdooClient';
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const config = require('config');
const odooXmlRpc = require('../../libs/odoo-xmlrpc');

describe('odoo Client', async () : Promise<any> => {
  const client = new odooXmlRpc(config.get('odoo-client'));
  const odooClient : OdooClient = new OdooClient(client);
  let executeKwStub;
  let connectStub;

  beforeEach(() : void => {
    executeKwStub = sinon.stub(client, 'execute_kw');
    connectStub = sinon.stub(client, 'connect');
  });

  afterEach(() : void => {
    executeKwStub.restore();
    connectStub.restore();
  });

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

  it('returns a valid JSON', async () => {
    executeKwStub.returns([{ x_RFID_Card_UUID: '9D:90:9C:1E', name: 'Fabian Meyer', id: 43 }]);
    const testRfidUuid = '9D:90:9C:1E';
    const expectedOutput = { x_RFID_Card_UUID: '9D:90:9C:1E', name: 'Fabian Meyer', id: 43 };
    let user;

    try {
      user = await odooClient.findUserByRfidUuid(testRfidUuid);
    } catch (e) {
      console.error(e);
    }

    expect(user).to.deep.equal(expectedOutput);
  });
});
