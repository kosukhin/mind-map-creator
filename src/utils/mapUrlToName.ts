export const mapUrlToName = (url: string) => {
  let mapName = url.replace('/', '').replaceAll('/', '_');

  if (mapName.match('_')) {
    mapName = `_${mapName}`;
  }

  return mapName || 'current';
};
