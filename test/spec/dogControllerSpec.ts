/// <reference path="../../typings/index.d.ts" />

describe('dogController test', () => {
  beforeEach(angular.mock.module('app.dog'));
  describe('the dogController', () => {

    let $rootScope: ng.IRootScopeService,
      $controller: ng.IControllerService,
      $interval: ng.IIntervalService,
      dogConfig: dogsrus.virtdog.DogConfiguration,
      eventNames: dogsrus.virtdog.EventNames,
      dogConstructorParams: {
        $rootScope: ng.IRootScopeService;
        $interval: ng.IIntervalService;
        dogConfig: dogsrus.virtdog.DogConfiguration;
        eventNames: dogsrus.virtdog.EventNames
      };

    dogConfig = {
      appTitle: 'Virtual Dog Demo',
      otherDogs: [],
      startDog: <dogsrus.virtdog.IDog>{},
      version: '0.0.1'
    };

    eventNames = <dogsrus.virtdog.EventNames>{};
    beforeEach(inject(($injector: ng.auto.IInjectorService) => {
      // we need to construct every time so set up for that
      $controller = $injector.get<ng.IControllerService>('$controller');
      $rootScope = $injector.get<ng.IRootScopeService>('$rootScope');
      $interval = $injector.get<ng.IIntervalService>('$interval');

      dogConstructorParams = {
        $rootScope: $rootScope,
        $interval: $interval,
        dogConfig: dogConfig,
        eventNames: eventNames
      };
    }));
    
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

    // todo: make sure all master/event/objects are covered
    describe('eventHandlers', () => {
        var thrownObject = new dogsrus.virtdog.DogObject(
          'testObject', false, false);
      // eventNames.masterThrow = 'masterThrow';
      
      // todo: add beforeEach for instantiation and spyOn
      it('masterThrow test', () => {
        spyOn(thrownObject, 'chewOn');

        var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
          'dogController', dogConstructorParams)
        
        // multiple asserts are ok here
        expect(sut.blogContent).not.toContain('master');
        expect(sut.blogContent).not.toContain('threw');

        $rootScope.$broadcast(
          eventNames.masterThrow, thrownObject);

        expect(sut.blogContent).toContain('master');
        expect(sut.blogContent).toContain('threw');
      });

      // describe('when thrown object is chewy, not edible:', () => {
        thrownObject = new dogsrus.virtdog.DogObject(
          'testChewyObject', true, false);
        it('should call chewOn for thrown object', () => {
          spyOn(thrownObject, 'chewOn');

          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          $rootScope.$broadcast(eventNames.masterThrow, thrownObject);

          expect(thrownObject.chewOn).toHaveBeenCalled();
        });
      // });

      // describe('when thrown object is not chewy, not edible', () => {
        thrownObject = new dogsrus.virtdog.DogObject(
          'testNotChewyObject', false, false);

        // todo: fix
        it('should not call chewOn for thrown object', () => {
          spyOn(thrownObject, 'chewOn');

          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          $rootScope.$broadcast(eventNames.masterThrow, thrownObject);

          expect(thrownObject.chewOn).not.toHaveBeenCalled();
        });
      // });

      // describe('when thrown object is edible', () => {
        thrownObject = new dogsrus.virtdog.DogObject(
          'testEdibleObject', false, true);

        beforeEach(() => {
          spyOn(thrownObject, 'chewOn');
        });

        // todo: fix
        it('should not call chewOn for thrown object', () => {
          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          $rootScope.$broadcast(eventNames.masterThrow, thrownObject);

          expect(thrownObject.chewOn).not.toHaveBeenCalled();
        });

        it('should not blog "returned" because dog eats it', () => {
          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          $rootScope.$broadcast(eventNames.masterThrow, thrownObject);

          expect(sut.blogContent).not.toContain('returned');
        });
      // });

    });
    describe('eventhandler test 2', () => {
      let sut: dogsrus.virtdog.DogController;
      let listIndex = 0;
      let thrownObject: dogsrus.virtdog.DogObject;
      let thrownObjects = [
        new dogsrus.virtdog.DogObject('test1', false, false),
        new dogsrus.virtdog.DogObject('test2', true, false),
        new dogsrus.virtdog.DogObject('test3', false, true),
        new dogsrus.virtdog.DogObject('test4', true, true)
      ];
      beforeEach(() => {
        thrownObject = thrownObjects[listIndex];
        listIndex++;
        sut = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams);
        spyOn(thrownObject, 'chewOn');
      });
      it(`should match chewy expectation`, () => {
        $rootScope.$broadcast(eventNames.masterThrow, thrownObject);
        
        if (thrownObject.chewy && !thrownObject.edible) {
          expect(thrownObject.chewOn).toHaveBeenCalled();
        } else {
          expect(thrownObject.chewOn).not.toHaveBeenCalled();
        }
      });
      it(`should match chewy expectation`, () => {
        $rootScope.$broadcast(eventNames.masterThrow, thrownObject);
        
        if (thrownObject.chewy && !thrownObject.edible) {
          expect(thrownObject.chewOn).toHaveBeenCalled();
        } else {
          expect(thrownObject.chewOn).not.toHaveBeenCalled();
        }
      });
      it(`should match chewy expectation`, () => {
        $rootScope.$broadcast(eventNames.masterThrow, thrownObject);
        
        if (thrownObject.chewy && !thrownObject.edible) {
          expect(thrownObject.chewOn).toHaveBeenCalled();
        } else {
          expect(thrownObject.chewOn).not.toHaveBeenCalled();
        }
      });
      it(`should match chewy expectation`, () => {
        $rootScope.$broadcast(eventNames.masterThrow, thrownObject);
        
        if (thrownObject.chewy && !thrownObject.edible) {
          expect(thrownObject.chewOn).toHaveBeenCalled();
        } else {
          expect(thrownObject.chewOn).not.toHaveBeenCalled();
        }
      });
    });
    // todo: eliminate repetitive code
    describe('eventHandler for chew urge interval expiration:', () => {
      dogConfig.startDog.chewUrgeInterval = 100;
      describe('with one chewy Object', () => {
        let chewyObject = new dogsrus.virtdog.DogObject(
          'testChewyObject', true, false);

        beforeEach(() => {
          spyOn(chewyObject, 'chewOn');
        });

        it('should call chewOn for chewy object', () => {

          let sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          sut.chewObjects.push(chewyObject);

          $interval.flush(99);
          expect(chewyObject.chewOn).not.toHaveBeenCalled();
          $interval.flush(1);
          expect(chewyObject.chewOn).toHaveBeenCalled();
        });

        it('should blog "chewed"', () => {
          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          sut.chewObjects.push(chewyObject);

          expect(sut.blogContent).not.toContain('chewed');

          $interval.flush(100);

          expect(sut.blogContent).toContain('chewed');
        });

        it('should blog chewyObject name', () => {
          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          sut.chewObjects.push(chewyObject);

          expect(sut.blogContent).not.toContain(chewyObject.name);

          $interval.flush(100);

          expect(sut.blogContent).toContain(chewyObject.name);
        });

      });

      describe('with three chewy objects, one being expensive', () => {
        let expensiveChewyObject = new dogsrus.virtdog.DogObject(
          'expensiveChewyObject', true, false);
        expensiveChewyObject.expensive = true;
        let chewObjects = [
          new dogsrus.virtdog.DogObject('junk', true, false),
          new dogsrus.virtdog.DogObject('junk2', true, false)];
        chewObjects.push(expensiveChewyObject);

        beforeEach(() => {
          spyOn(expensiveChewyObject, 'chewOn');
        });

        it('should call chewOn for expensive object', () => {
          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          sut.chewObjects.push(expensiveChewyObject);

          $interval.flush(100);

          expect(expensiveChewyObject.chewOn).toHaveBeenCalled();
        });

      });

    });
  });

});