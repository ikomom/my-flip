<script lang="ts" setup>
import Ajv from 'ajv'
import { BRACKETS_RXP } from '~/utils/utils'

const validateFunc = () => {
  const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

  const schema = {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'string' },
    },
    required: ['foo'],
    additionalProperties: false,
  }

  const validate = ajv.compile(schema)

  const data = {
    foo: '1',
    bar: 'abc',
  }

  const valid = validate(data)
  if (!valid)
    console.log(validate.errors)
}

const source = reactive({
  show: false,
  a: 1,
  b: 2,
})

const when = ref('{{a + b}}')

const whenFunc = async (rule: string) => {
  // return sandbox.evaluate(rule, { ...source })
  return rule.replace(BRACKETS_RXP.dbLarge, (match, key) => {
    console.log({ match, key })
    return key
  })
}

const run = async () => {
  try {
    // "use strict";
    const res = new Function('source', `with(source){return ${await whenFunc(when.value)}}`)(toRaw(source))
    console.log('res', res)
  }
  catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <n-space>
    <button btn @click="run">
      run
    </button>
    <button btn @click="validateFunc">
      ajv
    </button>
  </n-space>
  <div flex>
    <div flex-1>
      {{ JSON.stringify(source, null, 2) }}
    </div>
    <div flex-1>
      <div>when : <n-input v-model:value="when" /></div>
    </div>
  </div>
</template>
