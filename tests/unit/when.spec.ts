import {
  always,
  applyTo,
  call, ifElse, lensPath, pipe, view, when,
} from 'ramda';
import { isTruthy } from '@/utils/isTruthy';

describe('when', () => {
  it('call', () => {
    const obj = {
      hello() {
        return 'world';
      },
    };
    const withObj = applyTo(obj);

    expect(withObj(pipe(
      view(lensPath(['hello'])),
      when(isTruthy, call),
    ))).toBe('world');
  });

  it('call undefined', () => {
    const obj = {};
    const withObj = applyTo(obj);

    expect(withObj(pipe(
      view(lensPath(['none'])),
      ifElse(isTruthy, call, always('default')),
    ))).toBe('default');
  });
});
