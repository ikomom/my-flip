/**
 * 生成文件名的hash值
 *
 * @param filename
 * @returns
 */
export async function hashId(filename: string) {
  const msgUint8 = new TextEncoder().encode(filename) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex.slice(0, 8)
}

/**
 * 传建blob url
 * @param code
 * @param type
 */
export function createBlobURL(code: string, type = 'text/plain') {
  const blob = new Blob([code], {
    type,
  })
  return URL.createObjectURL(blob)
}

export const BRACKETS_RXP = {
  small: /\((.+?)\)/g, // () 小括号
  middle: /\[(.+?)]/g, // [] 中括号
  large: /{(.+?)}/g, // {} 大括号
  dbLarge: /{{([^}]+)}}/g, // {{}} 双大括号
  template: /\${([^}]*)}/g, // ${}模板字符串
}
/**
 * 简单模板替换
 * @param {String} template <h1>{{name}}</h1>
 * @param {Object} context {name: "哈哈哈"}
 * @param {RegExp} reg 替换规则
 * @returns {String} <h1>哈哈哈</h1>
 */
export function renderTemplate(
  template: string,
  context: Record<string, any>,
  reg = BRACKETS_RXP.dbLarge,
) {
  return template.replace(reg, (match, key) =>
    typeof context[key] === 'function' ? context[key](match, key) : context[key],
  )
}

/**
 * 从字符串中获取模板
 * @param {String} str
 * @param {RegExp} reg
 * @returns {*[]}
 */
export function getFormTemplate(str: string, reg = BRACKETS_RXP.dbLarge) {
  const found = []
  let curMatch
  // eslint-disable-next-line no-cond-assign
  while ((curMatch = reg.exec(str)))
    found.push(curMatch[1])

  return found
}
