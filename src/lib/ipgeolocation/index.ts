import { IPGeolocationAPI } from "ip-geolocation-api-sdk-typescript/IPGeolocationAPI";
import { GeolocationParams } from "ip-geolocation-api-sdk-typescript/GeolocationParams";

export const ipGeolocationAPI = new IPGeolocationAPI(
  process.env.IP_GEOLOCATION_API_KEY
);

export const geoLocationParams = new GeolocationParams();
geoLocationParams.setFields("country_name,city,country_flag");
