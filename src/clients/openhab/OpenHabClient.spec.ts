import { expect, sinon, chai } from '../../test-helpers';
import OpenhabClient from './OpenhabClient';
import axios from 'axios';

const config = require('config');
let sandbox;
const openHABClient = new OpenhabClient(config.get("openhab-client"))

beforeEach(() : void => {
    sandbox = sinon.createSandbox();
});

afterEach(() : void => {
  sandbox.restore();
});

describe('openHABClient.switchItemON', async () => {
    it('Should throw an "Device not found error", if the requested device is not found', async () => {
      const rejected = new Promise((_, r) => r({
        response: {
          statusText: 'NotFound',
          status: 404,
        }
      }));
      sandbox.stub(axios, 'post').returns(rejected);
      
      return(expect(openHABClient.switchItemON('NonExistingItemName')).to.be.rejectedWith(Error, 'Device not found'));
    })

    it('Should resolve, if requested device got switched on', async () => {
      const resolved = new Promise((r, _) => r({
        response: {
          status: 200,
        }
      }));
      sandbox.stub(axios, 'post').returns(resolved);
      
      return(expect(openHABClient.switchItemON('ExistingItemName')).to.be.fulfilled);
    })
})

describe('openHABClient.switchItemOFF', async () => {
  it('Should throw an "Device not found error", if the requested device is not found', async () => {
    const rejected = new Promise((_, r) => r({
      response: {
        statusText: 'NotFound',
        status: 404,
      }
    }));
    sandbox.stub(axios, 'post').returns(rejected);
  
    return(expect(openHABClient.switchItemOFF('NonExistingItemName')).to.be.rejectedWith(Error, 'Device not found'));
  })

  it('Should resolve, if requested device got switched of', async () => {
    const resolved = new Promise((r, _) => r({
      response: {
        status: 200,
      }
    }));
    sandbox.stub(axios, 'post').returns(resolved);
    
    return(expect(openHABClient.switchItemOFF('ExistingItemName')).to.be.fulfilled);
  })
})

describe('openHABClient.getItem', async () => {
  it('Should throw an "Device not found error", if the requested device is not found', async () => {
    const rejected = new Promise((_, r) => r({
      response: {
        statusText: 'NotFound',
        status: 404,
      }
    }));
    sandbox.stub(axios, 'get').returns(rejected);
    
    return(expect(openHABClient.getItem('NonExistingItemName')).to.be.rejectedWith(Error, 'Device not found'));
  })

  it('Should resolve with an object if the requested device is found', async () => {
    const resolved = new Promise((r, _) => r({
      some: 'data'
    }));
    sandbox.stub(axios, 'get').returns(resolved);
    
    return(expect(openHABClient.getItem('ExistingItemName')).to.be.fulfilled.and.eventually.deep.equal({some: 'data'}));
  })
})

