/// <reference path="../../typings/index.d.ts" />
import vdog = dogsrus.virtdog;

describe('In the file masterController.js', () => {
  describe('the masterController\'s', () => {
    let sut: vdog.MasterController,
      $rootScope: ng.IRootScopeService,
      eventNames = <vdog.EventNames>{},
      $controller: ng.IControllerService,
      masterControllerParams: {
        $rootScope: ng.IRootScopeService;
        eventNames: vdog.EventNames;
      };
    beforeEach(() => {
      angular.mock.module('app.people');
      inject(($injector: ng.auto.IInjectorService) => {
        $controller = $injector.get<ng.IControllerService>('$controller');
        $rootScope = $injector.get<ng.IRootScopeService>('$rootScope');
        masterControllerParams = {
          $rootScope: $rootScope,
          eventNames: eventNames
        };
      });
      sut = $controller<vdog.MasterController>('masterController', masterControllerParams);
    });
    describe('constructor', () => {
      it('should set familiarName to Dillon', () => {
        expect(sut.familiarName).toBe('Dillon');
      });
      it('should set speciesName to Homo Sapiens', () => {
        expect(sut.speciesName).toEqual('Homo Sapiens');
      });
      it('should add 2 items to masterActions', () => {
        expect(sut.masterActions.length).toEqual(2);
      });
      it('should set first item name in masterActions to \'Throw Object\'', () => {
        expect(sut.masterActions[0].actionName).toEqual('Throw Object');
      });
      it('should set second item name in masterActions to \'Feed\'', () => {
        expect(sut.masterActions[1].actionName).toEqual('Feed');
      });
      it('should set first item function in masterActions', () => {
        expect(sut.masterActions[0].actionFunc).toBeDefined('Function not defined for Throw Object');
        expect(sut.masterActions[0].actionFunc).not.toBeNull('Function is null for Throw Object');
      });
      it('should set second item function in masterActions', () => {
        expect(sut.masterActions[1].actionFunc).toBeDefined('Function not defined for Feed');
        expect(sut.masterActions[1].actionFunc).not.toBeNull('Function is null for Feed');
      });
      it('should add 6 items to masterObjects', () => {
        expect(sut.masterObjects.length).toEqual(6);
      });
      it('should set masterObject 1st item to Babe Ruth autographed baseball', () => {
        expect(sut.masterObjects[0].name).toEqual('Babe Ruth autographed baseball');
      });
      it('should set masterObject 2nd item to ball', () => {
        expect(sut.masterObjects[1].name).toEqual('ball');
      });
      it('should set masterObject 3rd item to Frisbee', () => {
        expect(sut.masterObjects[2].name).toEqual('Frisbee');
      });
      it('should set masterObject 4th item to stick', () => {
        expect(sut.masterObjects[3].name).toEqual('stick');
      });
      it('should set masterObject 5th item to dog food', () => {
        expect(sut.masterObjects[4].name).toEqual('dog food');
      });
      it('should set masterObject 6th item to table scraps', () => {
        expect(sut.masterObjects[5].name).toEqual('table scraps');
      });
    });
    describe('throwSomething method', () => {
      it('should broadcast the event name', () => {
        pending('wait for mocking module');
      });
    });
    describe('feedTheDog method', () => {
      it('should broadcast the event name', () => {
        pending('wait for mocking module');
      });
    });
  });
  describe('the MasterAction object\'s constructor', () => {
    let sut: vdog.MasterAction,
      actionFunc = (o: vdog.DogObject) => { return {}; };
    beforeEach(() => {
      sut = new vdog.MasterAction('masterActionName', actionFunc);
    });
    it('should set actionName to passed in name', () => {
      expect(sut.actionName).toEqual('masterActionName');
    });
    it('should set actionFunc to passed in actionFunc', () => {
      expect(sut.actionFunc).toBe(actionFunc, 'actionFunc should match passed in action func');
    });
  });
});
