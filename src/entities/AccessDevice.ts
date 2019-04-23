import { ObjectID } from 'bson';

export default class AccessDevice {
    private _id: ObjectID;
    private _identifier: string;
    private _apiKey: string;
    private _placeID: ObjectID;

    constructor(
        AccessDeviceID?: ObjectID,
        identifier?: string,
        apiKey?: string,
        placeID?: ObjectID,
    ) {
        this._id = AccessDeviceID;
        this._identifier = identifier;
        this._apiKey = apiKey;
        this._placeID = placeID;
    }


    get id(): ObjectID {
        return this._id;
    }

    set id(value: ObjectID) {
        this._id = value;
    }

    get identifier(): string {
        return this._identifier;
    }

    set identifier(value: string) {
        this._identifier = value;
    }

    get apiKey(): string {
        return this._apiKey;
    }

    set apiKey(value: string) {
        this._apiKey = value;
    }

    get placeID(): ObjectID {
        return this._placeID;
    }

    set placeID(value: ObjectID) {
        this._placeID = value;
    }
}
