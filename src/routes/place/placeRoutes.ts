import PlaceService from "../../services/place/PlaceService";
import {
  getPlace
} from '../../controllers/place/placesController';

const placeRoutes = require('express').Router();

const routes = (placeService: PlaceService) => {
  placeRoutes.get('/:placeID', getPlace(placeService));
  return placeRoutes;
};

export default routes;