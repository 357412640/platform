<template>
  <div class="recommended-add">
    <div class="title-box">
      <span class="left">{{ title }}</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/launcher-management/recommended_rules')" >关闭</Button>
    </div>
    <div class="select-box">
      <div class="left-box">
        <p class="left-title">来源列表</p>
        <div class="left-list">
          <Menu theme="light" :active-name="sourceValue" mode="vertical" width="100%" style="text-align: center" @on-select="changeMenu">
            <MenuItem v-for="source in sourceList" :name="source.value" :key="source.value">
              {{source.name}}
            </MenuItem>
          </Menu>
        </div>
        <div class="right-list">
          <Form :label-width="60" ref="formCustom" :model="formCustom" v-if=loading>
            <FormItem :label="item.name" v-for="item in formCustom">
              <Row v-if="formCustom[item.key].formType === 'value'">
                <Col span="6" style="margin-right: 20px">
                  <Select :disabled="disable" clearable v-model="formCustom[item.key].compareVal">
                    <Option v-for="i in formCustom[item.key].compare" :value="i.key" :key="i.name">{{ i.name }}</Option>
                  </Select>
                </Col>
                <Col span="8">
                  <Input :disabled="disable" v-model="formCustom[item.key][item.key]" type="text"></Input>
                </Col>
              </Row>
              <Select :disabled="disable" clearable v-model="formCustom[item.key][item.key]" v-else-if="formCustom[item.key].formType === 'select'">
               <Option v-for="i in formCustom[item.key].list" :value="i.value" :key="i.value">{{ i.name }}</Option>
              </Select>
              <Select :disabled="disable" filterable multiple v-model="formCustom[item.key][item.key]" v-else-if="formCustom[item.key].formType === 'tag'">
                <Option v-for="i in formCustom[item.key].list" :value="i.value" :key="i.value">{{ i.name }}</Option>
              </Select>
              <div v-else-if="formCustom[item.key].formType === 'text'">
                <Tag color="primary" v-for="i in formCustom[item.key][item.key]" :key="i" :name="i" closable @on-close="tagClose(item)">{{ i }}</Tag>
                <Input :disabled="disable" type="text" v-model="formCustom[item.key].tagVal" @on-enter="handleAdd(item)" @on-blur="handleAdd(item)" style="max-width: 100px"></Input>
                <p>（回车创建标签）</p>
              </div>
              <Row v-else-if="formCustom[item.key].formType === 'DatePicker'">
                <Col span="8">
                  <DatePicker :disabled="disable" type="date" placeholder="开始时间" v-model="formCustom[item.key][item.key].startTime"></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">
                  <span>至</span>
                </Col>
                <Col span="8">
                  <DatePicker :disabled="disable" type="date" placeholder="结束时间" v-model="formCustom[item.key][item.key].endTime"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <Button :disabled="disable" type="primary" style="margin: 5px" @click="createSelectTag">选择标签</Button>
          </Form>
        </div>
      </div>
      <div class="right-box">
        <div class="right-content">
          <p class="right-title">已选标签</p>
          <Tag color="primary" v-for="item in selectTag" :key="item.name" :name="item.name" @dragstart.native="onDragStart" draggable :data-isnot=item.isNot @on-close="closeTag" :closable=true>{{ item.name }}</Tag>
        </div>
        <div class="right-content">
          <p class="right-title">组合逻辑</p>
          <p>同行多个标签关系为<span class="c-ed4014">或者</span>，不同行之间关系为 <span class="c-ed4014">并且</span>，点击选择标签可将其设为<span class="c-ed4014">非</span>。</p>
        </div>
        <div class="right-content">
          <Table stripe border :columns="result_columns"
                 :data="result_data"
                 style="margin-top: 10px"
                 :show-header=false @dragover.native.prevent
                 @drop.native.capture.prevent="drop"
                 :row-class-name="(row, index) => {return `row${index}`}"
                 class="drag">
            <template slot-scope="{ row, index }" slot="judge" v-if="index !== 0">
              且
            </template>
            <template slot-scope="{ row, index }" slot="condition">
              <span v-for="(item, index) in row.tagNames" :key="item.name + index" style="display: inline-block">
                <span v-if="index !== 0" style="margin-right: 5px">或</span>
                  <Tag color="primary" :class="{'bgc-ff9900' : item.isNot === 'true'}"
                       :key="item.name"
                       :name="item.name"
                       :closable="!disable"
                       checked
                       @on-close="closeTableTag"
                       style="padding: 0 5px 0 0">
                    <span @click="changeType" style="padding-left: 8px">
                      <span v-if="item.isNot === 'true'">(非)</span>
                      <span :data-isnot='item.isNot'>{{ item.name }}</span>
                    </span>
                  </Tag>
              </span>
            </template>
          </Table>
        </div>

        <div>
          <p style="font-weight: 700;margin-top: 20px;">为您找到影片数</p>
          <p>{{ movieCount }}</p>
        </div>
        <div style="margin: 20px 0;">
          <p style="font-weight: 700;">自定义名称</p>
          <div v-if="!disable">
            <span style="width: 100px;line-height: 32px;">{{ sourceName }}</span>
            <Input :disabled="disable" type="text" v-model="customName" style="width: calc(100% - 100px);margin-left: 5px"></Input>
          </div>
          <p v-else style="line-height: 32px;">
            <span>{{ sourceName }}</span>
            <span>{{ customName }}</span>
          </p>
        </div>
        <Button :disabled="disable" type="primary" style="margin: 5px" @click="save">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
import './index.less'
import { getTagList, getMovieCount, getRuleDetails, saveRule, getSourceList } from '@/api/launcher-data'
import { resetTime2 } from '@/libs/util'
export default {
  name: 'recommended-add',
  data () {
    return {
      loading: false,
      pageType: '',
      disable: false,
      title: '',
      customName: '',
      movieCount: 0,
      formCustom: {
      },
      formList: [],
      selectTag: [],
      result_columns: [
        {
          slot: 'judge',
          width: 50
        },
        {
          slot: 'condition',
          minWidth: 100
        }
      ],
      result_data: [
        {
          tagNames: []
        }
      ],
      currentTag: '',
      tagVal: '',
      sourceList: [],
      sourceValue: '',
      sourceName: ''
    }
  },
  methods: {
    createSelectTag () {
      let list = this.formList
      let tag = []
      for (let i = 0; i < list.length; i++) {
        let li = list[i]
        let formType = li.formType
        let item = {
          isNot: 'false',
          key: li.key,
          formType
        }
        // 判断类型 formType: select(String)、tag/text(Array)、value(String[compareVal]，[key])、DatePicker(Obj[key][startTime、endTime])
        switch (formType) {
          case 'select': { // 单选
            if (li[li.key] !== undefined && li[li.key] !== '') {
              let val
              item.value = li[li.key]
              for (let i = 0; i < li.list.length; i++) {
                let l = li.list[i]
                if (l.value === li[li.key]) {
                  val = li.name + '：' + l.name
                  item.name = val
                  break
                }
              }
              tag.push(item)
            }
            break
          }
          case 'tag': { // 多选
            let arr = li[li.key]
            if (arr && arr.length) {
              let name = li.name
              for (let i = 0; i < arr.length; i++) {
                let item = {
                  isNot: 'false',
                  key: li.key,
                  formType,
                  value: arr[i]
                }
                for (let j = 0; j < li.list.length; j++) {
                  let l = li.list[j]
                  if (l.value === arr[i]) {
                    let val = name + '：' + l.name
                    item.name = val
                    break
                  }
                }
                tag.push(item)
              }
            }
            break
          }
          case 'text': { // 创建标签
            let arr = li[li.key]
            if (arr && arr.length) {
              let name = li.name
              for (let i = 0; i < arr.length; i++) {
                let item = {
                  isNot: 'false',
                  key: li.key,
                  formType
                }
                let val = name + '：' + arr[i]
                item.name = val
                item.value = arr[i]
                tag.push(item)
              }
            }
            break
          }
          case 'value': {
            if (li[li.key] && li[li.key].trim() !== '' && li.compareVal !== '') {
              let compare = ''
              let val = ''
              switch (li.compareVal) {
                case '$lt': {
                  compare = '<'
                  break
                }
                case '$gt': {
                  compare = '>'
                  break
                }
                case '$eq': {
                  compare = '='
                  break
                }
                case '$lte': {
                  compare = '≤'
                  break
                }
                case '$gte': {
                  compare = '≥'
                  break
                }
              }
              val = li.name + '：' + compare + li[li.key]
              item.value = li[li.key]
              item.name = val
              item.compareVal = li.compareVal
              tag.push(item)
            }
            break
          }
          case 'DatePicker': {
            let startTime = resetTime2(li[li.key].startTime) || ''
            let endTime = resetTime2(li[li.key].endTime) || ''
            if (startTime && endTime && startTime > endTime) {
              this.$Modal.warning({
                title: `${li.name}错误`,
                content: `原因：开始时间不能大于结束时间`
              })
              return
            }
            if (li[li.key].startTime !== '' || li[li.key].endTime !== '') {
              let date = li.name + '：' + startTime + ' - ' + endTime
              item.name = date
              item.startTime = startTime
              item.endTime = endTime
              tag.push(item)
            }
            break
          }
        }
      }

      let selectTag = this.selectTag.concat(tag)
      for (let i = 0; i < selectTag.length; i++) {
        let tag_i = selectTag[i]
        let flag = true
        for (let j = i + 1; j < selectTag.length; j++) {
          let tag_j = selectTag[j]
          if (tag_i.name === tag_j.name) {
            flag = false
            selectTag.splice(j, 1)
            j = j - 1
          }
        }

        if (flag) {
          this.result_data.forEach((n) => {
            let resultItem = n.tagNames
            for (let j = 0; j < resultItem.length; j++) {
              let tag_j = resultItem[j]
              if (tag_i.name === tag_j.name) {
                selectTag.splice(i, 1)
                i = i - 1
              }
            }
          })
        }
      }
      this.selectTag = selectTag
    },
    onDragStart (e) {
      this.currentTag = ''
      let name = e.target.innerText.trim()
      for (let i = 0; i < this.selectTag.length; i++) {
        let item = this.selectTag[i]
        if (item.name && name === item.name.trim()) {
          this.currentTag = item
        }
      }
    },
    handleAdd (item) {
      let val = this.formCustom[item.key].tagVal.trim()
      if (val && this.formCustom[item.key][item.key].indexOf(val) === -1) {
        this.formCustom[item.key][item.key].push(val)
      }
      this.formCustom[item.key].tagVal = ''
    },
    tagClose (item) {
      const index = this.formCustom[item.key][item.key].indexOf(name)
      this.formCustom[item.key][item.key].splice(index, 1)
    },
    returnWhere (ruleArr) {
      let data = []
      for (let i = 0; i < ruleArr.length; i++) {
        let rule = ruleArr[i]
        if (rule.tagNames && rule.tagNames.length) {
          switch (rule.formType) {
            case 'DatePicker': {
              let timeArr = rule.name.split('：')[1].split('-')
              let $gt = timeArr[0].trim()
              let $lt = timeArr[1].trim()
              rule.where = {
                $gt,
                $lt
              }
            }
          }
          data.push(rule.tagNames)
        }
      }
      // console.log(typeof data)
      // console.log(data)
      return data
    },
    save () {
      let data = {}
      let name = this.customName.trim()
      if (name) {
        data.condition = JSON.stringify(this.returnWhere(this.result_data))
        data.name = name
        data.source = this.sourceValue
        saveRule(data).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.$Message.success('保存成功!')
            this.toPage('/view/launcher-management/recommended_rules')
          } else {
            this.$Modal.warning({
              title: '保存失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      } else {
        this.$Modal.warning({
          title: '自定义名称不能为空'
        })
      }
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
      // console.log(e, newNum)
      let _this = this
      this.result_data.forEach((s, i) => {
        if (i === newNum) {
          // 当前行添加标签，删除可拖动标签
          if (!_this.currentTag.name) return
          s.tagNames.push(_this.currentTag)
          let index = -1
          for (let i = 0; i < _this.selectTag.length; i++) {
            if (_this.selectTag[i].name === _this.currentTag.name) {
              index = i
              break
            }
          }
          // console.log("获取位置", _this.currentTag, typeof _this.currentTag, _this.selectTag)
          if (index !== -1) {
            this.selectTag.splice(index, 1)
          }
          _this.currentTag = {}
        }
      })
      // 最后一行自增一行
      if (newNum + 1 === this.result_data.length && this.result_data[this.result_data.length - 1].tagNames.length) {
        this.result_data.push({tagNames: []})
      }
      this.getMovieCount()
    },
    closeTag (event, name) {
      let $vm = this
      $vm.selectTag.forEach((n, index) => {
        if (name === n.name) {
          $vm.selectTag.splice(index, 1)
        }
      })
    },
    // 删除表格内标签
    closeTableTag (event, name) {
      let emptyIndex = -1
      this.result_data.forEach((s, i) => {
        s.tagNames.forEach((item, j) => {
          if (item.name === name) {
            // 删除表格中tag，并增加拖动tag
            let index = j
            let deleteTag = s.tagNames.splice(index, 1)
            deleteTag = deleteTag[0]
            if (deleteTag && deleteTag.isNot) {
              deleteTag.isNot = 'false'
              // 判断selectTag内是否有相同标签
              let flag = true
              this.selectTag.forEach((o, i) => {
                if (o.name === name) {
                  flag = false
                }
              })
              if (flag) {
                this.selectTag.push(deleteTag)
              }
            }
            // 当前删除行内没数据，记录当前行
            if (s.tagNames.length === 0) {
              emptyIndex = i
            }
          }
        })
      })
      // 删除没有数据的空行
      if (emptyIndex !== -1) {
        this.result_data.splice(emptyIndex, 1)
      }
      this.getMovieCount()
    },
    changeType (e) {
      if (this.disable) {
        return
      }
      let el = e.currentTarget.childNodes[1]
      let name = el.innerText
      let isNot = el.getAttribute('data-isnot')
      this.result_data.forEach((s) => {
        s.tagNames.forEach((item) => {
          if (item.name === name) {
            if (isNot === 'false') {
              item.isNot = 'true'
            } else {
              item.isNot = 'false'
            }
          }
        })
      })
      this.getMovieCount()
    },
    // 获取影片数量
    getMovieCount () {
      let params = {
        condition: this.returnWhere(this.result_data),
      }
      if (params.condition.length) {
        this.movieCount = '正在获取...'
        params.condition = JSON.stringify(params.condition)
        params.source = this.sourceValue
        getMovieCount(params).then(res => {
          const movieCountData = res.data
          if (movieCountData.errno === 10000) {
            this.movieCount = movieCountData.data.count
          } else {
            this.$Modal.warning({
              title: '获取电影数量失败',
              content: `原因:${movieCountData.errmsg}`
            })
            this.movieCount = '获取失败'
          }
        }).catch(err => {
          if (err.message !== undefined) {
            console.error(err.message)
          }
        })
      }
    },
    createTagList (createReq) {
      let $vm = this
      Promise.all(createReq).then(results => {
        const data = results[0].data
        let tagListData
        if (this.pageType !== 'recommended_add') {
          this.result_data = []
          const ruleDetailsData = data
          if (ruleDetailsData.errno === 10000) {
            let sourceValue = $vm.sourceValue = ruleDetailsData.data.source
            for (let i = 0; i < this.sourceList.length; i++) {
              let source = this.sourceList[i]
              if (sourceValue === source.value) {
                this.sourceName = source.name + '_'
                break
              }
            }
            let params = {
              source: sourceValue
            }
            getTagList(params).then(result => {
              tagListData = result.data
              if (tagListData.errno === 10000) {
                this.resetTagListData (tagListData)
                this.customName = ruleDetailsData.data.name
                let condition = JSON.parse(ruleDetailsData.data.condition)
                for (let i = 0; i < condition.length; i++) {
                  let item = {
                    tagNames: condition[i]
                  }
                  this.result_data.push(item)
                }
                this.result_data.push({tagNames: []})
                this.getMovieCount()
              } else {
                this.$Modal.warning({
                  title: '规则选择列表获取失败',
                  content: `原因:${tagListData.errmsg}`
                })
              }
            })
          } else {
            this.$Modal.warning({
              title: '获取规则详情失败',
              content: `原因:${ruleDetailsData.errmsg}`
            })
          }
        } else {
          tagListData = data
          if (tagListData.errno === 10000) {
            this.resetTagListData(tagListData)
          } else {
            this.$Modal.warning({
              title: '规则选择列表获取失败',
              content: `原因:${tagListData.errmsg}`
            })
          }
        }
      }).catch(err => {
        console.error(err)
      })
    },
    toPage (path) {
      this.$router.push({
        path
      })
    },
    resetTagListData (tagListData) {
      let list = []
      for (let key in tagListData.data) {
        let item = tagListData.data[key]
        let formType = tagListData.data[key].formType
        item.key = key
        switch (formType) {
          case 'select': {
            item[key] = ''
            break
          }
          case 'tag': {
            item[key] = []
            break
          }
          case 'text': {
            item[key] = []
            item.tagVal = ''
            break
          }
          case 'value': {
            item[key] = ''
            let where = item.where
            item.compare = []
            for (let i in where) {
              let o = {
                name: where[i],
                key: i
              }
              item.compare.push(o)
            }
            item.compareVal = ''
            break
          }
          case 'DatePicker': {
            item[key] = {
              'startTime': '',
              'endTime': ''
            }
            break
          }
        }
        list.push(item)
      }
      this.formList = list
      this.formCustom = tagListData.data
      this.loading = true
      // console.log(this.formCustom)
    },
    changeMenu(value) {
      let sourceValue = this.sourceValue
      if (this.disable) {
        this.sourceValue = ''
        this.$nextTick(() => {
          this.sourceValue = sourceValue
        })
        return
      }
      this.sourceValue = value
      for (let i = 0; i < this.sourceList.length; i++) {
        let source = this.sourceList[i]
        if (value === source.value) {
          this.sourceName = source.name + '_'
          break
        }
      }
      let params = {
        source: value
      }
      getTagList(params).then(result => {
        let tagListData = result.data
        if (tagListData.errno === 10000) {
          this.resetTagListData (tagListData)
        } else {
          this.$Modal.warning({
            title: '规则选择列表获取失败',
            content: `原因:${tagListData.errmsg}`
          })
        }
      })
      // 清空右侧规则
      // 已选标签
      this.selectTag = []
      // 组合逻辑
      this.result_data = [
        {
          tagNames: []
        }
      ]
      this.movieCount = 0
      this.customName = ''
    }
  },
  mounted () {
    let $vm = this
    getSourceList().then(results => {
      let data = results.data
      if (data.errno === 10000) {
        $vm.sourceList = data.data.list
        $vm.$nextTick(() => {
          let href = location.href
          let createReq
          let hash
          let id
          if (~href.indexOf('recommended_add')) { // 新建
            $vm.sourceValue = $vm.sourceList[0].value
            $vm.sourceName = $vm.sourceList[0].name + '_'
            $vm.pageType = 'recommended_add'
            $vm.title = '新建规则'
            $vm.disable = false
            // TagList接口，频道接口
            let params = {
              source: $vm.sourceValue
            }
            createReq = [getTagList(params)]
            $vm.createTagList(createReq)
          } else if (~href.indexOf('recommended_copy')) { // 复制
            hash = href.split('#')[1]
            if (hash) {
              id = hash.split('?')[0]
            } else {
              this.toPage('/view/launcher-management/recommended_rules')
            }
            this.pageType = 'recommended_copy'
            this.title = '创建规则'
            this.disable = false
            // TagList接口，频道接口，详情接口
            createReq = [getRuleDetails(id)]
            this.createTagList(createReq)
          } else if (~href.indexOf('recommended_view')) { // 查看
            hash = href.split('#')[1]
            if (hash) {
              id = hash.split('?')[0]
            } else {
              this.toPage('/view/launcher-management/recommended_rules')
            }
            this.pageType = 'recommended_view'
            this.title = '查看规则'
            this.disable = true
            // TagList接口，详情接口
            createReq = [getRuleDetails(id)]
            this.createTagList(createReq)
          }
        })
      }else {
        this.$Modal.warning({
          title: '视频来源列表获取失败',
          content: `原因:${data.errmsg}`
        })
      }
    }).catch(err => {
      console.error(err)
    })
  }
}
</script>
