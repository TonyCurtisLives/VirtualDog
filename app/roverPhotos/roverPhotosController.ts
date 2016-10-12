'use strict';
namespace dogsrus.virtdog {
  export class RoverPhotosController {
    public data = {};
    public photosToDroolOver = [];
    public roverError;
    public today = new Date();
    public photoDate = this.today.getFullYear().toString() + '-' + this.today.getMonth().toString() + '-' + this.today.getDate().toString();
    public roverCamera = '';
    public roverPhotoUrl = '';
    public cameras;

    static $inject = ['roverPhotoDataService', 'roverConfig'];
    constructor(private roverPhotoDataService: RoverPhotoDataService, private roverConfig: RoverConfig) {
      // since there is a lag on photo upload from Mars (imagine that)
      // get photos from a few weeks ago
      this.today.setTime(this.today.getTime() - ((24 * 60 * 60 * 1000) * 84));
      this.photoDate = this.today.getFullYear().toString() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate().toString();
      this.roverCamera = this.roverConfig.camera;
      this.getPhotos(this.roverCamera);
    }
    // todo: interface out the photo object and other objects from rest call
    public getPhotos(currentCamera: string) {
      this.roverPhotoDataService.getPhotos(this.photoDate, currentCamera).then((data) => {
        this.photosToDroolOver = (<any>data).photos;
        this.photosToDroolOver.forEach(photo => {
          this.roverPhotoUrl = photo.img_src;
          this.cameras = photo.rover.cameras;
        });
      }, (reason) => { this.roverError = reason; });
    }
  }
  getModuleRoverPhotos().controller('roverPhotosController', RoverPhotosController);
}
