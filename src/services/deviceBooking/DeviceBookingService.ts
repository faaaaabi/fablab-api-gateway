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
    const deviceBooking = new DeviceBooking(deviceName, userUID);
    if (!(await this.deviceBookingRepository.find(deviceBooking))) {
      if (await this.userService.isUserAllowedToUse(userUID)) {
        if ((await this.deviceService.getDeviceState(deviceName)) === 'OFF') {
          deviceBooking.setStartTime(new Date().valueOf());
          await this.deviceBookingRepository.create(deviceBooking);
          await this.deviceService.toggleDeviceState(deviceName);
          return true;
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
}
