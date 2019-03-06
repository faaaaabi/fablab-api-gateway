import OpenhabClient from '../../clients/openhab/OpenhabClient';
import DeviceNotFoundError from '../../errors/DeviceNotFoundError';
import DeviceStateError from '../../errors/DeviceStateError';

class DeviceService {
  constructor(openhabClient: OpenhabClient) {
    this.openhabClient = openhabClient;
  }

  private openhabClient: OpenhabClient;

  public async toggleDeviceState(deviceName: string): Promise<void> {
    const deviceStateRequest = await this.openhabClient.getItem(deviceName);
    if (deviceStateRequest.data.state === 'ON') {
      this.openhabClient.switchItemOFF(deviceName);
    } else {
      this.openhabClient.switchItemON(deviceName);
    }
  }

  public async switchOnDevice(deviceName: string): Promise<boolean> {
    const deviceStateRequest = await this.openhabClient.getItem(deviceName);
    if (deviceStateRequest.data.state === 'ON') {
      throw new DeviceStateError(`Device ${deviceName} has already ON state`);
    } else {
      this.openhabClient.switchItemON(deviceName);
      return true;
    }
  }

  public async switchOffDevice(deviceName: string): Promise<boolean> {
    const deviceStateRequest = await this.openhabClient.getItem(deviceName);
    if (deviceStateRequest.data.state === 'OFF') {
      throw new DeviceStateError(`Device ${deviceName} has already OFF state`);
    } else {
      this.openhabClient.switchItemOFF(deviceName);
      return true;
    }
  }

  public async getDeviceState(deviceName: string): Promise<string> {
    const deviceObject = await this.openhabClient.getItem(deviceName);
    return deviceObject.data.state;
  }

  public async getDevice(name: string): Promise<Object> {
    const device = await this.openhabClient.getItem(name);
    return device;
  }

  public async getDevicesByGroup(groupName: string, metadataSeletor?: string): Promise<Object> {
    const groupRequest = await this.openhabClient.getItem(groupName, metadataSeletor);
    if (groupRequest.data.type !== 'Group') {
      throw new DeviceNotFoundError('Group not found');
    }
    return groupRequest.data.members;
  }

  public async getDevicesByGroupAsLocationMap(
    groupName: string,
    metadataSeletor?: string
  ): Promise<Object> {
    const groupRequest = await this.openhabClient.getItem(groupName, metadataSeletor);
    if (groupRequest.data.type !== 'Group') {
      throw new Error('Group not found');
    }
    if (groupRequest.data.category !== 'Positional') {
      throw new Error('No positional group');
    }
    const deviceLocationMap: object[][] = [[],[]];
    groupRequest.data.members.forEach(element => {
      if ('metadata' in element) {
        const position = element.metadata.position.config;
        delete element.metadata;
        delete element.editable;
        deviceLocationMap[position.x][position.y] = element;
      }
    });
    return deviceLocationMap;
  }
}

export default DeviceService;
