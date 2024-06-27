import { Left } from '@/domains/branching/Either';

export const jsonParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (e: any) {
    return new Left(e.message);
  }
};
