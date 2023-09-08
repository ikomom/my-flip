<script setup lang="ts">
const content = ref('') // 输入框内容
const ghostHTML = ref('') // 建议内容HTML
const ghostContent = ref('') // 建议内容HTML
const suggestions = ['你好啊', '怎么学编程', '111'] // 建议列表

const handleInput = () => {
  ghostContent.value = ''
  ghostHTML.value = '' 

  if (content.value === '') {
    return
  }
  const suggestion = suggestions.find((item) => item.startsWith(content.value))
  if (suggestion) {
    ghostContent.value = suggestion
    ghostHTML.value = suggestion.replace(content.value, `<span>${content.value}</span>`) + ' →' // 显示内容替换
  }
}

const handleTabKeydown = () => {
  // 监听tab键按下，将输入框内容设置为建议内容，同时清空建议内容
  content.value = ghostContent.value
  ghostContent.value = ''
  ghostHTML.value = ''
}

</script>

<template>
  <label class="container">
    <textarea b-1 p-2 v-model="content" @input="handleInput" @keydown.tab.prevent="handleTabKeydown" />
    <div class="ghost-content" v-html="ghostHTML"></div>
  </label>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  display: block;
  width: 300px;
  height: 200px;
  font-size: 14px;
  line-height: 21px;

  textarea {
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    font: inherit;
    color: #212121;
    background-color: #fff;
    outline: none;
  }
  .ghost-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #212121;
    opacity: 0.3;
  }

}

</style>