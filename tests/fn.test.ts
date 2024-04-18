import { expect, test } from 'vitest';
import { createMap } from '@/utils/map';
import { ref, unref } from 'vue';
import { doWith } from '@/utils/doWith';
import { compose } from 'lodash/fp';
import { isTruthy } from '@/utils/isTruthy';

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
  console.log('hello');
  const map = ref({ types: [] });
  const test = createMap('test', 'test');
  // const withMap = doWith(map);
  // const mapExisted = withMap(compose(isTruthy, unref));
  // console.log('map existed', mapExisted());
});
