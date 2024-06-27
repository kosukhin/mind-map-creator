export class Either {
  constructor(protected theValue: any) {}
}

export class Left extends Either {
  constructor(private theMessage: string) {
    super(null);
  }

    public message = () => this.theMessage
}

export class Right extends Either {
    public value = () => this.theValue
}
