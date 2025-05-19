<script lang="ts" setup>
import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType, convertInchesToTwip,
} from 'docx'
import { saveAs } from 'file-saver'
import moment from 'moment'

const props = defineProps<{ data: any[]; range: [number, number] }>()

// 生成文档大标题
function createHeading(text1, text2) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({
        text: text1,
      }),
      new TextRun({
        text: text2,
        break: 1,
      }),
    ],
  })
}

// 生成文档正文
function createText(text, num = 0) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [
      new TextRun({
        text,
        break: num,
      }),
    ],
  })
}
// 生成tablecell标题
function createTablecellTitle(text, type) {
  const obj: any = {}
  if (type === 1)
    obj.alignment = AlignmentType.CENTER
  else
    obj.indent = { start: 100 }
  const children: any[] = []
  const splited = String(text).split('\n').filter(Boolean)
  splited.forEach((t, i) => {
    if (text) {
      children.push(new TextRun({
        text: t,
        break: i === 0 ? 0 : 1,
      }))
    }
  })
  return new Paragraph({
    ...obj,
    heading: HeadingLevel.HEADING_5,
    children,
  })
}
// 生成tablecell正文
function createTablecellText(text, type) {
  const obj: any = {}
  if (type === 1)
    obj.alignment = AlignmentType.CENTER
  else
    obj.indent = { start: 100 }

  const children: any[] = []
  const splited = String(text).split('\n').filter(Boolean)
  splited.forEach((t, i) => {
    if (text) {
      children.push(new TextRun({
        text: t,
        break: i === 0 ? 0 : 1,
      }))
    }
  })
  console.log('ccc', { splited, children })
  return new Paragraph({
    ...obj,
    heading: HeadingLevel.HEADING_6,
    children,
  })
}

// 生成tablecell图片
function createTablecellImg(photo, width, height, type = 0) {
  const obj: any = {}
  if (type === 0) {
    obj.spacing = {
      before: 180,
    }
  }
  return new Paragraph({
    ...obj,
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({
        type: 'jpg',
        data: photo,
        transformation: {
          width,
          height,
        },
      }),
    ],
  })
}

/**
 * 生成纯文字tablecell
 * @param text
 * @param colspan 代表行合并数
 * @param type type=0表示是标题,1是正文
 * @param needCenter needCenter 1需要居中, 2是需要自己打断换行的
 */
function createTablecell(text, colspan = 2, type = 0, needCenter = 0) {
  return new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    heading: HeadingLevel.HEADING_4,
    columnSpan: colspan,
    children: [
      type === 0
        ? createTablecellTitle(text, needCenter)
        : createTablecellText(text, needCenter),
    ],
  })
}
// 生成空行(带border)
function ceateTableRow() {
  return [
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 12,
          children: [],
        }),
      ],
    }),
  ]
}
// 将大数组切割成固定长度的小数组,长度不够就填充空对象
function chunk(arr, size) {
  const arr2 = []
  for (let i = 0; i < arr.length; i = i + size) {
    if (arr.slice(i, i + size).length < size) {
      const arr3 = arr.slice(i, i + size)
      for (let j = 0; j < size; j++) {
        if (!arr3[j])
          arr3[j] = {}
      }
      arr2.push(arr3)
    }
    else {
      arr2.push(arr.slice(i, i + size))
    }
  }
  return arr2
}
// word文档共用设置
const commSetting = {
  creator: 'yzm',
  styles: {
    paragraphStyles: [
      // 文档大标题
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          size: 32,
          bold: true,
          color: '000000',
        },
        paragraph: {
          spacing: {
            before: 250,
            after: 250,
          },
        },
      },
      // 文档正文
      {
        id: 'Heading4',
        name: 'Heading 4',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          size: 28,
          color: '000000',
        },
        paragraph: {
          spacing: {
            before: 250,
            after: 250,
          },
        },
      },
      // 表格正文标题
      {
        id: 'Heading5',
        name: 'Heading 5',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          size: 18,
          color: '000000',
          bold: true,
        },
        paragraph: {
          spacing: {
            before: 250,
            after: 250,
          },
        },
      },
      // 表格正文
      {
        id: 'Heading6',
        name: 'Heading 6',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          size: 18,
          color: '000000',
        },
        paragraph: {
          spacing: {
            before: 180,
            after: 180,
          },
        },
      },
    ],
  },
}

function formatData(personData: any[]) {
  let str = ''

  for (let i = 0; i < personData.length; i++) {
    const item = personData[i]
    str += item.name
    str += '\n'

    for (let j = 0; j < item.children.length; j++) {
      const monthItem = item.children[j]
      if (monthItem.children.length > 0) {
        str += `${monthItem.name}月: `

        for (let k = 0; k < monthItem.children.length; k++) {
          const dayItem = monthItem.children[k]
          str += `${dayItem.name} ( ${dayItem.value} ) `
          if (k !== monthItem.children.length - 1)
            str += '、'
        }

        str += '\n'
      }
    }

    str += '\n'
  }

  return str
}
/**
 * 导出秩序册word
 * @param {string} fileName 文件名，不含后缀
 */
async function exportWord(fileName = 'word') {
  const { range, data } = props
  let document = null
  // 假设表格有12列
  const colums = []
  for (let i = 0; i < 12; i++)
    colums.push(convertInchesToTwip(0.5225))

  const timeRange = `${moment(range[0]).format('YYYY年MM月DD日')} - ${moment(range[1]).format('YYYY年MM月DD日')}`
  document = new Document({
    ...commSetting,
    sections: [
      {
        children: [
          new Table({
            columnWidths: colums,
            layout: TableLayoutType.FIXED, // 布局 TableLayoutType有两个属性，一个是FIXED 一个是AUTOFIT
            width: {
              size: convertInchesToTwip(6.27),
              type: WidthType.DXA,
            },
            rows: [
              new TableRow({
                children: [
                  createTablecell('序号', 2, 0, 1),
                  createTablecell('申请人', 2, 0, 1),
                  createTablecell('计次', 2, 0, 1),
                  createTablecell(`具体日期\n<${timeRange}>`, 4, 0, 1),
                  createTablecell('申请人确认', 2, 0, 1),
                ],
              }),
              ...data.map((item, index) => {
                return new TableRow({
                  children: [
                    createTablecell(index + 1, 2, 1, 1),
                    createTablecell(item.name, 2, 1, 1),
                    createTablecell(item.aCount, 2, 1, 1),
                    createTablecell(formatData(item.data), 4, 1, 0),
                    createTablecell('', 2, 1, 1),
                  ],
                })
              }),
            ],
          }),
        ],
      },
    ],
  })
  Packer.toBlob(document).then((b) => {
    saveAs(b, `${timeRange}-${fileName}.docx`)
  })
}
</script>

<template>
  <n-button @click="exportWord('统计表')">
    导出word文档
  </n-button>
</template>
