import {
  createElementBlock as _createElementBlock,
  openBlock as _openBlock,
  toDisplayString as _toDisplayString,
} from 'vue'

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock('div', null, _toDisplayString($setup.helloWorld), 1 /* TEXT */))
}
