import type {
  MaybeComputedElementRef,
  Position,
  RenderableComponent,
  UseDraggableOptions,
} from '@vueuse/core'
import {
  clamp,
  isClient,
  resolveUnref,
  useDraggable,
} from '@vueuse/core'
import { ref } from 'vue'

export type UseDraggableWithBoundingOptions = UseDraggableOptions & {
  boundElement?: MaybeComputedElementRef<any>
}

export function useDraggableWithBounding(
  target: Parameters<typeof useDraggable>[0],
  options?: UseDraggableWithBoundingOptions,
) {
  const { top: boundsTop, left: boundsLeft, width: boundsWidth, height: boundsHeight } = useElementBounding(options.boundElement)
  const { width, height } = useElementBounding(target)
  const { x = 0, y = 0 } = resolveUnref(options.initialValue) ?? {}
  const adjustedLeft = ref(x)
  const adjustedTop = ref(y)

  const drag = useDraggable(target, {
    ...options,
    onMove(pos, event) {
      // console.log('onMove', unref(boundsWidth) - unref(width))
      adjustedLeft.value = clamp(pos.x - unref(boundsLeft), 0, unref(boundsWidth) - unref(width))
      adjustedTop.value = clamp(pos.y - unref(boundsTop), 0, unref(boundsHeight) - unref(height))

      options.onMove?.(pos, event)
    },
    onEnd(pos, event) {
      options.onEnd?.({
        x: adjustedLeft.value,
        y: adjustedTop.value,
      }, event)
    },
  })

  return {
    isDragging: drag.isDragging,
    x: adjustedLeft,
    y: adjustedTop,
    style: computed(() => `left:${adjustedLeft.value}px;top:${adjustedTop.value}px;`),
  }
}

export type UseDraggableOptionsPorps = UseDraggableWithBoundingOptions & RenderableComponent & { storageType?: 'local' | 'session' ; storageKey?: string }

export const UseDraggableWithBounding = defineComponent<UseDraggableOptionsPorps>({
  name: 'UseDraggableWithBounding',
  props: [
    'storageKey',
    'storageType',
    'initialValue',
    'exact',
    'preventDefault',
    'stopPropagation',
    'pointerTypes',
    'as',
    'boundElement',
    'handle',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const boundElement = toRef(props, 'boundElement')
    const handle = computed(() => props.handle ?? target.value)
    const storageValue = props.storageKey && useStorage(
      props.storageKey,
      resolveUnref(props.initialValue) || { x: 0, y: 0 },
      isClient
        ? props.storageType === 'session'
          ? sessionStorage
          : localStorage
        : undefined,
    )
    const initialValue = storageValue || props.initialValue || { x: 0, y: 0 }
    const onEnd = (position: Position) => {
      if (!storageValue)
        return
      storageValue.value.x = position.x
      storageValue.value.y = position.y
    }

    const data = reactive(useDraggableWithBounding(target, {
      ...props,
      boundElement,
      handle,
      initialValue,
      onEnd,
    }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target, style: `touch-action:none;${data.style}` }, slots.default(data))
    }
  },
})
