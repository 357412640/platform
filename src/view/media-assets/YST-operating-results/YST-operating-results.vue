<!-- 爱奇艺运营结果 -->
<template>
  <div class="YST-operating-results">
    <div class="title-box">
      <span class="left">搜索</span>
    </div>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="80">
        <Row>
          <Col span="5">
            <FormItem label="视频名称" :label-width="60">
              <Input type="text" v-model="formCustom.title"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源ID">
              <Input type="text" v-model="formCustom.itemId"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="所属频道">
              <Select v-model="formCustom.chnId">
                <Option v-for="item in channelList" :value="item.channel_id" :key="item.channel_id">{{ item.chi_name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="付费类型">
              <Select v-model="formCustom.payStatus">
                <Option v-for="item in payList" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
        <template slot-scope="{ row, index }" slot="pic_1920x1080" >
          <img :src="row.pic_1920x1080" alt="" width="100%" style="padding: 10px">
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
import { getYSTChannelList, getYSTResultList } from '@/api/media-data'
import { setSelectAll } from '@/libs/util'
export default {
  name: 'YST-operating-results',
  data () {
    return {
      loading: true,
      formCustom: {
        itemId: '',
        title: '',
        chnId: '',
        payStatus: ''
      },
      pageInfo: {},
      album_columns: [
        {
          title: '视频名称',
          key: 'title',
          align: 'center'
        },
        {
          title: '内容类型',
          key: 'item_type_name',
          align: 'center'
        },
        {
          title: '来源ID',
          key: 'item_id',
          align: 'center'
        },
        {
          title: '所属频道',
          key: 'chnName',
          align: 'center'
        },
        {
          title: '付费类型',
          key: 'pay_status_name',
          align: 'center'
        },
        {
          title: '运营结果（1920*1080）',
          slot: 'pic_1920x1080',
          align: 'center'
        }
      ],
      album_data: [],
      channelList: [],
      payList: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 8,
          name: '免费'
        },
        {
          id: 5,
          name: '会员免费'
        },
        {
          id: 4,
          name: '会员用券'
        }
      ]
    }
  },
  methods: {
    changePage (p) {
      this.loading = true
      this.pageInfo.current = p || 1
      let page = p
      let page_size = this.pageInfo.page_size
      let itemId = this.formCustom.itemId.trim()
      let title = this.formCustom.title.trim()
      let chnId = this.formCustom.chnId === -1 ? '' : this.formCustom.chnId
      let payStatus = this.formCustom.payStatus === '' ? -1 : this.formCustom.payStatus
      let params = {
        page,
        page_size,
        itemId,
        title,
        chnId,
        payStatus
      }
      getYSTResultList(params).then(res => {
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
      this.changePage()
    }
  },
  created () {
    Promise.all([getYSTChannelList(), getYSTResultList({payStatus: -1})]).then(result => {
      let channelListRe = result[0].data
      let operatingResultListRe = result[1].data
      if (channelListRe.errno === 10000) {
        let channelList = setSelectAll(channelListRe.data, {chi_name: '全部', channel_id: -1})
        this.channelList = channelList
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
