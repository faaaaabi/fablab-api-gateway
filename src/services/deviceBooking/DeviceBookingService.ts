import { DeviceBookingRepository } from '../../repositories/DeviceBookingRepository';
import DeviceService from '../../services/device/DeviceService';
import UserService from '../../services/user/UserService';
import { DeviceBooking } from '../../entities/deviceBooking';
import BookingError from '../../errors/BookingError';

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

  startBooking = async (deviceName: string, userUID: string): Promise<boolean> => {
    const bookingTransaction = {
      bookingPersisted: false,
      deviceSwitchedOn: false,
    }

    const deviceBooking = new DeviceBooking(deviceName, userUID);
    if (!(await this.deviceBookingRepository.findOne(deviceBooking))) {
      if (await this.userService.isUserAllowedToUse(userUID)) {
        const deviceState: String = await this.deviceService.getDeviceState(deviceName);
        if (deviceState === 'OFF' || deviceState === 'NULL') {
          try {
            deviceBooking.setStartTime(new Date().valueOf());
            await this.deviceBookingRepository.create(deviceBooking);
            bookingTransaction.bookingPersisted = true;
            await this.deviceService.toggleDeviceState(deviceName);
            bookingTransaction.deviceSwitchedOn = true;
            return true;
          } catch (e) {
            if(bookingTransaction.bookingPersisted) {
              await this.deviceBookingRepository.delete(deviceName);
            }
            if(bookingTransaction.deviceSwitchedOn) {
              await this.deviceService.toggleDeviceState(deviceName);
            }
            throw e;
          }
        } else {
          throw new BookingError(
            `Device ${deviceName} should have state OFF but has state ON and is not present in any booking`
          );
        }
      } else {
        throw new BookingError('User not allowed to book this device');
      }
    } else {
      throw new BookingError('Device already present in other booking');
    }
  };

  endBooking = async (deviceName: string, userUID: string): Promise<boolean> => {
    const deviceBooking = new DeviceBooking(deviceName, userUID);
    if (!(await this.deviceBookingRepository.findOne(deviceBooking))) {
      await this.deviceService.toggleDeviceState(deviceName);
      return
    }
  };

  findBookings = async (deviceNames: Array<string>): Promise<DeviceBooking[]> => {
    const deviceBooking: DeviceBooking[] = await this.deviceBookingRepository.findBookingsByDeviceNames(
      deviceNames
    );
    return deviceBooking;
  };
}
