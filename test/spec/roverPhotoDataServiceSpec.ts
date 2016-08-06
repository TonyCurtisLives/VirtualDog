describe('in the file roverPhotoDataService.ts', () => {

  let sut: vdog.RoverPhotoDataService,
    spyValidationService: vdog.RoverParamValidationService,
    spyTranslateService: vdog.RoverPhotoTranslationService,
    httpBackend: ng.IHttpBackendService,
    stubHttpRequestHandler: ng.mock.IRequestHandler,
    // config objects 
    vdogApp: vdog.AppValues,
    vdogConfig: vdog.RoverConfig,
    // for digest and other useful things
    rootScope: ng.IRootScopeService,
    // lots of handy test varaibles
    vdogRover: vdog.Rover,
    httpPhotoData: vdog.IRestPhotos,
    validatedDateParam: {
      api_key: string,
      earth_date: string
    },
    restInvalidDateParam = 'bad date',
    httpNoPhotos: vdog.IRestError = { errors: 'No Photos Found' };

  beforeEach(() => {
    spyTranslateService = jasmine.createSpyObj(
      'spyTranslateService', ['translateCameraList', 'translateAllPhotos']
    );
    spyValidationService = jasmine.createSpyObj(
      'spyValidationService', ['validateParams', 'validateParamsPage']
    );
  });
  describe('when using the default application configuration ' +
    'the RoverPhotoDataService class\'s', () => {

      let validatedDateCameraParam: {
        api_key: string,
        camera: string,
        earth_date: string
      },
        validatedDatePageCameraParam: {
          api_key: string,
          camera: string,
          earth_date: string,
          page: number
        },
        httpEmptyPhotos: vdog.IRestPhotos = { photos: [] },
        restValidDateParam = '2012-12-12',
        restValidCameraParam = 'FHAZ',
        restValidPageParam = 2,
        httpStatusServer = 500;

      beforeEach(() => {
        // inject spys
        angular.mock.module('app.core', ($provide: ng.auto.IProvideService) => {
          $provide.value('roverPhotoTranslationService', spyTranslateService);
          $provide.value('roverParamValidationService', spyValidationService);
        });
        // get instances from angular
        inject(($httpBackend, roverPhotoDataService, $rootScope,
          roverConfig, appValues) => {
          httpBackend = $httpBackend;
          rootScope = $rootScope;
          sut = roverPhotoDataService;
          // grab real config values
          vdogConfig = roverConfig;
          vdogApp = appValues;
        });
        vdogRover = vdogConfig.defaultRover;

        // generally need valid data from validator
        validatedDateParam = {
          api_key: vdogConfig.apiKey,
          earth_date: vdogRover.minPhotoDate
        };
        validatedDateCameraParam = {
          api_key: vdogConfig.apiKey,
          camera: vdogRover.camera,
          earth_date: vdogRover.minPhotoDate
        };
        validatedDatePageCameraParam = {
          api_key: vdogConfig.apiKey,
          camera: vdogRover.camera,
          earth_date: vdogRover.minPhotoDate,
          page: restValidPageParam
        };

        (<jasmine.Spy>spyValidationService.validateParams).and
          .returnValue(validatedDateParam);

        // replace this return test var for added params
        // like camera and/or page
        (<jasmine.Spy>spyValidationService.validateParamsPage).and
          .returnValue(validatedDateParam);

        // setup backend definition to intercept ALL http calls
        stubHttpRequestHandler = httpBackend.whenGET(/.*/);

        // generally need valid photo data from http response
        httpPhotoData = roverTestData;
        stubHttpRequestHandler.respond(httpPhotoData);

      });

      // -----getTranslatedCameras------
      describe('getTranslatedCameras', () => {

        it('when earthDate is passed should call param validator with ' +
          'earthDate', () => {

            sut.getTranslatedCameras(restValidDateParam);
            httpBackend.flush();

            expect(spyValidationService.validateParams)
              .toHaveBeenCalledWith(restValidDateParam);
          });
        it('when earthDate is not passed should call param validator with ' +
          'default minPhotoDate', () => {

            sut.getTranslatedCameras();
            httpBackend.flush();

            expect(spyValidationService.validateParams)
              .toHaveBeenCalledWith(vdogRover.minPhotoDate);
          });
        describe('when param validator returns error for earthDate', () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          let wasHttpCalled: boolean;
          beforeEach(() => {
            wasHttpCalled = false;
            (<jasmine.Spy>spyValidationService.validateParams).and.returnValue(
              { errors: [`earth_date: ${restInvalidDateParam}`] });
            stubHttpRequestHandler.respond({ meh: 0 });
            sut.getTranslatedCameras('meh').then(
              (response) => { wasHttpCalled = true; },
              (error) => { errorData = error; });
            rootScope.$digest();
          });
          it('should return error status of -42', () => {

            expect(errorData.status).toEqual(vdogApp.restStatusBadParam);
          });
          it('should return error text with bad earthdate param', () => {

            expect(errorData.data).toContain(restInvalidDateParam);
          });
          it('should not call http service', () => {

            // if any responses remain in the buffer 
            // verifyNoOutstandingRequest throws an error (and fails the test)
            // since we haven't called flush, if there were any 
            // responses generated they would still be in the buffer
            httpBackend.verifyNoOutstandingRequest();
            expect(wasHttpCalled).toBeFalsy();
          });
        });
        describe('when http returns invalid response with status of 500', () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(httpStatusServer, '');
            sut.getTranslatedCameras('meh').then(
              (response) => { }, (error) => { errorData = error; });
            httpBackend.flush();
            rootScope.$digest();
          });
          it('should return status of 500', () => {

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
            it('should return status of -37', () => {

              expect(errorData.status).toBe(vdogApp.restStatusNoPhotos);
            });
            it('should not call translator', () => {

              expect(spyTranslateService.translateCameraList)
                .not.toHaveBeenCalled();
            });
          });
        it('when http returns valid response ' +
          'should call translator', () => {

            sut.getTranslatedCameras('meh');
            httpBackend.flush();

            expect(spyTranslateService.translateCameraList)
              .toHaveBeenCalled();
          });
        it('when http returns valid response ' +
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
    });
  describe('when using a CUSTOM application configuration ' +
    'the RoverPhotoDataService class\'s', () => {

      vdogConfig = {
        apiKey: 'meh',
        defaultRover: null,
        paramKeyApiKey: 'meh',
        paramKeyCamera: 'meh',
        paramKeyEarthDate: 'meh',
        paramKeyError: 'meh',
        paramKeyPage: 'meh',
        rovers: [{
          alternateUrl: 'meh',
          camera: 'meh',
          cameraList: 'meh',
          maxPageNumber: 0,
          maxPhotoDateOffset: 0,
          minPhotoDate: '4242-4-2',
          roverName: 'meh',
          roverUrl: 'meh'
        }]
      };
      vdogConfig.defaultRover = vdogConfig.rovers[0];

      vdogApp = {
        restStatusBadParam: -9429,
        restStatusNoPhotos: -8428,
        restStatusBadRover: 0
      };
      beforeEach(() => {
        angular.mock.module('app.core', ($provide: ng.auto.IProvideService) => {
          $provide.value('roverPhotoTranslationService', spyTranslateService);
          $provide.value('roverParamValidationService', spyValidationService);
          $provide.value('roverConfig', vdogConfig);
          $provide.value('vdogApp', vdogApp);

        });

        // getting instances from angular
        inject(($httpBackend, roverPhotoDataService, $rootScope,
          roverConfig, appValues) => {
          httpBackend = $httpBackend;
          rootScope = $rootScope;
          sut = roverPhotoDataService;
        });
        vdogRover = vdogConfig.defaultRover;
        validatedDateParam = {
          api_key: vdogConfig.apiKey,
          earth_date: vdogRover.minPhotoDate
        };

        (<jasmine.Spy>spyValidationService.validateParams).and
          .returnValue(validatedDateParam);

        // setup backend definition to intercept ALL http calls
        stubHttpRequestHandler = httpBackend.whenGET(/.*/);

        // generally need valid photo data from http response
        httpPhotoData = roverTestData;
        stubHttpRequestHandler.respond(httpPhotoData);

      });
      describe('getTranslatedCameras', () => {
        it('when earthDate is not passed should call param validator with ' +
          'custom configuration minPhotoDate', () => {

            sut.getTranslatedCameras();
            httpBackend.flush();

            expect(spyValidationService.validateParams)
              .toHaveBeenCalledWith(vdogRover.minPhotoDate);
          });
        describe('when param validator returns error for earthDate', () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          let wasHttpCalled: boolean;
          beforeEach(() => {
            wasHttpCalled = false;
            (<jasmine.Spy>spyValidationService.validateParams).and.returnValue(
              { errors: [`earth_date: ${restInvalidDateParam}`] });
            stubHttpRequestHandler.respond({ meh: 0 });
            sut.getTranslatedCameras('meh').then(
              (response) => { wasHttpCalled = true; },
              (error) => { errorData = error; });
            rootScope.$digest();
          });
          it('should return error custom configuration status', () => {

            expect(errorData.status).toEqual(vdogApp.restStatusBadParam);
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
            it('should return custom configuration status', () => {

              expect(errorData.status).toBe(vdogApp.restStatusNoPhotos);
            });
          });
      });
    });
});
