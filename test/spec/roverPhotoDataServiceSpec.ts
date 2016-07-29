describe('in the file roverPhotoDataService.ts', () => {

  let sut: vdog.RoverPhotoDataService,
    spyValidationService: vdog.RoverParamValidationService,// FORMAT CODE
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
    );// FORMAT CODE
    spyValidationService = jasmine.createSpyObj(
      'spyValidationService', ['validateParams', 'validateParamsPage']
    );
  });
  describe('when using the default application configuration' +
    'the RoverPhotoDataService class\'s', () => {

      let validatedDateCameraParam: {
        api_key: string,
        camera: string,
        earth_date: string
      },// FORMAT CODE
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
        httpStatusServer = 500;// FORMAT CODE

      beforeEach(() => {
        // inject spys
        angular.mock.module('app.core', ($provide: ng.auto.IProvideService) => {
          $provide.value('roverPhotoTranslationService', spyTranslateService);// FORMAT CODE
          $provide.value('roverParamValidationService', spyValidationService);
        });
        // get instances from angular
        inject(($httpBackend, roverPhotoDataService, $rootScope,
          roverConfig, appValues) => {
          httpBackend = $httpBackend;// FORMAT CODE
          rootScope = $rootScope;
          sut = roverPhotoDataService;// PAUSE PAUSE PAUSE
          // grab real config values
          vdogConfig = roverConfig;
          vdogApp = appValues;
        });
        vdogRover = vdogConfig.defaultRover;// PAUSE PAUSE PAUSE

        // generally need valid data from validator
        validatedDateParam = {
          api_key: vdogConfig.apiKey,
          earth_date: vdogRover.minPhotoDate
        };// FORMAT CODE
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
          .returnValue(validatedDateParam);// FORMAT CODE

        // setup backend definition to intercept ALL http calls
        stubHttpRequestHandler = httpBackend.whenGET(/.*/);

        // generally need valid photo data from http response
        httpPhotoData = roverTestData;
        stubHttpRequestHandler.respond(httpPhotoData);

      });// PAUSE PAUSE PAUSE

      // -----getTranslatedCameras------
      describe('getTranslatedCameras', () => {

        it('when earthDate is passed should call param validator with ' +
          'earthDate', () => {

            sut.getTranslatedCameras(restValidDateParam);// FORMAT CODE
            httpBackend.flush();

            expect(spyValidationService.validateParams).
              toHaveBeenCalledWith(restValidDateParam);
          });
        it('when earthDate is not passed should call param validator with ' +
          'default minPhotoDate', () => {

            sut.getTranslatedCameras();// FORMAT CODE
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
            stubHttpRequestHandler.respond({ meh: 0 });// FORMAT CODE
            sut.getTranslatedCameras('meh').then(
              (response) => { wasHttpCalled = true; },
              (error) => { errorData = error; });
            rootScope.$digest();// FORMAT CODE
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
            httpBackend.verifyNoOutstandingRequest();// FORMAT CODE
            expect(wasHttpCalled).toBeFalsy();
          });
        });
        describe('when http returns invalid response with status of 500', () => {

          let errorData: ng.IHttpPromiseCallbackArg<any>;
          beforeEach(() => {
            stubHttpRequestHandler.respond(httpStatusServer, '');// FORMAT CODE
            sut.getTranslatedCameras('meh').then(
              (response) => { }, (error) => { errorData = error; });
            httpBackend.flush();
            rootScope.$digest();
          });// FORMAT CODE
          it('should return status of 500', () => {

            expect(errorData.status).toEqual(httpStatusServer);
          });
          it('should not call translator', () => {

            expect(spyTranslateService.translateCameraList)
              .not.toHaveBeenCalled();
          });
        });// FORMAT CODE
        describe('when http returns valid response with ' +
          '"errors":"No Photos Found"', () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;// FORMAT CODE
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
          });// FORMAT CODE
        it('when http returns valid response ' +
          'should call translator', () => {

            sut.getTranslatedCameras('meh');// FORMAT CODE
            httpBackend.flush();

            expect(spyTranslateService.translateCameraList)
              .toHaveBeenCalled();
            it('when http returns valid response ' +
              'should return cameras recieved from translator', () => {
                let translatedCameras = new Array<vdog.DogCamera>();// FORMAT CODE
                let responseData: vdog.DogCamera[] | any;

                translatedCameras.push(
                  new vdog.DogCamera(new vdog.DogRover(), 'testcam', 'longtest'));
                translatedCameras.push(
                  new vdog.DogCamera(new vdog.DogRover(), 'test2', 'testLong2'));
                (<jasmine.Spy>spyTranslateService.translateCameraList).and
                  .returnValue(translatedCameras);// FORMAT CODE

                sut.getTranslatedCameras('meh')
                  .then((response) => { responseData = response; });
                httpBackend.flush();

                expect(responseData).toBe(translatedCameras);
              });
          });
      //});
    //});
//});// FORMAT CODE
// PAUSE PAUSE PAUSE
// getTranslatedPhotos --------------------------------------------------      
describe('getTranslatedPhotos', () => {

  it('when earthDate is passed should call param validator with ' +
    'earthDate', () => {

      sut.getTranslatedPhotos(restValidDateParam);
      httpBackend.flush();

      expect(spyValidationService.validateParamsPage).
        toHaveBeenCalledWith(restValidDateParam, 0, '');
    });
  it('when earthDate and camera are passed should call ' +
    'param validator with earthDate and camera', () => {

      sut.getTranslatedPhotos(restValidDateParam, 0,
        restValidCameraParam);
      httpBackend.flush();

      expect(spyValidationService.validateParamsPage).
        toHaveBeenCalledWith(restValidDateParam, 0,
        restValidCameraParam);
    });
  it('when earthDate, camera and page are passed should call ' +
    'param validator with earthDate, camera and page', () => {

      sut.getTranslatedPhotos(restValidDateParam,
        restValidPageParam, restValidCameraParam);
      httpBackend.flush();

      expect(spyValidationService.validateParamsPage).
        toHaveBeenCalledWith(restValidDateParam,
        restValidPageParam, restValidCameraParam);
    });
  it('when earthDate is not passed should call param validator with ' +
    'default earthDate, page and camera', () => {

      sut.getTranslatedPhotos();
      httpBackend.flush();

      expect(spyValidationService.validateParamsPage)
        .toHaveBeenCalledWith(vdogRover.minPhotoDate, 0, '');
    });
  describe('when param validator returns error for earthDate', () => {

    let errorData: ng.IHttpPromiseCallbackArg<any>;
    let wasHttpCalled: boolean;
    beforeEach(() => {
      wasHttpCalled = false;
      (<jasmine.Spy>spyValidationService.validateParamsPage).and
        .returnValue(
        { errors: [`earth_date: ${restInvalidDateParam}`] });
      stubHttpRequestHandler.respond({ meh: 0 });
      sut.getTranslatedPhotos('meh').then(
        (response) => { wasHttpCalled = true; },
        (error) => { errorData = error; });
      rootScope.$digest();
    });
    it('should return error status of -42',
      () => {

        expect(errorData.status).toEqual(vdogApp.restStatusBadParam);
      });
    it('should return error text with bad earthdate param', () => {

      expect(errorData.data).toContain(restInvalidDateParam);
    });
    it('should not call http service', () => {

      httpBackend.verifyNoOutstandingRequest();
      expect(wasHttpCalled).toBeFalsy();
    });
  });
  xdescribe('when param validator returns valid parameters with ' +
    'earth_date and api_key', () => {

      let actualUrl: string;
      beforeEach(() => {
        actualUrl = '';
        httpBackend.expectGET((url) => { actualUrl = url; return true; });
        sut.getTranslatedPhotos('meh');
        httpBackend.flush();
      });
      it('should send url with earth_date in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*earth_date=${vdogRover.minPhotoDate}.*`));
      });
      it('should send url with api_key in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*api_key=${vdogConfig.apiKey}.*`));
      });
    });
  xdescribe('when param validator returns valid parameters with ' +
    'earth_date, api_key and camera', () => {

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
      it('should send url with earth_date in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*earth_date=${vdogRover.minPhotoDate}.*`));
      });
      it('should send url with api_key in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*api_key=${vdogConfig.apiKey}.*`));
      });
      it('should send url with camerae in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*camera=${vdogRover.camera}.*`));
      });
    });
  xdescribe('when param validator returns valid parameters with ' +
    'earth_date, api_key, camera and page', () => {

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
      it('should send url with earth_date in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*earth_date=${vdogRover.minPhotoDate}.*`));
      });
      it('should send url with api_key in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*api_key=${vdogConfig.apiKey}.*`));
      });
      it('should send url with camera in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*camera=${vdogRover.camera}.*`));
      });
      it('should send url with page in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*page=${restValidPageParam}.*`));
      });
    });
  describe('when http returns invalid response with ' +
    'status of 500', () => {

      let errorData: ng.IHttpPromiseCallbackArg<any>;
      beforeEach(() => {
        stubHttpRequestHandler.respond(httpStatusServer, '');
        sut.getTranslatedPhotos('meh').then((response) => { },
          (error) => { errorData = error; });
        httpBackend.flush();
        rootScope.$digest();
      });
      it('should return status of 500', () => {

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
      it('should return status of -37', () => {

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
  it('when earthDate is passed should call param validator with ' +
    'earthDate, page = 0, camera = "" and defaultRover', () => {

      sut.getPhotos(restValidDateParam);
      httpBackend.flush();

      expect(spyValidationService.validateParamsPage).
        toHaveBeenCalledWith(
        restValidDateParam, 0, '', vdogRover);
    });
  it('when earthDate and camera are passed should call param validator ' +
    'with earthDate, camera, page = 0, and defaultRover', () => {

      sut.getPhotos(restValidDateParam, 0,
        restValidCameraParam);
      httpBackend.flush();

      expect(spyValidationService.validateParamsPage).
        toHaveBeenCalledWith(restValidDateParam, 0,
        restValidCameraParam, vdogRover);
    });
  it('when earthDate, camera and page are passed should call param ' +
    'validator with earthDate, camera, page and defaultRover', () => {

      sut.getPhotos(restValidDateParam,
        restValidPageParam, restValidCameraParam);
      httpBackend.flush();

      expect(spyValidationService.validateParamsPage).
        toHaveBeenCalledWith(restValidDateParam,
        restValidPageParam, restValidCameraParam,
        vdogRover);
    });
  it('when no parameters are passed should call param validator with ' +
    'default earthDate, page = 0, camera = "" and defaultRover', () => {

      sut.getPhotos();
      httpBackend.flush();

      expect(spyValidationService.validateParamsPage)
        .toHaveBeenCalledWith(vdogRover.minPhotoDate, 0, '', vdogRover);
    });
  it('when a bad rover name is passed should not call param validator',
    () => {

      sut.getPhotos('', 0, '', 'bad rover');
      rootScope.$digest();
      expect(spyValidationService.validateParamsPage)
        .not.toHaveBeenCalled();
    });
  it('when a bad rover name is passed should return status -7',
    () => {

      let errorData: ng.IHttpPromiseCallbackArg<any>;
      let wasHttpCalled = false;
      sut.getPhotos('', 0, '', 'bad rover').then(
        (response) => { wasHttpCalled = true; },
        (error) => { errorData = error; });
      rootScope.$digest();

      expect(errorData.status).toEqual(vdogApp.restStatusBadRover);
    });
  describe('when param validator returns error for earthDate', () => {

    let errorData: ng.IHttpPromiseCallbackArg<any>;
    let wasHttpCalled: boolean;
    beforeEach(() => {
      wasHttpCalled = false;
      (<jasmine.Spy>spyValidationService.validateParamsPage).and
        .returnValue(
        { errors: [`earth_date: ${restInvalidDateParam}`] });
      stubHttpRequestHandler.respond({ meh: 0 });
      sut.getPhotos('meh').then(
        (response) => { wasHttpCalled = true; },
        (error) => { errorData = error; });
      rootScope.$digest();
    });
    it('should return error status of -42',
      () => {

        expect(errorData.status).toEqual(vdogApp.restStatusBadParam);
      });
    it('should return error text with bad earthdate param', () => {

      expect(errorData.data).toContain(restInvalidDateParam);
    });
    it('should not call http service', () => {

      httpBackend.verifyNoOutstandingRequest();
      expect(wasHttpCalled).toBeFalsy();
    });
  });
  xdescribe('when param validator returns valid parameters with ' +
    'earth_date and api_key', () => {

      let actualUrl: string;
      beforeEach(() => {
        actualUrl = '';
        httpBackend.expectGET((url) => { actualUrl = url; return true; });
        sut.getPhotos('meh');
        httpBackend.flush();
      });
      it('should send url with earth_date in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*earth_date=${vdogRover.minPhotoDate}.*`));
      });
      it('should send url with api_key in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*api_key=${vdogConfig.apiKey}.*`));
      });
    });
  xdescribe('when param validator returns valid parameters with ' +
    'earth_date, api_key and camera', () => {

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
      it('should send url with earth_date in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*earth_date=${vdogRover.minPhotoDate}.*`));
      });
      it('should send url with api_key in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*api_key=${vdogConfig.apiKey}.*`));
      });
      it('should send url with camerae in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*camera=${vdogRover.camera}.*`));
      });
    });
  xdescribe('when param validator returns valid parameters with ' +
    'earth_date, api_key, camera and page', () => {

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
      it('should send url with earth_date in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*earth_date=${vdogRover.minPhotoDate}.*`));
      });
      it('should send url with api_key in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*api_key=${vdogConfig.apiKey}.*`));
      });
      it('should send url with camera in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*camera=${vdogRover.camera}.*`));
      });
      it('should send url with page in query string to $http', () => {

        expect(actualUrl).toMatch(new RegExp(
          `.*page=${restValidPageParam}.*`));
      });
    });
  describe('when http returns invalid response with ' +
    'status of 500', () => {

      let errorData: ng.IHttpPromiseCallbackArg<any>;
      beforeEach(() => {
        stubHttpRequestHandler.respond(httpStatusServer, '');
        sut.getPhotos('meh').then((response) => { },
          (error) => { errorData = error; });
        httpBackend.flush();
        rootScope.$digest();
      });
      it('should return status of 500', () => {

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
      it('should return status of -37', () => {

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
      // testPhoto.photos[0].earth_date = vdogRover.minPhotoDate;
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
describe('when using a CUSTOM application configuration' +
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
        minPhotoDate: '2002-2-2',
        roverName: 'meh',
        roverUrl: 'http://testUrl'
      }]
    };
    vdogConfig.defaultRover = vdogConfig.rovers[0];

    vdogApp = {
      restStatusBadParam: 12345,
      restStatusNoPhotos: 98765,
      restStatusBadRover: 0
    };
    beforeEach(() => {
      angular.mock.module('app.core', ($provide: ng.auto.IProvideService) => {
        $provide.value('roverPhotoTranslationService', spyTranslateService);
        $provide.value('roverParamValidationService', spyValidationService);
        $provide.value('roverConfig', vdogConfig);
        $provide.value('vdogApp', spyValidationService);

      });

      // getting instances from angular
      inject(($httpBackend, roverPhotoDataService, $rootScope,
        roverConfig, appValues) => {
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        sut = roverPhotoDataService;
        // vdogConfig = roverConfig;
        // vdogApp = appValues;
      });
      vdogRover = vdogConfig.defaultRover;
      validatedDateParam = {
        api_key: vdogConfig.apiKey,
        earth_date: vdogRover.minPhotoDate
      };
      validatedDateParam = {
        api_key: vdogConfig.apiKey,
        earth_date: vdogRover.minPhotoDate


      };

      (<jasmine.Spy>spyValidationService.validateParams).and
        .returnValue(validatedDateParam);

      // override this return value for additional returned parameters
      // available for http calls including camera and/or page
      (<jasmine.Spy>spyValidationService.validateParamsPage).and
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
            (<jasmine.Spy>spyValidationService.validateParams).and.returnValue(
              { validatedDateParam });
            stubHttpRequestHandler.respond(httpNoPhotos);
            // since I have hijacked configs valid date
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
      describe('when param validator returns valid parameters with ' +
        'earth_date and api_key', () => {

          let actualUrl: string;
          beforeEach(() => {
            (<jasmine.Spy>spyValidationService.validateParams).and.returnValue(
              { validatedDateParam });
            actualUrl = '';
            // use expectGET to grab url
            httpBackend.expectGET((url) => { actualUrl = url; return true; });
            sut.getTranslatedCameras('meh');
            httpBackend.flush();
          });
          it('should send url matching configuration value to $http', () => {

            expect(actualUrl).toMatch(new RegExp(
              `^${vdogRover.roverUrl}.*`));
          });
        });
    });
  });
});


