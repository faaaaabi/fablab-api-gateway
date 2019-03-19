import OdooClient from '../../clients/odoo/OdooClient';

class UserService {
  constructor(odooClient : OdooClient) {
    this.odooClient = odooClient;
  }

  private odooClient : OdooClient;

  public async getUserDataByUUID(userID: string) : Promise<Object> {
    const user = await this.odooClient.findUserByRfidUuid(userID);

    return user;
  }

  public async isUserAllowedToUse(userID: string) : Promise<Boolean> {
    const securityBriefingState = await this.odooClient.getSecurityBriefingState(userID);

    return securityBriefingState;
  }

}

export default UserService;
