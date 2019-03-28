import { ObjectID } from 'bson';
import { PlaceType } from '../types/PlaceType';

export class Place {
  private _id: ObjectID;
  private placeName: string;
  private placeLabel: string;
  private placeType: PlaceType;
  private positions: { deviceID: ObjectID; coordinates: [number, number] }[];

  constructor(
    placeID?: ObjectID,
    placeName?: string,
    placeLabel?: string,
    placeType?: PlaceType,
    positions?: { deviceID: ObjectID; coordinates: [number, number] }[]
  ) {
    this._id = placeID;
    this.placeName = placeName;
    this.placeLabel = placeLabel;
    this.placeType = placeType;
    this.positions = positions;
  }

  getPositions(): { deviceID: ObjectID; coordinates: [number, number] }[] {
    return this.positions;
  }
}
