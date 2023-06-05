import get from 'lodash/get.js'
import curry from 'lodash/curry.js'
import isObject from 'lodash/isObject.js'
import isFunction from 'lodash/isFunction.js'

const DEBUG_KEY = '__debug'
const DEFAULT_RESULT_KEY = 'prevResult'

const log = (...args: string[]) => console.log(...args)

export type State = <F extends Function>(fn: F) => () => ReturnType<F>
type defaultKey = typeof DEFAULT_RESULT_KEY

export function stepper<A, T>(
  args: A,
  vars: T,
  factory: (
    step: {
      (fn: Function, saveTo?: T[number] | A[number] | defaultKey): any
      (fn: Function, args?: (T[number] | A[number] | defaultKey)[]): any
      (
        fn: Function,
        args?: (T[number] | A[number] | Function)[],
        saveTo?: T[number] | A[number] | defaultKey
      ): any
    },
    state: State
  ) => any
) {
  const [setState, state, step] = createStep()
  const mainCallback = factory(step, state)
  return curry((...runArgs: any[]) => {
    const state = {}
    setState(state)
    vars.forEach((variable) => {
      state[variable] = variable === DEBUG_KEY ? true : null
    })
    args.forEach((arg, index) => {
      state[arg] = runArgs[index] ?? null
    })
    if (state[DEBUG_KEY]) {
      log('--- BEGIN --- \n')
    }
    return mainCallback()
  }, args.length)
}

function createStep<T>() {
  let state: any = null
  return [
    function setState(initState: T): void {
      state = initState
    },
    function state(fn: Function) {
      return () => fn(state)
    },
    function step(fn, args, saveTo = DEFAULT_RESULT_KEY) {
      if (typeof args === 'string') {
        saveTo = args
        args = []
      }
      return function stepRunner(value: any) {
        state[DEFAULT_RESULT_KEY] = value
        if (!args) {
          args = [DEFAULT_RESULT_KEY] as (keyof T)[]
        }
        const callArgs = (args as any).map((arg, index) => {
          if (typeof arg !== 'undefined' && !isFunction(arg) && isObject(arg)) {
            throw new Error(
              `StepperError: argument ${JSON.stringify(
                arg
              )} at index ${index} in function ${
                fn.name
              } must not be object, because it will be shared`
            )
          }
          return get(state, arg, arg)
        })
        state[saveTo] = fn(...callArgs)
        if (state[DEBUG_KEY]) {
          log(
            '\n',
            '[STEP] ',
            'fn:',
            fn.name,
            '\n ---------- \n',
            `args(${JSON.stringify(args)}): `,
            JSON.stringify(callArgs),
            '\n ---------- \n',
            `saveTo(${saveTo}):`,
            state[saveTo]
          )
        }
        return state[saveTo]
      }
    },
  ]
}
