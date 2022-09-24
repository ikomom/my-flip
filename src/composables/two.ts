import type { MaybeRef } from '@vueuse/core'
import Two from 'two.js'

interface UseTwoJsOptions {
  render(two: Two): void
  beforeRender(two: Two): void
  afterRender(two: Two): void
  frame: number
  autoClear: boolean
}

const useTwoJsOptionsDefault: UseTwoJsOptions = {
  render(two: Two) {},
  beforeRender(two: Two) {},
  afterRender(two: Two) {},
  frame: 0, // 帧率
  autoClear: true,
}
/**
 * 使用Two.js
 * @param parent
 * @param options
 */
export const useTwoJs = (parent: MaybeRef<any>, options: Partial<UseTwoJsOptions> = {}) => {
  const opt = { ...useTwoJsOptionsDefault, ...options }

  const two = new Two()

  const _render = async () => {
    opt.autoClear && two.clear()
    opt.render(two)
    two.update()
  }
  const run = async () => {
    await opt.beforeRender(two)
    return _render().then(() => {
      opt.afterRender(two)
    })
  }

  let timer: any

  tryOnMounted(() => {
    two.appendTo(unref(parent))
    if (opt.frame > 0) {
      timer = setInterval(() => {
        run()
      }, 1000 / opt.frame)
    }
    else {
      run()
    }
  })

  tryOnBeforeUnmount(() => {
    timer && clearInterval(timer)
  })

  return { run, two }
}
