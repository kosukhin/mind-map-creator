export class Maybe {
  constructor(private theValue = null) {}

    public isEmpty = () => this.theValue === null;

    public value = () => this.theValue
}

export class None extends Maybe {}
