namespace dogsrus.virtdog {
  export class EventNames {
    public dogBark = 'dogBark';
    public dogChase = 'dogChase';
    public catMeow = 'catMeow';
    public catBO = 'catBO';
    public catMove = 'catMove';
    public catHiss = 'catHiss';
    public decapitate = 'decapitate';
    public masterCall = 'masterCall';
    public masterThrow = 'masterThrow';
    public masterFeed = 'masterFeed';
    public masterTake = 'masterTake';
    public motherNatureCalls1 = 'motherNatureCalls1';
    public motherNatureCalls2 = 'motherNatureCalls2';
    public hunger = 'hunger';
    public chewUrge = 'chewUrge';
    public exhaustion = 'exhaustion';
    public loneliness = 'loneliness';
    public excitement = 'excitement';
    public layAround = 'layAround';
    public animalRun = 'animalRun';
    public personPet = 'personPet';
    public personThreaten = 'personThreaten';
    public commandSit = 'sit';
    public commandLayDown = 'lay down';
    public commandStay = 'stay';
    public commandShake = 'shake';
    public changeDomain = 'changeDomain';
  }

  export class RoverConfig {
    public roverUrl = 'http://localhost:8200//mars-photos/api/v1/rovers/curiosity/photos';
    public apiKey = 'DEMO_KEY';
    public camera = 'FHAZ';
    public earthDate = '2015-8-26';
    public roverName = 'curiosity';
    public alternateUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos';
  }

  export class DogPlaces {
    public home: DogDomain = { name: 'home', imagePath: 'zeusinside.jpg', indoors: true, placeObjects: [] };
    public frontYard: DogDomain = { name: 'front yard', imagePath: 'zeusfrontyard.jpg', indoors: false, placeObjects: [] };
    public backYard: DogDomain = { name: 'back yard', imagePath: 'zeusbackyard.jpg', indoors: false, placeObjects: [] };
    public park: DogDomain = { name: 'park', imagePath: 'zeuspark.jpg', indoors: false, placeObjects: [] };
    public bathroom: DogDomain = { name: 'bathroom', imagePath: 'fireplug.jpg', indoors: false, placeObjects: [] };
  }

  (() => {
    dogsrus.virtdog.getModuleCore().constant('eventNames', new EventNames());
    dogsrus.virtdog.getModuleCore().constant('roverConfig', new RoverConfig());
    dogsrus.virtdog.getModuleCore().constant('dogPlaces', new DogPlaces());
  })();
}
