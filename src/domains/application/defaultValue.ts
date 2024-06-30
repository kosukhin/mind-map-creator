const falsyValues = ['', null, undefined];

export const defaultValue = (
  defaultValueToReturn: any,
  value: any,
) => (falsyValues.includes(value) ? defaultValueToReturn : value);
