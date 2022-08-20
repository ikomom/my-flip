/* Analyzed bindings: {
  "ref": "setup-const",
  "msg": "setup-ref"
} */
import {
  Teleport as _Teleport,
  createBlock as _createBlock,
  createElementVNode as _createElementVNode,
  openBlock as _openBlock,
  toDisplayString as _toDisplayString,
  vModelText as _vModelText,
  withDirectives as _withDirectives,
} from 'vue'

import { ref } from 'vue'

const __sfc__ = {
  __name: 'App',
  setup(__props) {
    const msg = ref('Hello World!')

    return (_ctx, _cache) => {
      return (
        _openBlock(),
        _createBlock(
          _Teleport,
          { to: 'body' },
          [
            _createElementVNode('h1', null, _toDisplayString(msg.value), 1 /* TEXT */),
            _withDirectives(
              _createElementVNode(
                'input',
                {
                  'onUpdate:modelValue': _cache[0] || (_cache[0] = $event => ((msg).value = $event)),
                },
                null,
                512, /* NEED_PATCH */
              ),
              [
                [_vModelText, msg.value],
              ],
            ),
          ],
        )
      )
    }
  },

}
__sfc__.__file = 'App.vue'
export default __sfc__
