<!-- 专辑列表 -->
<template>
  <div class="album-list">
    <div class="title-box">
      <span class="left">专辑搜索</span>
    </div>
    <div class="search-box">
        <Form ref="formCustom" :model="formCustom" :label-width="80" :rules="ruleValidate">
          <Row>
            <Col span="5">
              <FormItem label="专辑名称" :label-width="60">
                <Input type="text" v-model="formCustom.name"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="专辑ID" :label-width="70">
                <Input type="text" v-model="formCustom.chn_id"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="来源专辑ID" :label-width="90">
                <Input type="text" v-model="formCustom.source_chn_id"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="频道" :label-width="60" class="channel">
                <Select v-model="formCustom.cid">
                  <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="3">
            <FormItem :label-width="0" style="text-align: center;">
              <Button type="primary" @click="handleSubmit('formCustom')">搜索</Button>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="5">
              <FormItem label="来源" :label-width="60">
                <Select v-model="formCustom.source">
                  <Option v-for="item in sourceList" :value="item.source" :key="item.source">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="是否完结" :label-width="80">
                <Select v-model="formCustom.is_done">
                  <Option v-for="item in finishList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem label="评分" :label-width="60" prop="min_score">
                <Input type="text" v-model="formCustom.min_score"  style="width: 85%;margin-right: 15%" @on-change="compareCheck('min_score')"></Input>
                <span style="position: absolute;right: 0;width: 15%">分</span>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem label="至" :label-width="30" prop="max_score">
                <Input type="text" v-model="formCustom.max_score" style="width: 70%;margin-right: 15%" @on-change="compareCheck('min_score')"></Input>
                <span style="position: absolute;right: 0;width: 30%">分</span>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="更新策略" :label-width="60">
                <Input type="text" v-model="formCustom.strategy"></Input>
              </FormItem>
            </Col>
          </Row>
        <div :class="{'open-search': searchClose}">
          <Row>
            <Col span="5">
              <FormItem label="上映日期" :label-width="60" prop="publish_start_time">
                <DatePicker type="date" placeholder="开始时间" v-model="formCustom.publish_start_time" @on-change="compareCheck('publish_start_time')"></DatePicker>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="至" :label-width="40">
                <DatePicker type="date" placeholder="结束时间" v-model="formCustom.publish_end_time" @on-change="compareCheck('publish_start_time')"></DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="标签(回车添加)" :label-width="110">
                <Tag color="primary" v-for="item in formCustom.tag_names" :key="item" :name="item" closable @on-close="tagClose">{{ item}}</Tag>
                <Input type="text" v-model="tagVal" @on-enter="handleAdd" @on-blur="handleAdd" style="max-width: 100px"></Input>
              </FormItem>
            </Col>
          </Row>
        </div>
      </Form>
      <Divider>
        <p style="text-align: center" ref="openSearchBtn">
          <Button type="primary" @click="openSearch" v-if="searchClose">+展开更多搜索条件</Button>
          <Button type="primary" @click="openSearch" v-else>收起</Button>
        </p>
      </Divider>
    </div>
    <p style="padding-left: 5px">共有{{ pageInfo.total }}条记录</p>
    <div>
      <Table stripe border :loading="loading" :columns="album_columns" :data="album_data" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="info">
          <ul class="ul">
            <li class="li img">
              <img :src="row.pic_url" alt="" width="100%">
            </li>
            <li class="li">
              <p>专辑名称:{{ row.name }}</p>
              <p>来源专辑ID:{{ row.source_chn_id }}</p>
              <p>总集数:{{ row.total }}</p>
              <p>是否完结: <span v-if="row.is_done === 1">完结</span><span v-else>未完结</span></p>
              <p>标签:{{ row.tag_names }}</p>
              <p>描述:{{ row.desc }}</p>
            </li>
            <li class="li">
              <p>所属频道:{{ row.cname }}</p>
              <p>上映日期:{{ row.time }}</p>
              <p>版权站点:{{ row.copyright }}</p>
              <p>更新策略:{{ row.strategy }}</p>
              <p>评分:{{ row.score }}</p>
            </li>
          </ul>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './index.less'
import { getChannelList, getSourceList, getEpgList } from '@/api/media-data'
import { setSelectAll, resetTime2, resetTime3 } from '@/libs/util'
export default {
  name: 'album-list',
  data () {
    const minScoreCheck = (rule, value, callback) => {
      if (isNaN(value * 1)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    const maxScoreCheck = (rule, value, callback) => {
      if (isNaN(value * 1)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    const compareScore = (rule, value, callback) => {
      let minScore = this.formCustom.min_score.trim() === '' ? '' : this.formCustom.min_score.trim() * 1
      let maxScore = this.formCustom.max_score.trim() === '' ? '' : this.formCustom.max_score.trim() * 1
      if (minScore !== '' && maxScore !== '' && minScore - maxScore > 0) {
        callback(new Error('评分范围有误'))
      } else {
        callback()
      }
    }
    const compareDate = (rule, value, callback) => {
      let startTime = this.formCustom.publish_start_time
      let endTime = this.formCustom.publish_end_time
      if (startTime !== '' && endTime !== '' && startTime - endTime > 0) {
        callback(new Error('发布时间范围有误'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      searchClose: true,
      formCustom: {
        chn_id: '',
        source_chn_id: '',
        name: '',
        cid: '',
        source: '',
        tag_names: [],
        min_score: '',
        max_score: '',
        is_done: '',
        publish_start_time: '',
        publish_end_time: '',
        strategy: ''
      },
      ruleValidate: {
        min_score: [
          {
            validator: minScoreCheck,
            trigger: 'change'
          },
          {
            validator: compareScore
          }
        ],
        max_score: [
          {
            validator: maxScoreCheck,
            trigger: 'change'
          }
        ],
        publish_start_time: [
          {
            validator: compareDate,
            trigger: 'blur'
          }
        ]
      },
      channelList: [],
      sourceList: [],
      labelList: [],
      finishList: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 1,
          name: '完结'
        },
        {
          id: 2,
          name: '未完结'
        }
      ],
      album_columns: [
        {
          title: '专辑ID',
          key: '_id',
          align: 'center',
          width: 150
        },
        {
          title: '专辑信息',
          align: 'center',
          minWidth: 460,
          slot: 'info'
        },
        {
          title: '来源',
          key: 'source_name',
          align: 'center',
          width: 150
        }
      ],
      album_data: [],
      pageInfo: {},
      popShow: false,
      tagVal: ''
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$refs.formCustom.validateField('min_score')
          this.$refs.formCustom.validateField('publish_start_time')
          this.changePage()
        }
      })
    },
    openSearch () {
      let flag = this.searchClose
      this.searchClose = !flag
    },
    changePage (p) {
      this.loading = true
      this.pageInfo.current = p || 1
      let page = p
      let page_size = this.pageInfo.page_size
      let chn_id = this.formCustom.chn_id.trim()
      let source_chn_id = this.formCustom.source_chn_id.trim()
      let name = this.formCustom.name.trim()
      let cid = this.formCustom.cid || -1
      let source = this.formCustom.source === -1 ? '' : this.formCustom.source
      let tag_names = this.formCustom.tag_names.join(',')
      let min_score = this.formCustom.min_score.trim()
      let max_score = this.formCustom.max_score.trim()
      let is_done = this.formCustom.is_done || -1
      let publish_start_time = resetTime2(this.formCustom.publish_start_time) || ''
      let publish_end_time = resetTime2(this.formCustom.publish_end_time) || ''
      let strategy = this.formCustom.strategy.trim()
      let params = {
        page,
        page_size,
        chn_id,
        source_chn_id,
        name,
        cid,
        source,
        tag_names,
        min_score,
        max_score,
        is_done,
        publish_start_time,
        publish_end_time,
        strategy
      }
      getEpgList(params).then(res => {
        this.loading = false
        const data = res.data
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.album_data = this.resetTime(data.data.list)
        } else {
          this.$Modal.warning({
            title: '专辑列表获取失败',
            content: `原因: ${data.errmsg}`
          })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    showPop () {
      this.popShow = true
    },
    handleAdd () {
      let val = this.tagVal.trim()
      if (val && this.formCustom.tag_names.indexOf(val) === -1) {
        this.formCustom.tag_names.push(val)
      }
      this.tagVal = ''
    },
    tagClose (event, name) {
      const index = this.formCustom.tag_names.indexOf(name)
      this.formCustom.tag_names.splice(index, 1)
    },
    compareCheck (name) {
      this.$refs.formCustom.validateField(name)
    },
    resetTime (list) {
      let l = list
      for (let i = 0; i < l.length; i++) {
        l[i].time = resetTime3(l[i].time)
      }
      return l
    }
  },
  created () {
    Promise.all([getChannelList(-1), getSourceList(), getEpgList()]).then(result => {
      let channelListRe = result[0].data
      let sourceListRe = result[1].data
      let epgListRe = result[2].data
      if (channelListRe.errno === 10000) {
        let channelList = setSelectAll(channelListRe.data)
        this.channelList = channelList
      } else {
        this.$Modal.warning({
          title: '频道列表获取失败',
          content: `原因: ${channelListRe.errmsg}`
        })
        return
      }

      if (sourceListRe.errno === 10000) {
        let sourceList = setSelectAll(sourceListRe.data, {source: -1, name: '全部'})
        this.sourceList = sourceList
      } else {
        this.$Modal.warning({
          title: '来源列表获取失败',
          content: `原因: ${sourceListRe.errmsg}`
        })
        return
      }

      if (epgListRe.errno === 10000) {
        this.loading = false
        this.pageInfo.total = epgListRe.data.total
        this.pageInfo.current = epgListRe.data.page
        this.pageInfo.page_size = epgListRe.data.page_size
        this.album_data = this.resetTime(epgListRe.data.list)
      } else {
        this.$Modal.warning({
          title: '专辑列表获取失败',
          content: `原因: ${epgListRe.errmsg}`
        })
      }
    }).catch(function (err) {
      console.error(err)
    })
  }
}
</script>
