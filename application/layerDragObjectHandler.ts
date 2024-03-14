import { KonvaEventObject } from 'konva/lib/Node'
import { Nullable } from './../entities/Nullable'
import {
  Arrow,
  MapLayerObjects,
  MapStructure,
  Stage,
  Text,
  Vector2d,
} from '~/entities'
import { debug, maxNewLineLength, newLineCount } from '~/utils'

interface Result {
  text: Nullable<[Text, Vector2d]>
  additionalText: Nullable<[Text, Vector2d]>
  arrows: Nullable<[Arrow, number[]][]>
  relatedArrows: Nullable<[Arrow, number[]][]>
}

type Params = [KonvaEventObject<DragEvent>, MapStructure]

export const calculateVisibleObjects = (vMap: MapStructure, vStage: Stage) => {
  const { objects } = vMap
  const isInBoundings = (position: [number, number]) => {
    const stageStartX = vStage.x()
    const stageEndX = vStage.x() - vStage.width()
    const stageStartY = vStage.y()
    const stageEndY = vStage.y() - vStage.height()
    const [objectX, objectY] = position
    return (
      stageStartX > -objectX &&
      -objectX > stageEndX &&
      stageStartY > -objectY &&
      -objectY > stageEndY
    )
  }
  const visible: any[] = []
  const invisible: any[] = []
  Object.values(objects).forEach((object) => {
    if (isInBoundings(object.position)) {
      visible.push(object)
    } else {
      invisible.push(object)
    }
  })
  return [visible, invisible]
}

export const layerDragObjectHandler =
  (layerObjects: MapLayerObjects) =>
  ([dragEvent, vMap]: Params): Result => {
    debug('dragmove fired', 'dragmove')
    const result = {
      text: null as any,
      additionalText: null as any,
      arrows: null as any,
      relatedArrows: null as any,
    }
    if (!dragEvent.target.attrs.image) {
      debug('not image object', 'dragmove')
      return result
    }
    const objectId = dragEvent.target.attrs.objectId
    const object = vMap.objects[objectId]
    const labelWidth = maxNewLineLength(object.name) * 7
    const type = vMap.types[object.type]
    const konvaObjects = layerObjects.get(objectId)
    if (!konvaObjects) {
      return result
    }
    const [, text, arrows, additionalObjects] = konvaObjects
    const additionalText = (additionalObjects as any)[0]
    if (additionalText) {
      const labelWidth = maxNewLineLength(String(object.additionalName)) * 7
      const labelHeight = newLineCount(String(object.additionalName)) * 11
      result.additionalText = [
        additionalText,
        {
          x: dragEvent.target.attrs.x + type.width / 2 - labelWidth / 2,
          y: dragEvent.target.attrs.y - labelHeight - 4,
        },
      ]
    }
    result.text = [
      text,
      {
        x: dragEvent.target.attrs.x + type.width / 2 - labelWidth / 2,
        y: dragEvent.target.attrs.y + type.height + 5,
      },
    ]
    const resultArrows: [Arrow, number[]][] = []
    ;(arrows as any).forEach((arrow: any) => {
      const points = arrow.points()
      points[0] = dragEvent.target.attrs.x + type.width / 2
      points[1] = dragEvent.target.attrs.y + type.height / 2
      resultArrows.push([arrow, points])
    })
    result.arrows = resultArrows
    const relatedArrows: Arrow[] = []
    Object.values(vMap.objects).forEach((relObject) => {
      if (!relObject.arrows) return
      const hasRelation = relObject.arrows.find(
        (relArrow) => relArrow.id === object.id
      )
      if (hasRelation && layerObjects.has(relObject.id)) {
        const relatedObjectsList = layerObjects.get(relObject.id)
        if (!relatedObjectsList) {
          return
        }
        const [, , arrows] = relatedObjectsList
        ;(arrows as any).forEach((arrow: any) => {
          if (arrow.attrs.toObjectId === object.id) {
            relatedArrows.push(arrow)
          }
        })
      }
    })
    const resultRelatedArrows: [Arrow, number[]][] = []
    relatedArrows.forEach((relArrow) => {
      const points = relArrow.points()
      points[2] = dragEvent.target.attrs.x + type.width / 2
      points[3] = dragEvent.target.attrs.y + type.height / 2
      resultRelatedArrows.push([relArrow, points])
    })
    result.relatedArrows = resultRelatedArrows
    return result
  }
