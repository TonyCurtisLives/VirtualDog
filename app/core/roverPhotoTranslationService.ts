namespace dogsrus.virtdog {
  export interface IRestCameraType {
    name: string;
    full_name: string;
  }
  export interface IRestRoverCamera extends IRestCameraType {
    id: number;
    rover_id: number;
  };
  export interface IRestRover {
    id: number;
    name: string;
    landing_date: string;
    max_sol: number;
    max_date: string;
    total_photos: number;
    cameras: IRestCameraType[];
  };
  export interface IRestPhoto {
    id: number;
    sol: number;
    camera: IRestRoverCamera;
    img_src: string;
    earth_date: string;
    rover: IRestRover;
  };

  // this is the top level object returned from the rest service
  export interface IRestPhotos {
    photos: IRestPhoto[];
  }
  export interface IRestError {
    errors: string;
  };

  export class DogCamera {
    public Photos = new Array<DogPhoto>();
    constructor(
      public Rover?: DogRover,
      public ShortName?: string,
      public LongName?: string
    ) { }
  }
  export class DogPhoto {
    constructor(
      public Url?: string,
      public Camera?: DogCamera,
      public Date?: string
    ) { }
  }
  export class DogRover {
    constructor(
      public Name?: string,
      public MinPhotoDate?: string,
      public MaxPhotoDate?: string,
      public Cameras = new Array<DogCamera>()
    ) { }
  }

  export interface IPhotoDataTranslator {
    translateCameraList<T1, T2>(data: T1): T2[];
    translateRover<T1, T2>(data: T1): T2;
    translateAllPhotos<T1, T2>(data: T1): T2;
  }

  export class RoverPhotoTranslationService implements IPhotoDataTranslator {

    constructor() { }

    public translateCameraList<T1 extends IRestPhotos,
      T2 extends DogCamera>(data: T1) {
      let rover = this.getRover(data);
      if (rover.Name !== undefined) {
        this.getCameras(data, rover);
      }
      return rover.Cameras;
    }

    public translateRover<T1 extends IRestPhotos,
      T2 extends DogRover>(data: T1) {
      return this.getRover(data);
    }

    public translateAllPhotos<T1 extends IRestPhotos,
      T2 extends DogRover>(data: T1) {
      let rover = this.getRover(data);
      if (rover.Name !== undefined) {
        this.getCameras(data, rover);
        data.photos.forEach((photo, i, photos) => {
          let camera = rover.Cameras.filter((camera, x, cameras) => {
            return camera.ShortName === photo.camera.name;
          })[0];
          camera.Photos.push(new DogPhoto(
            photo.img_src, camera, photo.earth_date));
        });
      }
      return rover;
    }

    private getRover(data: IRestPhotos) {
      let rover = new DogRover();
      if (data.photos.length > 0) {
        rover.Name = data.photos[0].rover.name;
        rover.MinPhotoDate = data.photos[0].rover.landing_date;
        rover.MaxPhotoDate = data.photos[0].rover.max_date;
      }
      return rover;
    }

    private getCameras(data: IRestPhotos, rover: DogRover) {
      if (rover.Name !== undefined) {
        data.photos[0].rover.cameras.forEach((camera, i, cameras) => {
          let dogCamera = new DogCamera(rover, camera.name, camera.full_name);
          rover.Cameras.push(dogCamera);
        });
      }
    }
  }
  getModuleCore().service(
    'roverPhotoTranslationService', RoverPhotoTranslationService);
}
