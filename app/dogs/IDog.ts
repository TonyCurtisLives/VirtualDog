'use strict';
namespace dogsrus.virtdog {
  export enum DogTailState {
    wagging,
    elevated,
    drooped,
    tucked
  }
  export interface IDog extends IAnimal{
    age: number;
    barkSound: string;
    breed: string;
    chewUrgeInterval: number;
    coatStyle: string;
    dogLonelyDuration: number;
    dogLonelyEndurance: number;
    dogSleepDuration: number;
    dogTiredInterval: number;
    earState: string;
    earStyle: string;
    motherNature1Interval: number;
    motherNature2Interval: number;
    squeakyOcdChewCount: number;
    startupBlog: string;
    tailState: DogTailState;
    tailStyle: string;
  }
}
