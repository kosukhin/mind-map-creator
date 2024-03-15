import { Ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import partial from 'lodash/partial'
import { ensureThen, fnify } from '~/combinators/ensureThen'
import { useSharedOverlay } from '~/composables'
import { OVERLAY_CLOSE, OVERLAY_CLOSE_ALERT } from '~/constants'
import { setValue } from '~/utils'

const { tryToClose, close } = useSharedOverlay()

type Subscriber = {
  isDirty: Ref<boolean>
  formName: string
}
const subscribers: Subscriber[] = []

const closeOverlay = partial(setValue, tryToClose, OVERLAY_CLOSE)
const overlayConfirmation = partial(confirm, OVERLAY_CLOSE_ALERT)
const closeThenConfirmed = () => ensureThen(overlayConfirmation)(close)

watch(tryToClose, (whatToClose) => {
  subscribers.forEach(({ isDirty, formName }) => {
    ensureThen(fnify(whatToClose === formName))(() => {
      ensureThen(fnify(!isDirty.value))(closeOverlay, close)
      ensureThen(fnify(isDirty.value))(closeThenConfirmed)
    })
  })
})

export const useFormDirtyCheck = (isDirty: Ref<boolean>, formName: string) => {
  subscribers.push({
    isDirty,
    formName,
  })
}
