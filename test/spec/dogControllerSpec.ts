/// <reference path="../../typings/browser.d.ts" />

describe('In the file dogController.js', () => {
  beforeEach(angular.mock.module('app.dog'));
  describe('the dogController\'s', () => {

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
      version: '1.0.0'
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

    describe('constructor:', () => {
      it('should set familiarName', () => {
        dogConfig.startDog.familiarName = 'testRover';
        // todo: constructing this for every tests, s/b in beforeEach
        let sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
          'dogController', dogConstructorParams)

        expect(sut.familiarName).toEqual(dogConfig.startDog.familiarName);
      });

      it('should set barkSound', () => {
        dogConfig.startDog.barkSound = 'testBark';

        var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
          'dogController', dogConstructorParams)

        expect(sut.barkSound).toEqual(dogConfig.startDog.barkSound);
      });

      it('should set age', () => {
        dogConfig.startDog.age = 7;

        var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
          'dogController', dogConstructorParams)

        expect(sut.age).toEqual(dogConfig.startDog.age);
      });

      it('should blog startupBlog', () => {
        var expectedBlog = 'Test Startup Blog';
        dogConfig.startDog.startupBlog = expectedBlog;

        var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
          'dogController', dogConstructorParams)

        expect(sut.blogContent).toContain(expectedBlog);
      });

    });

    describe('eventHandler for the masterThrow event:', () => {
      eventNames.masterThrow = 'masterThrow';

      it('should blog "master" and "threw"', () => {
        var thrownObject = new dogsrus.virtdog.DogObject(
          'testObject', false, false);
        spyOn(thrownObject, 'chewOn');

        var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
          'dogController', dogConstructorParams)

        expect(sut.blogContent).not.toContain('master');
        expect(sut.blogContent).not.toContain('threw');

        $rootScope.$broadcast(
          eventNames.masterThrow, thrownObject);

        expect(sut.blogContent).toContain('master');
        expect(sut.blogContent).toContain('threw');
      });

      describe('when thrown object is chewy, not edible:', () => {
        let thrownObject = new dogsrus.virtdog.DogObject(
          'testChewyObject', true, false);
        it('should call chewOn for thrown object', () => {
          spyOn(thrownObject, 'chewOn');

          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          $rootScope.$broadcast(eventNames.masterThrow, thrownObject);

          expect(thrownObject.chewOn).toHaveBeenCalled();
        });
      });

      describe('when thrown object is not chewy, not edible', () => {
        let thrownObject = new dogsrus.virtdog.DogObject(
          'testNotChewyObject', false, false);

        // todo: fix
        it('should not call chewOn for thrown object', () => {
          spyOn(thrownObject, 'chewOn');

          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          $rootScope.$broadcast(eventNames.masterThrow, thrownObject);

          expect(thrownObject.chewOn).not.toHaveBeenCalled();
        });
      });

      describe('when thrown object is edible', () => {
        let thrownObject = new dogsrus.virtdog.DogObject(
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

        // todo: fix
        it('should not blog "returned" because dog eats it', () => {
          var sut: dogsrus.virtdog.DogController = $controller<dogsrus.virtdog.DogController>(
            'dogController', dogConstructorParams)

          $rootScope.$broadcast(eventNames.masterThrow, thrownObject);

          expect(sut.blogContent).not.toContain('returned');
        });
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