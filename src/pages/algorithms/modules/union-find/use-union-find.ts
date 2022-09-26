import { cloneDeep, isEqual } from 'lodash-es'
import { UnionFind } from '~/pages/algorithms/modules/union-find/union-find-npm'

/**
 * 自我实现版本
 * 二维数组存储联通分类
 */
export const useUnionFindV1 = () => {
  const unionSet: number[][] = reactive([]) // 联通分量
  const unionLineSet: number[][] = reactive([]) // 原始的对象集合, 用于画线

  const command = {
    test() {
      command.union(1, 3)
      command.union(9, 7)
      command.union(1, 7)
    },
    clear() {
      unionSet.length = 0
      unionLineSet.length = 0
      console.log('clear')
    },
    separate(n1: number, n2: number) {
      const connected = command.findConnect(n1, n2)
      if (connected) {
        for (let i = 0; i < unionSet.length; i++) {
          const n1Index = unionSet[i].indexOf(n1)
          const n2Index = unionSet[i].indexOf(n2)
          if (n1Index !== -1 && n2Index !== -1) {
            unionSet[i] = unionSet[i].filter((_, index) => ![n1Index, n2Index].includes(index))
            break
          }
        }
        for (let i = 0; i < unionLineSet.length; i++) {
          if (isEqual([n1, n2], unionLineSet[i]))
            unionLineSet[i].splice(i, 1)
        }
      }
      else {
        toast.warning(`${[n1, n2]}未连接`)
      }
    },
    union(n1: number, n2: number) {
      const connected = command.findConnect(n1, n2)
      if (connected) {
        toast.warning(`[${[n1, n2]}]已经连接`)
      }
      else {
        // 查找是否单个数已经在已连接的节点中
        let n1Index = -1
        let n2Index = -1

        for (let i = 0; i < unionSet.length; i++) {
          const item = unionSet[i]
          if (n2Index === -1 && item.includes(n1))
            n2Index = i
          else if (n1Index === -1 && item.includes(n2))
            n1Index = i
        }
        console.log({
          n1Index,
          n2Index,
        }, cloneDeep(unionSet))
        // 合并已有的项目
        if (n1Index !== -1 && n2Index !== -1) {
          unionSet[n1Index] = unionSet[n1Index].concat(unionSet[n2Index])
          unionSet.splice(n2Index, 1)
        }
        else if (n1Index !== -1) {
          unionSet[n1Index].push(n1)
        }
        else if (n2Index !== -1) {
          unionSet[n2Index].push(n2)
        }
        else {
          unionSet.push([n1, n2])
        }
        unionLineSet.push([n1, n2])
      }
    },
    findConnect(n1: number, n2: number) {
      for (const item of unionSet) {
        if (item.length < 2)
          continue

        if (item.includes(n1) && item.includes(n2))
          return true
      }

      return false
    },
  }

  return {
    command,
    unionSet,
    unionLineSet,
  }
}
/**
 * 算法第四版实现
 * 一维数组下标存储联通分量
 */
export const useUnionFindV2 = (initRow: number) => {
  const unionSet: number[] = reactive(new Array(initRow).fill(0)) // 联通分量
  const unionLineSet: number[][] = reactive([]) // 原始的对象集合, 用于画线
  let index = 1

  const command = {
    test() {
      command.union(0, 1)
      command.union(2, 3)
      command.union(1, 2)
    },
    clear() {
      unionSet.length = 0
      unionLineSet.length = 0
      console.log('clear')
    },
    // TODO
    separate(n1: number, n2: number) {
      const connected = command.findConnect(n1, n2)
      if (connected) {
        unionSet[n1] = 0
        unionSet[n2] = 0

        for (let i = 0; i < unionLineSet.length; i++) {
          if (isEqual([n1, n2], unionLineSet[i]))
            unionLineSet[i].splice(i, 1)
        }
      }
      else {
        toast.warning(`${[n1, n2]}未连接`)
      }
    },
    // TODO
    union(n1: number, n2: number) {
      const connected = command.findConnect(n1, n2)
      if (connected) {
        toast.warning(`[${[n1, n2]}]已经连接`)
      }
      else {
        if (unionSet[n1]) {
          unionSet[n2] = unionSet[n1]
        }
        else if (unionSet[n2]) {
          unionSet[n1] = unionSet[n2]
        }
        else {
          unionSet[n1] = index
          unionSet[n2] = index
          index++
        }

        unionLineSet.push([n1, n2])
      }
    },
    findConnect(n1: number, n2: number) {
      if ((!unionSet[n1] && !unionSet[n1]) || unionSet[n1] !== unionSet[n2])
        return false
      return true
    },
  }

  return {
    command,
    unionSet,
    unionLineSet,
  }
}

/**
 * 使用npm包
 * @param initRow
 */
export function useUnionFindV3(initRow: number) {
  const unionLineSet: number[][] = reactive([]) // 原始的对象集合, 用于画线

  const command = new UnionFind(initRow)

  watch(command.roots, () => {
    console.group('union')
    console.log('roots', toRaw(command.roots))
    console.log('ranks', toRaw(command.ranks))
    console.groupEnd()
  }, {
    deep: true,
    immediate: true,
  })
  // @ts-expect-error
  window.command = command
  return {
    command,
    unionSet: command.roots,
    unionLineSet,
  }
}

export const UnionFindVersion = {
  V1: useUnionFindV1,
  V2: useUnionFindV2,
  V3: useUnionFindV3,
}

export const useUnionFind = (version: keyof typeof UnionFindVersion, initRow?: number) => {
  return UnionFindVersion[version](initRow)
}
