'use strict';
namespace dogsrus.virtdog {
  (() => {
    angular.module('app.people', []);
  })();
  // we don't ever refer to the app module except in tests
  // but the other modules may be refered 2+ times
  export function getModulePeople(): ng.IModule {
    return angular.module('app.people');
  }
}
