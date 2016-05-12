
// describe('tunesDataService.js', function () {
//   describe('tunesDataService', function () {
//     var $service: ng.IServiceProvider,
//       httpBackend: ng.IHttpBackendService,
//       tunesConfig: dogsrus.virtdog.TunesConfig;
//     tunesConfig = {
//       tunesUrl: 'http://thisIsATest/',
//       apiKey: 'testAPIKey',
//       userName: 'testUserName'
//     }
//     beforeEach(angular.mock.module('app.core', function ($provide) {
//       $provide.constant('tunesConfig', tunesConfig);
//     }));
//     describe('getLovedTracks', function () {
//       it('should make http call with url', inject(function (
//         $httpBackend, tunesDataService) {
//         // test successful expectation for nosuch, it works, see below
//         //$httpBackend.expectGET('nosuch').respond({});
//         $httpBackend.expectGET(new RegExp(tunesConfig.tunesUrl + '.*'))
//           .respond({});
//         tunesDataService.getLovedTracks('junk');
//         $httpBackend.flush();
//         // I am getting the message: "SPEC HAS NO EXPECTATIONS"
//         // but if I change the url to something invalid
//         // I get "Error: Unexpected request: ... Expected GET nosuch"
//         // so the expectation is being set, but if I expect the
//         // correct url, it is not being set?
//         // no answer for this online, only 1 suggestion is below
//         expect('supress "SPEC HAS NO EXPECTATIONS"').toBeDefined();
//       }));
//       it('should make http call with method parameter', inject(function (
//         $httpBackend, tunesDataService) {
//         $httpBackend.expectGET(new RegExp('^.*method=user\.getLovedTracks.*'))
//           .respond({});

//         tunesDataService.getLovedTracks('junk');
//         $httpBackend.flush();

//         expect('supress "SPEC HAS NO EXPECTATIONS"').toBeDefined();
//       }));
//       it('should make http call with user parameter', inject(function (
//         $httpBackend, tunesDataService) {
//         var expectedUser = 'expectedUser';
//         $httpBackend.expectGET(new RegExp('^.*user=' + expectedUser + '.*'))
//           .respond({});

//         tunesDataService.getLovedTracks(expectedUser);
//         $httpBackend.flush();

//         expect('supress "SPEC HAS NO EXPECTATIONS"').toBeDefined();
//       }));
//       it('should make http call with api_key parameter', inject(function (
//         $httpBackend, tunesDataService) {
//         $httpBackend.expectGET(
//           new RegExp('^.*api_key=' + tunesConfig.apiKey + '.*')
//           ).respond({});

//         tunesDataService.getLovedTracks('junk');
//         $httpBackend.flush();

//         expect('supress "SPEC HAS NO EXPECTATIONS"').toBeDefined();
//       }));
//       it('should make http call with format=json parameter', inject(function (
//         $httpBackend, tunesDataService) {
//         $httpBackend.expectGET(new RegExp('^.*format=json.*'))
//           .respond({});

//         tunesDataService.getLovedTracks('junk');
//         $httpBackend.flush();

//         expect('supress "SPEC HAS NO EXPECTATIONS"').toBeDefined();
//       }));
//       it('should return expected data', inject(function (
//         $httpBackend: ng.IHttpBackendService, tunesDataService) {
//         var expectedData = { testData: 'some data' };
//         var actualData;
//         $httpBackend.whenGET(/^\w+.*/).respond(expectedData);

//         tunesDataService.getLovedTracks('junk')
//           .then(function (response) { actualData = response });
//         $httpBackend.flush();
        
//         expect(actualData).toEqual(expectedData);
//       }));
//     });
//   });
// });