<!-- 视频列表 -->
<template>
  <div class="video-list">
    <div class="title-box">
      <span class="left">视频搜索</span>
    </div>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="80" :rules="ruleValidate">
        <Row>
          <Col span="5">
            <FormItem label="视频名称" :label-width="60">
              <Input type="text" v-model="formCustom.name"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="频道" :label-width="60" class="channel">
              <Select v-model="formCustom.cid" @on-change="changeChannel">
                <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="内容类型" :label-width="80">
              <Select v-model="formCustom.content_type">
                <Option v-for="item in contentTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="状态" :label-width="60">
              <Select v-model="formCustom.isOnline">
                <Option v-for="item in shelvesList" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
            <FormItem label="视频ID" :label-width="50">
              <Input type="text" v-model="formCustom.ep_id"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源视频ID" :label-width="90">
              <Input type="text" v-model="formCustom.source_ep_id"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源专辑ID" :label-width="90">
              <Input type="text" v-model="formCustom.chn_id"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源" :label-width="60">
              <Select v-model="formCustom.source">
                <Option v-for="item in sourceList" :value="item.source" :key="item.source">{{ item.name }}</Option>
              </Select>
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
              <FormItem label="至" :label-width="30">
                <DatePicker type="date" placeholder="结束时间" v-model="formCustom.publish_end_time" @on-change="compareCheck('publish_start_time')"></DatePicker>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem label="评分" :label-width="60" prop="min_score">
                <Input type="text" v-model="formCustom.min_score"  style="width: 85%;margin-right: 15%" @on-change="compareCheck('min_score')"></Input>
                <span style="position: absolute;right: 0;width: 15%;padding-left: 2px"> 分</span>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem label="至" :label-width="40" prop="max_score">
                <Input type="text" v-model="formCustom.max_score" style="width: 70%;margin-right: 15%" @on-change="compareCheck('min_score')"></Input>
                <span style="position: absolute;right: 0;width: 30%;padding-left: 2px"> 分</span>
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span="4">
              <FormItem label="是否VIP" :label-width="60">
                <Select v-model="formCustom.is_vip">
                  <Option v-for="item in memberList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="是否点播" :label-width="90">
                <Select v-model="formCustom.is_tvod">
                  <Option v-for="item in requestBroadcastList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="是否独播" :label-width="90">
                <Select v-model="formCustom.excl">
                  <Option v-for="item in exclusiveBroadcastList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="标签(回车添加)" :label-width="95">
                <Tag color="primary" v-for="item in formCustom.tag_names" :key="item" :name="item" closable @on-close="tagClose">{{ item}}</Tag>
                <Input type="text" v-model="tagVal" @on-enter="handleAdd" @on-blur="handleAdd" style="max-width: 100px"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="主演(回车添加)" :label-width="95">
                <Tag color="primary" v-for="item in formCustom.main_actor" :key="item" :name="item" closable @on-close="mainActorClose">{{ item}}</Tag>
                <Input type="text" v-model="mainActorVal" @on-enter="mainActorAdd" @on-blur="mainActorAdd" style="max-width: 100px"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="导演(回车添加)" :label-width="100">
                <Tag color="primary" v-for="item in formCustom.director" :key="item" :name="item" closable @on-close="directorClose">{{ item}}</Tag>
                <Input type="text" v-model="directorVal" @on-enter="directorAdd" @on-blur="directorAdd" style="max-width: 100px"></Input>
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
    <p style="padding-left: 5px;overflow:hidden;">
      <span style="display:inline-block;line-height: 32px">共有{{ pageInfo.total }}条记录</span>
      <Button type="primary" @click="handelUnshelve" style="float:right;">批量下架</Button>
    </p>
    <div>
      <Table stripe border :loading="loading" :columns="album_columns" :data="album_data" style="margin-top: 10px" @on-selection-change="setSelectList">
        <template slot-scope="{ row, index }" slot="info">
          <ul class="ul">
            <li class="li img">
              <img :src="row.pic_url" alt="" width="100%">
            </li>
            <li class="li con-left">
              <p>视频名称：{{ row.name }}</p>
              <p>来源视频ID：{{ row.source_ep_id }}</p>
              <p>
                <span>内容类型：{{ row.content_type_name }}</span>
              </p>
              <p>集数：{{ row.epOrder }}</p>
              <p>导演：{{ row.director }}</p>
              <p>标签：{{ row.tag_names }}</p>
              <p>描述：{{ row.desc }}</p>
            </li>
            <li class="li con-right">
              <p>所属专辑：{{ row.epg_name }}</p>
              <p>所属频道：{{ row.cname }}</p>
              <p>来源专辑ID：{{ row.source_chn_id }}</p>
              <p>上映日期：{{ row.time }}</p>
              <p>评分：{{ row.score }}</p>
              <p>主演：{{ row.main_actor }}</p>
            </li>
          </ul>
        </template>
        <template slot-scope="{ row, index }" slot="shelves">
          <span v-if="row.isOnline === 1">上架</span>
          <span v-else>下架</span>
        </template>
        <template slot-scope="{ row, index }" slot="operate">
          <Button type="primary" ghost @click="toVideoDetail(row._id)" style="margin-bottom: 10px">查看详情</Button>
          <Button type="primary" disabled v-if="row.effective === 2" style="width: 80px;">上架</Button>
          <Button type="primary" @click="shelve(row)" v-else-if="row.effective === 1 && row.isOnline === 1" style="width: 80px;">下架</Button>
          <Button type="primary" @click="shelve(row)" v-else-if="row.effective === 1 && row.isOnline === 0" style="width: 80px;">上架</Button>
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
import { getChannelList, getContentList, getSourceList, getVideoList, setVideosManage } from '@/api/media-data'
import { setSelectAll, resetTime2, resetTime3 } from '@/libs/util'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'video-list',
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
        ep_id: '',
        source_ep_id: '',
        name: '',
        cid: '',
        isOnline: '',
        chn_id: '',
        main_actor: [],
        director: [],
        tag_names: [],
        min_score: '',
        max_score: '',
        publish_start_time: '',
        publish_end_time: '',
        content_type: '',
        source: '',
        is_vip: '',
        is_tvod: '',
        excl: ''
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
      shelvesList: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 1,
          name: '上架'
        },
        {
          id: 0,
          name: '下架'
        }
      ],
      labelList: [
      ],
      contentTypeList: [

      ],
      memberList: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 0,
          name: '非会员'
        },
        {
          id: 1,
          name: '会员'
        }
      ],
      requestBroadcastList: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 1,
          name: '是'
        },
        {
          id: 0,
          name: '否'
        }
      ],
      exclusiveBroadcastList: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 1,
          name: '是'
        },
        {
          id: 0,
          name: '否'
        }
      ],
      album_columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '视频ID',
          key: '_id',
          align: 'center',
          width: 100
        },
        {
          title: '视频信息',
          align: 'center',
          slot: 'info',
          minWidth: 460
        },
        {
          title: '来源',
          key: 'source_name',
          align: 'center',
          width: 80
        },
        {
          title: '状态',
          align: 'center',
          width: 70,
          slot: 'shelves'
        },
        {
          title: '操作',
          align: 'center',
          width: 110,
          slot: 'operate'
        }
      ],
      album_data: [
      ],
      pageInfo: {
      },
      popShow: false,
      tagVal: '',
      mainActorVal: '',
      directorVal: '',
      unshelveList: [],
      detailFlag: false
    }
  },
  methods: {
    ...mapMutations([
      'setMediaAssetsCurrent',
      'setMediaAssetsFormCustom',
      'setMediaAssetsFlag',
      'setMediaAssetsScrollTop'
    ]),
    ...mapGetters([
      'getMediaAssetsCurrent',
      'getMediaAssetsFormCustom',
      'getMediaAssetsFlag',
      'getMediaAssetsScrollTop'
    ]),
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
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
      let page_size = this.pageInfo.page_size || ''
      let ep_id = this.formCustom.ep_id.trim()
      let chn_id = this.formCustom.chn_id.trim()
      let isOnline = this.formCustom.isOnline === '' ? -1 : this.formCustom.isOnline
      let source_ep_id = this.formCustom.source_ep_id
      let name = this.formCustom.name.trim()
      let cid = this.formCustom.cid || -1
      let content_type = this.formCustom.content_type || -1
      let source = this.formCustom.source === -1 ? '' : this.formCustom.source
      let main_actor = this.formCustom.main_actor.join(',')
      let director = this.formCustom.director.join(',')
      let tag_names = this.formCustom.tag_names
      let min_score = this.formCustom.min_score.trim()
      let max_score = this.formCustom.max_score.trim()
      let is_done = this.formCustom.is_done || -1
      let publish_start_time = resetTime2(this.formCustom.publish_start_time) || ''
      let publish_end_time = resetTime2(this.formCustom.publish_end_time) || ''
      let is_vip = this.formCustom.is_vip === '' ? -1 : this.formCustom.is_vip
      let is_tvod = this.formCustom.is_tvod === '' ? -1 : this.formCustom.is_tvod
      let excl = this.formCustom.excl === '' ? -1 : this.formCustom.excl
      let params = {
        page,
        page_size,
        ep_id,
        chn_id,
        isOnline,
        source_ep_id,
        name,
        cid,
        content_type,
        source,
        main_actor,
        director,
        tag_names,
        min_score,
        max_score,
        is_done,
        publish_start_time,
        publish_end_time,
        is_vip,
        is_tvod,
        excl
      }
      getVideoList(params).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.loading = false
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.album_data = this.resetTime(data.data.list)
        } else {
          this.$Modal.warning({
            title: '视频列表获取失败',
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
    mainActorAdd () {
      let val = this.mainActorVal.trim()
      if (val && this.formCustom.main_actor.indexOf(val) === -1) {
        this.formCustom.main_actor.push(val)
      }
      this.mainActorVal = ''
    },
    directorAdd () {
      let val = this.directorVal.trim()
      if (val && this.formCustom.director.indexOf(val) === -1) {
        this.formCustom.director.push(val)
      }
      this.directorVal = ''
    },
    tagClose (event, name) {
      const index = this.formCustom.tag_names.indexOf(name)
      this.formCustom.tag_names.splice(index, 1)
    },
    mainActorClose (event, name) {
      const index = this.formCustom.main_actor.indexOf(name)
      this.formCustom.main_actor.splice(index, 1)
    },
    directorClose (event, name) {
      const index = this.formCustom.director.indexOf(name)
      this.formCustom.director.splice(index, 1)
    },
    setSelectList (selection, row) {
      this.unshelveList = selection
    },
    handelUnshelve () {
      if (this.unshelveList.length) {
        let isOnline = 0
        let ep_id = []
        for (let i = 0; i < this.unshelveList.length; i++) {
          ep_id.push(this.unshelveList[i].source_ep_id)
        }
        setVideosManage({isOnline, ep_id}).then(res => {
          const data = res.data
          if (data.errno === 10000) {
            this.changePage(this.pageInfo.current)
          } else {
            this.$Modal.warning({
              title: '批量下架失败',
              content: `原因: ${data.errmsg}`
            })
          }
        }).catch(err => {
          console.error(err)
        })
      }
    },
    shelve (row) {
      let isOnline
      let ep_id = []
      if (row.isOnline === 1) {
        isOnline = 0
      } else if (row.isOnline === 0) {
        isOnline = 1
      } else {
        this.$Modal.warning({
          title: '当前视频上下架状态有误',
          content: `原因: isOnline为${row.isOnline}`
        })
      }
      ep_id.push(row.source_ep_id)
      setVideosManage({isOnline, ep_id}).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.changePage(this.pageInfo.current)
        } else {
          this.$Modal.warning({
            title: '操作失败',
            content: `原因: ${data.errmsg}`
          })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    toVideoDetail (_id) {
      // 跳转前存储当前搜索条件
      let formCustom = JSON.stringify(this.formCustom)
      this.setMediaAssetsFormCustom(formCustom)
      this.setMediaAssetsCurrent(this.pageInfo.current || 1)
      // 跳转时存储当前scrollTop
      let scrollTop = document.getElementsByClassName('content-wrapper')[0].scrollTop
      this.setMediaAssetsScrollTop(scrollTop)
      this.$router.push({
        path: `/view/media_assets/video_detail#${_id}?current=${this.pageInfo.current}`
      })
    },
    compareCheck (name) {
      this.$refs.formCustom.validateField(name)
    },
    changeChannel (cid) {
      this.formCustom.content_type = ''
      getContentList(cid).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          let contentList = setSelectAll(data.data.list)
          this.contentTypeList = contentList
        } else {
          this.$Modal.warning({
            title: '内容列表获取失败',
            content: `原因: ${data.errmsg}`
          })
        }
      })
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
    let params = {}
    this.detailFlag = this.getMediaAssetsFlag()
    if (this.detailFlag) {
      let page = this.getMediaAssetsCurrent()
      this.formCustom = JSON.parse(this.getMediaAssetsFormCustom())
      let ep_id = this.formCustom.ep_id.trim()
      let chn_id = this.formCustom.chn_id.trim()
      let isOnline = this.formCustom.isOnline === '' ? -1 : this.formCustom.isOnline
      let source_ep_id = this.formCustom.source_ep_id
      let name = this.formCustom.name.trim()
      let cid = this.formCustom.cid || -1
      let content_type = this.formCustom.content_type || -1
      let source = this.formCustom.source === -1 ? '' : this.formCustom.source
      let main_actor = this.formCustom.main_actor.join(',')
      let director = this.formCustom.director.join(',')
      let tag_names = this.formCustom.tag_names.join(',')
      let min_score = this.formCustom.min_score.trim()
      let max_score = this.formCustom.max_score.trim()
      let is_done = this.formCustom.is_done || -1
      let publish_start_time = resetTime2(this.formCustom.publish_start_time) || ''
      let publish_end_time = resetTime2(this.formCustom.publish_end_time) || ''
      let is_vip = this.formCustom.is_vip === '' ? -1 : this.formCustom.is_vip
      let is_tvod = this.formCustom.is_tvod || -1
      let excl = this.formCustom.excl || -1
      params = {
        page,
        ep_id,
        chn_id,
        isOnline,
        source_ep_id,
        name,
        cid,
        content_type,
        source,
        main_actor,
        director,
        tag_names,
        min_score,
        max_score,
        is_done,
        publish_start_time,
        publish_end_time,
        is_vip,
        is_tvod,
        excl
      }
      this.setMediaAssetsCurrent(1)
      this.setMediaAssetsFlag(false)
    }
    Promise.all([getChannelList(-1), getContentList(-1), getSourceList(), getVideoList(params)]).then(result => {
      let channelListRe = result[0].data
      let contentListRe = result[1].data
      let sourceListRe = result[2].data
      let videoListRe = result[3].data

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
      if (contentListRe.errno === 10000) {
        let contentList = setSelectAll(contentListRe.data.list)
        this.contentTypeList = contentList
      } else {
        this.$Modal.warning({
          title: '内容列表获取失败',
          content: `原因: ${contentListRe.errmsg}`
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
      if (videoListRe.errno === 10000) {
        this.loading = false
        this.pageInfo.total = videoListRe.data.total
        this.pageInfo.current = videoListRe.data.page
        this.pageInfo.page_size = videoListRe.data.page_size
        this.album_data = this.resetTime(videoListRe.data.list)
        if (this.detailFlag) {
          this.$nextTick(() => {
            let scrollTop = this.getMediaAssetsScrollTop()
            document.getElementsByClassName('content-wrapper')[0].scrollTop = scrollTop
            this.setMediaAssetsScrollTop(0)
          })
        }
      } else {
        this.$Modal.warning({
          title: '视频列表获取失败',
          content: `原因: ${videoListRe.errmsg}`
        })
      }
    }).catch(function (err) {
      console.error(err)
    })
  }
}
</script>
