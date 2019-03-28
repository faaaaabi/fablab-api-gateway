import UserNotFoundError from '../../errors/UserNotFoundError';
import * as moment from 'moment';

class OdooClient {
  constructor(odooXmlRpcClient) {
    this.odooXmlRpcClient = odooXmlRpcClient;
  }

  private odooXmlRpcClient: any;

  public async findUserByRfidUuid(rfidUuid: string): Promise<Object[]> {
    await this.odooXmlRpcClient.connect();
    const params = [
      [['is_company', '=', false], ['customer', '=', true], ['x_RFID_Card_UUID', '=', rfidUuid]], // ids to search for
      ['x_RFID_Card_UUID', 'name', 'x_hadSecurityBriefing', 'x_isAdmin']
    ]; // fields to return
    const result = await this.odooXmlRpcClient.execute_kw('res.partner', 'search_read', params);
    
    if (result.length === 0) {
      throw new UserNotFoundError(`User with ID ${rfidUuid} not found`);
    }
    
    const userObject = result[0];
    userObject.userID = userObject.x_RFID_Card_UUID;
    delete userObject.x_RFID_Card_UUID;
    userObject.hasSecurityBriefing = userObject.x_hadSecurityBriefing;
    delete userObject.x_hadSecurityBriefing;

    return userObject;
  }

  public async getSecurityBriefingState(rfidUuid: string): Promise<boolean> {
    await this.odooXmlRpcClient.connect();
    const params = [
      [['is_company', '=', false], ['customer', '=', true], ['x_RFID_Card_UUID', '=', rfidUuid]], // ids to search for
      ['x_hadSecurityBriefing']
    ]; // fields to return
    const result = await this.odooXmlRpcClient.execute_kw('res.partner', 'search_read', params);

    if (result.length === 0) {
      throw new UserNotFoundError(`User with ID ${rfidUuid} not found`);
    }

    return result[0].x_hadSecurityBriefing ? true : false;
  }

  public async confirmInvoice(invoiceID: number) {
    await this.odooXmlRpcClient.execute_kw('account.invoice', 'action_invoice_open', [[invoiceID]]);
  }

  public async createInvoice(rfidUuid: string, productID: number, items?: Object): Promise<number> {
    await this.odooXmlRpcClient.connect();
    const user: any = await this.findUserByRfidUuid(rfidUuid);

    const productParams = [[40], ['lst_price', 'taxes_id']];
    const productResult = await this.odooXmlRpcClient.execute_kw(
      'product.product',
      'read',
      productParams
    );

    const invoiceParams = {
      partner_id: user.id,
      date_invoice: moment().format('YYYY-MM-DD'),
      invoice_line_ids: [
        [
          0,
          false,
          {
            product_id: 40,
            account_id: 1161,
            quantity: 232,
            name: 'pupudipu',
            //invoice_line_tax_ids: [productResult[0].taxes_id],
            price_unit: productResult[0].lst_price
          }
        ]
      ]
    };

    const invoiceResult = await this.odooXmlRpcClient.execute_kw('account.invoice', 'create', [
      [invoiceParams]
    ]);

    return invoiceResult[0];

    //await this.confirmInvoice(invoiceResult[0]);
  }

  public async confirmSaleOrder(saleOrderID: number) {
    await this.odooXmlRpcClient.execute_kw('sale.order', 'action_confirm', [[saleOrderID]]);
  }

  public async createSalesOrder(
    rfidUuid: string,
    productID: string,
    quantity: number,
    productDescription: string,
    items?: Object
  ): Promise<number> {
    await this.odooXmlRpcClient.connect();
    const user: any = await this.findUserByRfidUuid(rfidUuid);

    const invoiceParams = {
      partner_id: user.id,
      partner_invoice_id: user.id,
      date_order: moment().format('YYYY-MM-DD HH:mm:ss'),
      order_line: [
        [
          0,
          0,
          {
            product_id: Number(productID),
            product_uom_qty: quantity,
            qty_delivered: quantity,
            name: productDescription
          }
        ]
      ]
    };

    const orderResult = await this.odooXmlRpcClient.execute_kw('sale.order', 'create', [
      [invoiceParams]
    ]);

    return orderResult[0];
  }

  public async createInvoiceFromSaleOrder(saleOrderID: number): Promise<number> {
    const orderInvoiceResult = await this.odooXmlRpcClient.execute_kw(
      'sale.advance.payment.inv',
      'create',
      [
        [
          { advance_payment_method: 'delivered', amount: 0, deposit_account_id: false, product_id: false },
          {
            context: {
              active_id: saleOrderID,
              active_model: 'sale.order',
              create: false,
            }
          }
        ]
      ]
    );

    const orderInvoiceCreateResult = await this.odooXmlRpcClient.execute_kw(
      'sale.advance.payment.inv',
      'create_invoices',
      [
        orderInvoiceResult[0],
        { active_id: saleOrderID, active_ids: [saleOrderID], active_model: 'sale.order' }
      ]
    );

    return orderInvoiceResult;
  }
}

export default OdooClient;
