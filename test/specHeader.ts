/// <reference path="../typings/index.d.ts" />

namespace dogsrus.virtdogtest {
  import vdog = virtdog;

  // get constants to use in testing
  let $injector = angular.injector(['app.core']);
  export let vdogApp = $injector.get<vdog.AppValues>('appValues');
  export let vdogConfig = $injector.get<vdog.RoverConfig>('roverConfig');
  export let vdogEvents = $injector.get<vdog.EventNames>('eventNames');
  export let vdogPlaces = $injector.get<vdog.DogPlaces>('dogPlaces');
}

