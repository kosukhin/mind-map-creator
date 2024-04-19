import { ref } from 'vue';
import { doWith } from '@/utils/doWith';
import { get } from 'lodash';
import { curryVar } from '@/utils/curryVar';

describe('fp', () => {
  it('curry var', () => {
    const add = curryVar((...args: number[]) => args.reduce((a, b) => a + b, 0));
    add(100); // no side effects
    const res = add(1)(2)(3)(4)(5)();
    add(1000); // no side effects
    console.log('add res', res);
    const res2 = add(1, 2, 3)(4)(5)();
    console.log('add res2', res2);
    const res3 = add(1)(2)(3, 4, 5)();
    console.log('add res3', res3);
    expect([res, res2, res3].every((v) => v === 15)).toBe(true);
  });

  it('playground', () => {
    expect('hello').toMatch('hello');
    const map = ref({ types: [1, 2, 3], name: 'myname' });
    const withMap = doWith(map);
    function typesPath(obj: any) {
      return get(obj, 'value.types', []);
    }
    function namePath(obj: any) {
      return get(obj, 'value.name', '');
    }
    const name = withMap(namePath);
    const test = withMap(typesPath);
    function six() {
      return 6;
    }
    withMap(six);
    function seven() {
      return 6;
    }
    withMap(seven);
    console.log('types', test());
    console.log('names', name());
    // console.log('map existed', mapExisted());
  });
});
