


/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minOperations = function (nums, k) {
  console.time()
  class MaxPriorityQueue {
    constructor(compare) {
      if (typeof compare !== 'function')
        throw new TypeError('compare function required!')

      this.data = []
      this.compare = compare
    }

    // 二分查找 寻找插入位置
    search(target) {
      let low = 0; let high = this.data.length
      while (low < high) {
        const mid = low + ((high - low) >> 1)
        if (this.compare(this.data[mid], target) > 0)
          high = mid

        else
          low = mid + 1
      }
      return low
    }

    // 添加
    push(elem) {
      const index = this.search(elem)
      this.data.splice(index, 0, elem)
      return this.data.length
    }

    // 取出最优元素
    pop() {
      return this.data.pop()
    }

    // 查看最优元素
    peek() {
      return this.data[this.data.length - 1]
    }
  }

  let t = 0
  let queue = new MaxPriorityQueue((a, b) => b - a)

  for (const num of nums) {
    queue.push(num)
  }
  // // console.log(queue.data)
  // while (queue.peek() < k) {
  //   const min = queue.pop()
  //   const max = queue.pop()
  //   const sum = max + min * 2
  //   queue.push(sum)
  //   t++
  // }
  console.timeEnd()
  return t
};
