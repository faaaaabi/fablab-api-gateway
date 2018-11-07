const odoo = require('../../libs/odoo-xmlrpc');
const config = require('config');

class OdooClient {
  constructor() {
    this.odoo = new odoo(config.get('odoo-client'));
  }

  private odoo: any;

  public async findUserByRfidUuid(rfidUuid : string): Promise<any> {
    try {
      await this.odoo.connect();

      const params = [
        [['is_company', '=', false], ['customer', '=', true],
         ['x_RFID_Card_UUID', '=', rfidUuid]], // ids to search for
         ['x_RFID_Card_UUID', 'name']]; // fields to return
      const result = await this.odoo.execute_kw('res.partner', 'search_read', params);

      console.log('result: ', result);
    } catch (e) {
      console.error(e);
    }
  }
}

const client = new OdooClient();
client.findUserByRfidUuid('9D:90:9C:1E');

export default OdooClient;
