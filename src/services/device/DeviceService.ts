import DeviceStateError from '../../errors/DeviceStateError';
import { ActorService } from '../../interfaces/ActorService';
import { actor } from '../../types/actor';
import { ObjectID } from 'bson';
import { DeviceRepository } from '../../repositories/DeviceRepository';
import { Device } from '../../entities/Device';
import NotFoundError from '../../errors/NotFoundError';

class DeviceService {
  private actorServices: ActorService[];
  private deviceRepository: DeviceRepository;

  constructor(actorServices: ActorService[], deviceRepository: DeviceRepository) {
    this.actorServices = actorServices;
    this.deviceRepository = deviceRepository;
  }

  private getActorService(actor: actor): ActorService {
    return this.actorServices.find(actorService => {
      return actorService.getIdentifier() === actor.platformIdentifier;
    });
  }

  public async toggleDeviceState(deviceID: ObjectID): Promise<void> {
    const device: Device = Object.assign(
      new Device(),
      await this.deviceRepository.findDeviceById(deviceID)
    );
    const actor: actor = device.getActor();
    const actorService: ActorService = this.getActorService(actor);

    const actorState = await actorService.getActorState(actor);
    if (actorState === 'ON') {
      actorService.switchOffActor(actor);
    } else {
      actorService.switchOnActor(actor);
    }
  }

  public async switchOnDevice(deviceID: ObjectID): Promise<boolean> {
    const device: Device = Object.assign(
      new Device(),
      await this.deviceRepository.findDeviceById(deviceID)
    );
    const actor: actor = device.getActor();
    const actorService: ActorService = this.getActorService(actor);

    const actorState = await actorService.getActorState(actor);
    if (actorState === 'ON') {
      throw new DeviceStateError(`Device ${actor.identifier} has already ON state`);
    } else {
      actorService.switchOnActor(actor);
      return true;
    }
  }

  public async switchOffDevice(deviceID: ObjectID): Promise<boolean> {
    const device: Device = Object.assign(
      new Device(),
      await this.deviceRepository.findDeviceById(deviceID)
    );
    const actor: actor = device.getActor();
    const actorService: ActorService = this.getActorService(actor);

    const actorState = await actorService.getActorState(actor);
    if (actorState === 'OFF') {
      throw new DeviceStateError(`Device ${actor.identifier} has already OFF state`);
    } else {
      actorService.switchOffActor(actor);
      return true;
    }
  }

  public async getDeviceState(deviceID: ObjectID): Promise<string> {
    const device: Device = Object.assign(
      new Device(),
      await this.deviceRepository.findDeviceById(deviceID)
    );
    const actor: actor = device.getActor();
    const actorService: ActorService = this.getActorService(actor);
    const actorState = await actorService.getActorState(actor);

    return actorState;
  }

  public async getDeviceByID(deviceID: ObjectID): Promise<Device> {
    const device: Device = await this.deviceRepository.findDeviceById(deviceID);
    if (device === null) {
      throw new NotFoundError('The requested device could not be found');
    }

    return device;
  }

  public async getDevicesByID(deviceIDs: ObjectID[]): Promise<Device[]> {
    const devices: Device[] = await this.deviceRepository.findDevicesByID(deviceIDs);
    if (devices.length === 0) {
      throw new NotFoundError('The requested devices could not be found');
    }
    return devices;
  }
}

export default DeviceService;
