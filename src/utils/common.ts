import curry from 'lodash/fp/curry';
import sum from 'lodash/sum';
import { normal } from 'color-blend';
import { AnyFn } from '@/entities/Utils';

interface ErrorFull {
  error: any
}

export const setError = curry((value: ErrorFull, error: any) => {
  value.error = error;
});

interface Valuable {
  value: any
}

export const setProperty = curry(
  (target: any, property: string, value: any) => {
    target[property] = value;
  },
);

export const setValue = curry((valuable: Valuable, value: any) => {
  valuable.value = value;
});

export const setValues = (valuables: [Valuable, any][]) => {
  valuables.forEach(([valuable, value]) => {
    valuable.value = value;
  });
};

export const urlTrim = (url: string) => {
  if (url[url.length - 1] === '/') {
    const urlArr = url.split('');
    urlArr.splice(urlArr.length - 1, 1);
    return urlArr.join('');
  }
  return url;
};

export const maxNewLineLength = (str: string): number => {
  if (!str) {
    return 0;
  }
  return Math.max.apply(
    null,
    str.split('\n').map((s) => s.length),
  );
};

export const newLineCount = (str: string): number => {
  if (!str) {
    return 0;
  }
  return str.split('\n').length;
};

export const nl2br = (str: string, isXhtml = false) => {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  const breakTag = isXhtml || typeof isXhtml === 'undefined' ? '<br />' : '<br>';
  return (`${str}`).replace(
    /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    `$1${breakTag}$2`,
  );
};

export const stripHtml = (string: string) => string.replace(/<\/?[^>]+>/gi, ' ');

export const debug = (tag: string, ...string: any) => {
  const { log } = console;
  if (log) {
    log(`['${tag}'] = '${string.join(' | ')}'`);
  }
};

export const cDebug: any = (tag: any) => (...strs: any[]) => console.log(tag, ...strs);

export const tap = (fn: AnyFn) => (v: any) => {
  fn(v);
  return v;
};

export function objectToValues(obj: object) {
  return Object.values(obj);
}

export function average(values: number[]) {
  return Math.round(sum(values) / values.length);
}

export function apply(args: any[] | any, fn: AnyFn) {
  return fn(args);
}

export const cApply = curry(apply);

export function calculateProgressBg(progress: number) {
  const progressRest = 1 - progress;
  const red = {
    r: 255, g: 0, b: 0, a: progressRest,
  };
  const green = {
    r: 0, g: 255, b: 0, a: progress,
  };
  return normal(red, green);
}

export const delayResetToNull = (val: Valuable) => {
  setTimeout(() => { val.value = null; });
};
