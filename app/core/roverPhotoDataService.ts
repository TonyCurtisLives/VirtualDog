namespace dogsrus.virtdog {
  export class RoverPhotoDataService {
    static $inject = ['$http', 'roverConfig'];
    constructor(private $http: ng.IHttpService, private roverConfig: RoverConfig) { }

    public getPhotos(earthDate: string = this.roverConfig.earthDate, camera: string = this.roverConfig.camera) {
      let roverHttpConfig: ng.IRequestConfig = {
        method: 'GET',
        params: {
          'earth_date': earthDate,
          'camera': camera,
          'api_key': this.roverConfig.apiKey,
          'preventIECache': new Date().getTime()
        },
        url: this.roverConfig.roverUrl
      };

      return this.$http(roverHttpConfig).then(
        (results) => {
          return results.data;
        }, (response) => {
          return response;
        });
    }
  }
  getModuleCore().service('roverPhotoDataService', RoverPhotoDataService);
}
