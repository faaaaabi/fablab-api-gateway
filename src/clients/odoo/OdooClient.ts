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
       ['x_RFID_Card_UUID', 'name']]; // fields to return
    const result = await this.odooXmlRpcClient.execute_kw('res.partner', 'search_read', params);

    return result[0];
  }
}

export default OdooClient;
