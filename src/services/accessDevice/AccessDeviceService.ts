import AccessDeviceRepository from '../../repositories/AccessDeviceRepository';
import AccessDevice from "../../entities/AccessDevice";

class AccessDeviceService {
  private accessDeviceRepository: AccessDeviceRepository;

  constructor(accessDeviceRepository: AccessDeviceRepository) {
    this.accessDeviceRepository = accessDeviceRepository;
  }

  public async getAccessDeviceByIdentifier(accessDeviceIdentifier: string): Promise<AccessDevice> {
    const accessDevice: AccessDevice = await this.accessDeviceRepository.findAccessDeviceByIdentifier(accessDeviceIdentifier);
    return accessDevice;
  }

}

export default AccessDeviceService;
