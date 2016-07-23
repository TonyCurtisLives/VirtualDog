xdescribe('in the file roverPhotoDataService.ts the ' +
  'RoverPhotoDataService class\'s', () => {

    let sut: vdog.RoverPhotoDataService,
      spyTranslateService: vdog.RoverPhotoTranslationService,
      spyValidationService: vdog.RoverParamValidationService,
      httpBackend: ng.IHttpBackendService,
      stubHttpRequestHandler: ng.mock.IRequestHandler,
      rootScope: ng.IRootScopeService,
      roverConfig: vdog.RoverConfig,
      dateParam: string,
      cameraParam: string,
      validatedDateParam = {},
      validatedDateCameraParam = {},
      validatedDatePageCameraParam = {},
      httpNoPhotos: vdog.IRestError = { errors: 'No Photos Found' };
    roverConfig = vdog.roverConfig;

    beforeEach(() => {
      // generally need valid data from validator
      validatedDateParam[roverConfig.paramKeyApiKey]
        = roverConfig.apiKey;
      validatedDateParam[roverConfig.paramKeyEarthDate]
        = roverConfig.minPhotoDate;
      validatedDatePageCameraParam[roverConfig.paramKeyApiKey]
        = roverConfig.apiKey;
      validatedDatePageCameraParam[roverConfig.paramKeyEarthDate]
        = roverConfig.minPhotoDate;
      validatedDatePageCameraParam[roverConfig.paramKeyPage]
        = 0;
      validatedDatePageCameraParam[roverConfig.paramKeyCamera]
        = '';
      spyValidationService = jasmine.createSpyObj(
        'spyValidationService', ['validateParams', 'validateParamsPage']
      );
      (<jasmine.Spy>spyValidationService.validateParams).and
        .returnValue(validatedDateParam);
      // override this return value for additional parameters
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
        $provide.constant('roverConfig', roverConfig);
        $provide.value('roverPhotoTranslationService', spyTranslateService);
        $provide.value('roverParamValidationService', spyValidationService);
      });
      inject(($httpBackend, roverPhotoDataService, $rootScope) => {
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        sut = roverPhotoDataService;
      });

      // todo: use expectGET to test urls since call is expected for those tests
      // whenGET and expectGET can layer, with no response for expectGET
      stubHttpRequestHandler = httpBackend.whenGET(/.*/);
    });
    describe(`getTranslatedCameras`, () => {

      let httpPhotoData: vdog.IRestPhotos;
      let translatedCameras = new Array<vdog.DogCamera>();
      let responseData: vdog.DogCamera[] | any;
      beforeEach(() => {
        // gnereally need valid camera data from http response
        httpPhotoData = vdog.test.roverTestData;
        stubHttpRequestHandler.respond(httpPhotoData);

        // translated cameras not as important
        (<jasmine.Spy>spyTranslateService.translateCameraList).and
          .returnValue(translatedCameras);
      });
      it(`when earthDate is passed with ${vdogT.restValidDateParam} ` +
        `should call param validator with ` +
        `dateParam = ${vdogT.restValidDateParam}`, () => {

          validatedDateParam[roverConfig.paramKeyEarthDate]
            = vdogT.restValidDateParam;
          sut.getTranslatedCameras(vdogT.restValidDateParam);
          httpBackend.flush();

          expect(spyValidationService.validateParams).
            toHaveBeenCalledWith(vdogT.restValidDateParam);
        });
      it(`when earthDate is not passed should call param validator with ` +
        `default dateParam = ${vdogRc.minPhotoDate}`, () => {

          sut.getTranslatedCameras();
          httpBackend.flush();

          expect(spyValidationService.validateParams)
            .toHaveBeenCalledWith(vdogRc.minPhotoDate);
        });
      describe(`when param validator returns error with ` +
        `dateParam of "${vdogT.restInvalidDateParam}"`, () => {

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
          it(`should return error text with ` +
            `"${vdogA.parameterInvalidText}"`, () => {

              expect(errorData.data).toContain(vdogA.parameterInvalidText);
            });
          it(`should return error text with ` +
            `"dateParam = ${vdogT.restInvalidDateParam}"`, () => {

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
      describe(`when param validator returns valid parameters with ` +
        `earth_date=${vdogT.restValidDateParam} `, () => {

          let actualUrl: string;
          beforeEach(() => {
            validatedDateParam[roverConfig.paramKeyEarthDate]
              = vdogT.restValidDateParam;
          });
          it(`should call http with ` +
            `"${vdogRc.paramKeyEarthDate}=${vdogT.restValidDateParam}"`, () => {

              httpBackend.expectGET((url) => { actualUrl = url; return true; });
              sut.getTranslatedCameras(vdogT.restValidDateParam);
              httpBackend.flush();

              expect(actualUrl).toMatch(new RegExp(
                `.*${vdogRc.paramKeyEarthDate}=${vdogT.restValidDateParam}.*`));
            });
          it(`should call http with ` +
            `"${vdogRc.paramKeyApiKey}=${vdogRc.apiKey}" `, () => {

              httpBackend.expectGET((url) => { actualUrl = url; return true; });
              sut.getTranslatedCameras(vdogT.restValidDateParam);
              httpBackend.flush();

              expect(actualUrl).toMatch(new RegExp(
                `.*${vdogRc.paramKeyApiKey}=${vdogRc.apiKey}.*`));
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
          });
          it(`should return status of ${vdogT.httpStatusServer}`, () => {

            rootScope.$digest();
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
          });
          it(`should return status of ${vdogA.restStatusNoPhotos}`, () => {

            rootScope.$digest();
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
            .calls.argsFor(0)[0].photos[0]).toEqual(httpPhotoData.photos[0]);
        });
      });
      it('when translator returns translated cameras ' +
        'should return cameras recieved from translator', () => {

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

      let httpPhotoData: vdog.IRestPhotos;
      let translatedPhotos = new vdog.DogRover();
      let responseData: vdog.DogRover | any;
      beforeEach(() => {
        // gnereally need valid photo data from http response
        httpPhotoData = vdog.test.roverTestData;
        stubHttpRequestHandler.respond(httpPhotoData);

        // translated photos not as important
        (<jasmine.Spy>spyTranslateService.translateAllPhotos).and
          .returnValue(translatedPhotos);
      });
      it(`when earthDate is passed with ${vdogT.restValidDateParam} ` +
        `should call param validator with ` +
        `earthDate = ${vdogT.restValidDateParam} ` +
        `and default page = 0 and default camera = ''`, () => {

          validatedDatePageCameraParam[roverConfig.paramKeyEarthDate]
            = vdogT.restValidDateParam;
          sut.getTranslatedPhotos(vdogT.restValidDateParam);
          httpBackend.flush();

          expect(spyValidationService.validateParamsPage).
            toHaveBeenCalledWith(vdogT.restValidDateParam, 0, '');
        });
      it(`when earthDate is not passed should call param validator with ` +
        `default earthDate param = ${vdogRc.minPhotoDate}`, () => {

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
          it(`should return error text with ` +
            `"${vdogA.parameterInvalidText}"`, () => {

              expect(errorData.data).toContain(vdogA.parameterInvalidText);
            });
          it(`should return error text with ` +
            `"dateParam = ${vdogT.restInvalidDateParam}"`, () => {

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
      describe(`when param validator returns valid parameters with ` +
        `earth_date=${vdogT.restValidDateParam} `, () => {

          let actualUrl: string;
          beforeEach(() => {
            validatedDateParam[roverConfig.paramKeyEarthDate]
              = vdogT.restValidDateParam;
          });
          it(`should call http with ` +
            `"${vdogRc.paramKeyEarthDate}=${vdogT.restValidDateParam}"`, () => {

              httpBackend.expectGET((url) => { actualUrl = url; return true; });
              sut.getTranslatedPhotos(vdogT.restValidDateParam);
              httpBackend.flush();

              expect(actualUrl).toMatch(new RegExp(
                `.*${vdogRc.paramKeyEarthDate}=${vdogT.restValidDateParam}.*`));
            });
          it(`should call http with ` +
            `"${vdogRc.paramKeyApiKey}=${vdogRc.apiKey}" `, () => {

              httpBackend.expectGET((url) => { actualUrl = url; return true; });
              sut.getTranslatedPhotos(vdogT.restValidDateParam);
              httpBackend.flush();

              expect(actualUrl).toMatch(new RegExp(
                `.*${vdogRc.paramKeyApiKey}=${vdogRc.apiKey}.*`));
            });
        });
      describe(`when http returns invalid response with ` +
        `status of ${vdogT.httpStatusServer}`, () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(500, '');
            sut.getTranslatedPhotos('meh').then((response) => { },
              (error) => { errorData = error; });
            httpBackend.flush();
          });
          it(`should return status of ${vdogT.httpStatusServer}`, () => {

            rootScope.$digest();
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
          });
          it(`should return status of ${vdogA.restStatusNoPhotos}`, () => {

            rootScope.$digest();
            expect(errorData.status).toBe(vdogA.restStatusNoPhotos);
          });
          it('should not call translator', () => {

            expect(spyTranslateService.translateAllPhotos)
              .not.toHaveBeenCalled();
          });
        });
      describe('when http returns valid response', () => {

        it('should call translator with a photo from http data', () => {

          sut.getTranslatedPhotos('meh');
          httpBackend.flush();

          expect((<jasmine.Spy>spyTranslateService.translateAllPhotos)
            .calls.argsFor(0)[0].photos[0]).
            toEqual(httpPhotoData.photos[0]);
        });
      });
      it('when translator returns translated photos ' +
        'should return photos recieved from translator', () => {

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
  });
