<template>
<div>
  <div>1.点击图片出现选择</div>
    <img src="@/assets/images/talkingdata.png" alt="没找到" class="img-list" v-for="(item, index) in 4" :key="index" @click="showChoose = true">
    <Button type="primary" v-show="showChoose">选择</Button>
  <div>2.添加标签组件</div>
  <Tag v-for="item in count" :key="item" :name="item" closable @on-close="handleClose2">标签{{ item }}</Tag>
  <Button icon="ios-add" type="dashed" size="small" @click="isAdd=true" v-show="!isAdd">添加标签</Button>
  <div class="common-form-inline" style="vertical-align: middle;" v-show="isAdd">
    <Input size="small" v-model="tag"><Button slot="append" size="small" type="primary" @click="handleAdd">确定</Button></Input>
  </div>
  <div>3.拖动并添加表格</div>
    <Tag v-for="(item, index) in dragTags"
         :key="index+'drag'"
         :name="item"
         closable
         @on-close="handleCloseTag"
         @dragstart.native="onDragStart"
         draggable>{{item}}</Tag>
    <Table border
           :columns="tableColumn"
           :data="tableData"
           :show-header="false"
           @dragover.native.prevent
           style="margin-top: 20px"
           @drop.native.capture.prevent="drop"
           :row-class-name="(row, index) => {return `row${index}`}"
           class="drag">
      <template slot-scope = "{ row, index }" slot="and">
        <p v-if="index !== 0">且</p>
      </template>
      <template slot-scope = "{ row, index }" slot="content">
        <i v-for="(item, i) in row.content" :key="i+'tag'">
          <span v-if="i !== 0">或</span>
          <Tag :name="item"
               closable
               @on-close="closeTableTag">{{item}}</Tag>
        </i>
      </template>
    </Table>
</div>
</template>

<script>
// tag数据类型：｛key:'', value: '', isNot: false｝
export default {
  name: 'index',
  created () {
    // 未选中不出现选择
    window.onclick = function (event) {
      console.log(event, event.target.className === 'img-list')
      if (!(event.target.className === 'img-list')) {
        this.showChoose = false
      }
    }.bind(this)
  },
  data () {
    return {
      showChoose: false,
      tag: '',
      dragTags: ['视频标签：电视剧', '标签2', '标签3', '标签4', '标签5'],
      count: [],
      isAdd: false,
      tableColumn: [
        {slot: 'and', width: 100},
        {slot: 'content'}
      ],
      tableData: [{and: '', content: []}],
      currentTag: '' // 当前拖动标签
    }
  },
  methods: {
    // 初始化拖拽
    onDragStart (e) {
      this.currentTag = e.target.innerText.trim()
      // console.log('开始拖动', e.target.innerText)
    },
    drop (e) {
      // 获取classname中数字，来判断第几行
      let str
      if (e.target.parentNode.classList.value.indexOf('ivu-table-row') !== -1) {
        str = e.target.parentNode.classList.value
      } else {
        // 如果当前添加行已经有值时候，会多出一层div，向上parrent有变化
        str = e.target.parentNode.parentNode.parentNode.classList.value
      }
      let newNum = Number(str.replace(/[^0-9]/ig, ''))
      console.log(e, newNum)
      let _this = this
      this.tableData.forEach((s, i) => {
        if (i === newNum) {
          // 当前行添加标签，删除可拖动标签
          s.content.push(_this.currentTag)
          const index = _this.dragTags.indexOf(_this.currentTag)
          // console.log("获取位置", _this.currentTag, typeof _this.currentTag, _this.dragTags)
          if (index !== -1) {
            this.dragTags.splice(index, 1)
          }
        }
      })
      // 最后一行自增一行
      if (newNum + 1 === this.tableData.length) {
        this.tableData.push({and: '且', content: []})
      }
    },
    handleCloseTag (event, name) {
      const index = this.dragTags.indexOf(name)
      this.dragTags.splice(index, 1)
    },
    // 删除表格内标签
    closeTableTag (event, name) {
      let emptyIndex = -1
      this.tableData.forEach((s, i) => {
        if (s.content.indexOf(name) !== -1) {
          // 删除表格中tag，并增加拖动tag
          let index = s.content.indexOf(name)
          s.content.splice(index, 1)
          this.dragTags.push(name)
          // 当前删除行内没数据，记录当前行
          if (s.content.length === 0) {
            emptyIndex = i
          }
        }
      })
      // 删除没有数据的空行
      if (emptyIndex !== -1) {
        this.tableData.splice(emptyIndex, 1)
      }
    },
    handleAdd () {
      this.isAdd = false
      if (this.count.length) {
        // let newItem = {index: this.count[this.count.length - 1] + 1, con: this.tag}
        this.count.push(this.tag)
      } else {
        this.count.push(this.tag)
      }
      this.tag = ''
    },
    handleClose2 (event, name) {
      const index = this.count.indexOf(name)
      this.count.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
.img-list{
  width: 200px;
  height: 200px;
  margin-left: 10px;
}
</style>
