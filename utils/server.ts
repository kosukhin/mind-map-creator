import path from 'path'
import flowRight from 'lodash/flowRight.js'
import trim from 'lodash/trim.js'
import { BASE_HOST, MAP_PARAM_NAME } from '~/constants'

export const documentNormalize = (document: string | null) => {
  document = trim(String(document), '/')
  if (document && document.includes('/')) {
    document = '_' + document.replaceAll('/', '_')
  }

  return document && document.toLowerCase()
}

export function getDocumentName(url: string) {
  const urlObject = new URL(BASE_HOST + url)

  return urlObject.searchParams.get(MAP_PARAM_NAME)
}

export function createFilePath(name: string | null) {
  if (!name) {
    return ''
  }

  return path.join('.', `/public/maps/${name}.json`)
}

export const createFilePathByUrl: (url: string) => string = flowRight(
  createFilePath,
  documentNormalize,
  getDocumentName
)

export const createFilePathByName: (name: string) => string = flowRight(
  createFilePath,
  documentNormalize
)
