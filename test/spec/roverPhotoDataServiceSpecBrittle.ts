namespace dogsrus.virtdogtest {
  import vdog = virtdog;

  describe('brittle tests for RoverPhotoDataService class\'s -----------------' +
    '-------------------------------------------------------------------', () => {
      let sut: vdog.RoverPhotoDataService,
        mockTranslateService: vdog.RoverPhotoTranslationService,
        mockValidationService: vdog.RoverParamValidationService,
        httpBackend: ng.IHttpBackendService,
        rootScope: ng.IRootScopeService,
        roverConfig: vdog.RoverConfig,
        expectedConfig: vdog.RoverConfig;

      beforeEach(() => {
        mockTranslateService = jasmine.createSpyObj(
          'mockTransService', ['translateCameraList']);
        mockValidationService = jasmine.createSpyObj(
          'mockValidationService', ['validateParams', 'validateParamsPage']);
        (<jasmine.Spy>mockValidationService.validateParams).and.returnValue({
          earth_date: '2012-08-06',
          api_key: 'DEMO_KEY'
        });
        angular.mock.module('app.core', ($provide: ng.auto.IProvideService) => {
          //$provide.constant('roverConfig', vdogTest.roverConfig);
          $provide.value('roverPhotoTranslationService', mockTranslateService);
          $provide.value('roverParamValidationService', mockValidationService);
        });
        inject(($httpBackend, $rootScope, roverPhotoDataService) => {
          httpBackend = $httpBackend;
          rootScope = $rootScope;
          sut = roverPhotoDataService;
        });
      });
      describe('getTranslatedCameras', () => {
        let translatedRover: vdog.DogRover = new vdog.DogRover;
        let responseData: vdog.DogCamera[] | any;
        beforeEach(() => {
          translatedRover.Cameras.push(
            new vdog.DogCamera(translatedRover, 'testcam', 'longtest'));
          translatedRover.Cameras.push(
            new vdog.DogCamera(translatedRover, 'testShort2', 'testLong2'));
          (<jasmine.Spy>mockTranslateService.translateCameraList).and
            .returnValue(translatedRover.Cameras);
        });
        describe('when valid parameters are passed to validator', () => {
          beforeEach(() => {
            httpBackend.expectGET(
              'http://localhost:8200/mars-photos/api/v1/rovers/curiosity/photos?api_key=DEMO_KEY&earth_date=2016-08-06')
              .respond(roverTestData);
          });
          it('when earthdate is passed with 2016-01-01 ' +
            'should call param validator with ' +
            'earthDate = 2016-01-01', () => {

              sut.getTranslatedCameras('2016-01-10');
              httpBackend.flush();

              expect(mockValidationService.validateParams).
                toHaveBeenCalledWith('2016-01-01');
            });
          it('when earthdate is npt passed ' +
            'should call param validator with ' +
            'earthDate = 2016-08-06', () => {

              sut.getTranslatedCameras();
              httpBackend.flush();

              expect(mockValidationService.validateParams).
                toHaveBeenCalledWith('2016-08-06');
            });
        });
        describe('when param validator returns error with ' +
          'earthDate of "1976-01-01"', () => {

            let errorData: ng.IHttpPromiseCallbackArg<any>;
            let wasHttpCalled: boolean;
            beforeEach(() => {
              wasHttpCalled = false;
              (<jasmine.Spy>mockValidationService.validateParams).and.returnValue(
                { errors: ['earth_date : 1976-01-01'] });
              httpBackend.expectGET(
                'http://localhost:8200/mars-photos/api/v1/rovers/curiosity/photos?api_key=DEMO_KEY&earth_date=2016-01-01')
                .respond(roverTestData);
              sut.getTranslatedCameras('1976-01-01').then(
                (response) => { wasHttpCalled = true; },
                (error) => { errorData = error; });
              rootScope.$digest();
            });
            it('should return error status of 42',
              () => {

                expect(errorData.status).toEqual(42);
              });
            it('should return error text with ' +
              '"error: parameter invalid - earth_date=1979-01-01', () => {

                expect(errorData.data).toEqual(
                  'error: parameter invalid - earth_date=1979-01-01');
              });
            it('should not call http service', () => {

              httpBackend.verifyNoOutstandingRequest();
              expect(wasHttpCalled).toBeFalsy();
            });
          });
        describe('when http response is valid', () => {
          beforeEach(() => {
            httpBackend.expectGET(
              'http://localhost:8200/mars-photos/api/v1/rovers/curiosity/photos?api_key=DEMO_KEY&earth_date=2012-08-06')
              .respond(roverTestData);
          });
          it('should call translator with http data', () => {
            sut.getTranslatedCameras('2016-01-01');
            httpBackend.flush();
            expect(mockTranslateService.translateCameraList).toHaveBeenCalledWith(roverTestData);
          });
          it('should return cameras returned from translator', () => {
            sut.getTranslatedCameras('2016-01-01')
              .then((response) => { responseData = response; });
            httpBackend.flush();

            expect(responseData).toBe(translatedRover.Cameras);
          });
        });
        describe('when http response is "errors":"No Photos Found"', () => {
          beforeEach(() => {
            httpBackend.expectGET(
              'http://localhost:8200/mars-photos/api/v1/rovers/curiosity/photos?api_key=DEMO_KEY&earth_date=2016-01-01')
              .respond({ errors: 'No Photos Found' });
          });
          it('should return empty camera array', () => {
            sut.getTranslatedCameras('2016-01-01')
              .then((response) => { responseData = response; });
            httpBackend.flush();
            expect(responseData).toEqual(new Array<vdog.DogCamera>());
          });
          it('should not call translator', () => {
            sut.getTranslatedCameras('2016-01-01');
            httpBackend.flush();
            expect(mockTranslateService.translateCameraList).not.toHaveBeenCalled();
          });
        });
        // describe('when sending url to http service', () => {
        //   beforeEach(() => {
        //     httpBackend.expectGET(
        //       'http://localhost:8200//mars-photos/api/v1/rovers/curiosity/photos/')
        //       .respond('meh');
        //   });
        //   it('should pass "&${vdogRc.paramKeyApiKey}=${vdogRc.apiKey}" ' +
        // 'to the http call', () => {
        //   httpBackend.expectGET((url) => { actualUrl = url; return true; });
        //   sut.getTranslatedCameras(vdogT.restValidDateParam);
        //   httpBackend.flush();

        //   expect(actualUrl).toMatch(new RegExp(
        //     '.*\&${vdogRc.paramKeyApiKey}=${vdogRc.apiKey}.*'));
        // });

        //   it('should send DEMO_KEY', () => {
        //     sut.getTranslatedCameras();
        //     httpBackend.flush();
        //     expect(actualUrl).toContain('?api_key=DEMO_KEY');
        //   });
        //   it('should send correct url', () => {
        //     sut.getTranslatedCameras();
        //     httpBackend.flush();
        //     expect(actualUrl).toMatch(new RegExp('^http://localhost:8200//mars-photos/api/v1/rovers/curiosity/photos.*'));
        //   });
        //   it('when called without earth_date should call http with 2012-8-6', () => {
        //     sut.getTranslatedCameras();
        //     httpBackend.flush();
        //     expect(actualUrl).toContain('&earth_date=2012-8-6');
        //   });
        // });
      });
    });
}