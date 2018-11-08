import OdooClient from '../../clients/odoo/OdooClient';

class OdooService {
  constructor(odooClient : OdooClient) {
    this.odooClient = odooClient;
  }

  private odooClient : OdooClient;

  public async getUserDataByUUID(rfidCardUUID: string) : Promise<Object> {
    const user = await this.odooClient.findUserByRfidUuid(rfidCardUUID);

    return user;
  }

}

export default OdooService;
