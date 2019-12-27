<!-- 酷喵运营结果 -->
<template>
  <div class="KM-operating-results">
    <div class="title-box">
      <span class="left">搜索</span>
    </div>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="100">
        <Row>
          <Col span="5">
            <FormItem label="视频名称" :label-width="60">
              <Input type="text" v-model="formCustom.title"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源ID">
              <Input type="text" v-model="formCustom.media_id"></Input>
            </FormItem>
          </Col>

          <Col span="5">
            <FormItem label="所属频道">
              <Select v-model="formCustom.show_type">
                <Option v-for="item in channelList" :value="item.show_type" :key="item.show_type">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="标签类型">
              <Select v-model="formCustom.label_type">
                <Option v-for="item in labelTypeList" :value="item.label_type" :key="item.label_type">{{ item.label_name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem :label-width="0" style="text-align: center;">
              <Button type="primary" @click="handleSubmit">搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div>
      <Table stripe border :loading="loading" :columns="album_columns" :data="album_data" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="still" >
          <img :src="row.pic_url_horizontal" alt="" width="100%" style="padding: 10px">
        </template>
        <template slot-scope="{ row, index }" slot="poster" >
          <img :src="row.pic_url" alt="" width="100%" style="padding: 10px">
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
import { getKMChannelList, getKMLabelList, getKMResultList } from '@/api/media-data'
import { setSelectAll } from '@/libs/util'
export default {
  name: "KM-operating-results",
  data () {
    return {
      loading: true,
      formCustom: {
        media_id: '',
        label_type: '',
        title: '',
        show_type: ''
      },
      searchInfo: {},
      pageInfo: {},
      album_columns: [
        {
          title: '视频名称',
          key: 'title',
          align: 'center'
        },
        {
          title: '来源ID',
          key: 'media_id',
          align: 'center'
        },
        {
          title: '所属频道',
          key: 'show_type_name',
          align: 'center'
        },
        {
          title: '标签类型',
          key: 'label_name',
          align: 'center'
        },
        {
          title: '运营结果（横图）',
          slot: 'still',
          align: 'center'
        },
        {
          title: '运营结果（竖图）',
          slot: 'poster',
          align: 'center'
        }
      ],
      album_data: [],
      channelList: [],
      labelTypeList: []
    }
  },
  methods: {
    changePage (p) {
      this.loading = true
      this.pageInfo.current = p || 1
      let page = p
      this.searchInfo.page = p
      let params = this.searchInfo
      getKMResultList(params).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.album_data = data.data.list
        } else {
          this.$Modal.warning({
            title: '数据列表获取失败',
            content: `原因: ${data.errmsg}`
          })
        }
        this.loading = false
      }).catch(function (err) {
        console.error(err)
      })
    },
    handleSubmit () {
      let page_size = this.pageInfo.page_size
      let media_id = this.formCustom.media_id.trim()
      let label_type = this.formCustom.label_type === '-1' ? '' : this.formCustom.label_type
      let title = this.formCustom.title.trim()
      let show_type = this.formCustom.show_type === '-1' ? '' : this.formCustom.show_type
      this.searchInfo = {
        page_size,
        label_type,
        media_id,
        title,
        show_type
      }
      this.changePage()
    }
  },
  created () {
    Promise.all([getKMChannelList(), getKMLabelList(), getKMResultList()]).then(result => {
      let channelListRe = result[0].data
      let labelListRe = result[1].data
      let operatingResultListRe = result[2].data
      if (channelListRe.errno === 10000) {
        let channelList = setSelectAll(channelListRe.data.list, {show_type: '-1', name: '全部'})
        this.channelList = channelList
      } else {
        this.$Modal.warning({
          title: '频道获取失败',
          content: `原因: ${channelListRe.errmsg}`
        })
      }

      if (labelListRe.errno === 10000) {
        let labelList = setSelectAll(labelListRe.data.list, {label_type: '-1', label_name: '全部'})
        this.labelTypeList = labelList
      } else {
        this.$Modal.warning({
          title: '频道获取失败',
          content: `原因: ${channelListRe.errmsg}`
        })
      }

      if (operatingResultListRe.errno === 10000) {
        this.loading = false
        this.pageInfo.total = operatingResultListRe.data.total
        this.pageInfo.current = operatingResultListRe.data.page
        this.pageInfo.page_size = operatingResultListRe.data.page_size
        this.album_data = operatingResultListRe.data.list
      } else {
        this.$Modal.warning({
          title: '数据列表获取失败',
          content: `原因: ${operatingResultListRe.errmsg}`
        })
      }
    }).catch(function (err) {
      console.error(err)
    })
  }
}
</script>
