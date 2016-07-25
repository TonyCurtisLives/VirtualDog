namespace dogsrus.virtdogtest {
  import vdog = virtdog;

  describe('In the file masterController.ts', () => {
    describe('the MasterController\'s', () => {
      let sut: vdog.MasterController,
        $rootScope: ng.IRootScopeService,
        $controller: ng.IControllerService,
        eventNamesTest = vdogEvents,
        masterControllerParams: {
          $rootScope: ng.IRootScopeService;
        };
      beforeEach(() => {
        angular.mock.module('app.core', ($injector: ng.auto.IInjectorService) => {
          eventNamesTest = $injector.get<vdog.EventNames>('eventNames');
        });
        angular.mock.module('app.people');
        inject(($injector: ng.auto.IInjectorService) => {
          $controller = $injector.get<ng.IControllerService>('$controller');
          $rootScope = $injector.get<ng.IRootScopeService>('$rootScope');
        });
        masterControllerParams = {
          $rootScope: $rootScope
        };
        sut = $controller<vdog.MasterController>('masterController', masterControllerParams);
      });
      describe('constructor', () => {
        it('should set familiarName to Dillon', () => {
          expect(sut.familiarName).toEqual('Dillon');
        });
        it('should set speciesName to Homo Sapiens', () => {
          expect(sut.speciesName).toEqual('Homo Sapiens');
        });
        it('should add 2 items to masterActions', () => {
          expect(sut.masterActions.length).toEqual(2);
        });
        it('should set first item actionName in masterActions to \'Throw Object\'', () => {
          expect(sut.masterActions[0].actionName).toEqual('Throw Object');
        });
        it('should set first item actionFunc in masterActions', () => {
          expect(sut.masterActions[0].actionFunc).toBeDefined('actionFunc not defined for Throw Object');
          expect(sut.masterActions[0].actionFunc).not.toBeNull('actionFunc is null for Throw Object');
        });
        it('should set second item actionName in masterActions to \'Feed\'', () => {
          expect(sut.masterActions[1].actionName).toEqual('Feed');
        });
        it('should set second item actionFunc in masterActions', () => {
          expect(sut.masterActions[1].actionFunc).toBeDefined('actionFunc not defined for Feed');
          expect(sut.masterActions[1].actionFunc).not.toBeNull('actionFunc is null for Feed');
        });
        it('should add 6 items to masterObjects', () => {
          expect(sut.masterObjects.length).toEqual(6);
        });
        it('should set masterObject item 1 name to \'Babe Ruth autographed baseball\'', () => {
          expect(sut.masterObjects[0].name).toEqual('Babe Ruth autographed baseball');
        });
        it('should set masterObject item 2 name to \'ball\'', () => {
          expect(sut.masterObjects[1].name).toEqual('ball');
        });
        it('should set masterObject item 3 name to \'Frisbee\'', () => {
          expect(sut.masterObjects[2].name).toEqual('Frisbee');
        });
        it('should set masterObject item 4 name to \'stick\'', () => {
          expect(sut.masterObjects[3].name).toEqual('stick');
        });
        it('should set masterObject item 5 name to \'dog food\'', () => {
          expect(sut.masterObjects[4].name).toEqual('dog food');
        });
        it('should set masterObject item 6 name to \'table scraps\'', () => {
          expect(sut.masterObjects[5].name).toEqual('table scraps');
        });
      });
      describe('broadcast related property', () => {
        let broadcastObject = new vdog.DogObject('meh', false, false);
        beforeEach(() => {
          spyOn($rootScope, '$broadcast');
        });
        describe('throwSomething', () => {
          it('should broadcast the throw event name and the object thrown', () => {
            sut.throwSomething(broadcastObject);
            expect($rootScope.$broadcast).toHaveBeenCalledWith(
              eventNamesTest.masterThrow, broadcastObject);
          });
        });
        describe('feedTheDog', () => {
          it('should broadcast the feed event name and the object fed', () => {
            sut.feedTheDog(broadcastObject);
            expect($rootScope.$broadcast).toHaveBeenCalledWith(
              eventNamesTest.masterFeed, broadcastObject);
          });
        });
      });
      // todo: throw this away after proving spyOn works
      describe('feedTheDog, when $broadcast is being spied on', () => {
        let foodObject: vdog.DogObject;
        let wasBroadcast: boolean;
        beforeEach(() => {
          foodObject = new vdog.DogObject('meh', false, false);
          wasBroadcast = false;
          spyOn($rootScope, '$broadcast');
          $rootScope.$on(eventNamesTest.masterFeed, (event, args) => wasBroadcast = true);
        });
        describe('and there is no callThrough', () => {
          it('should not broadcast', () => {
            sut.feedTheDog(foodObject);
            expect($rootScope.$broadcast).toHaveBeenCalled();
            expect(wasBroadcast).toBeFalsy;
          });
        });
        describe('and there is a callThrough', () => {
          it('should broadcast', () => {
            (<jasmine.Spy>($rootScope.$broadcast)).and.callThrough();
            sut.feedTheDog(foodObject);
            expect($rootScope.$broadcast).toHaveBeenCalled();
            expect(wasBroadcast).toBeTruthy;
          });
        });

      });
    });
    describe('the MasterAction\'s constructor', () => {
      let sut: vdog.MasterAction,
        actionFunc = (o: vdog.DogObject) => { };
      beforeEach(() => {
        sut = new vdog.MasterAction('masterActionName', actionFunc);
      });
      it('should set actionName to passed in name', () => {
        expect(sut.actionName).toEqual('masterActionName');
      });
      it('should set actionFunc to passed in function', () => {
        expect(sut.actionFunc).toBe(actionFunc, 'actionFunc should match passed in action function');
      });
    });
  });
}
