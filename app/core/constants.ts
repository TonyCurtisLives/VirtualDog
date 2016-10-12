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
    roverUrl: 'http://localhost:8200//mars-photos/api/v1/rovers/curiosity/photos',
    apiKey: 'DEMO_KEY',
    camera: 'FHAZ',
    earthDate: '2014-8-26',
    roverName: 'curiosity',
    alternateUrl: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos'
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

  getModuleCore().constant('eventNames', eventNames);
  getModuleCore().constant('roverConfig', roverConfig);
  getModuleCore().constant('dogPlaces', dogPlaces);
}
