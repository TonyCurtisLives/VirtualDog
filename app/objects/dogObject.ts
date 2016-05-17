namespace dogsrus.virtdog {
  export enum DogSpitState {
    noSpit,
    someSpit,
    soggyAndSlimy
  }

  export enum ObjectState {
    mintCondition,
    littleBitChewed,
    veryChewed,
    structurallyDamaged,
    shredded
  }

  export class DogObject {
    public expensive: boolean = false;
    public irreplaceable: boolean = false;
    public flies: boolean = false;
    public bounces: boolean = false;
    public monetaryValue: number = 0;
    public spitState: DogSpitState = DogSpitState.noSpit;
    public shredable: boolean = false;
    public impervious: boolean = false;
    public chewLimit: number = 0;
    public state: ObjectState = ObjectState.mintCondition;

    constructor(
      public name: string,
      public chewy: boolean,
      public edible: boolean
    ) { }

    public getSpitStateText() {
      return DogSpitState[this.spitState];
    }

    public getStateText() {
      return ObjectState[this.state];
    }

    public chewOn() {
      if (this.spitState < DogSpitState.soggyAndSlimy) {
        this.spitState++;
      }
      if (this.impervious) {
        return;
      }
      this.monetaryValue /= 2;
      this.expensive = this.monetaryValue > 100;
      if (this.chewLimit > 0) {
        this.chewLimit--;
        if (this.state === ObjectState.mintCondition) {
          this.state++;
        } else if (this.chewLimit < 10 && this.state === ObjectState.littleBitChewed) {
          this.state++;
        } else if (this.chewLimit < 5 && this.state === ObjectState.veryChewed) {
          this.state++;
        }
        return;
      }
      if (this.state === ObjectState.veryChewed) {
        if (this.shredable) {
          this.state++;
        } else {
          this.state += 2;
        }
      } else if (this.state < ObjectState.structurallyDamaged) {
        this.state++;
      }
    }
  }
}
