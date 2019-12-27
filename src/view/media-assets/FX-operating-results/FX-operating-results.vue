<!-- 风行运营结果 -->
<template>
  <div class="FX-operating-results">
    <div class="title-box">
      <span class="left">搜索</span>
    </div>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="100">
        <Row>
          <Col span="5">
            <FormItem label="视频名称" :label-width="60">
              <Input type="text" v-model="formCustom.name"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源ID">
              <Input type="text" v-model="formCustom.media_id"></Input>
            </FormItem>
          </Col>

          <Col span="5">
            <FormItem label="所属频道">
              <Select v-model="formCustom.type">
                <Option v-for="item in channelList" :value="item.type" :key="item.type">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="付费类型">
              <Select v-model="formCustom.vip_type">
                <Option v-for="item in payTypeList" :value="item.vip_type" :key="item.vip_type">{{ item.name }}</Option>
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
          <img :src="row.still" alt="" width="100%" style="padding: 10px">
        </template>
        <template slot-scope="{ row, index }" slot="poster" >
          <img :src="row.poster" alt="" width="100%" style="padding: 10px">
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
import { getFXChannelList, getFXPayList, getFXResultList } from '@/api/media-data'
import { setSelectAll } from '@/libs/util'
export default {
  name: 'FX-operating-results',
  data () {
    return {
      loading: true,
      formCustom: {
        media_id: '',
        vip_type: '',
        name: '',
        type: ''
      },
      searchInfo: {},
      pageInfo: {},
      album_columns: [
        {
          title: '视频名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '来源ID',
          key: 'media_id',
          align: 'center'
        },
        {
          title: '所属频道',
          key: 'typeName',
          align: 'center'
        },
        {
          title: '付费类型',
          key: 'payName',
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
      payTypeList: []
    }
  },
  methods: {
    changePage (p) {
      this.loading = true
      this.pageInfo.current = p || 1
      let page = p
      this.searchInfo.page = p
      let params = this.searchInfo
      getFXResultList(params).then(res => {
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
      let vip_type = this.formCustom.vip_type === '-1' ? '' : this.formCustom.vip_type
      let name = this.formCustom.name.trim()
      let type = this.formCustom.type === '-1' ? '' : this.formCustom.type
      this.searchInfo = {
        page_size,
        vip_type,
        media_id,
        name,
        type
      }
      this.changePage()
    }
  },
  created () {
    Promise.all([getFXChannelList(), getFXPayList(), getFXResultList()]).then(result => {
      let channelListRe = result[0].data
      let payListRe = result[1].data
      let operatingResultListRe = result[2].data
      if (channelListRe.errno === 10000) {
        let channelList = setSelectAll(channelListRe.data.list, {type: '-1', name: '全部'})
        this.channelList = channelList
      } else {
        this.$Modal.warning({
          title: '频道获取失败',
          content: `原因: ${channelListRe.errmsg}`
        })
      }

      if (payListRe.errno === 10000) {
        let payList = setSelectAll(payListRe.data.list, {vip_type: '-1', name: '全部'})
        this.payTypeList = payList
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
