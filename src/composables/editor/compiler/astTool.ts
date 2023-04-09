import type { Node, ObjectProperty } from '@babel/types'

/**
 * 是否是静态属性
 * 动态属性 a[b] 时 computed true
 *
 * @param node
 */
export function isStaticProperty(node: Node): node is ObjectProperty {
  return node.type === 'ObjectProperty' && !node.computed
}

/**
 * 是否在结构赋值中
 *
 * @param parent
 * @param parentStack
 */
export function isInDestructureAssignment(parent: Node, parentStack: Node[]): boolean {
  if (parent && ['ObjectProperty', 'ArrayPattern', 'ObjectPattern'].includes(parent.type)) {
    let i = parentStack.length
    while (i--) {
      const p = parentStack[i]
      if (p.type === 'AssignmentExpression')
        return true
      else if (p.type !== 'ObjectProperty' && !p.type.endsWith('Pattern'))
        break
    }
  }

  return false
}
