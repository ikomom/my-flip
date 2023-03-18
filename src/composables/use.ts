import type {
  MaybeComputedElementRef,
  UseDraggableOptions,
} from '@vueuse/core'
import {
  clamp,
  resolveUnref,
  useDraggable,
} from '@vueuse/core'
import { ref } from 'vue'

export function useDraggableWithBounding(
  target: Parameters<typeof useDraggable>[0],
  options?: UseDraggableOptions & {
    boundElement?: MaybeComputedElementRef
  },
): ReturnType<typeof useDraggable> {
  const { top: boundsTop, left: boundsLeft, width: boundsWidth, height: boundsHeight } = useElementBounding(options.boundElement)
  const { width, height } = useElementBounding(target)
  const { x = 0, y = 0 } = resolveUnref(options.initialValue) ?? {}
  const adjustedLeft = ref(x)
  const adjustedTop = ref(y)

  const drag = useDraggable(target, {
    ...options,
    onMove(pos, event) {
      adjustedLeft.value = clamp(pos.x - unref(boundsLeft), 0, unref(boundsWidth) - unref(width))
      adjustedTop.value = clamp(pos.y - unref(boundsTop), 0, unref(boundsHeight) - unref(height))

      options.onMove?.(pos, event)
    },
  })

  return {
    ...drag,
    x: adjustedLeft,
    y: adjustedTop,
  }
}
