// values for use in ES6 string interpolation
namespace dogsrus.virtdogtest {
  import vdog = virtdog;

  // use in description strings and tests for templating
  let vdogRover = vdogConfig.defaultRover;

  describe('Using an unreadable spec, in the file roverPhotoDataService.ts the ' +
    'RoverPhotoDataService class\'s ', () => {

      let sut: vdog.RoverPhotoDataService,
        spyTranslateService: vdog.RoverPhotoTranslationService,
        spyValidationService: vdog.RoverParamValidationService,
        httpBackend: ng.IHttpBackendService,
        stubHttpRequestHandler: ng.mock.IRequestHandler,
        rootScope: ng.IRootScopeService,
        dateParam: string,
        cameraParam: string,
        // by default these will return config values
        validatedDateParam = {},
        validatedDateCameraParam = {},
        validatedDatePageCameraParam = {},
        httpPhotoData: vdog.IRestPhotos,
        httpNoPhotos: vdog.IRestError = { errors: 'No Photos Found' };

      beforeEach(() => {
        // generally need valid data from validator
        validatedDateParam[vdogConfig.paramKeyApiKey]
          = vdogConfig.apiKey;
        validatedDateParam[vdogConfig.paramKeyEarthDate]
          = vdogRover.minPhotoDate;
        validatedDateCameraParam[vdogConfig.paramKeyApiKey]
          = vdogConfig.apiKey;
        validatedDateCameraParam[vdogConfig.paramKeyEarthDate]
          = vdogRover.minPhotoDate;
        validatedDateCameraParam[vdogConfig.paramKeyCamera]
          = vdogRover.camera;
        validatedDatePageCameraParam[vdogConfig.paramKeyApiKey]
          = vdogConfig.apiKey;
        validatedDatePageCameraParam[vdogConfig.paramKeyEarthDate]
          = vdogRover.minPhotoDate;
        validatedDatePageCameraParam[vdogConfig.paramKeyPage]
          = restValidPageParam;
        validatedDatePageCameraParam[vdogConfig.paramKeyCamera]
          = vdogRover.camera;
        spyValidationService = jasmine.createSpyObj(
          'spyValidationService', ['validateParams', 'validateParamsPage']
        );
        (<jasmine.Spy>spyValidationService.validateParams).and
          .returnValue(validatedDateParam);
        // override this return value for additional returned parameters
        // available for http calls including camera and/or page
        (<jasmine.Spy>spyValidationService.validateParamsPage).and
          .returnValue(validatedDateParam);

        // fake / stub values
        dateParam = 'meh';
        cameraParam = 'meh';
        spyTranslateService = jasmine.createSpyObj(
          'spyTranslateService', ['translateCameraList', 'translateAllPhotos']
        );

        // angular setup for service injection parameters
        angular.mock.module('app.core', ($provide: ng.auto.IProvideService) => {
          $provide.value('roverPhotoTranslationService', spyTranslateService);
          $provide.value('roverParamValidationService', spyValidationService);
        });
        // getting instances from angular
        inject(($httpBackend, roverPhotoDataService, $rootScope) => {
          httpBackend = $httpBackend;
          rootScope = $rootScope;
          sut = roverPhotoDataService;
        });
        // setup backend definition to intercept ALL http calls
        stubHttpRequestHandler = httpBackend.whenGET(/.*/);

        // generally need valid photo data from http response
        httpPhotoData = roverTestData;
        stubHttpRequestHandler.respond(httpPhotoData);
      });

      // getTranslatedCameras--------------------------------------------------
      describe(`getTranslatedCameras`, () => {

        it(`when earthDate is passed with ${restValidDateParam} ` +
          `should call param validator with ` +
          `earthDate = ${restValidDateParam} `, () => {

            sut.getTranslatedCameras(restValidDateParam);
            httpBackend.flush();

            expect(spyValidationService.validateParams).
              toHaveBeenCalledWith(restValidDateParam);
          });
        it(`when earthDate is not passed should call param validator with ` +
          `default minPhotoDate of ${vdogRover.minPhotoDate}`, () => {

            sut.getTranslatedCameras();
            httpBackend.flush();

            expect(spyValidationService.validateParams)
              .toHaveBeenCalledWith(vdogRover.minPhotoDate);
          });
        describe(`when param validator returns error with ` +
          `earthDate of "${restInvalidDateParam}"`, () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;
            let wasHttpCalled: boolean;
            beforeEach(() => {
              wasHttpCalled = false;
              (<jasmine.Spy>spyValidationService.validateParams).and.returnValue(
                { errors: [`${vdogConfig.paramKeyEarthDate}: ${restInvalidDateParam}`] });
              stubHttpRequestHandler.respond({ meh: 0 });
              sut.getTranslatedCameras('meh').then(
                (response) => { wasHttpCalled = true; },
                (error) => { errorData = error; });
              rootScope.$digest();
            });
            it(`should return error status of ${vdogApp.restStatusBadParam}`,
              () => {

                expect(errorData.status).toEqual(vdogApp.restStatusBadParam);
              });
            it(`should return error text with ` +
              `"${vdogConfig.paramKeyEarthDate} = ${restInvalidDateParam}"`, () => {

                expect(errorData.data).toContain(restInvalidDateParam);
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
          `${vdogConfig.paramKeyEarthDate}: ${vdogRover.minPhotoDate} and ` +
          `${vdogConfig.paramKeyApiKey}: ${vdogConfig.apiKey}`, () => {

            let actualUrl: string;
            beforeEach(() => {
              actualUrl = '';
              httpBackend.expectGET((url) => { actualUrl = url; return true; });
              sut.getTranslatedCameras('meh');
              httpBackend.flush();
            });
            it(`should call http with ` +
              `"earth_date=${vdogRover.minPhotoDate}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*earth_date=${vdogRover.minPhotoDate}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}" `, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}.*`));
              });
          });
        describe(`when http returns invalid response with ` +
          `status of ${httpStatusServer}`, () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;
            beforeEach(() => {
              stubHttpRequestHandler.respond(500, '');
              sut.getTranslatedCameras('meh').then(
                (response) => { }, (error) => { errorData = error; });
              httpBackend.flush();
              rootScope.$digest();
            });
            it(`should return status of ${httpStatusServer}`, () => {

              expect(errorData.status).toEqual(httpStatusServer);
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
            it(`should return status of ${vdogApp.restStatusNoPhotos}`, () => {

              expect(errorData.status).toBe(vdogApp.restStatusNoPhotos);
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
              new vdog.DogCamera(new vdog.DogRover(), 'test2', 'testLong2'));
            (<jasmine.Spy>spyTranslateService.translateCameraList).and
              .returnValue(translatedCameras);

            sut.getTranslatedCameras('meh')
              .then((response) => { responseData = response; });
            httpBackend.flush();

            expect(responseData).toBe(translatedCameras);
          });
      });

      // getTranslatedPhotos --------------------------------------------------      
      describe(`getTranslatedPhotos`, () => {

        it(`when earthDate is passed with ${restValidDateParam} ` +
          `should call param validator with ` +
          `earthDate = ${restValidDateParam} and ` +
          `default page = 0 and default camera = ''`, () => {

            sut.getTranslatedPhotos(restValidDateParam);
            httpBackend.flush();

            expect(spyValidationService.validateParamsPage).
              toHaveBeenCalledWith(restValidDateParam, 0, '');
          });
        it(`when earthDate is passed with ${restValidDateParam} and ` +
          `camera is passed with ${restValidCameraParam} ` +
          `should call param validator with ` +
          `earthDate = ${restValidDateParam} and ` +
          `camera = ${restValidCameraParam} and ` +
          `default page = 0`, () => {

            sut.getTranslatedPhotos(restValidDateParam, 0,
              restValidCameraParam);
            httpBackend.flush();

            expect(spyValidationService.validateParamsPage).
              toHaveBeenCalledWith(restValidDateParam, 0,
              restValidCameraParam);
          });
        it(`when earthDate is passed with ${restValidDateParam} and ` +
          `camera is passed with ${restValidCameraParam} and ` +
          `page is passed with ${restValidPageParam} ` +
          `should call param validator with ` +
          `earthDate = ${restValidDateParam} and ` +
          `camera = ${restValidCameraParam} and ` +
          `page = ${restValidPageParam}`, () => {

            sut.getTranslatedPhotos(restValidDateParam,
              restValidPageParam, restValidCameraParam);
            httpBackend.flush();

            expect(spyValidationService.validateParamsPage).
              toHaveBeenCalledWith(restValidDateParam,
              restValidPageParam, restValidCameraParam);
          });
        it(`when earthDate is not passed should call param validator with ` +
          `default earthDate param = ${vdogRover.minPhotoDate}` +
          `and default page = 0 and default camera = ''`, () => {

            sut.getTranslatedPhotos();
            httpBackend.flush();

            expect(spyValidationService.validateParamsPage)
              .toHaveBeenCalledWith(vdogRover.minPhotoDate, 0, '');
          });
        describe(`when param validator returns error with ` +
          `earthDate of "${restInvalidDateParam}"`, () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;
            let wasHttpCalled: boolean;
            beforeEach(() => {
              wasHttpCalled = false;
              (<jasmine.Spy>spyValidationService.validateParamsPage).and
                .returnValue(
                { errors: [`${vdogConfig.paramKeyEarthDate}: ${restInvalidDateParam}`] });
              stubHttpRequestHandler.respond({ meh: 0 });
              sut.getTranslatedPhotos('meh').then(
                (response) => { wasHttpCalled = true; },
                (error) => { errorData = error; });
              rootScope.$digest();
            });
            it(`should return error status of ${vdogApp.restStatusBadParam}`,
              () => {

                expect(errorData.status).toEqual(vdogApp.restStatusBadParam);
              });
            it(`should return error text with ` +
              `"dateParam = ${restInvalidDateParam}"`, () => {

                expect(errorData.data).toContain(restInvalidDateParam);
              });
            it(`should not call http service`, () => {

              httpBackend.verifyNoOutstandingRequest();
              expect(wasHttpCalled).toBeFalsy();
            });
          });
        xdescribe(`when param validator returns valid parameters with ` +
          `${vdogConfig.paramKeyEarthDate}: ${vdogRover.minPhotoDate} and ` +
          `${vdogConfig.paramKeyApiKey}: ${vdogConfig.apiKey}`, () => {

            let actualUrl: string;
            beforeEach(() => {
              actualUrl = '';
              httpBackend.expectGET((url) => { actualUrl = url; return true; });
              sut.getTranslatedPhotos('meh');
              httpBackend.flush();
            });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}" `, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}.*`));
              });
          });
        xdescribe(`when param validator returns valid parameters with ` +
          `${vdogConfig.paramKeyEarthDate}: ${vdogRover.minPhotoDate} and ` +
          `${vdogConfig.paramKeyApiKey}: ${vdogConfig.apiKey} and ` +
          `${vdogConfig.paramKeyCamera}: ${vdogRover.camera}`, () => {

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
              `"${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}" `, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyCamera}=${vdogRover.camera}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyCamera}=${vdogRover.camera}.*`));
              });
          });
        xdescribe(`when param validator returns valid parameters with ` +
          `${vdogConfig.paramKeyEarthDate}: ${vdogRover.minPhotoDate} ` +
          `${vdogConfig.paramKeyApiKey}: ${vdogConfig.apiKey} and ` +
          `${vdogConfig.paramKeyCamera}: ${vdogRover.camera} and ` +
          `${vdogConfig.paramKeyPage}: ${restValidPageParam}`, () => {

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
              `"${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}" `, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyCamera}=${vdogRover.camera}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyCamera}=${vdogRover.camera}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyPage}=${restValidPageParam}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyPage}=${restValidPageParam}.*`));
              });
          });
        describe(`when http returns invalid response with ` +
          `status of ${httpStatusServer}`, () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;
            beforeEach(() => {
              stubHttpRequestHandler.respond(httpStatusServer, '');
              sut.getTranslatedPhotos('meh').then((response) => { },
                (error) => { errorData = error; });
              httpBackend.flush();
              rootScope.$digest();
            });
            it(`should return status of ${httpStatusServer}`, () => {

              expect(errorData.status).toEqual(httpStatusServer);
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
            it(`should return status of ${vdogApp.restStatusNoPhotos}`, () => {

              expect(errorData.status).toBe(vdogApp.restStatusNoPhotos);
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

      // getPhotos ------------------------------------------------------------
      describe('getPhotos', () => {
        it(`when earthDate is passed with ${restValidDateParam} ` +
          `should call param validator with ` +
          `earthDate = ${restValidDateParam} and ` +
          `default page = 0 and default camera = '' and defaultRover`, () => {

            sut.getPhotos(restValidDateParam);
            httpBackend.flush();

            expect(spyValidationService.validateParamsPage).
              toHaveBeenCalledWith(
              restValidDateParam, 0, '', vdogRover);
          });
        it(`when earthDate is passed with ${restValidDateParam} and ` +
          `camera is passed with ${restValidCameraParam} ` +
          `should call param validator with ` +
          `earthDate = ${restValidDateParam} and ` +
          `camera = ${restValidCameraParam} and ` +
          `default page = 0 and defaultRover`, () => {

            sut.getPhotos(restValidDateParam, 0,
              restValidCameraParam);
            httpBackend.flush();

            expect(spyValidationService.validateParamsPage).
              toHaveBeenCalledWith(restValidDateParam, 0,
              restValidCameraParam, vdogRover);
          });
        it(`when earthDate is passed with ${restValidDateParam} and ` +
          `camera is passed with ${restValidCameraParam} and ` +
          `page is passed with ${restValidPageParam} ` +
          `should call param validator with ` +
          `earthDate = ${restValidDateParam} and ` +
          `camera = ${restValidCameraParam} and ` +
          `page = ${restValidPageParam} and defaultRover`, () => {

            sut.getPhotos(restValidDateParam,
              restValidPageParam, restValidCameraParam);
            httpBackend.flush();

            expect(spyValidationService.validateParamsPage).
              toHaveBeenCalledWith(restValidDateParam,
              restValidPageParam, restValidCameraParam,
              vdogRover);
          });
        it(`when no parameters are passed should call param validator with ` +
          `default earthDate param = ${vdogRover.minPhotoDate} and ` +
          `default page = 0 and default camera = '' and defaultRover`, () => {

            sut.getPhotos();
            httpBackend.flush();

            expect(spyValidationService.validateParamsPage)
              .toHaveBeenCalledWith(vdogRover.minPhotoDate, 0, '', vdogRover);
          });
        it(`when a bad rover name is passed should not call param validator`,
          () => {

            sut.getPhotos('', 0, '', 'bad rover');
            rootScope.$digest();
            expect(spyValidationService.validateParamsPage)
              .not.toHaveBeenCalled();
          });
        it(`when a bad rover name is passed ` +
          `should return status ${vdogApp.restStatusBadRover}`,
          () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;
            let wasHttpCalled = false;
            sut.getPhotos('', 0, '', 'bad rover').then(
              (response) => { wasHttpCalled = true; },
              (error) => { errorData = error; });
            rootScope.$digest();

            expect(errorData.status).toEqual(vdogApp.restStatusBadRover);
          });
        describe(`when param validator returns error with ` +
          `earthDate of "${restInvalidDateParam}"`, () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;
            let wasHttpCalled: boolean;
            beforeEach(() => {
              wasHttpCalled = false;
              (<jasmine.Spy>spyValidationService.validateParamsPage).and
                .returnValue(
                { errors: [`${vdogConfig.paramKeyEarthDate}: ${restInvalidDateParam}`] });
              stubHttpRequestHandler.respond({ meh: 0 });
              sut.getPhotos('meh').then(
                (response) => { wasHttpCalled = true; },
                (error) => { errorData = error; });
              rootScope.$digest();
            });
            it(`should return error status of ${vdogApp.restStatusBadParam}`,
              () => {

                expect(errorData.status).toEqual(vdogApp.restStatusBadParam);
              });
            it(`should return error text with ` +
              `dateParam value of "${restInvalidDateParam}"`, () => {

                expect(errorData.data).toContain(restInvalidDateParam);
              });
            it(`should not call http service`, () => {

              httpBackend.verifyNoOutstandingRequest();
              expect(wasHttpCalled).toBeFalsy();
            });
          });
        xdescribe(`when param validator returns valid parameters with ` +
          `${vdogConfig.paramKeyEarthDate}: ${vdogRover.minPhotoDate} and ` +
          `${vdogConfig.paramKeyApiKey}: ${vdogConfig.apiKey}`, () => {

            let actualUrl: string;
            beforeEach(() => {
              actualUrl = '';
              httpBackend.expectGET((url) => { actualUrl = url; return true; });
              sut.getPhotos('meh');
              httpBackend.flush();
            });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}" `, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}.*`));
              });
          });
        xdescribe(`when param validator returns valid parameters with ` +
          `${vdogConfig.paramKeyEarthDate}: ${vdogRover.minPhotoDate} and ` +
          `${vdogConfig.paramKeyApiKey}: ${vdogConfig.apiKey} and ` +
          `${vdogConfig.paramKeyCamera}: ${vdogRover.camera}`, () => {

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
              `"${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}" `, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyCamera}=${vdogRover.camera}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyCamera}=${vdogRover.camera}.*`));
              });
          });
        xdescribe(`when param validator returns valid parameters with ` +
          `${vdogConfig.paramKeyEarthDate}: ${vdogRover.minPhotoDate} ` +
          `${vdogConfig.paramKeyApiKey}: ${vdogConfig.apiKey} and ` +
          `${vdogConfig.paramKeyCamera}: ${vdogRover.camera} and ` +
          `${vdogConfig.paramKeyPage}: ${restValidPageParam}`, () => {

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
              `"${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyEarthDate}=${vdogRover.minPhotoDate}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}" `, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyApiKey}=${vdogConfig.apiKey}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyCamera}=${vdogRover.camera}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyCamera}=${vdogRover.camera}.*`));
              });
            it(`should call http with ` +
              `"${vdogConfig.paramKeyPage}=${restValidPageParam}"`, () => {

                expect(actualUrl).toMatch(new RegExp(
                  `.*${vdogConfig.paramKeyPage}=${restValidPageParam}.*`));
              });
          });
        describe(`when http returns invalid response with ` +
          `status of ${httpStatusServer}`, () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;
            beforeEach(() => {
              stubHttpRequestHandler.respond(httpStatusServer, '');
              sut.getPhotos('meh').then((response) => { },
                (error) => { errorData = error; });
              httpBackend.flush();
              rootScope.$digest();
            });
            it(`should return status of ${httpStatusServer}`, () => {

              expect(errorData.status).toEqual(httpStatusServer);
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
            it(`should return status of ${vdogApp.restStatusNoPhotos}`, () => {

              expect(errorData.status).toBe(vdogApp.restStatusNoPhotos);
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
            // testPhoto.photos[0].${vdogConfig.paramKeyEarthDate} = vdogRover.minPhotoDate;
            // testPhoto.photos[0].id = 42;
            // stubHttpRequestHandler.respond(testPhoto);
            let responseData: vdog.IRestPhotos | any;
            sut.getPhotos('meh')
              .then((response) => { responseData = response; });
            httpBackend.flush();

            expect(responseData).toEqual(roverTestData);
            // expect(responseData).toBe(testPhoto);
          });
      });
    });
}