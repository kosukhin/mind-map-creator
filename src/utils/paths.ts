import partial from 'lodash/partial';
import { get } from 'lodash';
import { compose } from 'lodash/fp';

export const valuePath = partial(get, partial.placeholder, 'value', {});
export const typesPath = partial(get, partial.placeholder, 'types', []);
export const namePath = partial(get, partial.placeholder, 'name', '');

export const valueTypesPath = compose(typesPath, valuePath);
export const valueNamePath = compose(namePath, valuePath);
