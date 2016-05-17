'use strict';
namespace dogsrus.virtdog {
  (() => {
    angular.module('app.otherAnimal', []);
  })();
  // we don't ever refer to the app module except in tests
  // but the other modules may be refered 2+ times
  export function getModuleOtherAnimal(): ng.IModule {
    return angular.module('app.otherAnimal');
  }
}
