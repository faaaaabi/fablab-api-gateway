import OpenhabClient from '../../clients/openhab/OpenhabClient';

class OpenhabService {
  constructor(openhabClient : OpenhabClient) {
    this.openhabClient = openhabClient;
  }

  private openhabClient : OpenhabClient;

  public async toggleDeviceState(deviceName : string) : Promise<void> {
    const deviceStateRequest = await this.openhabClient.getItem(deviceName);
    if (deviceStateRequest.data.state === 'ON') {
      this.openhabClient.switchItemOFF(deviceName);
    } else {
      this.openhabClient.switchItemON(deviceName);
    }
  }

  public async getDeviceState(deviceName : string) : Promise<string> {
    const deviceObject = await this.openhabClient.getItem(deviceName);
    return deviceObject.data.state;
  }

  public async getDevicesByGroup(groupName : string) : Promise<Object> {
    const groupRequest = await this.openhabClient.getItem(groupName);
    if (groupRequest.data.type !== 'Group') {
      throw new Error('Group not found');
    }
    return groupRequest.data.members;
  }
}

export default OpenhabService;
