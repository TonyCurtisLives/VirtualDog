namespace dogsrus.virtdog {
  export class MasterAction {
    constructor(
      public actionName: string,
      public actionFunc: (actionObject: DogObject) => void
    ) { }
  }

  export class MasterController implements IAnimal {
    public speciesName: string = 'Homo Sapiens';
    public familiarName: string;
    public defaultAction: string;

    public selectedAction: MasterAction;
    public masterActions: MasterAction[] = [];
    public selectedObject: DogObject;
    public masterObjects: DogObject[] = [];

    static $inject = ['$rootScope', 'eventNames'];
    constructor(private $rootScope: ng.IRootScopeService, private eventNames: EventNames) {
      this.familiarName = 'Dillon';
      this.initializeLists();
    }

    public throwSomething = (object) =>
      this.$rootScope.$broadcast(this.eventNames.catHiss, object);

    public feedTheDog = (food) =>
      this.$rootScope.$broadcast(this.eventNames.masterFeed, {});

    // --------------------- private stuff down here -------------------------------
    private initializeLists() {
      this.masterActions.push(new MasterAction('Throw Object', this.throwSomething));
      this.masterActions.push(new MasterAction('Feed', this.feedTheDog));

      let dogObject = new DogObject('Babe Ruth autographed baseball', true, false);
      dogObject.bounces = true;
      dogObject.expensive = true;
      dogObject.irreplaceable = true;
      dogObject.monetaryValue = 100000;
      dogObject.chewLimit = 15;
      this.masterObjects.push(dogObject);

      dogObject = new DogObject('ball', true, false);
      dogObject.bounces = true;
      dogObject.chewLimit = 100;
      this.masterObjects.push(dogObject);

      dogObject = new DogObject('Frisbee', true, false);
      dogObject.flies = true;
      dogObject.chewLimit = 20;
      this.masterObjects.push(dogObject);

      this.masterObjects.push(new DogObject('stick', true, false));
      this.masterObjects.push(new DogObject('dog food', true, true));
      this.masterObjects.push(new DogObject('table scraps', true, true));
    }
  }
  getModulePeople().controller('masterController', MasterController);
}
