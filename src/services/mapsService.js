import apiExt from "./apiExt";
import { api } from "./api";

export const nominatimReverseGeocoding = (latitude, longitude, callback) => {
    const urlBase = "https://nominatim.openstreetmap.org/reverse?format=json"
    const parLatitude = `&lat=${latitude}`;
    const parLongitude = `&lon=${longitude}`;
    const parZoom = "&zoom=18&addressdetails=1";
    var resp = {};

    apiExt.get( `${urlBase}${parLatitude}${parLongitude}${parZoom}` )
        .then((response) => {
            resp = response.data.address;
            return callback(resp);
        });
};
  // exemplo de uso
  //
  // nominatimReverseGeocoding(-23.627212, -46.561431, (response) => {console.log(response)} );
  //
  // response = {
  //   "city": "São Caetano do Sul",
  //   "city_district": "São Caetano do Sul",
  //   "country": "Brasil",
  //   "country_code": "br",
  //   "postcode": "09570-320",
  //   "quarter": "Vila Paula",
  //   "region": "Região Sudeste",
  //   "road": "Avenida Tijucussu",
  //   "state": "São Paulo",
  //   "suburb": "Olímpico", 
  // }

export const googleDistance = async (address) => {
    var resp;
    await api.get(`/delivery-settings/distance/${address}`)
        .then((response)=> {
            resp = response;
        })
        .catch((error)=>{
            console.log("==> ERROR : googleDistance.get ", error);
            return null;
        });

        return resp.data;
};
// exemplo de uso
//
// resp.data = {
//     "distance": Object {
//       "text": "1.6 km",
//       "value": 1642,
//     },
//     "duration": Object {
//       "text": "5 mins",
//       "value": 270,
//     },
//     "status": "OK",
//   }
