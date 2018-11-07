const odoo = require('../../libs/odoo-xmlrpc');

class OdooClient {
  constructor() {
    this.odoo = new odoo({
      url: 'http://localhost',
      port: 8069,
      db: 'odoo_fablab',
      username: 'f@bian-meyer.de',
      password: 'IVm3O8nb0T13nOYlh9au',
    });
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
client.findUserByRfidUuid('9D:90:9C:1B');

export default OdooClient;
