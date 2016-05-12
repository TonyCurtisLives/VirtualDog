namespace dogsrus.virtdog {
  export class MasterAction {
    constructor(
      public actionName: string,
      public actionFunc: (actionObject: DogObject) => {}
    ) { }
  }

  export class MasterController implements IAnimal {
    public speciesName: string = 'Homo Sapiens';
    public familiarName: string;
    public defaultAction: string;

    public selectedAction: MasterAction;
    public masterActions: MasterAction[] = [];
    public selectedObject: DogObject;
    public mastersObjects: DogObject[] = [];

    static $inject = ['$rootScope', 'eventNames'];
    constructor(private $rootScope: ng.IRootScopeService, private eventNames: EventNames) {
      this.familiarName = 'Dillon';
      this.initializeLists();

      // bind this to actions since they are called from html binding
      this.throwSomething = this.throwSomething.bind(this);
      this.masterActions[0].actionFunc = this.masterActions[0].actionFunc.bind(this);
      this.feedTheDog = this.feedTheDog.bind(this);
      this.masterActions[1].actionFunc = this.masterActions[1].actionFunc.bind(this);
    }

    public throwSomething(object) {
      this.$rootScope.$broadcast(this.eventNames.masterThrow, object);
      return {};
    }

    public feedTheDog(food) {
      this.$rootScope.$broadcast(this.eventNames.masterFeed, food);
      return {};
    }

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
      this.mastersObjects.push(dogObject);

      dogObject = new DogObject('ball', true, false);
      dogObject.bounces = true;
      dogObject.chewLimit = 100;
      this.mastersObjects.push(dogObject);

      dogObject = new DogObject('Frisbee', true, false);
      dogObject.flies = true;
      dogObject.chewLimit = 20;
      this.mastersObjects.push(dogObject);

      this.mastersObjects.push(new DogObject('stick', true, false));
      this.mastersObjects.push(new DogObject('dog food', true, true));
      this.mastersObjects.push(new DogObject('table scraps', true, true));
    }
  }
  (() => {
    dogsrus.virtdog.getModulePeople().controller('masterController', MasterController);
  })();
}
