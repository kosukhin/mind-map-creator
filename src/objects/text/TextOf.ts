import { Text } from '@/objects/text/Text';

export class TextOf implements Text {
  public constructor(private str: string) {}

  public entity(): string {
    return this.str;
  }
}
