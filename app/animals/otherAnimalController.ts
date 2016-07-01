namespace dogsrus.virtdog {
  export class OtherAnimalController {
    public otherAnimals: IAnimal[] = [];
    public selectedAnimal: IAnimal;
    public lastAction: string = '';

    static $inject = ['$rootScope', 'eventNames'];
    constructor(private $rootScope: ng.IRootScopeService, private eventNames: EventNames) {
      this.intializeAnimalList(eventNames);
    }

    public performAction() {
      // in future may keep track of last action so we can respond back and forth
      this.lastAction = this.selectedAnimal.defaultAction;
      this.$rootScope.$broadcast(this.selectedAnimal.defaultAction, this.selectedAnimal);
    }

    private intializeAnimalList(eventNames: EventNames) {
      this.otherAnimals.push(
        {
          defaultAction: eventNames.catHiss,
          familiarName: 'Alley Cat',
          speciesName: ''
        });
      this.otherAnimals.push(
        {
          defaultAction: eventNames.decapitate,
          familiarName: 'No Ordinary Rabbit',
          speciesName: ''
        });
      this.otherAnimals.push(
        {
          defaultAction: eventNames.dogBark,
          familiarName: 'Little Noisy Dog',
          speciesName: ''
        });
      this.performAction = this.performAction.bind(this);
    }
  }
  getModuleOtherAnimal().controller('otherAnimalController', OtherAnimalController);
}
