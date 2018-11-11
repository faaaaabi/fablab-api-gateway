const axios = require('axios');
const config = require('config');

const openhabConfig = config.get('openhab-client');

class OpenhabClient{
  constructor() {

  }

  public async switchItemON(itemName : string) : Promise<void> {
    return axios.post(`${openhabConfig.url}:${openhabConfig.port}/rest/items/${itemName}`, 'ON', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  public async switchItemOFF(itemName : string) : Promise<void> {
    return axios.post(`${openhabConfig.url}:${openhabConfig.port}/rest/items/${itemName}`, 'OFF', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  public async getItemState(itemName : string) : Promise<string> {
    return axios.get(`${openhabConfig.url}:${openhabConfig.port}/rest/items/${itemName}`);
  }

}
console.log(`${openhabConfig.url}:${openhabConfig.port}/rest/items/mockLampTrigger`);

const client = new OpenhabClient();

const response = client.switchItemON('mockLampTrigger');