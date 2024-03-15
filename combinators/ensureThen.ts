import { apply } from './_helpers'

export const ensureTemplate =
  (action: 'every' | 'some', flip = false) =>
  (...ensureFns: Function[]) =>
  (...thenFns: Function[]) => {
    if (flip) {
      const tempFns = ensureFns
      ensureFns = thenFns
      thenFns = tempFns
    }
    const results = ensureFns.map(apply)
    if (results[action](Boolean)) {
      thenFns.forEach(apply)
    }
  }

export const fnify = (v: any) => () => v
export const ensureThen = (fn: Function) => ensureEveryThen(fn)
export const ensureEveryThen = ensureTemplate('every')
export const ensureSomeThen = ensureTemplate('some')
export const thenEnsure = (fn: Function) => thenEveryEnsure(fn)
export const thenEveryEnsure = ensureTemplate('every', true)
export const thenSomeEnsure = ensureTemplate('some', true)
