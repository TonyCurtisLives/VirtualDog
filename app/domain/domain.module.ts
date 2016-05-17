'use strict';
namespace dogsrus.virtdog {
  (() => {
    angular.module('app.dogDomain', []);
  })();
  // we don't ever refer to the app module except in tests
  // but the other modules may be refered 2+ times
  export function getModuleDogDomain(): ng.IModule {
    return angular.module('app.dogDomain');
  }
}
