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

  public async isUserAllowedToUse(rfidCardUUID: string) : Promise<Boolean> {
    const securityBriefingState = await this.odooClient.getSecurityBriefingState(rfidCardUUID);

    return securityBriefingState;
  }

}

export default OdooService;
