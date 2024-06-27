export const tap = (fn: (...args: any[]) => any) => (value: any) => {
  fn(value);
  return value;
};
