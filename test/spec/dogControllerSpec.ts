/// <reference path="../../typings/index.d.ts" />
import vdog = dogsrus.virtdog;

// todo: major refactoring, add event tests
describe('dogController test', () => {
  beforeEach(angular.mock.module('app.dog'));
  describe('the dogController', () => {

    let $rootScope: ng.IRootScopeService,
      $controller: ng.IControllerService,
      $interval: ng.IIntervalService,
      dogConfig: vdog.DogConfiguration,
      //eventNames: vdog.EventNames,
      dogConstructorParams: {
        $rootScope: ng.IRootScopeService;
        $interval: ng.IIntervalService;
        dogConfig: vdog.DogConfiguration;
        eventNames: vdog.EventNames;
      };

    dogConfig = {
      appTitle: 'Virtual Dog Demo',
      otherDogs: [],
      startDog: <vdog.IDog>{},
      version: '0.0.1'
    };
    //eventNames = vdog.eventNames;
    beforeEach(() => {
      angular.mock.module('app.dog');
      inject(($injector: ng.auto.IInjectorService) => {
        // we need to construct every time so set up for that
        $controller = $injector.get<ng.IControllerService>('$controller');
        $rootScope = $injector.get<ng.IRootScopeService>('$rootScope');
        $interval = $injector.get<ng.IIntervalService>('$interval');

        dogConstructorParams = {
          $rootScope: $rootScope,
          $interval: $interval,
          dogConfig: dogConfig,
          // this was changed too
          eventNames: vdog.eventNames
        };
      });
    });
    describe('new', () => {
      // todo: add a beforeEach and move startdog settings and instantiation here
      it('construction test', () => {
        dogConfig.startDog.age = 99;
        dogConfig.startDog.barkSound = 'testbark';
        dogConfig.startDog.breed = 'testbreed';
        dogConfig.startDog.chewUrgeInterval = 1000 * 1 * 1 * 1;
        dogConfig.startDog.coatStyle = 'testCoatStyle';
        dogConfig.startDog.defaultAction = 'testDefaultAction';
        dogConfig.startDog.dogLonelyDuration = 1000 * 2 * 1 * 1;
        dogConfig.startDog.dogLonelyEndurance = 1000 * 3 * 1 * 1;
        dogConfig.startDog.dogSleepDuration = 1000 * 4 * 1 * 1;
        dogConfig.startDog.dogTiredInterval = 1000 * 5 * 1 * 1;
        dogConfig.startDog.earState = 'testEarState';
        dogConfig.startDog.earStyle = 'testEarStyle';
        dogConfig.startDog.familiarName = 'testFamiliarName';
        dogConfig.startDog.motherNature1Interval = 1000 * 6 * 1 * 1;
        dogConfig.startDog.motherNature2Interval = 1000 * 7 * 1 * 1;
        dogConfig.startDog.speciesName = 'testSpeciesName';
        dogConfig.startDog.startupBlog = 'testStartupBlog';
        dogConfig.startDog.tailState = dogsrus.virtdog.DogTailState.tucked;
        dogConfig.startDog.tailStyle = 'testTailStyle';
        
        let sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
          'dogController', dogConstructorParams)

        expect(sut.age).toEqual(dogConfig.startDog.age);
        expect(sut.barkSound).toEqual(dogConfig.startDog.barkSound);
        expect(sut.breed).toEqual(dogConfig.startDog.breed);
        expect(sut.chewUrgeInterval).toEqual(dogConfig.startDog.chewUrgeInterval);
        expect(sut.coatStyle).toEqual(dogConfig.startDog.coatStyle);
        expect(sut.defaultAction).toEqual(dogConfig.startDog.defaultAction);
        expect(sut.dogLonelyDuration).toEqual(dogConfig.startDog.dogLonelyDuration);
        expect(sut.dogLonelyEndurance).toEqual(dogConfig.startDog.dogLonelyEndurance);
        expect(sut.dogSleepDuration).toEqual(dogConfig.startDog.dogSleepDuration);
        expect(sut.dogTiredInterval).toEqual(dogConfig.startDog.dogTiredInterval);
        expect(sut.earState).toEqual(dogConfig.startDog.earState);
        expect(sut.earStyle).toEqual(dogConfig.startDog.earStyle);
        expect(sut.familiarName).toEqual(dogConfig.startDog.familiarName);
        expect(sut.motherNature1Interval).toEqual(dogConfig.startDog.motherNature1Interval);
        expect(sut.motherNature2Interval).toEqual(dogConfig.startDog.motherNature2Interval);
        expect(sut.speciesName).toEqual(dogConfig.startDog.speciesName);
        expect(sut.startupBlog).toEqual(dogConfig.startDog.startupBlog);
        expect(sut.tailState).toEqual(dogConfig.startDog.tailState);
        expect(sut.tailStyle).toEqual(dogConfig.startDog.tailStyle);
      });
      it('other stuff happens when new', () => {
        pending('add other constructor tests');
      });
    });
    // todo: need to test feed event

    // todo: need to test thow event
  });
});

