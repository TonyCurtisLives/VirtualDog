// values for use in ES6 string interpolation
namespace dogsrus.virtdog.test {
  export let restValidDateParam = '2012-12-12';
  export let restValidCameraParam = 'FHAZ';
  export let restValidPageParam = 2;
  export let restInvalidDateParam = 'bad date';
  export let restInvalidCameraParam = 'bad camera';
  export let restInvalidPageParam = -1;
  export let restFhazCamName = 'FHAZ';
  export let httpStatusServer = 500;
};

// use these in description strings and tests for templating
import vdogT = dogsrus.virtdog.test;
import vdogA = dogsrus.virtdog.appValues;
import vdogRc = dogsrus.virtdog.roverConfig;

describe('in the file roverPhotoDataService.ts the ' +
  'RoverPhotoDataService class\'s', () => {

    let sut: vdog.RoverPhotoDataService,
      spyTranslateService: vdog.RoverPhotoTranslationService,
      spyValidationService: vdog.RoverParamValidationService,
      httpBackend: ng.IHttpBackendService,
      stubHttpRequestHandler: ng.mock.IRequestHandler,
      rootScope: ng.IRootScopeService,
      dateParam: string,
      cameraParam: string,
      // by default these will return config values
      validatedDateParam = {
        api_key: vdogRc.apiKey,
        earth_date: vdogRc.minPhotoDate
      },
      validatedDateCameraParam = {
        api_key: vdogRc.apiKey,
        camera: vdogRc.camera,
        earth_date: vdogRc.minPhotoDate
      },
      validatedDatePageCameraParam = {
        api_key: vdogRc.apiKey,
        camera: vdogRc.camera,
        earth_date: vdogRc.minPhotoDate,
        page: vdogT.restValidPageParam
      },
      httpPhotoData: vdog.IRestPhotos,
      httpNoPhotos: vdog.IRestError = { errors: 'No Photos Found' };

    beforeEach(() => {
      // generally need valid data from validator
      spyValidationService = jasmine.createSpyObj(
        'spyValidationService', ['validateParams', 'validateParamsPage']
      );
      (<jasmine.Spy>spyValidationService.validateParams).and
        .returnValue(validatedDateParam);
      // override this return value for additional parameters
      // available for http calls including camera and/or page
      (<jasmine.Spy>spyValidationService.validateParamsPage).and
        .returnValue(validatedDateParam);

      // incidental values
      dateParam = 'meh';
      cameraParam = 'meh';
      spyTranslateService = jasmine.createSpyObj(
        'spyTranslateService', ['translateCameraList', 'translateAllPhotos']
      );

      // angular setup
      angular.mock.module('app.core', ($provide: ng.auto.IProvideService) => {
        $provide.constant('roverConfig', vdogRc);
        $provide.value('roverPhotoTranslationService', spyTranslateService);
        $provide.value('roverParamValidationService', spyValidationService);
      });
      inject(($httpBackend, roverPhotoDataService, $rootScope) => {
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        sut = roverPhotoDataService;
      });
      // setup backend definition to intercept ALL http calls
      stubHttpRequestHandler = httpBackend.whenGET(/.*/);

      // generally need valid photo data from http response
      httpPhotoData = vdog.test.roverTestData;
      stubHttpRequestHandler.respond(httpPhotoData);
    });
    describe(`getTranslatedCameras`, () => {

      it(`when earthDate is passed with ${vdogT.restValidDateParam} ` +
        `should call param validator with ` +
        `earthDate = ${vdogT.restValidDateParam} `, () => {

          sut.getTranslatedCameras(vdogT.restValidDateParam);
          httpBackend.flush();

          expect(spyValidationService.validateParams).
            toHaveBeenCalledWith(vdogT.restValidDateParam);
        });
      it(`when earthDate is not passed should call param validator with ` +
        `default minPhotoDate of ${vdogRc.minPhotoDate}`, () => {

          sut.getTranslatedCameras();
          httpBackend.flush();

          expect(spyValidationService.validateParams)
            .toHaveBeenCalledWith(vdogRc.minPhotoDate);
        });
      describe(`when param validator returns error with ` +
        `earthDate of "${vdogT.restInvalidDateParam}"`, () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          let wasHttpCalled: boolean;
          beforeEach(() => {
            wasHttpCalled = false;
            (<jasmine.Spy>spyValidationService.validateParams).and.returnValue(
              { errors: [`earth_date: ${vdogT.restInvalidDateParam}`] });
            stubHttpRequestHandler.respond({ meh: 0 });
            sut.getTranslatedCameras('meh').then(
              (response) => { wasHttpCalled = true; },
              (error) => { errorData = error; });
            rootScope.$digest();
          });
          it(`should return error status of ${vdogA.restStatusBadParam}`,
            () => {

              expect(errorData.status).toEqual(vdogA.restStatusBadParam);
            });
          it(`should return error text with "${vdogA.parameterInvalidText}"`,
            () => {

              expect(errorData.data).toContain(vdogA.parameterInvalidText);
            });
          it(`should return error text with ` +
            `"earth_date = ${vdogT.restInvalidDateParam}"`, () => {

              expect(errorData.data).toContain(vdogT.restInvalidDateParam);
            });
          it(`should not call http service`, () => {

            // if any responses remain in the buffer 
            // verifyNoOutstandingRequest throws an error (and fails the test)
            // since we haven't called flush, if there were any 
            // responses generated they would still be in the buffer
            httpBackend.verifyNoOutstandingRequest();
            expect(wasHttpCalled).toBeFalsy();
          });
        });
      xdescribe(`when param validator returns valid parameters with ` +
        `earth_date: ${vdogRc.minPhotoDate} and ` +
        `api_key: ${vdogRc.apiKey}`, () => {

          let actualUrl: string;
          beforeEach(() => {
            actualUrl = '';
            httpBackend.expectGET((url) => { actualUrl = url; return true; });
            sut.getTranslatedCameras('meh');
            httpBackend.flush();
          });
          it(`should call http with ` +
            `"earth_date=${vdogRc.minPhotoDate}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*earth_date=${vdogRc.minPhotoDate}.*`));
            });
          it(`should call http with ` +
            `"api_key=${vdogRc.apiKey}" `, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*api_key=${vdogRc.apiKey}.*`));
            });
        });
      describe(`when http returns invalid response with ` +
        `status of ${vdogT.httpStatusServer}`, () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(500, '');
            sut.getTranslatedCameras('meh').then(
              (response) => { }, (error) => { errorData = error; });
            httpBackend.flush();
            rootScope.$digest();
          });
          it(`should return status of ${vdogT.httpStatusServer}`, () => {

            expect(errorData.status).toEqual(vdogT.httpStatusServer);
          });
          it('should not call translator', () => {

            expect(spyTranslateService.translateCameraList)
              .not.toHaveBeenCalled();
          });
        });
      describe('when http returns valid response with ' +
        '"errors":"No Photos Found"', () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(httpNoPhotos);
            sut.getTranslatedCameras('meh').then(
              (response) => { },
              (error) => { errorData = error; });
            httpBackend.flush();
            rootScope.$digest();
          });
          it(`should return status of ${vdogA.restStatusNoPhotos}`, () => {

            expect(errorData.status).toBe(vdogA.restStatusNoPhotos);
          });
          it('should not call translator', () => {

            expect(spyTranslateService.translateCameraList)
              .not.toHaveBeenCalled();
          });
        });
      describe('when http returns valid response', () => {

        it('should call translator with a photo from http data', () => {

          sut.getTranslatedCameras('meh');
          httpBackend.flush();

          expect((<jasmine.Spy>spyTranslateService.translateCameraList)
            .calls.argsFor(0)[0].photos[0])
            .toEqual(httpPhotoData.photos[0]);
        });
      });
      it('when translator returns translated cameras ' +
        'should return cameras recieved from translator', () => {
          let translatedCameras = new Array<vdog.DogCamera>();
          let responseData: vdog.DogCamera[] | any;

          translatedCameras.push(
            new vdog.DogCamera(new vdog.DogRover(), 'testcam', 'longtest'));
          translatedCameras.push(
            new vdog.DogCamera(new vdog.DogRover(), 'testShort2', 'testLong2'));
          (<jasmine.Spy>spyTranslateService.translateCameraList).and
            .returnValue(translatedCameras);

          sut.getTranslatedCameras('meh')
            .then((response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData).toBe(translatedCameras);
        });
    });
    describe(`getTranslatedPhotos`, () => {

      it(`when earthDate is passed with ${vdogT.restValidDateParam} ` +
        `should call param validator with ` +
        `earthDate = ${vdogT.restValidDateParam} and ` +
        `default page = 0 and default camera = ''`, () => {

          sut.getTranslatedPhotos(vdogT.restValidDateParam);
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage).
            toHaveBeenCalledWith(vdogT.restValidDateParam, 0, '');
        });
      it(`when earthDate is passed with ${vdogT.restValidDateParam} and ` +
        `camera is passed with ${vdogT.restValidCameraParam} ` +
        `should call param validator with ` +
        `earthDate = ${vdogT.restValidDateParam} and ` +
        `camera = ${vdogT.restValidCameraParam} and default page = 0`, () => {

          sut.getTranslatedPhotos(vdogT.restValidDateParam, 0,
            vdogT.restValidCameraParam);
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage).
            toHaveBeenCalledWith(vdogT.restValidDateParam, 0,
            vdogT.restValidCameraParam);
        });
      it(`when earthDate is passed with ${vdogT.restValidDateParam} and ` +
        `camera is passed with ${vdogT.restValidCameraParam} and ` +
        `page is passed with ${vdogT.restValidPageParam} ` +
        `should call param validator with ` +
        `earthDate = ${vdogT.restValidDateParam} and ` +
        `camera = ${vdogT.restValidCameraParam} and ` +
        `page = ${vdogT.restValidPageParam}`, () => {

          sut.getTranslatedPhotos(vdogT.restValidDateParam,
            vdogT.restValidPageParam, vdogT.restValidCameraParam);
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage).
            toHaveBeenCalledWith(vdogT.restValidDateParam,
            vdogT.restValidPageParam, vdogT.restValidCameraParam);
        });
      it(`when earthDate is not passed should call param validator with ` +
        `default earthDate param = ${vdogRc.minPhotoDate}` +
        `and default page = 0 and default camera = ''`, () => {

          sut.getTranslatedPhotos();
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage)
            .toHaveBeenCalledWith(vdogRc.minPhotoDate, 0, '');
        });
      describe(`when param validator returns error with ` +
        `earthDate of "${vdogT.restInvalidDateParam}"`, () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          let wasHttpCalled: boolean;
          beforeEach(() => {
            wasHttpCalled = false;
            (<jasmine.Spy>spyValidationService.validateParamsPage).and
              .returnValue(
              { errors: [`earth_date: ${vdogT.restInvalidDateParam}`] });
            stubHttpRequestHandler.respond({ meh: 0 });
            sut.getTranslatedPhotos('meh').then(
              (response) => { wasHttpCalled = true; },
              (error) => { errorData = error; });
            rootScope.$digest();
          });
          it(`should return error status of ${vdogA.restStatusBadParam}`,
            () => {

              expect(errorData.status).toEqual(vdogA.restStatusBadParam);
            });
          it(`should return error text with "${vdogA.parameterInvalidText}"`,
            () => {

              expect(errorData.data).toContain(vdogA.parameterInvalidText);
            });
          it(`should return error text with ` +
            `"dateParam = ${vdogT.restInvalidDateParam}"`, () => {

              expect(errorData.data).toContain(vdogT.restInvalidDateParam);
            });
          it(`should not call http service`, () => {

            httpBackend.verifyNoOutstandingRequest();
            expect(wasHttpCalled).toBeFalsy();
          });
        });
      xdescribe(`when param validator returns valid parameters with ` +
        `earth_date: ${vdogRc.minPhotoDate} and ` +
        `api_key: ${vdogRc.apiKey}`, () => {

          let actualUrl: string;
          beforeEach(() => {
            actualUrl = '';
            httpBackend.expectGET((url) => { actualUrl = url; return true; });
            sut.getTranslatedPhotos('meh');
            httpBackend.flush();
          });
          it(`should call http with ` +
            `"earth_date=${vdogRc.minPhotoDate}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*earth_date=${vdogRc.minPhotoDate}.*`));
            });
          it(`should call http with ` +
            `"api_key=${vdogRc.apiKey}" `, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*api_key=${vdogRc.apiKey}.*`));
            });
        });
      xdescribe(`when param validator returns valid parameters with ` +
        `earth_date: ${vdogRc.minPhotoDate} and ` +
        `api_key: ${vdogRc.apiKey} and ` +
        `camera: ${vdogRc.camera}`, () => {

          let actualUrl: string;
          beforeEach(() => {
            actualUrl = '';
            // setup spy to also return camera
            (<jasmine.Spy>spyValidationService.validateParamsPage).and
              .returnValue(validatedDateCameraParam);

            httpBackend.expectGET((url) => { actualUrl = url; return true; });
            sut.getTranslatedPhotos('meh');
            httpBackend.flush();
          });
          it(`should call http with ` +
            `"earth_date=${vdogRc.minPhotoDate}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*earth_date=${vdogRc.minPhotoDate}.*`));
            });
          it(`should call http with ` +
            `"api_key=${vdogRc.apiKey}" `, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*api_key=${vdogRc.apiKey}.*`));
            });
          it(`should call http with ` +
            `"camera=${vdogRc.camera}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*camera=${vdogRc.camera}.*`));
            });
        });
      xdescribe(`when param validator returns valid parameters with ` +
        `earth_date: ${vdogRc.minPhotoDate} ` +
        `api_key: ${vdogRc.apiKey} and ` +
        `camera: ${vdogRc.camera} and ` +
        `page: ${vdogT.restValidPageParam}`, () => {

          let actualUrl: string;
          beforeEach(() => {
            actualUrl = '';
            // setup spy to return camera and page
            (<jasmine.Spy>spyValidationService.validateParamsPage).and
              .returnValue(validatedDatePageCameraParam);

            httpBackend.expectGET((url) => { actualUrl = url; return true; });
            sut.getTranslatedPhotos('meh');
            httpBackend.flush();
          });
          it(`should call http with ` +
            `"earth_date=${vdogRc.minPhotoDate}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*earth_date=${vdogRc.minPhotoDate}.*`));
            });
          it(`should call http with ` +
            `"api_key=${vdogRc.apiKey}" `, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*api_key=${vdogRc.apiKey}.*`));
            });
          it(`should call http with ` +
            `"camera=${vdogRc.camera}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*camera=${vdogRc.camera}.*`));
            });
          it(`should call http with ` +
            `"page=${vdogT.restValidPageParam}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*page=${vdogT.restValidPageParam}.*`));
            });
        });
      describe(`when http returns invalid response with ` +
        `status of ${vdogT.httpStatusServer}`, () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(vdogT.httpStatusServer, '');
            sut.getTranslatedPhotos('meh').then((response) => { },
              (error) => { errorData = error; });
            httpBackend.flush();
            rootScope.$digest();
          });
          it(`should return status of ${vdogT.httpStatusServer}`, () => {

            expect(errorData.status).toEqual(vdogT.httpStatusServer);
          });
          it('should not call translator', () => {

            expect(spyTranslateService.translateAllPhotos)
              .not.toHaveBeenCalled();
          });
        });
      describe('when http returns valid response with ' +
        '"errors":"No Photos Found"', () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(httpNoPhotos);
            sut.getTranslatedPhotos('meh')
              .then((response) => { },
              (error) => { errorData = error; });
            httpBackend.flush();
            rootScope.$digest();
          });
          it(`should return status of ${vdogA.restStatusNoPhotos}`, () => {

            expect(errorData.status).toBe(vdogA.restStatusNoPhotos);
          });
          it('should not call translator', () => {

            expect(spyTranslateService.translateAllPhotos)
              .not.toHaveBeenCalled();
          });
        });
      it('when http returns valid response ' +
        'should call translator with photos from http response', () => {

          sut.getTranslatedPhotos('meh');
          httpBackend.flush();

          expect(spyTranslateService.translateAllPhotos)
            .toHaveBeenCalledWith(httpPhotoData);
        });
      it('when translator returns translated photos ' +
        'should return photos recieved from translator', () => {

          let translatedPhotos = new vdog.DogRover();
          let responseData: vdog.DogRover | any;
          let testCamera = new vdog.DogCamera(translatedPhotos);
          testCamera.Photos.push(new vdog.DogPhoto('meh', testCamera));
          testCamera.Photos.push(new vdog.DogPhoto('meh', testCamera));
          translatedPhotos.Cameras.push(testCamera);
          (<jasmine.Spy>spyTranslateService.translateAllPhotos).and
            .returnValue(translatedPhotos);

          sut.getTranslatedPhotos('meh')
            .then((response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData).toBe(translatedPhotos);
        });
    });
    describe('getPhotos', () => {
      it(`when earthDate is passed with ${vdogT.restValidDateParam} ` +
        `should call param validator with ` +
        `earthDate = ${vdogT.restValidDateParam} and ` +
        `default page = 0 and default camera = ''`, () => {

          sut.getPhotos(vdogT.restValidDateParam);
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage).
            toHaveBeenCalledWith(vdogT.restValidDateParam, 0, '');
        });
      it(`when earthDate is passed with ${vdogT.restValidDateParam} and ` +
        `camera is passed with ${vdogT.restValidCameraParam} ` +
        `should call param validator with ` +
        `earthDate = ${vdogT.restValidDateParam} and ` +
        `camera = ${vdogT.restValidCameraParam} and default page = 0`, () => {

          sut.getPhotos(vdogT.restValidDateParam, 0,
            vdogT.restValidCameraParam);
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage).
            toHaveBeenCalledWith(vdogT.restValidDateParam, 0,
            vdogT.restValidCameraParam);
        });
      it(`when earthDate is passed with ${vdogT.restValidDateParam} and ` +
        `camera is passed with ${vdogT.restValidCameraParam} and ` +
        `page is passed with ${vdogT.restValidPageParam} ` +
        `should call param validator with ` +
        `earthDate = ${vdogT.restValidDateParam} and ` +
        `camera = ${vdogT.restValidCameraParam} and ` +
        `page = ${vdogT.restValidPageParam}`, () => {

          sut.getPhotos(vdogT.restValidDateParam,
            vdogT.restValidPageParam, vdogT.restValidCameraParam);
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage).
            toHaveBeenCalledWith(vdogT.restValidDateParam,
            vdogT.restValidPageParam, vdogT.restValidCameraParam);
        });
      it(`when earthDate is not passed should call param validator with ` +
        `default earthDate param = ${vdogRc.minPhotoDate}` +
        `and default page = 0 and default camera = ''`, () => {

          sut.getPhotos();
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage)
            .toHaveBeenCalledWith(vdogRc.minPhotoDate, 0, '');
        });
      describe(`when param validator returns error with ` +
        `earthDate of "${vdogT.restInvalidDateParam}"`, () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          let wasHttpCalled: boolean;
          beforeEach(() => {
            wasHttpCalled = false;
            (<jasmine.Spy>spyValidationService.validateParamsPage).and
              .returnValue(
              { errors: [`earth_date: ${vdogT.restInvalidDateParam}`] });
            stubHttpRequestHandler.respond({ meh: 0 });
            sut.getPhotos('meh').then(
              (response) => { wasHttpCalled = true; },
              (error) => { errorData = error; });
            rootScope.$digest();
          });
          it(`should return error status of ${vdogA.restStatusBadParam}`,
            () => {

              expect(errorData.status).toEqual(vdogA.restStatusBadParam);
            });
          it(`should return error text with "${vdogA.parameterInvalidText}"`,
            () => {

              expect(errorData.data).toContain(vdogA.parameterInvalidText);
            });
          it(`should return error text with ` +
            `"dateParam = ${vdogT.restInvalidDateParam}"`, () => {

              expect(errorData.data).toContain(vdogT.restInvalidDateParam);
            });
          it(`should not call http service`, () => {

            httpBackend.verifyNoOutstandingRequest();
            expect(wasHttpCalled).toBeFalsy();
          });
        });
      xdescribe(`when param validator returns valid parameters with ` +
        `earth_date: ${vdogRc.minPhotoDate} and ` +
        `api_key: ${vdogRc.apiKey}`, () => {

          let actualUrl: string;
          beforeEach(() => {
            actualUrl = '';
            httpBackend.expectGET((url) => { actualUrl = url; return true; });
            sut.getPhotos('meh');
            httpBackend.flush();
          });
          it(`should call http with ` +
            `"earth_date=${vdogRc.minPhotoDate}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*earth_date=${vdogRc.minPhotoDate}.*`));
            });
          it(`should call http with ` +
            `"api_key=${vdogRc.apiKey}" `, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*api_key=${vdogRc.apiKey}.*`));
            });
        });
      xdescribe(`when param validator returns valid parameters with ` +
        `earth_date: ${vdogRc.minPhotoDate} and ` +
        `api_key: ${vdogRc.apiKey} and ` +
        `camera: ${vdogRc.camera}`, () => {

          let actualUrl: string;
          beforeEach(() => {
            actualUrl = '';
            // setup spy to also return camera
            (<jasmine.Spy>spyValidationService.validateParamsPage).and
              .returnValue(validatedDateCameraParam);

            httpBackend.expectGET((url) => { actualUrl = url; return true; });
            sut.getPhotos('meh');
            httpBackend.flush();
          });
          it(`should call http with ` +
            `"earth_date=${vdogRc.minPhotoDate}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*earth_date=${vdogRc.minPhotoDate}.*`));
            });
          it(`should call http with ` +
            `"api_key=${vdogRc.apiKey}" `, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*api_key=${vdogRc.apiKey}.*`));
            });
          it(`should call http with ` +
            `"camera=${vdogRc.camera}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*camera=${vdogRc.camera}.*`));
            });
        });
      xdescribe(`when param validator returns valid parameters with ` +
        `earth_date: ${vdogRc.minPhotoDate} ` +
        `api_key: ${vdogRc.apiKey} and ` +
        `camera: ${vdogRc.camera} and ` +
        `page: ${vdogT.restValidPageParam}`, () => {

          let actualUrl: string;
          beforeEach(() => {
            actualUrl = '';
            // setup spy to return camera and page
            (<jasmine.Spy>spyValidationService.validateParamsPage).and
              .returnValue(validatedDatePageCameraParam);

            httpBackend.expectGET((url) => { actualUrl = url; return true; });
            sut.getPhotos('meh');
            httpBackend.flush();
          });
          it(`should call http with ` +
            `"earth_date=${vdogRc.minPhotoDate}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*earth_date=${vdogRc.minPhotoDate}.*`));
            });
          it(`should call http with ` +
            `"api_key=${vdogRc.apiKey}" `, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*api_key=${vdogRc.apiKey}.*`));
            });
          it(`should call http with ` +
            `"camera=${vdogRc.camera}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*camera=${vdogRc.camera}.*`));
            });
          it(`should call http with ` +
            `"page=${vdogT.restValidPageParam}"`, () => {

              expect(actualUrl).toMatch(new RegExp(
                `.*page=${vdogT.restValidPageParam}.*`));
            });
        });
      describe(`when http returns invalid response with ` +
        `status of ${vdogT.httpStatusServer}`, () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(vdogT.httpStatusServer, '');
            sut.getPhotos('meh').then((response) => { },
              (error) => { errorData = error; });
            httpBackend.flush();
            rootScope.$digest();
          });
          it(`should return status of ${vdogT.httpStatusServer}`, () => {

            expect(errorData.status).toEqual(vdogT.httpStatusServer);
          });
          it('should not call translator', () => {

            expect(spyTranslateService.translateAllPhotos)
              .not.toHaveBeenCalled();
          });
        });
      describe('when http returns valid response with ' +
        '"errors":"No Photos Found"', () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(httpNoPhotos);
            sut.getPhotos('meh')
              .then((response) => { },
              (error) => { errorData = error; });
            httpBackend.flush();
            rootScope.$digest();
          });
          it(`should return status of ${vdogA.restStatusNoPhotos}`, () => {

            expect(errorData.status).toBe(vdogA.restStatusNoPhotos);
          });
          it('should not call translator', () => {

            expect(spyTranslateService.translateAllPhotos)
              .not.toHaveBeenCalled();
          });
        });
      it('when http returns valid responses ' +
        'should return photos recieved from http', () => {

          // let testPhoto = <vdog.IRestPhotos>{};
          // testPhoto.photos = new Array();
          // testPhoto.photos.push(<vdog.IRestPhoto>{});
          // testPhoto.photos[0].earth_date = vdogRc.minPhotoDate;
          // testPhoto.photos[0].id = 42;
          // stubHttpRequestHandler.respond(testPhoto);
          let responseData: vdog.IRestPhotos | any;
          sut.getPhotos('meh')
            .then((response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData).toEqual(vdogT.roverTestData);
          // expect(responseData).toBe(testPhoto);
        });
    });
  });

