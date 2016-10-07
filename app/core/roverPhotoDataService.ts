namespace dogsrus.virtdog {
  interface IPromiseError {
    data: string;
    status: number;
  }
  
  export class RoverPhotoDataService {
    static $inject = ['$http', 'roverConfig', 'appValues',
      'roverPhotoTranslationService', 'roverParamValidationService', '$q'];
    constructor(private $http: ng.IHttpService,
      private roverConfig: RoverConfig,
      private appValues: AppValues,
      private roverPhotoTranslationService: IPhotoDataTranslator,
      private roverParamValidationService: RoverParamValidationService,
      private $q: ng.IQService
    ) { }

    public getTranslatedCameras(
      earthDate = this.roverConfig.defaultRover.minPhotoDate): ng.IPromise<DogCamera[]> {
      //if (earthDate) {return;}
      let earthDateParams = this.roverParamValidationService
        .validateParams(earthDate);
      if (earthDateParams.errors !== undefined) {
        return this.$q((resolve: ng.IHttpPromiseCallbackArg<any>, reject) => {
          reject({
            data: 'error: parameter invalid - ' +
            earthDateParams.errors.join(', '),
            status: this.appValues.restStatusBadParam
          });
        });
      }
      let roverHttpConfig: ng.IRequestShortcutConfig = {
        params: earthDateParams
      };

      return this.$http.get(this.roverConfig.defaultRover.roverUrl, roverHttpConfig).then(
        (results: ng.IHttpPromiseCallbackArg<IRestPhotos | IRestError>) => {
          let returnData = results.data;
          // here if we got no photos, can we call again with date - 1?
          if (this.isError(returnData)) {
            return this.$q.reject({
              data: `INFO: no photos found`,
              status: this.appValues.restStatusNoPhotos
            });
          } else {
            let translatedData = this.roverPhotoTranslationService
              .translateCameraList<IRestPhotos, DogCamera>(
              { photos: [returnData.photos[0]] });
            return translatedData;
          }
        }, (error: ng.IHttpPromiseCallbackArg<any>) => {
          return this.$q.reject(error);
        });
    }

    public getPhotos(earthDate = this.roverConfig.defaultRover.minPhotoDate,
      page = 0, camera = '', roverName = ''): ng.IPromise<IRestPhotos> {
      let error = <IPromiseError>{};
      let earthDateParams: any;
      let rover = this.getRover(roverName, error);

      if (rover) {
        earthDateParams = this.getParams(
          earthDate, page, camera, rover, error);
      }
      if (!rover || !earthDateParams) {
        return this.$q.reject(error);
      }

      let roverHttpConfig: ng.IRequestShortcutConfig = {
        params: earthDateParams
      };

      return this.$http.get(rover.roverUrl, roverHttpConfig).then(
        (results: ng.IHttpPromiseCallbackArg<IRestPhotos | IRestError>) => {
          let returnData = results.data;
          // here if we got no photos, can we call again with date - 1?
          if (this.isError(returnData)) {
            error.data = 'INFO: no photos found';
            error.status = this.appValues.restStatusNoPhotos;
            return this.$q.reject(error);
          } else {
            return results.data;
          }
        }, (error) => {
          return this.$q.reject(error);
        });
    }

    public getTranslatedPhotos(
      earthDate = this.roverConfig.defaultRover.minPhotoDate,
      page = 0, camera = ''): ng.IPromise<DogRover> {
      let earthDateParams = this.roverParamValidationService
        .validateParamsPage(earthDate, page, camera);
      if (earthDateParams.errors !== undefined) {
        return this.$q((resolve: ng.IHttpPromiseCallbackArg<any>, reject) => {
          reject({
            data: 'error: parameter invalid - ' +
            earthDateParams.errors.join(', '),
            status: this.appValues.restStatusBadParam
          });
        });
      }
      let roverHttpConfig: ng.IRequestShortcutConfig = {
        params: earthDateParams
      };

      return this.$http.get(
        this.roverConfig.defaultRover.roverUrl, roverHttpConfig)
        .then(
        (results: ng.IHttpPromiseCallbackArg<IRestPhotos | IRestError>) => {
          let returnData = results.data;
          // here if we got no photos, can we call again with date - 1?
          if (this.isError(returnData)) {
            return this.$q.reject({
              data: `INFO: no photos found`,
              status: this.appValues.restStatusNoPhotos
            });
          } else {
            let translatedData = this.roverPhotoTranslationService
              .translateAllPhotos<IRestPhotos, DogRover>(returnData);
            return translatedData;
          }
        }, (error: ng.IHttpPromiseCallbackArg<any>) => {
          return this.$q.reject(error);
        });
    }

    private getRover(
      roverName: string, error: IPromiseError) {
      let roversFiltered: Rover[];
      let rover: Rover = null;
      if (!roverName) {
        rover = this.roverConfig.defaultRover;
      } else {
        roversFiltered = this.roverConfig.rovers.filter(
          (roverToCheck, i, rovers) => { return roverToCheck.roverName === roverName; });
        if (roversFiltered.length !== 1) {
          error.data = `error: rover name invalid - ${roverName}`;
          error.status = this.appValues.restStatusBadRover;
        } else {
          rover = roversFiltered[0];
        }
      }
      return rover;
    }

    private getParams(earthDate: string, page: number, camera: string,
      rover: Rover, error: IPromiseError): boolean {
      let earthDateParams = this.roverParamValidationService
        .validateParamsPage(earthDate, page, camera, rover);
      if (earthDateParams.errors !== undefined) {
        error.data = 'error: parameter invalid - ' +
          earthDateParams.errors.join(', ');
        error.status = this.appValues.restStatusBadParam;
        earthDateParams = null;
      }
      return earthDateParams;
    }

    // typeguard - since rest returns {"errors":"No Photos Found"}
    private isError(
      returnData: IRestPhotos | IRestError): returnData is IRestError {
      return (<IRestError>returnData).errors !== undefined;
    }
  }
  getModuleCore().service('roverPhotoDataService', RoverPhotoDataService);
}
