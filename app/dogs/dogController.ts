'use strict';
namespace dogsrus.virtdog {
  export class DogController implements IDog {
    public blogContent = '';
    public blogPreface: string[] = [''];
    public chewObjects: DogObject[] = [];
    public chewPromise: ng.IPromise<any>;
    public dogDomain: DogDomain = null;
    public dogList: IDog[] = [];

    // IDog
    public age = 0;
    public barkSound = '';
    public breed = '';
    public chewUrgeInterval = 1000 * 60 * 60 * 6;
    public coatStyle = '';
    public dogLonelyDuration = 1000 * 60 * 60 * 6;
    public dogLonelyEndurance = 1000 * 60 * 60 * 6;
    public dogSleepDuration = 1000 * 60 * 60 * 6;
    public dogTiredInterval = 1000 * 60 * 60 * 6;
    public earState = '';
    public earStyle = '';
    public motherNature1Interval = 1000 * 60 * 60 * 6;
    public motherNature2Interval = 1000 * 60 * 60 * 6;
    public squeakyOcdChewCount = 1;
    public startupBlog = '';
    public tailState = DogTailState.elevated;
    public tailStyle = '';

    // IAnimal
    public defaultAction = '';
    public familiarName = '';
    public speciesName = 'Canis familiaris';

    static $inject = ['$rootScope', '$interval', 'dogConfig', 'eventNames'];
    constructor(
      private $rootScope: ng.IRootScopeService,
      private $interval: ng.IIntervalService,
      private dogConfig: DogConfiguration,
      private eventNames: EventNames
    ) {
      this.initializeDog(this.dogConfig.startDog);
      this.initializeEvents();
      this.initializeLists();

      this.blog(this.startupBlog);
    }

    public testBark() {
      this.bark(3);
    }

    public getTailStateText() {
      return DogTailState[this.tailState];
    }

    // --------------------- private stuff down here -------------------------------
    private initializeDog(dogToCopy: IDog) {
      // todo: not all dog props are being transfered
      this.familiarName = dogToCopy.familiarName;
      this.barkSound = dogToCopy.barkSound;
      this.age = dogToCopy.age;
      this.startupBlog = dogToCopy.startupBlog;
      this.chewUrgeInterval = dogToCopy.chewUrgeInterval;
    }

    private initializeEvents() {
      this.chewPromise = this.$interval(this.chewOnSomething, this.chewUrgeInterval, 0, true);
      this.$rootScope.$on(this.eventNames.masterThrow, this.fetch);
      this.$rootScope.$on(this.eventNames.masterFeed, this.eat);
      this.$rootScope.$on(this.eventNames.decapitate, this.decapitateHandler);
      this.$rootScope.$on(this.eventNames.catHiss, (e, a) => this.bark(10));
      this.$rootScope.$on(this.eventNames.personPet, this.getPetted);
      this.$rootScope.$on(this.eventNames.animalRun, (e, arg) => this.giveChase(<IAnimal>arg));
      this.$rootScope.$on(this.eventNames.changeDomain, (e, arg) => this.setDogDomain(<DogDomain>arg));
      this.$rootScope.$on(this.eventNames.commandStay, this.respondToCommand);
      this.$rootScope.$on(this.eventNames.commandShake, this.respondToCommand);
      this.$rootScope.$on(this.eventNames.dogBark, (e, a) => this.getExcited);
    }

    private initializeLists() {
      this.blogPreface.push('Guess what! ');
      this.blogPreface.push('Ha! ');
      this.blogPreface.push('Nice! ');
      this.blogPreface.push('You\'ll never believe this! ');
      this.blogPreface.push('OMG! ');
      this.blogPreface.push('So I\'m laying here. ');
      for (let x = 0; x < this.dogConfig.otherDogs.length; x++) {
        this.dogList.push(this.dogConfig.otherDogs[x]);
      }
      this.dogList.push(this.dogConfig.startDog);
    }

    private bark = (numberOfBarks: number) => {
      let totalBarkText = '';
      for (let x = 0; x < numberOfBarks; x++) {
        totalBarkText += `${this.barkSound} `;
      }
      this.blog(totalBarkText, false);
    };

    // todo: may not always want to add datestamp to blog
    // e.g. if want we want to blog multiple times on one event 
    private blog(blogEntry: string, addPreface = true): void {
      if (blogEntry !== '') {
        if (addPreface) {
          blogEntry = this.blogPreface[Math.floor(
            (Math.random() * this.blogPreface.length))] + blogEntry;
        }
        blogEntry = `${new Date().toLocaleTimeString(navigator.language,
          { hour: '2-digit', minute: '2-digit' })}: ${blogEntry}`;
        this.blogContent = `${blogEntry}\r\n${this.blogContent}`;
      }
    }

    // todo: implement this with button, make public?
    private blogAboutMe() {
      this.blog(`Hi, my name is ${this.familiarName} and
        I am a ${this.breed}. I have a ${this.coatStyle} coat,
        ears that are ${this.earStyle}
        and a tail that is ${this.tailStyle}, 
        I am ${this.age} years old,
        and when I bark it sounds like this: ${this.barkSound}.
        I get the urge to chew about every
        ${this.chewUrgeInterval / (1000)} seconds, 
        but mostly I ${this.defaultAction}. I get lonely after 
        ${this.dogLonelyEndurance / (1000 * 60 * 60)} hours,
        and I will complain loudly about it for 
        ${this.dogLonelyDuration / (1000 * 60)} minutes. I get sleepy every 
        ${this.dogTiredInterval / (1000 * 60 * 60)} hours
        and sleep for ${this.dogSleepDuration / (1000 * 60 * 60)}.
        Right now my ears are ${this.earState}
        and my tail is ${this.getTailStateText()}.`
        .replace(/\s+/g, ' '));
    }

    private chewOnSomething = () => {
      if (this.chewObjects.length) {
        this.chewObjects.sort((chewObject1, chewObject2) => {
          return chewObject1.expensive > chewObject2.expensive
            ? -1
            : chewObject1.expensive < chewObject2.expensive
              ? 1
              : chewObject1.irreplaceable
                ? -1
                : 0;
        });
      }
      for (let x = 0; x < this.chewObjects.length; x++) {
        if (this.chewObjects[x].chewy) {
          let description = '';
          if (this.chewObjects[x].chewOn() === ChewExperience.squeaky) {
            this.chewOnSomethingSqueaky(description, this.chewObjects[x]);
          } else {
            description = `Suddenly I got an urge to chew!
            I happily chewed on the ${this.chewObjects[x].name}!
            The ${this.chewObjects[x].name} is now
            ${this.chewObjects[x].getSpitStateText()} and
            ${this.chewObjects[x].getStateText()}
            ${((this.chewObjects[x].monetaryValue < 1)
                ? '.'
                : (` and is now worth $
                ${Math.round(this.chewObjects[x].monetaryValue)}.`))}`
              .replace(/\s+/g, ' ');
          }
          this.blog(description);
          return;
        }
      }
    };

    private chewOnSomethingSqueaky(blogEntry: string, chewObject: DogObject) {
      blogEntry += ` I chewed on the ${chewObject.name} and heard it squeak!` +
        'Ok this is way too much fun!!!';
      for (let i = 0; i < this.squeakyOcdChewCount; i++) {
        if (chewObject.chewOn() === ChewExperience.squeaky) {
          blogEntry += ' Chomp, SQEAK!';
        } else {
          blogEntry += ' Chomp... Hey it stopped squeaking, let me try again!';
        }
      }
    }

    private decapitateHandler = (event: ng.IAngularEvent) => {
      this.stopChewing();
      this.tailState = DogTailState.tucked;
      this.blog('Oh no! Not the rab...');
    };

    private displayConfusion(event: ng.IAngularEvent, args) {
      this.blog(`I tilt my head at ${event.name}, akward...`);
    }

    private eat = (event: ng.IAngularEvent, food: DogObject) => {
      let blogEntry = `My master just fed me ${food.name}`;
      if (food.edible) {
        if (food.name === 'dog food') {
          blogEntry += '! I ignored it for an hour, dumped it out on the floor, then ate the ' +
            `${food.name} one piece at a time!`;
          this.tailState = DogTailState.wagging;
        } else {
          blogEntry += `! I devoured the ${food.name} immediately ` +
            'and looked back up at him with a hungry face.';
          this.tailState = DogTailState.wagging;
        }
      } else {
        blogEntry += `? I sniffed the ${food.name} and tilted my head.`;
        this.tailState = DogTailState.elevated;
      }
      this.blog(blogEntry);
    };

    private fetch = (event: ng.IAngularEvent, fetchObject: DogObject) => {
      let blogEntry = `My master just threw a ${fetchObject.name}. ` +
        `I ran like mad to grab the ${fetchObject.name}`;
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
      if (fetchObject.chewOn() === ChewExperience.squeaky) {
        this.chewOnSomethingSqueaky(blogEntry, fetchObject);
      } else {
        blogEntry += ` I gave the ${fetchObject.name} a good chew or two and dropped it.`;
      }

      this.blog(blogEntry);
    };

    private getExcited = (someAnimal: IAnimal) => {
      let description = someAnimal.familiarName +
        ' wants to play with me!!! I wag my tail vigorously whine and jump up!!!';
      this.blog(description, true);
    };

    private getPetted = (event: ng.IAngularEvent, person: IAnimal) => {
      this.tailState = DogTailState.wagging;
      let description = person.familiarName +
        ' just gave me a good petting! I smile and look at ' +
        `${person.familiarName} with my big dog eyes look!`;
      this.blog(description, true);
    };

    private giveChase = (someAnimal: IAnimal) => {
      this.tailState = DogTailState.wagging;
      let description = `I just chased ${someAnimal.familiarName} ` +
        `through the ${this.dogDomain.name}!!!`;
      this.blog(description, true);
    };

    private respondToCommand = (event: ng.IAngularEvent, somePerson: IAnimal) => {
      let description = `${somePerson.familiarName} just told me to ${event.name}! `;
      if (somePerson.familiarName === 'The Mailman') {
        this.giveChase(somePerson);
        this.blog(description, false);
        return;
      }
      if (event.name === this.eventNames.commandStay) {
        if (somePerson.familiarName === 'The Alpha Male') {
          description += 'I stayed.';
        } else {
          description += 'I ignored it.';
        }
      } else {
        description += 'I did it.';
      }
      this.blog(description, true);
    };

    private setDogDomain = (dogDomain: DogDomain) => {
      this.dogDomain = dogDomain;
    };

    private stopChewing() {
      this.$interval.cancel(this.chewPromise);
    }

  }
  getModuleDog().controller('dogController', DogController);
}
