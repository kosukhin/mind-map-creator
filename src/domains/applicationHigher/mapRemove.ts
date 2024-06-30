import { Applicative } from '@/domains/branching/Applicative';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { openRoute } from '@/domains/vue/openRoute';
import { partial } from 'lodash';

export const mapRemove = () => new Applicative(mapFileHandler.value)
  .ap(ensureNotNullish)
  .ap((fileHandle: any) => fileHandle.remove())
  .ap(partial(openRoute, '/'))
  .promise();
