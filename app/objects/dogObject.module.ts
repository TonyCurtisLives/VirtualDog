'use strict';
namespace dogsrus.virtdog {
  (() => {
    angular.module('app.dogObject', []);
  })();
  // we don't ever refer to the app module except in tests
  // but the other modules may be refered 2+ times
  export function getModuleDogObject(): ng.IModule {
    return angular.module('app.dogObject');
  }
}
