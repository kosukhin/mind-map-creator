import {
  applyTo, lensPath, pipe, view,
} from 'ramda';

describe('applyTo', () => {
  it('', () => {
    const map = {
      objects: ['one'],
    };
    const withMap = applyTo(map);
    const hasObject = pipe(view(lensPath(['objects'])), withMap);
  });
});
