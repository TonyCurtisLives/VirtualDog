/// <reference path="../../typings/index.d.ts" />
import vdog = dogsrus.virtdog;

describe('In the file masterController.ts', () => {
  describe('the MasterController\'s', () => {
    let sut: vdog.MasterController,
      $rootScope: ng.IRootScopeService,
      //eventNames = new vdog.EventNames(),
      $controller: ng.IControllerService,
      masterControllerParams: {
        $rootScope: ng.IRootScopeService;
        eventNames: vdog.EventNames
      };
    beforeEach(() => {
      angular.mock.module('app.people');
      inject(($injector: ng.auto.IInjectorService) => {
        $controller = $injector.get<ng.IControllerService>('$controller');
        $rootScope = $injector.get<ng.IRootScopeService>('$rootScope');
        masterControllerParams = {
          $rootScope: $rootScope,
          eventNames: vdog.eventNames
          // eventNames: eventNames
        };
      });
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
    describe('throwSomething method', () => {

    });
    describe('feedTheDog method', () => {

    });
  });
  describe('the MasterAction object\'s constructor', () => {

  });
});