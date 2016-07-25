namespace dogsrus.virtdog {
  var eventNames = {
    dogBark: 'dogBark',
    dogChase: 'dogChase',
    catMeow: 'catMeow',
    catBO: 'catBO',
    catMove: 'catMove',
    catHiss: 'catHiss',
    decapitate: 'decapitate',
    masterCall: 'masterCall',
    masterThrow: 'masterThrow',
    masterFeed: 'masterFeed',
    masterTake: 'masterTake',
    motherNatureCalls1: 'motherNatureCalls1',
    motherNatureCalls2: 'motherNatureCalls2',
    hunger: 'hunger',
    chewUrge: 'chewUrge',
    exhaustion: 'exhaustion',
    loneliness: 'loneliness',
    excitement: 'excitement',
    layAround: 'layAround',
    animalRun: 'animalRun',
    personPet: 'personPet',
    personThreaten: 'personThreaten',
    commandSit: 'sit',
    commandLayDown: 'lay down',
    commandStay: 'stay',
    commandShake: 'shake',
    changeDomain: 'changeDomain'
  };
  export type EventNames = typeof eventNames;

  let defaultRoverUnit = {
    alternateUrl: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos',
    camera: 'MAST',
    cameraList: '|FHAZ|RHAZ|MAST|CHEMCAM|MAHLI|MARDI|NAVCAM|',
    maxPageNumber: 149,
    maxPhotoDateOffset: 30,
    minPhotoDate: '2012-8-6',
    roverName: 'curiosity',
    roverUrl: 'http://localhost:8200/mars-photos/api/v1/rovers/curiosity/photos'
  };
  export type Rover = typeof defaultRoverUnit;

  let roverConfig = {
      apiKey: 'DEMO_KEY',
      defaultRover: defaultRoverUnit,
      paramKeyApiKey: 'api_key',
      paramKeyCamera: 'camera',
      paramKeyEarthDate: 'earth_date',
      paramKeyError: 'errors',
      paramKeyPage: 'page',
      rovers: new Array(defaultRoverUnit)
    };
  export type RoverConfig = typeof roverConfig;

  var dogPlaces = {
    home: <DogDomain>{ name: 'home', imagePath: 'zeusinside.jpg', indoors: true, placeObjects: [] },
    frontYard: <DogDomain>{ name: 'front yard', imagePath: 'zeusfrontyard.jpg', indoors: false, placeObjects: [] },
    backYard: <DogDomain>{ name: 'back yard', imagePath: 'zeusbackyard.jpg', indoors: false, placeObjects: [] },
    park: <DogDomain>{ name: 'park', imagePath: 'zeuspark.jpg', indoors: false, placeObjects: [] },
    bathroom: <DogDomain>{ name: 'bathroom', imagePath: 'fireplug.jpg', indoors: false, placeObjects: [] }
  };
  export type DogPlaces = typeof dogPlaces;

  export var appValues = {
    restStatusBadParam: -42,
    restStatusNoPhotos: -37,
    restStatusBadRover: -7
  };
  export type AppValues = typeof appValues;

  getModuleCore().constant('eventNames', eventNames);
  getModuleCore().constant('roverConfig', roverConfig);
  getModuleCore().constant('dogPlaces', dogPlaces);
  getModuleCore().constant('appValues', appValues);
}
