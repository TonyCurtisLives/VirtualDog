namespace dogsrus.virtdog {
  export class DogConfiguration {
    public appTitle = 'Virtual Dog Demo';
    public version = '1.0.0';
    public startDog: IDog;
    public otherDogs: IDog[] = [];
    constructor() {
      this.startDog = {
        age: 5,
        barkSound: 'bark',
        chewUrgeInterval: 1000 * 20 * 1 * 1,
        coatStyle: '',
        defaultAction: 'Lay around',
        dogLonleyDuration: 1000 * 60 * 60 * 6,
        dogLonleyEndurance: 1000 * 60 * 60 * 6,
        dogSleepDuration: 1000 * 60 * 60 * 6,
        dogTiredInterval: 1000 * 60 * 60 * 6,
        earState: '',
        earStyle: '',
        familiarName: 'Fido',
        motherNature1Interval: 1000 * 60 * 60 * 6,
        motherNature2Interval: 1000 * 60 * 60 * 6,
        speciesName: 'Canis familiaris',
        startupBlog: 'I laid down and knocked my tail on the floor twice.',
        tailState: DogTailState.elevated,
        tailStyle: ''
      };
      this.otherDogs.push({
        age: 0.1,
        barkSound: 'yip',
        chewUrgeInterval: 1000 * 15,
        coatStyle: '',
        defaultAction: 'Lay around',
        dogLonleyDuration: 1000 * 60 * 60 * 6,
        dogLonleyEndurance: 1000 * 10,
        dogSleepDuration: 1000 * 60 * 4,
        dogTiredInterval: 1000 * 60 * 2,
        earState: '',
        earStyle: '',
        familiarName: 'Puppy Trouble',
        motherNature1Interval: 1000 * 60,
        motherNature2Interval: 1000 * 60 * 60 * 1,
        speciesName: 'Canis familiaris',
        startupBlog: 'I wagged my tail, no I wagged my whole body! And while I did that I did my other favorite thing, I wet all over!',
        tailState: DogTailState.wagging,
        tailStyle: ''
      }, {
          age: 5,
          barkSound: 'ruf',
          chewUrgeInterval: 1000 * 60 * 60 * 6,
          coatStyle: '',
          defaultAction: 'Lay around',
          dogLonleyDuration: 1000 * 60 * 60 * 6,
          dogLonleyEndurance: 1000 * 60 * 60 * 6,
          dogSleepDuration: 1000 * 60 * 60 * 6,
          dogTiredInterval: 1000 * 60 * 60 * 6,
          earState: '',
          earStyle: '',
          familiarName: 'Rover',
          motherNature1Interval: 1000 * 60 * 60 * 6,
          motherNature2Interval: 1000 * 60 * 60 * 6,
          speciesName: 'Canis familiaris',
          startupBlog: 'I ran up to my master wagging my tail!',
          tailState: DogTailState.wagging,
          tailStyle: ''
        });
    }
  }
  (() => {
    dogsrus.virtdog.getModuleCore().value('dogConfig', new DogConfiguration());
  })();
}
