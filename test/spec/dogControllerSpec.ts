/// <reference path="../../typings/index.d.ts" />

describe('In the file dogController.ts', () => {
  describe('the dogController\'s', () => {
    let sut: vdog.DogController,
      $rootScope: ng.IRootScopeService,
      $controller: ng.IControllerService,
      $interval: ng.IIntervalService,
      dogConfig: vdog.DogConfiguration,
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
    beforeEach(() => {
      angular.mock.module('app.dog');
      inject(($injector: ng.auto.IInjectorService) => {
        $controller = $injector.get<ng.IControllerService>('$controller');
        $rootScope = $injector.get<ng.IRootScopeService>('$rootScope');
        $interval = $injector.get<ng.IIntervalService>('$interval');

        dogConstructorParams = {
          $rootScope: $rootScope,
          $interval: $interval,
          dogConfig: dogConfig,
          eventNames: vdog.eventNames
        };
      });
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
      dogConfig.startDog.tailState = vdog.DogTailState.tucked;
      dogConfig.startDog.tailStyle = 'testTailStyle';
      sut = $controller<vdog.DogController>('dogController', dogConstructorParams);
    });
    
    describe('constructor', () => {
      it('should set barkSound', () => {
        expect(sut.barkSound).toEqual(dogConfig.startDog.barkSound);
      });
      it('should set age', () => {
        expect(sut.age).toEqual(dogConfig.startDog.age);
      });
      it('should set breed', () => {
        expect(sut.breed).toEqual(dogConfig.startDog.breed);
      });
      it('should set chewUrgeInterval', () => {
        expect(sut.chewUrgeInterval).toEqual(dogConfig.startDog.chewUrgeInterval);
      });
      it('should set coatStyle', () => {
        expect(sut.coatStyle).toEqual(dogConfig.startDog.coatStyle);
      });
      it('should set defaultAction', () => {
        expect(sut.defaultAction).toEqual(dogConfig.startDog.defaultAction);
      });
      it('should set dogLonelyDuration', () => {
        expect(sut.dogLonelyDuration).toEqual(dogConfig.startDog.dogLonelyDuration);
      });
      it('should set dogLonelyEndurance', () => {
        expect(sut.dogLonelyEndurance).toEqual(dogConfig.startDog.dogLonelyEndurance);
      });
      it('should set dogSleepDuration', () => {
        expect(sut.dogSleepDuration).toEqual(dogConfig.startDog.dogSleepDuration);
      });
      it('should set dogTiredInterval', () => {
        expect(sut.dogTiredInterval).toEqual(dogConfig.startDog.dogTiredInterval);
      });
      it('should set earState', () => {
        expect(sut.earState).toEqual(dogConfig.startDog.earState);
      });
      it('should set earStyle', () => {
        expect(sut.earStyle).toEqual(dogConfig.startDog.earStyle);
      });
      it('should set familiarName', () => {
        expect(sut.familiarName).toEqual(dogConfig.startDog.familiarName);
      });
      it('should set motherNature1Interval', () => {
        expect(sut.motherNature1Interval).toEqual(dogConfig.startDog.motherNature1Interval);
      });
      it('should set motherNature2Interval', () => {
        expect(sut.motherNature2Interval).toEqual(dogConfig.startDog.motherNature2Interval);
      });
      it('should set speciesName', () => {
        expect(sut.speciesName).toEqual(dogConfig.startDog.speciesName);
      });
      it('should set startupBlog', () => {
        expect(sut.startupBlog).toEqual(dogConfig.startDog.startupBlog);
      });
      it('should set tailState', () => {
        expect(sut.tailState).toEqual(dogConfig.startDog.tailState);
      });
      it('should set tailStyle', () => {
        expect(sut.tailStyle).toEqual(dogConfig.startDog.tailStyle);
      });
      it('other stuff happens when new', () => {
        pending('add other constructor tests');
      });
    });
    describe('the masterFeed event handler', () => {
      let foodObject: vdog.DogObject;
      beforeEach(() => {
        foodObject = new vdog.DogObject('meh', false, false);
        sut.blogContent = '';
      });
      it('should blog master', () => {
        $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
        expect(sut.blogContent).toContain('master');
      });
      describe('when object is edible', () => {
        beforeEach(() => {
          foodObject.edible = true;
        });
        it('should make tail wag', () => {
          expect(sut.tailState).not.toEqual(vdog.DogTailState.wagging);
          $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
          expect(sut.tailState).toEqual(vdog.DogTailState.wagging);
        });
        describe('and is dog food', () => {
          beforeEach(() => {
            foodObject.name = 'dog food';
          });
          it('should blog ignored', () => {
            expect(sut.blogContent).not.toContain('ignored');
            $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
            expect(sut.blogContent).toContain('ignored');
          });
          it('should blog dumped', () => {
            expect(sut.blogContent).not.toContain('dumped');
            $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
            expect(sut.blogContent).toContain('dumped');
          });
          it('should blog piece', () => {
            expect(sut.blogContent).not.toContain('piece');
            $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
            expect(sut.blogContent).toContain('piece');
          });
        });
        describe('and is not dog food', () => {
          it('should blog devour', () => {
            expect(sut.blogContent).not.toContain('devour');
            $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
            expect(sut.blogContent).toContain('devour');
          });
          it('should blog immediately', () => {
            expect(sut.blogContent).not.toContain('immediately');
            $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
            expect(sut.blogContent).toContain('immediately');
          });
          it('should blog look', () => {
            expect(sut.blogContent).not.toContain('look');
            $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
            expect(sut.blogContent).toContain('look');
          });
          it('should blog hungry', () => {
            expect(sut.blogContent).not.toContain('hungry');
            $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
            expect(sut.blogContent).toContain('hungry');
          });
        });
      });
      describe('when object is not edible', () => {
        beforeEach(() => {
          sut.tailState = vdog.DogTailState.drooped;
        });
        it('should make tail elevated', () => {
          expect(sut.tailState).not.toEqual(vdog.DogTailState.elevated);
          $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
          expect(sut.tailState).toEqual(vdog.DogTailState.elevated);
        });
        it('should blog sniff', () => {
          expect(sut.blogContent).not.toContain('sniff');
          $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
          expect(sut.blogContent).toContain('sniff');
        });
        it('should blog tilt', () => {
          expect(sut.blogContent).not.toContain('tilt');
          $rootScope.$broadcast(vdog.eventNames.masterFeed, foodObject);
          expect(sut.blogContent).toContain('tilt');
        });
      });
    });
  });
});
