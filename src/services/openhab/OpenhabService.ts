import OpenhabClient from '../../clients/openhab/OpenhabClient';

class OpenhabService {
  constructor(openhabClient : OpenhabClient) {
    this.openhabClient = openhabClient;
  }

  private openhabClient : OpenhabClient;

  public async toggleDeviceState(deviceName : string) : Promise<void> {
    const deviceStateRequest = await this.openhabClient.getItemState(deviceName);
    if (deviceStateRequest.data.state === 'ON') {
      this.openhabClient.switchItemOFF(deviceName);
    } else {
      this.openhabClient.switchItemON(deviceName);
    }
  }

  public async getDeviceState(deviceName : string) : Promise<string> {
    return await this.openhabClient.getItemState(deviceName);
  }
}

export default OpenhabService;
