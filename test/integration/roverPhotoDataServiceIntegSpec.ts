describe('in the file roverPhotoDataService.ts the ' +
  'RoverPhotoDataService class\'s', () => {
    let sut: vdog.RoverPhotoDataService,
      httpBackend: ng.IHttpBackendService,
      stubHttpRequestHandler: ng.mock.IRequestHandler,
      rootScope: ng.IRootScopeService,
      q: ng.IQService,
      roverConfig = vdog.roverConfig,
      dateParam: string,
      cameraParam: string,
      pageParam: number,
      httpNoPhotos: vdog.IRestError = { errors: 'No Photos Found' };

    beforeEach(() => {
      dateParam = '2012-8-6';
      cameraParam = 'FHAZ';
      pageParam = 0;

      angular.mock.module('app.core');
      inject(($httpBackend, roverPhotoDataService, $rootScope) => {
        httpBackend = $httpBackend;
        sut = roverPhotoDataService;
        rootScope = $rootScope;
      });
      stubHttpRequestHandler = httpBackend.whenGET(/.*/);
    });
    describe('getTranslatedCameras', () => {
      describe('with bad date', () => {
        let errorData: ng.IHttpPromiseCallbackArg<any>;
        beforeEach(() => {
          dateParam = 'bad date';
        });
        it('should return error status -42', () => {
          sut.getTranslatedCameras(dateParam).then((response) => { },
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.status).toEqual(-42);
        });
        it('should return error data containing "parameter invalid"', () => {
          sut.getTranslatedCameras(dateParam).then((response) => { },
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain('parameter invalid');
        });
        it('should return error data containing date param', () => {
          sut.getTranslatedCameras(dateParam).then((response) => { },
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain(dateParam);
        });
      });
      describe('when valid http response', () => {
        let responseData: vdog.DogCamera[];
        beforeEach(() => {
          stubHttpRequestHandler.respond(vdog.test.roverTestData);
        });
        it('with curiosity test data should return 7 cameras', () => {
          sut.getTranslatedCameras('2012-8-6').then(
            (response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData.length).toEqual(7);
        });
      });
    });
    describe('getTranslatedPhotos', () => {
      describe('with bad date', () => {
        let errorData: ng.IHttpPromiseCallbackArg<any>;
        beforeEach(() => {
          dateParam = 'bad date';
        });
        it('should return error status -42', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.status).toEqual(-42);
        });
        it('should return error data containing "parameter invalid"', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain('parameter invalid');
        });
        it('should return error data containing date param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain(dateParam);
        });
        it('should return error data NOT containing page param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).not.toContain(pageParam);
        });
        it('should return error data NOT containing camera param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).not.toContain(cameraParam);
        });
      });
      describe('with bad page', () => {
        let errorData: ng.IHttpPromiseCallbackArg<any>;
        beforeEach(() => {
          pageParam = -1;
        });
        it('should return error status -42', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.status).toEqual(-42);
        });
        it('should return error data containing "parameter invalid"', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain('parameter invalid');
        });
        it('should return error data NOT containing date param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).not.toContain(dateParam);
        });
        it('should return error data containing page param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain(pageParam);
        });
        it('should return error data NOT containing camera param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).not.toContain(cameraParam);
        });
      });
      describe('with bad camera', () => {
        let errorData: ng.IHttpPromiseCallbackArg<any>;
        beforeEach(() => {
          cameraParam = 'bad camera';
        });
        it('should return error status -42', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.status).toEqual(-42);
        });
        it('should return error data containing "parameter invalid"', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain('parameter invalid');
        });
        it('should return error data NOT containing date param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).not.toContain(dateParam);
        });
        it('should return error data NOT containing page param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).not.toContain(pageParam);
        });
        it('should return error data containing camera param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain(cameraParam);
        });
      });
      describe('with bad camera, date, and page', () => {
        let errorData: ng.IHttpPromiseCallbackArg<any>;
        beforeEach(() => {
          cameraParam = 'bad camera';
          dateParam = 'bad date';
          pageParam = -1;
        });
        it('should return error status -42', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.status).toEqual(-42);
        });
        it('should return error data containing "parameter invalid"', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain('parameter invalid');
        });
        it('should return error data containing camera param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain(cameraParam);
        });
        it('should return error data containing page param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain(pageParam);
        });
        it('should return error data containing date param', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then((response) => {},
            (error) => { errorData = error; });
          rootScope.$digest();

          expect(errorData.data).toContain(dateParam);
        });
      });
      describe('when valid http response with 2 cameras', () => {
        let responseData: vdog.DogRover;
        beforeEach(() => {
          stubHttpRequestHandler.respond(vdog.test.roverTestData);
        });
        it('with curiosity test data should return curiosity', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then(
            (response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData.Name).toEqual('Curiosity');
        });
        it('with curiosity test data should return FHAZ camera', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then(
            (response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'FHAZ';
          }).length).toEqual(1);
        });
        it('with curiosity test data should return 2 photos for FHAZ camera', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then(
            (response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'FHAZ';
          })[0].Photos.length).toEqual(2);
        });
      });
      describe('when valid http response with chem cameras', () => {
        let responseData: vdog.DogRover;
        beforeEach(() => {
          stubHttpRequestHandler.respond(vdog.test.roverTestDataCurChem);
        });
        it('with curiosity test data should return CHEMCAM camera', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then(
            (response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'CHEMCAM';
          }).length).toEqual(1);
        });
        it('with curiosity test data should return 22 photos for CHEMCAM camera', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then(
            (response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'CHEMCAM';
          })[0].Photos.length).toEqual(22);
        });
        it('with curiosity test data should return MAST camera', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then(
            (response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'MAST';
          }).length).toEqual(1);
        });
        it('with curiosity test data should return 3 photos for MAST camera', () => {
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then(
            (response) => { responseData = response; });
          httpBackend.flush();

          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'MAST';
          })[0].Photos.length).toEqual(3);
        });
      });
      describe('when valid http response with FHAZ, RHAZ, NAVCAM cameras', () => {
        let responseData: vdog.DogRover;
        beforeEach(() => {
          stubHttpRequestHandler.respond(vdog.test.roverTestDataCurF_N_R);
          sut.getTranslatedPhotos(dateParam, pageParam, cameraParam).then(
            (response) => { responseData = response; });
          httpBackend.flush();
        });
        it('with curiosity test data should return FHAZ camera', () => {
          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'FHAZ';
          }).length).toEqual(1);
        });
        it('with curiosity test data should return 8 photos for FHAZ camera', () => {
          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'FHAZ';
          })[0].Photos.length).toEqual(8);
        });
        it('with curiosity test data should return RHAZ camera', () => {
          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'RHAZ';
          }).length).toEqual(1);
        });
        it('with curiosity test data should return 8 photos for RHAZ camera', () => {
          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'RHAZ';
          })[0].Photos.length).toEqual(8);
        });
        it('with curiosity test data should return NAVCAM camera', () => {
          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'NAVCAM';
          }).length).toEqual(1);
        });
        it('with curiosity test data should return 9 photos for NAVCAM camera', () => {
          expect(responseData.Cameras.filter((camera, i, cameras) => {
            return camera.ShortName === 'NAVCAM';
          })[0].Photos.length).toEqual(9);
        });
      });
    });
  });
