import { isFunction, isObject, isString } from 'lodash'
import { formatTime } from '../../utils/date'

const renders = {
  /**
   * 选择下拉
   */
  select: ({ data, column }) => {
    const option = column.form && column.form.options ? column.form.options.find(e => e.value === data) : null
    return option ? option.label : data
  },
  /**
   * 下拉多选类型
   */
  multiselect: ({ data, column }) => {
    return data
      .map(value => {
        const item =
          column.form && column.form.options ? column.form.options.find(option => option.value === value) : null
        return item ? item.label : '--'
      })
      .join(',')
  },
  /**
   * 时间类型
   */
  time: ({ data, column }) => {
    if (!data) return '--'
    if (typeof data === 'string') {
      data = data.includes('-') ? data : Number(data)
    }
    return data ? formatTime(data, column.render.format || column.format || column.form.format) : '--'
  },
  date: ({ data, column }) => {
    if (!data) return '--'
    data = data.includes('-') ? data : Number(data)
    return data ? formatTime(Number(data), column.render.format || column.format || column.form.format) : '--'
  }
}
export function render({ fullData, data, column, name, index }) {
  const renderTarget = column.render
  if (isFunction(renderTarget)) {
    return renderTarget(fullData, name, index, data)
  }
  if (data === null || data === undefined || data === '') {
    return '--'
  }
  if (isObject(renderTarget) || isString(renderTarget)) {
    const type = renderTarget.type || renderTarget
    if (!renders[type]) return data
    return renders[type]({ data, column, fullData })
  }
  return data
}
