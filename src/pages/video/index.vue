<script setup lang="ts">
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import * as m3u8Parser from 'm3u8-parser'

videojs.addLanguage('zh-CN', {
  'Play': '播放',
  'Pause': '暂停',
  'Current Time': '当前时间',
  'Duration': '时长',
  'Remaining Time': '剩余时间',
  'Stream Type': '媒体流类型',
  'LIVE': '直播',
  'Loaded': '加载完成',
  'Progress': '进度',
  'Fullscreen': '全屏',
  'Exit Fullscreen': '退出全屏',
  'Picture-in-Picture': '画中画',
  'Exit Picture-in-Picture': '退出画中画',
  'Mute': '静音',
  'Unmute': '开启音效',
  'Playback Rate': '播放速度',
  'Subtitles': '字幕',
  'subtitles off': '关闭字幕',
  'Captions': '内嵌字幕',
  'captions off': '关闭内嵌字幕',
  'Chapters': '节目段落',
  'Close Modal Dialog': '关闭弹窗',
  'Descriptions': '描述',
  'descriptions off': '关闭描述',
  'Audio Track': '音轨',
  'You aborted the media playback': '视频播放被终止',
  'A network error caused the media download to fail part-way.': '网络错误导致视频下载中途失败。',
  'The media could not be loaded, either because the server or network failed or because the format is not supported.': '视频因格式不支持或者服务器或网络的问题无法加载。',
  'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.': '由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。',
  'No compatible source was found for this media.': '无法找到此视频兼容的源。',
  'The media is encrypted and we do not have the keys to decrypt it.': '视频已加密，无法解密。',
  'Play Video': '播放视频',
  'Close': '关闭',
  'Modal Window': '弹窗',
  'This is a modal window': '这是一个弹窗',
  'This modal can be closed by pressing the Escape key or activating the close button.': '可以按ESC按键或启用关闭按钮来关闭此弹窗。',
  ', opens captions settings dialog': ', 开启标题设置弹窗',
  ', opens subtitles settings dialog': ', 开启字幕设置弹窗',
  ', opens descriptions settings dialog': ', 开启描述设置弹窗',
  ', selected': ', 选择',
  'captions settings': '字幕设定',
  'Audio Player': '音频播放器',
  'Video Player': '视频播放器',
  'Replay': '重新播放',
  'Progress Bar': '进度条',
  'Volume Level': '音量',
  'subtitles settings': '字幕设定',
  'descriptions settings': '描述设定',
  'Text': '文字',
  'White': '白',
  'Black': '黑',
  'Red': '红',
  'Green': '绿',
  'Blue': '蓝',
  'Yellow': '黄',
  'Magenta': '紫红',
  'Cyan': '青',
  'Background': '背景',
  'Window': '窗口',
  'Transparent': '透明',
  'Semi-Transparent': '半透明',
  'Opaque': '不透明',
  'Font Size': '字体尺寸',
  'Text Edge Style': '字体边缘样式',
  'None': '无',
  'Raised': '浮雕',
  'Depressed': '压低',
  'Uniform': '均匀',
  'Dropshadow': '下阴影',
  'Font Family': '字体库',
  'Proportional Sans-Serif': '比例无细体',
  'Monospace Sans-Serif': '单间隔无细体',
  'Proportional Serif': '比例细体',
  'Monospace Serif': '单间隔细体',
  'Casual': '舒适',
  'Script': '手写体',
  'Small Caps': '小型大写字体',
  'Reset': '重置',
  'restore all settings to the default values': '恢复全部设定至预设值',
  'Done': '完成',
  'Caption Settings Dialog': '字幕设定窗口',
  'Beginning of dialog window. Escape will cancel and close the window.': '打开对话窗口。Escape键将取消并关闭对话窗口',
  'End of dialog window.': '结束对话窗口',
  'Seek to live, currently behind live': '尝试直播，当前为延时播放',
  'Seek to live, currently playing live': '尝试直播，当前为实时播放',
  'progress bar timing: currentTime={1} duration={2}': '{1}/{2}',
  '{1} is loading.': '正在加载 {1}。',
  'No content': '无内容',
  'Color': '颜色',
  'Opacity': '不透明度',
  'Text Background': '文本背景',
  'Caption Area Background': '字幕区域背景',
  'Skip forward {1} seconds': '快进 {1} 秒',
  'Skip backward {1} seconds': '快退 {1} 秒',
})
// import 'videojs-playlist'

onMounted(() => {
  // const video = document.getElementById('video') as HTMLMediaElement
  // const videoSrc = 'http://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_4.m3u8'
  // // const videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  //
  // if (Hls.isSupported()) {
  //   const hls = new Hls()
  //   hls.loadSource(videoSrc)
  //   hls.attachMedia(video)
  // }
  // else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //   video.src = videoSrc
  // }

  const player = videojs('video1', {
    language: 'zh-CN',
  })
  console.log(player)
  fetch('https://raw.githubusercontent.com/joevess/IPTV/main/home.m3u8').then(res => res.text()).then((res) => {
    const parser = new m3u8Parser.Parser()
    parser.push(res)
    parser.end()
    console.log({ parser })
  })
})
</script>

<template>
  <!--  <video id="video" controls w-400 /> -->
  <video id="video1" class="video-js vjs-default-skin vjs-big-play-centered" w-200 h-100 controls>
    <!-- 在source标签里写入我们的索引文件路径 -->
    <!--    <source src="http://127.0.0.1:8000/m3u8Index" type="application/x-mpegURL"> -->
    <!--    <source src="https://raw.githubusercontent.com/joevess/IPTV/main/home.m3u8" type="application/x-mpegURL"> -->
    <source src="//mobilelive-ds.ysp.cctv.cn/ysp/2013693901.m3u8" type="application/x-mpegURL">
    <!--    <source src="http://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_4.m3u8" type="application/x-mpegURL"> -->
  </video>
  <!--  <video src="http://127.0.0.1:8000/flower" controls autoplay /> -->
<!--  <video src="http://127.0.0.1:8000/flower1" controls autoplay /> -->
</template>

<style scoped lang="scss">

</style>
