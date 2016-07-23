namespace dogsrus.virtdog {
  export class RoverParamValidationService {
    static $inject = ['roverConfig'];
    constructor(private roverConfig: RoverConfig) { }

    // todo: don't know if I'll ever care about the sol param
    // it replaces earth_date as the required date param
    // sol being a martian date, it is the only param not handled
    public validateParams(earthDate: string, camera = '') {
      let params: any = {};
      let errors = [];
      if (this.validateEarthDate(earthDate)) {
        params[roverConfig.paramKeyEarthDate] = earthDate;
        params[roverConfig.paramKeyApiKey] = roverConfig.apiKey;
      } else {
        errors.push(`${roverConfig.paramKeyEarthDate}=${earthDate}`);
      }

      if (camera !== '') {
        if (this.validateCamera(camera)) {
          params[roverConfig.paramKeyCamera] = camera;
        } else {
          errors.push(`${roverConfig.paramKeyCamera}=${camera}`);
        }
      }
      if (errors.length > 0) {
        params[roverConfig.paramKeyError] = errors;
      }
      return params;
    }

    public validateParamsPage(earthDate: string, page: number, camera = '') {
      let params: any = {};
      params = this.validateParams(earthDate, camera);

      if (page !== 0) {
        if (page === parseInt(<any>page, 10) && page > 0
          && page <= this.roverConfig.maxPageNumber) {
          if (params[roverConfig.paramKeyError] === undefined) {
            params[roverConfig.paramKeyPage] = page.toString();
          }
        } else {
          if (params[roverConfig.paramKeyError] === undefined) {
            params[roverConfig.paramKeyError] = new Array(
              `${roverConfig.paramKeyPage}=${page}`);
          } else {
            params[roverConfig.paramKeyError].push(
              `${roverConfig.paramKeyPage}=${page}`);
          }
        }
      }

      return params;
    }

    private validateEarthDate(earthDate: string) {
      let isValid = false;
      try {
        let dateValue = new Date(earthDate);
        if (!isNaN(<any>dateValue)) {
          let maxDate = new Date();
          maxDate.setDate(
            maxDate.getDate() - this.roverConfig.maxPhotoDateOffset);
          if (dateValue >= new Date(roverConfig.minPhotoDate)
            && dateValue <= maxDate) {
            isValid = true;
          }
        }
      } catch (swallow) { }

      return isValid;
    }

    private validateCamera(validCamera: string) {
      validCamera = '|' + validCamera + '|';
      return this.roverConfig.cameraList.indexOf(validCamera) > -1;
    }
  }
  getModuleCore().service(
    'roverParamValidationService', RoverParamValidationService);
}
