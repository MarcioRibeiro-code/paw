function extractFieldsFromJSON(json) {
  const {
    _id,
    localdata: {
      properties: {
        name,
        country,
        country_code,
        county,
        city,
        postcode,
        district,
        neighbourhood,
        suburb,
        street,
        lon:  lon ,
        lat:  lat ,
      },
    },
    price:price ,
    deleted,
  } = json;

  return {
    id: _id.$oid,
    name,
    country,
    country_code,
    county,
    city,
    postcode,
    district,
    neighbourhood,
    suburb,
    street,
    lon,
    lat,
    price,
    deleted,
  };
}
module.exports = {extractFieldsFromJSON};