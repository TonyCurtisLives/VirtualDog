namespace dogsrus.virtdog {
  export class DogDomainController {
    public placeObjects: DogObject[] = [];
    public place: DogDomain;
    public places: DogDomain[] = [];

    static $inject = ['$rootScope', 'dogPlaces', 'eventNames']
    constructor(private $rootScope: ng.IRootScopeService, public dogPlaces: DogPlaces, private eventNames: EventNames) {
      this.initializeDomain();
    }

    public domainSelected(domain: DogDomain) {
      this.$rootScope.$broadcast(this.eventNames.changeDomain, domain);
    }

    // default initialization is home
    private initializeDomain() {
      this.place = this.dogPlaces.home;
      this.places.push(this.dogPlaces.home);
      this.places.push(this.dogPlaces.backYard);
      this.places.push(this.dogPlaces.frontYard);
      this.places.push(this.dogPlaces.park);
      this.places.push(this.dogPlaces.bathroom);
      this.placeObjects.push(
        new DogObject('Really Nice Couch', true, false)
      );
      this.placeObjects[0].expensive = true;
      this.placeObjects[0].monetaryValue = 2000;
    }
  }
  getModuleDogDomain().controller('dogDomainController', DogDomainController);
}
