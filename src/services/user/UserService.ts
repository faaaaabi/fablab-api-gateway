import OdooClient from '../../clients/odoo/OdooClient';

class UserService {
  constructor(odooClient: OdooClient) {
    this.odooClient = odooClient;
  }

  private odooClient: OdooClient;

  public async getUserDataByUUID(userID: string): Promise<object> {
    const user = await this.odooClient.findUserByRfidUuid(userID);

    return user;
  }

  public async isUserAllowedToUse(userID: string): Promise<boolean> {
    const securityBriefingState = await this.odooClient.getSecurityBriefingState(userID);

    return securityBriefingState;
  }

  public async createInvoice(userID: string, productID: number): Promise<number> {
    const invoiceID = await this.odooClient.createInvoice(userID, productID);
    return invoiceID;
  }

  public async createAndConfirmInvoice(userID: string, productID: number): Promise<number> {
    const invoiceID = await this.odooClient.createInvoice(userID, productID);
    await this.odooClient.confirmInvoice(invoiceID);
    return invoiceID;
  }

  public async createSalesOrder(userID: string, productID: string, quantity: number, productDescription: string): Promise<number> {
    const saleOrderID = await this.odooClient.createSalesOrder(userID, productID, quantity, productDescription);
    return saleOrderID;
  }

  public async createAndConfirmSalesOrder(userID: string, productID: string, quantity: number, productDescription: string): Promise<number> {
    const saleOrderID = await this.odooClient.createSalesOrder(userID, productID, quantity, productDescription);
    await this.odooClient.confirmSaleOrder(saleOrderID);
    await this.odooClient.createInvoiceFromSaleOrder(saleOrderID);
    //await this.odooClient.confirmInvoice(saleOrderID);
    return saleOrderID;
  }
}

export default UserService;
