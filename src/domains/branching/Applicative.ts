import { None } from './Maybe';
import { Left } from './Either';

export class Applicative {
  constructor(private theValue: any = null) {}

  /**
   * Внутренняя логика контейнера
   */
  private applyFn = (fn: (...args: any[]) => any, realValue: any) => {
    if (realValue instanceof None && realValue.isEmpty()) {
      return realValue;
    }

    if (realValue instanceof Left) {
      return Promise.reject(realValue.message());
    }

    return fn();
  }

  /**
   * Применить функцию fn к значению внутри контейнера
   */
  ap(fn: (...args: any[]) => any) {
    if (this.theValue !== null && typeof this.theValue === 'object' && 'then' in this.theValue) {
      return new Applicative(new Promise((resolve, reject) => {
        this.theValue.then((realValue: any) => resolve(
          this.applyFn(() => fn(realValue), realValue),
        )).catch(reject);
      }));
    }

    return new Applicative(this.applyFn(() => fn(this.theValue), this.theValue));
  }

  /**
   * Асинхронное значение, на случай асинхронной логики
   */
  promise() {
    const result = this.applyFn(() => this.theValue, this.theValue);
    return Promise.resolve(result);
  }

  /**
   * Синхронное значение на случай синхронной композиции
   */
  value() {
    return this.theValue;
  }
}

export const applicative = (value: any) => new Applicative(value);
