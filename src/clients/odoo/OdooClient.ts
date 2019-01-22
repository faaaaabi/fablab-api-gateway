class OdooClient {
  constructor(odooXmlRpcClient) {
    this.odooXmlRpcClient = odooXmlRpcClient;
  }

  private odooXmlRpcClient: any;

  public async findUserByRfidUuid(rfidUuid : string): Promise<Object[]> {
    await this.odooXmlRpcClient.connect();
    const params = [
      [['is_company', '=', false], ['customer', '=', true],
       ['x_RFID_Card_UUID', '=', rfidUuid]], // ids to search for
       ['x_RFID_Card_UUID', 'name', 'x_hadSecurityBriefing', 'x_isAdmin']]; // fields to return
    const result = await this.odooXmlRpcClient.execute_kw('res.partner', 'search_read', params);

    if (result.length === 0) {
      throw new Error('User not found');
    }

    return result[0];
  }

  public async getSecurityBriefingState(rfidUuid : string): Promise<Boolean> {
    await this.odooXmlRpcClient.connect();
    const params = [
      [['is_company', '=', false], ['customer', '=', true],
       ['x_RFID_Card_UUID', '=', rfidUuid]], // ids to search for
       ['x_hadSecurityBriefing']]; // fields to return
    const result = await this.odooXmlRpcClient.execute_kw('res.partner', 'search_read', params);

    if (result.length === 0) {
      throw new Error('User not found');
    }

    return result[0].x_hadSecurityBriefing ? true : false;
  }
}

export default OdooClient;
