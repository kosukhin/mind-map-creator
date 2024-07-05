import { None } from './Maybe';
import { Left } from './Either';

export class Applicative {
  constructor(private theValue: any = null) {}

  /**
   * Внутренняя логика контейнера
   */
  private applyFn = (fn: (...args: any[]) => any, realValue: any) => {
    // Значение - функция
    if (typeof realValue === 'function') {
      return fn(realValue());
    }

    // Значение - апликатив
    if (realValue instanceof Applicative) {
      return new Promise((resolve, reject) => {
        realValue.promise().then((promiseValue: any) => resolve(fn(promiseValue))).catch(reject);
      });
    }

    // Значение - промис
    if (realValue !== null && typeof realValue === 'object' && 'then' in realValue) {
      return new Promise((resolve, reject) => {
        realValue.then((promiseValue: any) => resolve(fn(promiseValue))).catch(reject);
      });
    }

    // Значение - Left объект
    if (realValue instanceof Left) {
      return Promise.reject(realValue.message());
    }

    // Значение - None объект
    if (realValue instanceof None && realValue.isEmpty()) {
      return realValue;
    }

    // Значение - обычное без специального поведения
    return fn(this.value());
  }

  /**
   * Применить функцию fn к значению внутри контейнера
   */
  ap(fn: (...args: any[]) => any) {
    return new Applicative(this.applyFn((theValue: any) => fn(theValue), this.value()));
  }

  /**
   * Асинхронное значение, на случай асинхронной логики
   */
  promise() {
    return Promise.resolve(this.applyFn(() => this.value(), this.value()));
  }

  /**
   * Синхронное значение на случай синхронной композиции
   */
  value() {
    return this.theValue;
  }
}

export const applicative = (value: any) => new Applicative(value);
