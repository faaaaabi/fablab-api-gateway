import OdooClient from '../clients/odoo/OdooClient';

class OdooService {
  constructor(odooClient : OdooClient) {
    this.odooClient = odooClient;
  }

  private odooClient : OdooClient;

}

export default OdooService;
