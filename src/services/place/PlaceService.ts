import { ObjectID } from 'bson';
import PlaceRepository from '../../repositories/PlaceRepository';
import Place from '../../entities/Place';

class PlaceService {
  private placeRepository: PlaceRepository;

  constructor(placeRepository: PlaceRepository) {
    this.placeRepository = placeRepository;
  }

  public async getPlaceByID(placeID: ObjectID): Promise<Place> {
    const place: Place = await this.placeRepository.findPlaceById(placeID);
    return place;
  }
}

export default PlaceService;
