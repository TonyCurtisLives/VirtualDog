/// <reference path="../../typings/index.d.ts" />
import vdog = dogsrus.virtdog;

describe('In the file masterController.ts', () => {
  describe('the MasterController\'s', () => {
    let sut: vdog.MasterController,
      $rootScope: ng.IRootScopeService,
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
        };
      });
      sut = $controller<vdog.MasterController>('masterController', masterControllerParams);
    });
    describe('constructor', () => {

    });
    describe('throwSomething method', () => {

    });
    describe('feedTheDog method', () => {

    });
  });
  describe('the MasterAction object\'s constructor', () => {

  });
});