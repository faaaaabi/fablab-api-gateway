import OpenhabClient from '../../clients/openhab/OpenhabClient';
import DeviceStateError from '../../errors/DeviceStateError';
import { ActorService } from 'interfaces/ActorService';
import { actor } from '../../types/actor';

class OpenhabService implements ActorService {
  private openhabClient: OpenhabClient;
  private identifier: string;

  constructor(openhabClient: OpenhabClient, identifier: string) {
    this.openhabClient = openhabClient;
    this.identifier = identifier;
  }

  public async toggleActorState(actor: actor): Promise<void> {
    const actorStateRequest = await this.openhabClient.getItem(actor.identifier);
    if (actorStateRequest.data.state === 'ON') {
      this.openhabClient.switchItemOFF(actor.identifier);
    } else {
      this.openhabClient.switchItemON(actor.identifier);
    }
  }

  public async switchOnActor(actor: actor): Promise<boolean> {
    const actorStateRequest = await this.openhabClient.getItem(actor.identifier);
    if (actorStateRequest.data.state === 'ON') {
      throw new DeviceStateError(`Device ${actor.identifier} has already ON state`);
    } else {
      this.openhabClient.switchItemON(actor.identifier);
      return true;
    }
  }

  public async switchOffActor(actor: actor): Promise<boolean> {
    const actorStateRequest = await this.openhabClient.getItem(actor.identifier);
    if (actorStateRequest.data.state === 'OFF') {
      throw new DeviceStateError(`Device ${actor.identifier} has already OFF state`);
    } else {
      this.openhabClient.switchItemOFF(actor.identifier);
      return true;
    }
  }

  public async getActorState(actor: actor): Promise<string> {
    const actorObject = await this.openhabClient.getItem(actor.identifier);
    return actorObject.data.state;
  }

  public async getActor(name: string): Promise<Object> {
    const device = await this.openhabClient.getItem(name);
    return device;
  }

  getIdentifier(): string {
    return this.identifier;
  }

  /*public async getDevicesByGroup(groupName: string, metadataSeletor?: string): Promise<Object> {
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
    const deviceLocationMap: object[][] = [];
    groupRequest.data.members.forEach(element => {
      if ('metadata' in element) {
        const position = element.metadata.position.config;
        if(!deviceLocationMap[position.y]) {
          deviceLocationMap[position.y] = [];
        }
        delete element.metadata;
        delete element.editable;
        deviceLocationMap[position.y][position.x] = element;
      }
    });
    return deviceLocationMap;
  }*/
}

export default OpenhabService;
