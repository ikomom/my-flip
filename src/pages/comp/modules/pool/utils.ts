export type TaskStatus = 'IDLE' | 'SUCCESS' | 'ERROR' | 'PENDING' | 'STOP'

export const MB_BIT = 1024 * 1024

const sizeArr = ['B', 'KB', 'M', 'G', 'T', 'P']

/**
 * 获取文件大小描述
 * @param size
 * @param fixed
 */
export function getSizeDes(size: number, fixed = 2) {
  let index = 0
  let _s = size
  while (_s > 1024) {
    _s = _s / 1024
    index++
  }
  return sizeArr[index] ? (_s.toFixed(fixed)) + sizeArr[index] : _s.toFixed(fixed)
}

/**
 * 生成range
 *
 * @param end
 * @param offsetSize
 * @param cb
 */
export function sliceRange(end: number, offsetSize: number, cb?: (start: number, end: number) => void) {
  let offset = 0
  const range: number[][] = []
  while (offset < end) {
    const _r: [number, number] = [offset, 0]
    offset += offsetSize
    _r[1] = offset > end ? end : offset
    cb && cb(_r[0], _r[1])
    range.push(_r)
  }
  // console.log('sliceResult', {
  //   offset,
  //   range,
  //   end,
  // })
  return range
}

export function getFilenameExt(name: string) {
  return name.substring(name.lastIndexOf('.') + 1)
}
