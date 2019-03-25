import { ObjectID } from 'bson';

export class Place {
  private _id: ObjectID;
  private placeName: string;
  private placeLabel: string;
  private positions: { deviceID: ObjectID; coordinates: [number, number] }[];

  constructor(
    placeID?: ObjectID,
    placeName?: string,
    placeLabel?: string,
    positions?: { deviceID: ObjectID; coordinates: [number, number] }[]
  ) {
    this._id = placeID;
    this.placeName = placeName;
    this.placeLabel = placeLabel;
    this.positions = positions;
  }

  getPositions(): { deviceID: ObjectID; coordinates: [number, number] }[] {
    return this.positions;
  }
}
