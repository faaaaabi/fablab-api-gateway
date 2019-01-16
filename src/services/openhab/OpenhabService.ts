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

  public async getDevicesByGroup(groupName : string, metadataSeletor? : string) : Promise<Object> {
    const groupRequest = await this.openhabClient.getItem(groupName, metadataSeletor);
    if (groupRequest.data.type !== 'Group') {
      throw new Error('Group not found');
    }
    return groupRequest.data.members;
  }

  public async getDevicesByGroupAsLocationMap(groupName : string, metadataSeletor? : string)
  : Promise<Object> {
    const groupRequest = await this.openhabClient.getItem(groupName, metadataSeletor);
    if (groupRequest.data.type !== 'Group') {
      throw new Error('Group not found');
    }
    if (groupRequest.data.category !== 'Positional') {
      throw new Error('No positional group');
    }
    const deviceLocationMap : object[][] = [];
    groupRequest.data.members.forEach((element) => {
      if ('metadata' in element) {
        const position = element.metadata.position.config;
        if (!deviceLocationMap[position.x]) deviceLocationMap[position.x] = [];
        delete element.metadata;
        delete element.editable;
        deviceLocationMap[position.x][position.y] = element;
      }
    });

    return deviceLocationMap;
  }
}

export default OpenhabService;
