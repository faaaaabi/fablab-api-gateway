import { DeviceBookingRepository } from '../../repositories/DeviceBookingRepository';
import DeviceService from '../../services/device/DeviceService';
import UserService from '../../services/user/UserService';
import { DeviceBooking } from '../../entities/deviceBooking';
import BookingError from '../../errors/BookingError';
import { ObjectID } from 'bson';

export class DeviceBookingService {
  private deviceBookingRepository: DeviceBookingRepository;
  private deviceService: DeviceService;
  private userService: UserService;

  constructor(
    deviceBookingRepository: DeviceBookingRepository,
    deviceService: DeviceService,
    userService: UserService
  ) {
    this.deviceBookingRepository = deviceBookingRepository;
    this.deviceService = deviceService;
    this.userService = userService;
  }

  startBooking = async (deviceName: string, userUID: string): Promise<ObjectID> => {
    const bookingTransaction = {
      bookingPersisted: false,
      deviceSwitchedOn: false
    };
    const deviceBooking = new DeviceBooking(deviceName, userUID);
    const deviceState: String = await this.deviceService.getDeviceState(deviceName);

    if (await this.deviceBookingRepository.findOne(deviceBooking)) {
      throw new BookingError('Device already present in other booking');
    }
    if (!(await this.userService.isUserAllowedToUse(userUID))) {
      throw new BookingError('User not allowed to book this device');
    }
    if (deviceState !== 'OFF' && deviceState !== 'NULL') {
      throw new BookingError(
        `Device ${deviceName} should have state OFF but has state ON and is not present in any booking`
      );
    }

    let bookingID: ObjectID;
    try {
      deviceBooking.setStartTime = new Date().valueOf();
      bookingID = await this.deviceBookingRepository.create(deviceBooking);
      bookingTransaction.bookingPersisted = true;
      await this.deviceService.toggleDeviceState(deviceName);
      bookingTransaction.deviceSwitchedOn = true;
      return bookingID;
    } catch (e) {
      if (bookingTransaction.bookingPersisted) {
        await this.deviceBookingRepository.delete(bookingID);
      }
      if (bookingTransaction.deviceSwitchedOn) {
        await this.deviceService.toggleDeviceState(deviceName);
      }
      throw e;
    }
  };

  endBooking = async (bookingID: string, userUID: string): Promise<boolean> => {
    const bookingTransaction = {
      bookingDeleted: false,
      deviceSwitchedOff: false
    };
    const deviceBooking = Object.assign(
      new DeviceBooking(),
      await this.deviceBookingRepository.findBookingById(new ObjectID(bookingID))
    );

    if (DeviceBooking) {
      if (deviceBooking.getUserID !== userUID) {
        throw new BookingError(
          `Requesting user with ID ${userUID} is not owner of booking with ID ${
            deviceBooking.getID
          }`
        );
      }

      try {
        if (deviceBooking) {
          bookingTransaction.bookingDeleted = await this.deviceBookingRepository.deleteBookingById(
            deviceBooking.getID
          );
          bookingTransaction.deviceSwitchedOff = await this.deviceService.switchOffDevice(
            deviceBooking.getDeviceName
          );
          return bookingTransaction.bookingDeleted && bookingTransaction.deviceSwitchedOff;
        }
      } catch (e) {
        if (bookingTransaction.bookingDeleted) {
          await this.deviceBookingRepository.create(deviceBooking);
        }
        if (bookingTransaction.deviceSwitchedOff) {
          await this.deviceService.switchOnDevice(deviceBooking.getDeviceName);
        }
        throw e;
      }
    }
  };

  findBookings = async (deviceNames: Array<string>): Promise<DeviceBooking[]> => {
    const deviceBooking: DeviceBooking[] = await this.deviceBookingRepository.findBookingsByDeviceNames(
      deviceNames
    );
    return deviceBooking;
  };
}
