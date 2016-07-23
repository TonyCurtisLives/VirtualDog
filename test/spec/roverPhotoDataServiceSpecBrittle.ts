xdescribe('brittle tests for RoverPhotoDataService class\'s', () => {
  let sut: vdog.RoverPhotoDataService,
    mockTranslateService: vdog.RoverPhotoTranslationService,
    httpBackend: ng.IHttpBackendService,
    roverConfig: vdog.RoverConfig,
    expectedConfig: vdog.RoverConfig;

  beforeEach(() => {
    mockTranslateService = jasmine.createSpyObj(
      'mockTransService', ['translateCameraList']);
    angular.mock.module('app.core', ($provide: ng.auto.IProvideService) => {
      $provide.constant('roverConfig', vdog.roverConfig);
      $provide.value('roverPhotoTranslationService', mockTranslateService);
    });
    inject(($httpBackend, roverPhotoDataService) => {
      httpBackend = $httpBackend;
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
    describe('when http response is valid', () => {
      beforeEach(() => {
        httpBackend.expectGET(
          'http://localhost:8200/mars-photos/api/v1/rovers/curiosity/photos?api_key=DEMO_KEY&earth_date=2016-01-01')
          .respond(vdog.test.roverTestData);
      });
      it('should call translator with http data', () => {
        sut.getTranslatedCameras('2016-01-01');
        httpBackend.flush();
        expect(mockTranslateService.translateCameraList).toHaveBeenCalledWith(vdog.test.roverTestData);
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
    //   it(`should pass "&${vdogRc.paramKeyApiKey}=${vdogRc.apiKey}" ` +
    // `to the http call`, () => {
    //   httpBackend.expectGET((url) => { actualUrl = url; return true; });
    //   sut.getTranslatedCameras(vdogT.restValidDateParam);
    //   httpBackend.flush();

    //   expect(actualUrl).toMatch(new RegExp(
    //     `.*\&${vdogRc.paramKeyApiKey}=${vdogRc.apiKey}.*`));
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
