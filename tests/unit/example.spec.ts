import { ref } from 'vue';
import { doWith } from '@/utils/doWith';
import { get } from 'lodash';
import { curryVar } from '@/utils/curryVar';

describe('fp', () => {
  it('curry var', () => {
    const add = curryVar((...args: number[]) => args.reduce((a, b) => a + b, 0));
    add(100);
    const res = add(1)(2)(3)(4)(5)();
    add(1000);
    console.log('add res', res);
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
