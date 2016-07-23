namespace dogsrus.virtdog {
  export class RoverPhotoDataService {
    static $inject = ['$http', 'roverConfig',
      'roverPhotoTranslationService', 'roverParamValidationService', '$q'];
    constructor(private $http: ng.IHttpService,
      private roverConfig: RoverConfig,
      private roverPhotoTranslationService: IPhotoDataTranslator,
      private roverParamValidationService: RoverParamValidationService,
      private $q: ng.IQService
    ) { }

    public getPhotos(earthDate = this.roverConfig.minPhotoDate,
      page = 0, camera = ''): ng.IPromise<IRestPhotos> {
      let earthDateParams = this.roverParamValidationService
        .validateParamsPage(earthDate, page, camera);
      if (earthDateParams.errors !== undefined) {
        return this.$q((resolve: ng.IHttpPromiseCallbackArg<any>, reject) => {
          reject({
            data: 'error: parameter invalid - ' +
            earthDateParams.errors.join(', '),
            status: -42
          });
        });
      }
      let roverHttpConfig: ng.IRequestShortcutConfig = {
        params: earthDateParams
      };

      return this.$http.get(this.roverConfig.roverUrl, roverHttpConfig).then(
        (results: ng.IHttpPromiseCallbackArg<IRestPhotos | IRestError>) => {
          let returnData = results.data;
          // here if we got no photos, can we call again with date - 1?
          if (this.isError(returnData)) {
            return this.$q.reject({
              data: 'INFO: no photos found',
              status: -37
            });
          } else {
            return results.data;
          }
        }, (error) => {
          return this.$q.reject(error);
        });
    }

    public getTranslatedPhotos(earthDate = this.roverConfig.minPhotoDate,
      page = 0, camera = ''): ng.IPromise<DogRover> {
      let earthDateParams = this.roverParamValidationService
        .validateParamsPage(earthDate, page, camera);
      if (earthDateParams.errors !== undefined) {
        return this.$q((resolve: ng.IHttpPromiseCallbackArg<any>, reject) => {
          reject({
            data: 'error: parameter invalid - ' +
            earthDateParams.errors.join(', '),
            status: -42
          });
        });
      }
      let roverHttpConfig: ng.IRequestShortcutConfig = {
        params: earthDateParams
      };

      return this.$http.get(this.roverConfig.roverUrl, roverHttpConfig).then(
        (results: ng.IHttpPromiseCallbackArg<IRestPhotos | IRestError>) => {
          let returnData = results.data;
          // here if we got no photos, can we call again with date - 1?
          if (this.isError(returnData)) {
            return this.$q.reject({
              data: `INFO: no photos found`,
              status: -37
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

    // this should query by rover name and not care about camera name
    // and should keep going backwards a day if no photos till it gets 
    // the cameras for that rover?
    public getTranslatedCameras(
      earthDate = roverConfig.minPhotoDate): ng.IPromise<DogCamera[]> {
      let earthDateParams = this.roverParamValidationService
        .validateParams(earthDate);
      if (earthDateParams.errors !== undefined) {
        return this.$q((resolve: ng.IHttpPromiseCallbackArg<any>, reject) => {
          reject({
            data: 'error: parameter invalid - ' +
            earthDateParams.errors.join(', '),
            status: -42
          });
        });
      }
      let roverHttpConfig: ng.IRequestShortcutConfig = {
        params: earthDateParams
      };

      return this.$http.get(this.roverConfig.roverUrl, roverHttpConfig).then(
        (results: ng.IHttpPromiseCallbackArg<IRestPhotos | IRestError>) => {
          let returnData = results.data;
          // here if we got no photos, can we call again with date - 1?
          if (this.isError(returnData)) {
            return this.$q.reject({
              data: `INFO: no photos found`,
              status: -37
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

    // typeguard - since rest returns {"errors":"No Photos Found"}
    private isError(
      returnData: IRestPhotos | IRestError): returnData is IRestError {
      return (<IRestError>returnData).errors !== undefined;
    }
  }
  getModuleCore().service('roverPhotoDataService', RoverPhotoDataService);
}
