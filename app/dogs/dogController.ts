'use strict';
namespace dogsrus.virtdog {
  export class DogController implements IDog {
    // interface first 
    public speciesName = 'Canis familiaris';
    public familiarName = '';
    public defaultAction = '';

    public coatStyle = '';
    public tailStyle = '';
    public earStyle = '';
    public age = 0;
    public barkSound = '';
    public startupBlog = '';
    public tailState = DogTailState.elevated;
    public earState = '';
    public chewUrgeInterval = 1000 * 60 * 60 * 6;
    public motherNature1Interval = 1000 * 60 * 60 * 6;
    public motherNature2Interval = 1000 * 60 * 60 * 6;
    public dogTiredInterval = 1000 * 60 * 60 * 6;
    public dogSleepDuration = 1000 * 60 * 60 * 6;
    public dogLonleyEndurance = 1000 * 60 * 60 * 6;
    public dogLonleyDuration = 1000 * 60 * 60 * 6;

    public blogContent = '';
    public blogPreface: string[] = [''];
    public chewObjects: DogObject[] = [];
    public dogList: IDog[] = [];
    public chewPromise: ng.IPromise<any>;

    public dogDomain: DogDomain = null;

    // constructor next
    static $inject = ['$rootScope', '$interval', 'dogConfig', 'eventNames'];
    constructor(
      private $rootScope: ng.IRootScopeService,
      private $interval: ng.IIntervalService,
      private dogConfig: DogConfiguration,
      private eventNames: EventNames
    ) {
      // initialize startup dog
      this.initializeDog(this.dogConfig.startDog);
      this.initializeEvents();
      this.initializeLists();

      this.blog(this.startupBlog);
    }

    // public methods next
    public testBark() {
      this.bark(3);
    }

    public getTailStateText() {
      // tip: how to get text from enum
      return DogTailState[this.tailState];
    }

    // --------------------- private stuff down here -------------------------------
    private initializeDog(dogToCopy: IDog) {
      this.familiarName = dogToCopy.familiarName;
      this.barkSound = dogToCopy.barkSound;
      this.age = dogToCopy.age;
      this.startupBlog = dogToCopy.startupBlog;
      this.chewUrgeInterval = dogToCopy.chewUrgeInterval;
    }

    private initializeEvents() {
      // setup event handlers
      this.chewPromise = this.$interval(() => {
        this.chewOnSomething();
      }, this.chewUrgeInterval, 0, true);

      this.$rootScope.$on(this.eventNames.masterThrow, (event, args) => {
        this.handleEvent(event, args);
      });
      this.$rootScope.$on(this.eventNames.masterFeed, (event, args) => {
        this.handleEvent(event, args);
      });
      // this.$rootScope.$on(this.eventNames.masterThrow, (event, args) => {
      //   this.fetch(<DogObject>args);
      // });
      // this.$rootScope.$on(this.eventNames.masterFeed, (event, args) => {
      //   this.eat(args);
      // });
      this.$rootScope.$on(this.eventNames.decapitate, (event, args) => {
        this.handleEvent(event, args);
      });
      this.$rootScope.$on(this.eventNames.catHiss, (event, args) => {
        this.handleEvent(event, args);
      });
      this.$rootScope.$on(this.eventNames.personPet, (event, args) => {
        this.handleEvent(event, args);
      });
      this.$rootScope.$on(this.eventNames.animalRun, (event, args) => {
        this.handleEvent(event, args);
      });
      this.$rootScope.$on(this.eventNames.changeDomain, (event, args) => {
        this.handleEvent(event, args);
      });
      this.$rootScope.$on(this.eventNames.commandStay, (event: ng.IAngularEvent, args) => {
        this.handleEvent(event, args);
      });
      this.$rootScope.$on(this.eventNames.commandShake, (event: ng.IAngularEvent, args) => {
        this.handleEvent(event, args);
      });
      this.$rootScope.$on(this.eventNames.dogBark, (event, args) => {
        this.handleEvent(event, args);
      });

      // bind all event handlers to this
      // this.fetch = this.fetch.bind(this);
      // this.eat = this.eat.bind(this);
      this.chewOnSomething = this.chewOnSomething.bind(this);
      this.handleEvent = this.handleEvent.bind(this);
      // this.decapitateHandler = this.decapitateHandler.bind(this);
      // this.stopChewing = this.stopChewing.bind(this);
      // this.bark = this.bark.bind(this);
      // this.getPetted = this.getPetted.bind(this);
      // this.giveChase = this.giveChase.bind(this);
      // this.setDogDomain = this.setDogDomain.bind(this);
      // this.respondToCommand = this.respondToCommand.bind(this);
      // this.getExcited = this.getExcited.bind(this);
    }

    private initializeLists() {
      this.blogPreface.push('Guess what! ');
      this.blogPreface.push('Ha! ');
      this.blogPreface.push('Nice! ');
      this.blogPreface.push('You\'ll never believe this! ');
      this.blogPreface.push('OMG! ');
      this.blogPreface.push('So I\'m laying here. ');
      for (let x = 1; x < this.dogConfig.otherDogs.length; x++) {
        this.dogList.push(this.dogConfig.otherDogs[x]);
      }
      this.dogList.push(this.dogConfig.startDog);
    }

    private handleEvent(event: ng.IAngularEvent, args) {
      switch (event.name) {
        case this.eventNames.masterThrow:
          this.fetch(<DogObject>args);
          break;
        case this.eventNames.masterFeed:
          this.eat(args);
          break;
        case this.eventNames.decapitate:
          this.decapitateHandler();
          break;
        case this.eventNames.catHiss:
          this.bark(10);
          break;
        case this.eventNames.animalRun:
          this.giveChase(<IAnimal>args);
          break;
        case this.eventNames.personPet:
          this.getPetted(<IAnimal>args);
          break;
        case this.eventNames.changeDomain:
          this.setDogDomain(<DogDomain>args);
          break;
        case this.eventNames.commandStay:
        case this.eventNames.commandShake:
          this.respondToCommand(<IAnimal>args, event.name);
          break;
        case this.eventNames.dogBark:
          this.getExcited(<IAnimal>args);
          break;
        default:
          this.displayConfusion(event, args);
          break;
      }
    }

    private blog(blogEntry: string, addPreface = true): void {
      if (blogEntry !== '') {
        if (addPreface) {
          blogEntry = this.blogPreface[Math.floor(
            (Math.random() * this.blogPreface.length))] + blogEntry;
        }
        blogEntry = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }) + ': ' + blogEntry;
        this.blogContent = blogEntry + '\r\n' + this.blogContent;
      }
    }

    private fetch(fetchObject: DogObject) {
      let blogEntry = 'My master just threw a '
        + fetchObject.name + '. '
        + 'I ran like mad to grab the ' + fetchObject.name;
      if (fetchObject.flies) {
        blogEntry += ' and leapt like Air Jordan, snatching in mid flight!';
      } else {
        blogEntry += ' snapping it up far sooner than imaginable!';
      }

      if (fetchObject.chewy && !this.chewObjects.some((chewObject) => {
        return chewObject.name === fetchObject.name;
      })) {
        this.chewObjects.push(fetchObject);
      }
      fetchObject.chewOn();
      blogEntry += ' I gave the ' + fetchObject.name
        + ' a good chew or two and dropped it.';

      this.blog(blogEntry);
    }

    private bark(numberOfBarks: number) {
      let totalBarkText = '';
      for (let x = 0; x < numberOfBarks; x++) {
        totalBarkText += this.barkSound + ' ';
      }
      this.blog(totalBarkText, false);
    }

    private eat(food: DogObject) {
      let blogEntry = '';
      blogEntry = 'My master just fed me ' + food.name;
      if (food.edible) {
        if (food.name === 'dog food') {
          blogEntry += '! I ignored it for an hour, dumped it out on the floor, then ate the ' + food.name
            + ' one piece at a time!';
          this.tailState = DogTailState.wagging;
        } else {
          blogEntry += '! I devoured the ' + food.name + ' immediately'
            + ' and looked back up at him with a hungry face.';
          this.tailState = DogTailState.wagging;
        }
      } else {
        blogEntry += '? I sniffed the ' + food.name
          + ' and tilted my head.';
        this.tailState = DogTailState.elevated;
      }
      this.blog(blogEntry);
    }

    private chewOnSomething() {
      if (this.chewObjects.length !== 0) {
        this.chewObjects.sort((chewObject1, chewObject2) => {
          return chewObject1.expensive > chewObject2.expensive ? -1 :
            chewObject1.expensive < chewObject2.expensive ? 1 :
              chewObject1.irreplaceable ? -1 : 0;
        });
      }

      for (let x = 0; x < this.chewObjects.length; x++) {
        if (this.chewObjects[x].chewy) {
          this.chewObjects[x].chewOn();
          let description = 'Suddenly I got an urge to chew! '
            + 'I happily chewed on the ' + this.chewObjects[x].name + '!'
            + ' The ' + this.chewObjects[x].name + ' is now '
            + this.chewObjects[x].getSpitStateText() + ' and '
            + this.chewObjects[x].getStateText()
            + ((this.chewObjects[x].monetaryValue < 1) ? '.' : (' and is now worth $'
              + Math.round(this.chewObjects[x].monetaryValue) + '.'));
          this.blog(description);
          return;
        }
      }
    }

    private stopChewing() {
      this.$interval.cancel(this.chewPromise);
    }

    private decapitateHandler() {
      this.stopChewing();
      this.tailState = DogTailState.tucked;
      this.blog('Oh no! Not the rab...');
    }

    private getPetted(person: IAnimal) {
      this.tailState = DogTailState.wagging;
      let description = person.familiarName
        + ' just gave me a good petting! I smile and look at '
        + person.familiarName + ' with my big dog eyes look!';
      this.blog(description, true);
    }

    private giveChase(someAnimal: IAnimal) {
      this.tailState = DogTailState.wagging;
      let description = 'I just chased ' + someAnimal.familiarName
        + ' through the ' + this.dogDomain.name + '!!!';
      this.blog(description, true);
    }

    private setDogDomain(dogDomain: DogDomain) {
      this.dogDomain = dogDomain;
    }

    private respondToCommand(somePerson: IAnimal, commandName: string) {
      let description = somePerson.familiarName + ' just told me to ' + commandName + '! ';
      if (somePerson.familiarName === 'The Mailman') {
        this.giveChase(somePerson);
        this.blog(description, false);
        return;
      }
      if (commandName === this.eventNames.commandStay) {
        if (somePerson.familiarName === 'The Alpha Male') {
          description += 'I stayed.';
        } else {
          description += 'I ignored it.';
        }
      } else {
        description += 'I did it.';
      }
      this.blog(description, true);
    }

    private getExcited(someAnimal: IAnimal) {
      let description = someAnimal.familiarName + ' wants to play with me!!! I wag my tail vigorously whine and jump up!!!';
      this.blog(description, true);
    }

    private displayConfusion(event: ng.IAngularEvent, args) {
      this.blog('I tilt my head at ' + event.name + ', akward...');
    }

  }
  (() => {
    dogsrus.virtdog.getModuleDog().controller('dogController', DogController);
  })();
}
