var Odoo = require('../../libs/odoo-xmlrpc');

class odooClient {
    constructor() {
        this.odoo = new Odoo({
            url: 'http://localhost',
            port: 8069,
            db: 'odoo_fablab',
            username: 'f@bian-meyer.de',
            password: 'IVm3O8nb0T13nOYlh9au'
        })
    }

    private odoo: any;

    public async readRecord(): Promise<any> {
        try {
            await this.odoo.connect();

            const params = [
                [['is_company', '=', true],['customer', '=', true]], // ids to search for
                ['name', 'country_id', 'comment'] // fields to return
            ];
            let result = await this.odoo.execute_kw('res.partner', 'search_read', params);
            let result2= await this.odoo.exec_workflow('')
    
            console.log('result: ', result);
        } catch (e) {
            console.error(e)
        }
    }
}

let client = new odooClient();
client.readRecord();

export default odooClient