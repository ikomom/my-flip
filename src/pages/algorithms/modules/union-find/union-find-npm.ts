export class UnionFind {
  roots: number[]
  ranks: number[]
  count: number

  constructor(count: number) {
    this.count = count
    this.init()
  }

  private init() {
    this.roots = reactive(new Array(this.count))
    this.ranks = reactive(new Array(this.count))

    for (let i = 0; i < this.count; ++i) {
      this.roots[i] = i
      this.ranks[i] = 0
    }
  }

  get() {
    return this.roots.length
  }

  makeSet() {
    const n = this.roots.length
    this.roots.push(n)
    this.ranks.push(0)
    return n
  }

  find(num: number) {
    let n1 = num
    const roots = this.roots
    while (roots[num] !== num)
      num = roots[num]

    while (roots[n1] !== num) {
      const n2 = roots[n1]
      roots[n1] = num
      n1 = n2
    }
    return num
  }

  clear() {
    this.init()
  }

  async test() {
    this.union(0, 1)
    await nextTick()
    this.union(2, 3)
    await nextTick()
    this.union(1, 2)
  }

  union(n1: number, n2: number) {
    const xr = this.find(n1)
    const yr = this.find(n2)
    if (xr === yr)
      return

    const ranks = this.ranks
    const roots = this.roots
    const xd = ranks[xr]
    const yd = ranks[yr]
    if (xd < yd) {
      roots[xr] = yr
    }
    else if (yd < xd) {
      roots[yr] = xr
    }
    else {
      roots[yr] = xr
      ++ranks[xr]
    }
  }
}

// var VERTEX_COUNT = 8;
// var edges = [
//   [0,1],
//   [1,2],
//   [2,3],
//   [5,6],
//   [7,1]
// ];
//
// console.log(edges);
//
// //Import data structure
// var UnionFind = require('../index.js');
//
// //Link all the nodes together
// var forest = new UnionFind(VERTEX_COUNT);
// for(var i=0; i<edges.length; ++i) {
//   forest.link(edges[i][0], edges[i][1]);
// }
//
// //Label components
// var labels = new Array(VERTEX_COUNT);
// for(var i=0; i<VERTEX_COUNT; ++i) {
//   labels[i] = forest.find(i);
// }
//
// console.log(labels);
