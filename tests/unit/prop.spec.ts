import { prop } from 'ramda';

describe('prop', () => {
  it('prop on  number', () => {
    expect((prop('test') as any)('2')).toBe(undefined);
  });
});
