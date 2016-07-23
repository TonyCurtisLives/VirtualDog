namespace dogsrus.virtdog {
  export var eventNames = {
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

  export var roverConfig = {
    // roverUrl: 'http://localhost:8200/mars-photos/api/v1/rovers/opportunity/photos',
    // roverUrl: 'http://localhost:8200/mars-photos/api/v1/rovers/spirit/photos',
    roverUrl: 'http://localhost:8200/mars-photos/api/v1/rovers/curiosity/photos',
    apiKey: 'DEMO_KEY',
    //camera: 'MST', // this camera only works for curiosity
    camera: 'MAST', // this camera only works for curiosity
    earthDate: '2014-8-26', // a default date but this won't work for spirit (national dog day)
    roverName: 'curiosity',
    minPhotoDate: '2012-8-6', // this base photo date won't work for spirit
    // alternateUrl: 'https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos'
    // alternateUrl: 'https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos'
    alternateUrl: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos',
    maxPhotoDateOffset: 30,
    cameraList: '|FHAZ|RHAZ|MAST|CHEMCAM|MAHLI|MARDI|NAVCAM|',
    maxPageNumber: 200,
    paramKeyEarthDate: 'earth_date',
    paramKeyApiKey: 'api_key',
    paramKeyPage: 'page',
    paramKeyCamera: 'camera',
    paramKeyError: 'errors'
  };
  export type RoverConfig = typeof roverConfig;

  export var dogPlaces = {
    home: <DogDomain>{ name: 'home', imagePath: 'zeusinside.jpg', indoors: true, placeObjects: [] },
    frontYard: <DogDomain>{ name: 'front yard', imagePath: 'zeusfrontyard.jpg', indoors: false, placeObjects: [] },
    backYard: <DogDomain>{ name: 'back yard', imagePath: 'zeusbackyard.jpg', indoors: false, placeObjects: [] },
    park: <DogDomain>{ name: 'park', imagePath: 'zeuspark.jpg', indoors: false, placeObjects: [] },
    bathroom: <DogDomain>{ name: 'bathroom', imagePath: 'fireplug.jpg', indoors: false, placeObjects: [] }
  };
  export type DogPlaces = typeof dogPlaces;

  export var appValues = {
    parameterInvalidText: 'parameter invalid',
    restStatusBadParam: -42,
    restStatusNoPhotos: -37
  };
  export type AppValues = typeof appValues;

  getModuleCore().constant('eventNames', eventNames);
  getModuleCore().constant('roverConfig', roverConfig);
  getModuleCore().constant('dogPlaces', dogPlaces);
  getModuleCore().constant('appValues', appValues);
}
