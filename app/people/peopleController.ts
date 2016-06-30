namespace dogsrus.virtdog {
  export class PersonAction {
    constructor(
      public actionName: string,
      public actionFunc: (actionObject: DogObject) => void
    ) { }
  }

  export class PeopleController {
    public people: IAnimal[] = [];
    public selectedPerson: IAnimal;

    public selectedAction: PersonAction;
    public personActions: PersonAction[] = [];

    static $inject = ['$rootScope', 'eventNames'];
    constructor(private $rootScope: ng.IRootScopeService, private eventNames: EventNames) {
      this.initializeLists();
    }

    public commandStay = (person) =>
      this.$rootScope.$broadcast(this.eventNames.commandStay, person);

    public commandShake = (person) =>
      this.$rootScope.$broadcast(this.eventNames.commandShake, person);

    public runAway = (person) =>
      this.$rootScope.$broadcast(this.eventNames.animalRun, person);

    public pet = (person) =>
      this.$rootScope.$broadcast(this.eventNames.personPet, person);

    // --------------------- private stuff down here -------------------------------
    private initializeLists() {
      this.personActions.push(new PersonAction('Command Zeus to Stay', this.commandStay));
      this.personActions.push(new PersonAction('Command Zeus to Shake', this.commandShake));
      this.personActions.push(new PersonAction('Run Away', this.runAway));
      this.personActions.push(new PersonAction('Pet Zeus', this.pet));

      this.people.push(
        {
          defaultAction: this.eventNames.personPet,
          familiarName: 'The Alpha Male',
          speciesName: 'Homo Sapiens'
        }
      );
      this.people.push(
        {
          defaultAction: this.eventNames.personPet,
          familiarName: 'The She Wolf',
          speciesName: 'Homo Sapiens'
        }
      );
      this.people.push(
        {
          defaultAction: this.eventNames.animalRun,
          familiarName: 'The Mailman',
          speciesName: 'Homo Sapiens'
        }
      );
    }
  }
  getModulePeople().controller('peopleController', PeopleController);
}
