import { Dictionary } from '@/entities/Dictionary';

export interface MapObjectRelation {
  id: string
}

export interface MapObject {
  id: string
  type: string
  position: [number, number]
  name: string
  additionalName: string | null
  outlink: string
  linked: boolean
  description: string
  zindex: number
  arrows: MapObjectRelation[]
  targetBlank: boolean
  lastClick: number
  inMenu: boolean
  menuOrder: number
  width: number
  height: number
  additionalFields?: Record<string, string>
}

export interface MapType {
  name: string
  svg: string
  width: number
  height: number
}

export type MapStructureTypes = Dictionary<MapType>

export interface MapSettings {
  colored: boolean
  title: string
  favoriteGroup?: string
  prevFavoriteGroup?: string
  skipSearchIndex?: boolean
}

export interface NamedSearch {
  name: string,
  query: string,
  type: string
}

export interface MapStructure {
  document: string
  url: string
  parent: string
  progress: number
  parentNames?: Dictionary<string>
  settings: MapSettings
  types: MapStructureTypes
  objects: Dictionary<MapObject>
  position?: [number, number],
  namedSearches?: NamedSearch[]
}

export type MapFile = Record<string, MapStructure>;

export interface Map {
  document: string
  structure: MapStructure
}

export interface MapResponse {
  ok: boolean
  data: Map
  parentTypes: MapType[]
}
