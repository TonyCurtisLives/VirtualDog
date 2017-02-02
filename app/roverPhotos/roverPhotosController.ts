'use strict';
namespace dogsrus.virtdog {
  export class RoverPhotosController {
    public data = {};
    public photosToDroolOver = [];
    public roverError;
    public today = new Date();
    public photoDate = this.today.getFullYear().toString() + '-' + this.today.getMonth().toString() + '-' + this.today.getDate().toString();
    public selectedDate = this.today;
    public rover: Rover;
    public roverCamera = '';
    public roverPhotoUrl = '';
    public cameras: string[];
    public rovers: Rover[];
    public photos: DogPhoto[];
    public currentPhotoIndex = 0;

    static $inject = ['roverPhotoDataService', 'roverConfig'];
    constructor(private roverPhotoDataService: RoverPhotoDataService, private roverConfig: RoverConfig) {
      // since there is a lag on photo upload from Mars (imagine that)
      // get photos from a few weeks ago
      this.today.setTime(this.today.getTime() - ((24 * 60 * 60 * 1000) * 60));
      this.photoDate = this.today.getFullYear().toString() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate().toString();
      this.rovers = this.roverConfig.rovers;
      this.rover = this.roverConfig.defaultRover;
      this.roverSelected();
      this.getPhotos(this.today, this.roverCamera, this.rover.roverName);
    }

    public roverSelected() {
      this.roverCamera = this.rover.camera; // use default camera to ensure some photo
      this.cameras = this.rover.cameraList.split('|').filter(s => s.length > 0);
    }
    // todo: interface out the photo object and other objects from rest call
    public getPhotos(dateOfPhoto: Date, currentCamera: string, roverName: string) {
      var dateString = dateOfPhoto.getFullYear().toString() + '-'
        + (dateOfPhoto.getMonth() + 1).toString() + '-' + dateOfPhoto.getDate().toString();
      this.roverPhotoDataService.getPhotos(dateString, 0, currentCamera, roverName).then((data) => {
        this.photosToDroolOver = (<any>data).photos;
        if (this.photosToDroolOver.length > 0) {
          this.roverError = '';
          this.currentPhotoIndex = 0;
          this.roverPhotoUrl = this.photosToDroolOver[this.currentPhotoIndex].img_src;
        }
        // this.photosToDroolOver.forEach(photo => {
        //   this.roverPhotoUrl = photo.img_src;
        //   //this.cameras = photo.rover.cameras;
        // });
      }, (reason) => {
        this.currentPhotoIndex = -1;
        this.photosToDroolOver = [];
        this.roverPhotoUrl = '';
        this.roverError = reason.data;
      });
    }

    public setPhoto(indexChange: number){
      this.currentPhotoIndex += indexChange;
      this.roverPhotoUrl = this.photosToDroolOver[this.currentPhotoIndex].img_src;
    }
  }
  getModuleRoverPhotos().controller('roverPhotosController', RoverPhotosController);
}
