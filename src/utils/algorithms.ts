/**
 *
 * 最大公约数
 *
 * 辗转相除法, 正整数递归取余数
 * @param p
 * @param q
 */
export function getGcd(p: number, q: number): number {
  if (q === 0)
    return p
  return getGcd(q, p % q)
}

/**
 * 最小公倍数
 *
 * 两个数的乘积 = 最大公约数 * 最小公倍数
 * 最小公倍数 = 两个数的乘积 / 最大公约数
 * @param p
 * @param q
 */
export function getLcm(p: number, q: number) {
  return p * q / getGcd(p, q)
}

export function useUnionFind() {}
