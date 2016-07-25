namespace dogsrus.virtdog {
  export class RoverParamValidationService {

    static $inject = ['roverConfig'];
    constructor(private roverConfig: RoverConfig) { }

    // todo: don't know if I'll ever care about the sol param
    // it replaces earth_date as the required date param
    // sol being a martian date, it is the only param not handled
    public validateParams(earthDate: string, camera = '', rover?: Rover) {
      if (rover === undefined) {
        rover = this.roverConfig.defaultRover;
      }
      
      let params: any = {};
      let errors = [];
      if (this.validateEarthDate(earthDate, rover)) {
        params[this.roverConfig.paramKeyEarthDate] = earthDate;
        params[this.roverConfig.paramKeyApiKey] = this.roverConfig.apiKey;
      } else {
        errors.push(`${this.roverConfig.paramKeyEarthDate}=${earthDate}`);
      }

      if (camera !== '') {
        if (this.validateCamera(camera, rover)) {
          params[this.roverConfig.paramKeyCamera] = camera;
        } else {
          errors.push(`${this.roverConfig.paramKeyCamera}=${camera}`);
        }
      }
      if (errors.length > 0) {
        params[this.roverConfig.paramKeyError] = errors;
      }
      return params;
    }

    public validateParamsPage(
      earthDate: string, page: number, camera = '', rover?: Rover) {
      if (rover === undefined) {
        rover = this.roverConfig.defaultRover;
      }
      let params: any = {};
      params = this.validateParams(earthDate, camera);

      if (page !== 0) {
        if (page === parseInt(<any>page, 10) && page > 0
          && page <= rover.maxPageNumber) {
          if (params[this.roverConfig.paramKeyError] === undefined) {
            params[this.roverConfig.paramKeyPage] = page.toString();
          }
        } else {
          if (params[this.roverConfig.paramKeyError] === undefined) {
            params[this.roverConfig.paramKeyError] = new Array(
              `${this.roverConfig.paramKeyPage}=${page}`);
          } else {
            params[this.roverConfig.paramKeyError].push(
              `${this.roverConfig.paramKeyPage}=${page}`);
          }
        }
      }

      return params;
    }

    private validateEarthDate(earthDate: string, rover: Rover) {
      let isValid = false;
      try {
        let dateValue = new Date(earthDate);
        if (!isNaN(<any>dateValue)) {
          let maxDate = new Date();
          maxDate.setDate(
            maxDate.getDate() - rover.maxPhotoDateOffset);
          if (dateValue >= new Date(rover.minPhotoDate)
            && dateValue <= maxDate) {
            isValid = true;
          }
        }
      } catch (swallow) { }

      return isValid;
    }

    private validateCamera(validCamera: string, rover: Rover) {
      validCamera = '|' + validCamera + '|';
      return rover.cameraList.indexOf(validCamera) > -1;
    }
  }
  getModuleCore().service(
    'roverParamValidationService', RoverParamValidationService);
}
