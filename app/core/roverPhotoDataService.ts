namespace dogsrus.virtdog {
  export class RoverPhotoDataService {
    static $inject = ['$http', 'roverConfig'];
    constructor(private $http: ng.IHttpService, private roverConfig: RoverConfig) { }

    public getPhotos(earthDate = this.roverConfig.earthDate, camera = this.roverConfig.camera) {
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
    public getPhotosJsonP(earthDate = this.roverConfig.earthDate, camera = this.roverConfig.camera) {
      let roverHttpConfig: ng.IRequestConfig = {
        method: 'GET',
        params: {
          'earth_date': earthDate,
          'camera': camera,
          'api_key': this.roverConfig.apiKey,
          'callback': 'JSON_CALLBACK'
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
    
    // public getPhotosJsonP(earthDate = this.roverConfig.earthDate, camera = this.roverConfig.camera) {
    //   let roverHttpConfig: ng.IRequestConfig = {
    //     method: 'JSONP',
    //     params: {
    //       'earth_date': earthDate,
    //       'camera': camera,
    //       'api_key': this.roverConfig.apiKey
    //     },
    //     url: this.roverConfig.roverUrl
    //   };

    //   return this.$http(roverHttpConfig).then(
    //     (results) => {
    //       return results.data;
    //     }, (response) => {
    //       return response;
    //     });
    // }
  }
  (() => {
    dogsrus.virtdog.getModuleCore().service('roverPhotoDataService', RoverPhotoDataService);
  })();
}
