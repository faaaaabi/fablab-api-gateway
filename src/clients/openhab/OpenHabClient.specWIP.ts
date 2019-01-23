import { expect, sinon } from '../../test-helpers';
import OdooClient from './OpenhabClient';

const config = require('config');
let sandbox;

beforeEach(() : void => {
    sandbox = sinon.sandbox.create();
});

afterEach(() : void => {
  sandbox.restor();
});

describe('openHAB Client', () => {
    
})
