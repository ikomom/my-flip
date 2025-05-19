<script setup lang="ts">
import * as XLSX from 'xlsx'
import { get, groupBy, set } from 'lodash-es'
import dayjs from 'dayjs'
import type { Moment } from 'moment'
import moment from 'moment'
import HolidayCalendar from 'holiday-calendar'
import CreateDoc from './docx.vue'

import 'moment/locale/zh-cn'

const calendar = new HolidayCalendar()
console.log('calendar', calendar)
calendar.getDateInfo('CN', '2025-05-31').then((dateInfo) => {
  console.log('dateInfo', dateInfo)
})
// 引入中文语言包
dayjs.locale('zh-cn') // 全局使用简体中文
moment.locale('zh-cn')
const weekdays = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]
const mapRemark = {
  Kiꫛg: '汪伊恒',
  0: '吴良浩',
  ikonon: '叶铮铭',
  倾雨倾城: '连伟成',
  我吃汉堡包: '陈楠',
  四斤小同学: '李思军',
}
function extractDates(text) {
  // 正则表达式，用于匹配“补”字后面的日期，月份和日期分开匹配
  // const pattern = /补(\d{1,2})月(\d{1,2})日|\d{1,2}\.\d{1,2}/g
  const pattern = /补(\s?)+(\d{1,2})月(\d{1,2})日?|补(\s?)+(\d{1,2})\.(\d{1,2})|补(\s?)+(\d{2,4})/g
  let match
  const dates = []

  // 循环查找所有匹配的日期
  while ((match = pattern.exec(text)) !== null) {
    // 检查是否是“月日”格式
    if (match[1] && match[2]) {
      // 分别提取月份和日期
      const month = Number(match[1])
      const day = Number(match[2])
      dates.push({ month, day })
    }
    else if (match[0]) {
      // 对于“点”格式，假设第一个数字是月份，第二个数字是日期
      let month = 0
      let day = 0
      for (const m of match) {
        if (m && !isNaN(Number(m))) {
          if (month === 0)
            month = Number(m)
          else if (day === 0)
            day = Number(m)
          else
            break
        }
        if (day === 0) {
          const strMonth = month.toString()
          if (strMonth.length === 3) {
            month = Number(strMonth.slice(0, 1))
            day = Number(strMonth.slice(1))
          }
          else if (strMonth.length === 4) {
            month = Number(strMonth.slice(0, 2))
            day = Number(strMonth.slice(2))
          }
        }
      }

      // console.log(match, { month, day })
      // debugger

      // const [month, day] = match[0].split('.').map(Number)
      dates.push({ month, day })
    }
  }

  return dates
}
const isDev = import.meta.env.MODE === 'development'
const isPassed = ref(isDev)

if (!isDev) {
  const str = prompt('请输入密码')
  console.log('str', str)
  isPassed.value = str === moment().format('YYYYMMDD')
}

const loading = ref<boolean>(false)
const lastModified = ref<string>('')
const curSheetData = ref<any[]>([])

const selectKey = ref<string[]>([])
const range = ref<[number, number]>([moment().add(-2, 'year').toDate().getTime(), Date.now()])

const selectKeys = computed(() => {
  return Object.keys(groupBy(curSheetData.value, 'name')).map(i => ({ label: i, value: i }))
})
const curRenderData = computed(() => {
  return curSheetData.value.filter(item => selectKey.value.length ? selectKey.value.includes(item.name) : true).filter(item => moment(item.overtime).isBetween(range.value[0], range.value[1]))
})
const allCount = computed(() => {
  return curRenderData.value.reduce((pre, cur) => pre + cur.count, 0)
})

const groupCurRenderData = computed(() => {
  const g = groupBy(curRenderData.value, 'name')
  const obj = []
  for (const gKey in g) {
    const gObj = {
      name: gKey,
      aCount: 0,
      data: {},
    }
    g[gKey].forEach((item) => {
      const [year, month, day] = moment(item.overtime).format('YYYY MM DD').split(' ')
      const path = ['data', year, month].join('.')
      set(gObj, path, { ...get(gObj, path, {}), [day]: item.count })
      gObj.aCount += item.count
    })
    gObj.data = convertToArrays(gObj.data)
    obj.push(gObj)
  }
  obj.sort((a, b) => -Number(a.aCount) + Number(b.aCount))
  console.log('obbbb', obj, g)
  return obj
})
interface NestedObject {
  [key: string]: NestedObject | number
}

function convertToArrays(obj: NestedObject): Array<any> {
  const result: Array<any> = []

  for (const name in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(name)) {
      const value = obj[name]
      if (typeof value === 'object' && value !== null) {
        // 递归调用，处理嵌套对象
        result.push({ name, children: convertToArrays(value) })
      }
      else {
        // 处理叶子节点
        result.push({ name, value })
      }
    }
  }
  result.sort((a, b) => Number(a.name) - Number(b.name))

  return result
}

async function isHoliday(m: Moment) {
  const isH = await calendar.isHoliday('CN', m.format('YYYY-MM-DD'))
  return isH || (m.weekday() === 0 || m.weekday() === 6)
}

function getData() {
  loading.value = true
  return fetch('/jiaban.xlsx').then((res) => {
    lastModified.value = res.headers.get('last-modified') ? moment(res.headers.get('last-modified')).format('YYYY-MM-DD HH:mm:ss') : ''
    return res
  }).then(res => res.arrayBuffer())
    .then(async (res) => {
      const workbook = XLSX.read(res, { type: 'array' })
      const data: any = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1)
      // const data = getSheetData(XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, { header: 1 }), sheetData.Sheets.Sheet1['!merges'])
      // const test = moment('2024-10-4')
      const nData = [
      // {
      //   id: 0,
      //   overtime: test.format('YYYY-MM-DD HH:mm:ss'),
      //   count: ((test.weekday() === 0 || test.weekday() === 6)) ? 3 : 1,
      //   weekDay: weekdays[test.weekday()],
      //   name: '',
      //   reason: '',
      // },
      ]
      let id = 0
      for (const item of data) {
        if (item.Remark && typeof item.StrContent === 'string' && !item.StrContent.includes('<revokemsg>') && item.StrContent.startsWith('加班')) {
          let name = item.Remark.split('电信五所-')[1] || item.Remark.split('电信五所–')[1] || mapRemark[item.Remark] || item.Remark
          if (item.Remark === 'O')
            name = '吴良浩'
          const reason = item.StrContent.replaceAll('\n', '')

          const tempOvertime = moment(Number(`${item.CreateTime}` + '000'))
          const overtime = (tempOvertime.hour() < 6 && !reason.includes('补'))
            ? tempOvertime.add(-1, 'day').set('hour', 23).set('minute', 59).set('seconds', 59)
            : tempOvertime

          const other = extractDates(item.StrContent)
          if (other.length) {
            for (const i of other) {
              id++
              const c = overtime.clone().month(i.month - 1).date(i.day)
              nData.push({
                id,
                overtime: c.format('YYYY-MM-DD HH:mm:ss'),
                weekDay: weekdays[c.weekday()],
                count: await isHoliday(c) ? 3 : 1,
                name,
                // name: `${name}--${c.hour()}`,
                reason,
              // other,
              })
            }
          }
          else {
            id++
            nData.push({
              id,
              overtime: overtime.format('YYYY-MM-DD HH:mm:ss'),
              name,
              // name: `${name}--${overtime.hour()}`,
              weekDay: weekdays[overtime.weekday()],
              count: await isHoliday(overtime) ? 3 : 1,
              reason,
            // other,
            })
          }
        }
      }
      curSheetData.value = nData
      console.log({ workbook, nData, data: groupBy(data, 'Remark') })
    }).finally(() => {
      loading.value = false
    })
}
if (isPassed.value)
  getData()

function downloadTable() {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(curRenderData.value)
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, '加班.xlsx')
}

function downloadTableNew() {
  const workbook = XLSX.utils.book_new()
  // ...添加工作表和数据
  const ws = XLSX.utils.json_to_sheet(curRenderData.value)
  XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1')
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
    return buf
  }

  const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = '加班数据.xlsx'
  a.click()

  URL.revokeObjectURL(url)
}
function sortDay(monthItem) {
  const keys = Object.keys(monthItem)
  keys.sort((a, b) => Number(a) - Number(b))
  return keys.map(key => ({ day: key, count: monthItem[key] }))
}

function sortByKey<T>(array: T[], key: keyof T) {
  return array.sort((a, b) => {
    const x = a[key]
    const y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}
</script>

<template>
  <template v-if="isPassed">
    <NSpace mb-2 align="center">
      总计 {{ allCount }} 次
      <NSelect v-model:value="selectKey" :options="selectKeys" multiple style="min-width: 150px" filterable clearable placeholder="请选择人" />
      <NDatePicker v-model:value="range" type="daterange" />
      <NButton @click="downloadTableNew">
        下载
      </NButton>
      <CreateDoc :data="groupCurRenderData" :range="range" />
    </NSpace>
    <div>
      数据更新时间：{{ lastModified || '2025-05-19 12:29:21' }}
      <span class="text-blue"> (数据发送时间在0-5点的会自动修正到前一天)</span>
    </div>
    <n-tabs type="line" animated>
      <n-tab-pane name="group" tab="聚合">
        <n-spin :spinning="loading">
          <n-grid cols="1 s:2 m:3 l:3 xl:4 2xl:6" responsive="screen" :x-gap="12" :y-gap="12" style="min-height: 360px">
            <n-gi v-for="(arr, index) in groupCurRenderData" :key="index">
              <n-card :id="arr.name" embedded h-full>
                <div font-bold text-lg mb-1 flex justify-between>
                  {{ arr.name }} ({{ arr.aCount }} 次)
                  <CopyCodeButton :target="`#${arr.name}`" />
                </div>
                <div v-for="(item) in arr.data" :key="item.name" mb-2>
                  <div font-bold text-base>
                    {{ item.name }}
                  </div>
                  <div v-for="(monthItem, month) in item.children" :key="monthItem.name">
                    <template v-if="monthItem.children.length">
                      <div font-italic font-600>
                        {{ monthItem.name }} 月
                      </div>
                      <span v-for="(dayItem, index) in monthItem.children" :key="dayItem.name">
                        {{ dayItem.name }} ( {{ dayItem.value }} ) {{ index !== monthItem.children.length - 1 ? '、' : '' }}
                      </span>
                    </template>
                  </div>
                </div>
              </n-card>
            </n-gi>
          </n-grid>
        </n-spin>
      </n-tab-pane>
      <n-tab-pane name="all" tab="全部">
        <NDataTable
          :loading="loading"
          :data="curRenderData"
          :max-height="360"
          size="small"
          :columns="[
            { title: 'id', key: 'id', ellipsis: true },
            { title: '姓名', key: 'name' },
            {
              title: '加班时间',
              key: 'overtime',
              defaultSortOrder: 'descend',
              sorter(a, b){
                return moment(a.overtime).valueOf() - moment(b.overtime).valueOf()
              },
            },
            { title: '理由', key: 'reason' },
            { title: '星期几', key: 'weekDay' },
            {
              title: '次数',
              key: 'count',
              // width: 30,
              sorter: (a, b) => {
                return a.count - b.count
              },
            },
          ]"
        />
      </n-tab-pane>
    </n-tabs>
  </template>
  <template v-else>
    密码错误
  </template>
</template>
