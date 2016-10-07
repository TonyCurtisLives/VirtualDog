/// <reference path="../../typings/index.d.ts" />
namespace dogsrus.virtdogtest {
  import vdog = virtdog;
  describe('In the file dogController.ts', () => {
    describe('the dogController\'s', () => {
      let sut: vdog.DogController,
        $rootScope: ng.IRootScopeService,
        $controller: ng.IControllerService,
        $interval: ng.IIntervalService,
        dogConfig: vdog.DogConfiguration,
        eventNamesTest: vdog.EventNames,
        dogConstructorParams: {
          $rootScope: ng.IRootScopeService;
          $interval: ng.IIntervalService;
          dogConfig: vdog.DogConfiguration;
        };

      dogConfig = {
        appTitle: 'Virtual Dog Demo',
        otherDogs: [],
        startDog: <vdog.IDog>{},
        version: '0.0.1'
      };
      beforeEach(() => {
        angular.mock.module('app.core', ($injector: ng.auto.IInjectorService) => {
          eventNamesTest = $injector.get<vdog.EventNames>('eventNames');
        });
        angular.mock.module('app.dog');
        inject(($injector: ng.auto.IInjectorService) => {
          $controller = $injector.get('$controller');
          $rootScope = $injector.get('$rootScope');
          $interval = $injector.get('$interval');
        });

        dogConstructorParams = {
          $rootScope: $rootScope,
          $interval: $interval,
          dogConfig: dogConfig
        };
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
      // todo: need to test feed event
      describe('masterFeed event listener', () => {
        let foodObject: vdog.DogObject;
        beforeEach(() => {
          foodObject = new vdog.DogObject('meh', false, false);
          sut.blogContent = '';
        });
        it('should blog master', () => {
          $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
          expect(sut.blogContent).toContain('master');
        });
        describe('when object is edible', () => {
          beforeEach(() => {
            foodObject.edible = true;
          });
          it('should make tail wag', () => {
            sut.tailState = vdog.DogTailState.drooped;
            $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
            expect(sut.tailState).toEqual(vdog.DogTailState.wagging);
          });
          describe('and is dog food', () => {
            beforeEach(() => {
              foodObject.name = 'dog food';
            });
            it('should blog ignored', () => {
              $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
              expect(sut.blogContent).toContain('ignored');
            });
            it('should blog dumped', () => {
              $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
              expect(sut.blogContent).toContain('dumped');
            });
            it('should blog piece', () => {
              $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
              expect(sut.blogContent).toContain('piece');
            });
          });
          describe('and is not dog food', () => {
            it('should blog devour', () => {
              $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
              expect(sut.blogContent).toContain('devour');
            });
            it('should blog immediately', () => {
              $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
              expect(sut.blogContent).toContain('immediately');
            });
            it('should blog look', () => {
              $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
              expect(sut.blogContent).toContain('look');
            });
            it('should blog hungry', () => {
              $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
              expect(sut.blogContent).toContain('hungry');
            });
          });
        });
        describe('when object is not edible', () => {
          it('should make tail elevated', () => {
            sut.tailState = vdog.DogTailState.drooped;
            $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
            expect(sut.tailState).toEqual(vdog.DogTailState.elevated);
          });
          it('should blog sniff', () => {
            $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
            expect(sut.blogContent).toContain('sniff');
          });
          it('should blog tilt', () => {
            $rootScope.$broadcast(eventNamesTest.masterFeed, foodObject);
            expect(sut.blogContent).toContain('tilt');
          });
        });
      });
      describe('masterThrow event listener', () => {
        let throwObject: vdog.DogObject;
        beforeEach(() => {
          throwObject = jasmine.createSpyObj('throwObject', ['chewOn']);
          throwObject.name = 'meh';
          throwObject.flies = false;
          throwObject.chewy = false;
          (<jasmine.Spy>(throwObject.chewOn)).and.returnValue(
            vdog.ChewExperience.fair);
          sut.blogContent = '';
        });
        it('should blog master', () => {
          $rootScope.$broadcast(eventNamesTest.masterThrow, throwObject);
          expect(sut.blogContent).toContain('master');
        });
        it('should blog thrown object name', () => {
          $rootScope.$broadcast(eventNamesTest.masterThrow, throwObject);
          expect(sut.blogContent).toContain(throwObject.name);
        });
        it('when thrown object does not fly should blog snapping', () => {
          $rootScope.$broadcast(eventNamesTest.masterThrow, throwObject);
          expect(sut.blogContent).toContain('snapping');
        });
        it('when thrown object flies should blog leapt', () => {
          throwObject.flies = true;
          $rootScope.$broadcast(eventNamesTest.masterThrow, throwObject);
          expect(sut.blogContent).toContain('leapt');
        });
        it('when thrown object is chewy and not in chewObjects ' +
          'should add thrown object to chewObjects', () => {
            throwObject.chewy = true;
            sut.chewObjects = [];
            $rootScope.$broadcast(eventNamesTest.masterThrow, throwObject);
            expect(sut.chewObjects).toContain(throwObject);
          });
        describe('when thrown object chewOn returns squeaky', () => {
          beforeEach(() => {
            (<jasmine.Spy>(throwObject.chewOn)).and.returnValue(
              vdog.ChewExperience.squeaky);
          });
          it('should blog squeak', () => {
            $rootScope.$broadcast(eventNamesTest.masterThrow, throwObject);
            expect(sut.blogContent).toContain('squeak');
          });
          it('should call chewOn squeakyOcdChewCount+1 times', () => {
            sut.squeakyOcdChewCount = 5;
            $rootScope.$broadcast(eventNamesTest.masterThrow, throwObject);
            expect(throwObject.chewOn).toHaveBeenCalledTimes(
              sut.squeakyOcdChewCount + 1);
          });
          it('then chewOn stops returning squeaky should blog \'try again\'',
            () => {
              (<jasmine.Spy>(throwObject.chewOn)).and.returnValues(
                vdog.ChewExperience.squeaky,
                vdog.ChewExperience.great
              );
              sut.squeakyOcdChewCount = 1;
              $rootScope.$broadcast(eventNamesTest.masterThrow, throwObject);
              expect(sut.blogContent).toContain('try again');
            });
        });
      });
    });
  });
}
