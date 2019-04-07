import Place from '../../entities/Place';

const getPlace = placeService => async (req, res, next) => {
  try {
    const place: Place = await placeService.getPlaceByID(req.params.placeID);
    res.send({ ...place });
  } catch (e) {
    next(e);
  }
};

export { getPlace };
