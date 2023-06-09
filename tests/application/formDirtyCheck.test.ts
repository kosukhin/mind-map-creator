import { describe, it, expect } from 'vitest'
import { formDirtyCheck } from '~/application/formDirtyCheck'

describe('Проверяем что форма изменена', () => {
  it('изменена', () => {
    const isDirty = formDirtyCheck(false, 'test', 'test')
    expect(isDirty).toStrictEqual(false)
  })

  it('null', () => {
    const isDirty = formDirtyCheck(false, 'ddd', 'test')
    expect(isDirty).toStrictEqual(null)
  })
})
