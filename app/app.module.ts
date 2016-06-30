/// <reference path="../typings/index.d.ts" />
'use strict';
namespace dogsrus.virtdog {
  angular.module('app', [
    // Everybody has access to these
    // so centralize registration here 
    // so feature modules don't need to register them 

    'app.core',

    // Feature Modules

    'app.dogObject',
    'app.dog',
    'app.people',
    'app.roverPhotos',
    'app.otherAnimal',
    'app.dogDomain'
  ]);
  // we don't ever refer to the app module except in tests
  // but the other modules may be refered 2+ times
  export function getModuleApp(): ng.IModule {
    return angular.module('app');
  }
}
