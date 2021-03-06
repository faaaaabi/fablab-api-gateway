import DeviceNotFoundError from '../../errors/DeviceNotFoundError';

const axios = require('axios');

class OpenhabClient {
  constructor(config) {
    this.openhabUrl = config.url;
    this.openhabPort = config.port;
  }

  private openhabUrl: string;
  private openhabPort: number;

  public async switchItemON(itemName: string): Promise<void> {
    try {
      await axios.post(`${this.openhabUrl}:${this.openhabPort}/rest/items/${itemName}`, 'ON', {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          throw new DeviceNotFoundError('Device not found');
        }
      }
      throw new Error(e);
    }
  }

  public async switchItemOFF(itemName: string): Promise<void> {
    try {
      await axios.post(`${this.openhabUrl}:${this.openhabPort}/rest/items/${itemName}`, 'OFF', {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          throw new DeviceNotFoundError('Device not found');
        }
      }
      throw new Error(e);
    }
  }

  public async getItem(itemName: string, metadataSelector?: string): Promise<any> {
    let result: string;
    try {
      result = await axios.get(
        `${this.openhabUrl}:${this.openhabPort}/rest/items/${itemName}${
          metadataSelector ? `?metadata=${metadataSelector}` : ''
        }`
      );
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          throw new DeviceNotFoundError('Device not found');
        }
      }
      throw new Error(e);
    }
    return result;
  }
}

export default OpenhabClient;
