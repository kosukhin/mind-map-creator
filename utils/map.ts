import { slugify } from 'transliteration'
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import {
  Arrow,
  KonvaLayerObject,
  Layer,
  Map,
  MapObject,
  MapStructure,
  Nullable,
} from '~/entities'
import { MAP_DEFAULT_TITLE } from '~/constants'
import { urlTrim } from '~/utils'
import { addObjectToLayer } from '~/utils/konva'
import { generateUniqString } from '~/utils/string'

export const createMap = (
  document: string,
  title: Nullable<string> = null
): MapStructure => {
  document = title ? slugify(title) : document
  return {
    progress: 0,
    settings: {
      colored: false,
      title: title ?? MAP_DEFAULT_TITLE,
    },
    document,
    objects: {},
    types: {},
    url: document,
    parent: '',
  }
}

export const createObject = (
  position: [number, number],
  type: string
): MapObject => {
  return {
    name: '',
    outlink: '',
    linked: false,
    targetBlank: false,
    arrows: [],
    description: '',
    id: Date.now().toString(),
    lastClick: Date.now(),
    position,
    type,
    zindex: 0,
    inMenu: false,
    menuOrder: 0,
    additionalName: '',
  }
}

export function createMapObjectUrl(object: MapObject) {
  let link = object.outlink
    ? object.outlink
    : location.pathname +
      '/' +
      slugify(
        object.name
          ? object.name
          : object.additionalName
          ? object.additionalName
          : ''
      )
  link = urlTrim(link)
  return link
}

export const createMapFileNameFromUrl = (object: MapStructure) => {
  const url = object.url
  let docName = url.replaceAll('/', '_') + '.json'
  const underscores = docName.match(/_/g)
  if (underscores && underscores.length === 1) {
    docName = docName.slice(1)
  }
  return slugify(docName)
}

const openExternalLink = debounce((link: string) => {
  window.open(link)
}, 200)

export const openUrlByObject = (object: MapObject) => {
  if (object?.linked) {
    const link = createMapObjectUrl(object)
    if (object.targetBlank) {
      openExternalLink(link)
    } else {
      const router = useRouter()
      router.push(link)
      // location.href = link
    }
    return true
  }
  return false
}

export const applyArrowPoints = (
  arrows: [arrow: Arrow, points: number[]][]
) => {
  arrows.forEach(([arrow, points]) => arrow.points(points))
}

export async function cloneObject(
  vObj: MapObject,
  vMap: MapStructure,
  vLayer: Layer,
  layerObjects: Map<string, any>
) {
  const newId = generateUniqString()
  const clonedObject = cloneDeep(vObj)
  clonedObject.id = newId
  vMap.objects[newId] = clonedObject
  const objects = await addObjectToLayer(vLayer, clonedObject, vMap)
  layerObjects.set(clonedObject.id, objects as KonvaLayerObject[])
}
