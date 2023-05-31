const mapTag = '[object Map]'
const setTag = '[object Set]'
const arrayTag = '[object Array]'
const objectTag = '[object Object]'

const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const numberTag = '[object Number]'
const regexpTag = '[object RegExp]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
function getInit(target: any) {
  const Ctor = target.prototype.constructor
  return new Ctor()
}
function forEach(array: any[], iteratee: (item: any, index: number) => void) {
  let index = -1
  const length = array.length
  while (++index < length)
    iteratee(array[index], index)

  return array
}

function isObject(target: unknown) {
  const type = typeof target
  return target !== null && type === 'object'
}
export function cloneDeep(target: any, map = new WeakMap()) {
  if (isObject(target)) {
    const isArray = Array.isArray(target)
    const cloneTarget: any = isArray ? [] : {}

    if (map.get(target))
      return map.get(target)
    map.set(target, cloneTarget)

    const keys = isArray ? undefined : Object.keys(target)
    forEach(keys || target, (value, key) => {
      if (keys)
        key = value

      cloneTarget[key] = cloneDeep(target[key], map)
    })

    return cloneTarget
  }
  else {
    return target
  }
}

export function compareKeys(source: any, res: any) {
  const target: any[] = []

  for (const key in source)
    target.push({ key, compare: source[key] === res[key], s: source[key], r: res[key] })

  return target
}

export function timeCount(func: () => void) {
  const startTime = new Date().getTime()
  func()
  const endTime = new Date().getTime()
  console.log('timeCount  ' + `${endTime - startTime}ms`)
}
function cloneFunction(func: Function) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const paramReg = /(?<=\().+(?=\)\s+{)/
  const funcString = func.toString()
  if (func.prototype) {
    // 没有复制原型
    console.log('普通函数')
    const param = paramReg.exec(funcString)
    const body = bodyReg.exec(funcString)
    if (body) {
      console.log('匹配到函数体：', body[0])
      if (param) {
        const paramArr = param[0].split(',')
        console.log('匹配到参数：', paramArr)
        return new Function(...paramArr, body[0])
      }
      else {
        return new Function(body[0])
      }
    }
    else {
      return null
    }
  }
  else {
    // eslint-disable-next-line no-eval
    return eval(funcString)
  }
}
function cloneSymbol(target: any) {
  return Object(Symbol.prototype.valueOf.call(target))
}
