<!-- 爱奇艺运营结果 -->
<template>
  <div class="IQY-operating-results">
    <div class="title-box">
      <span class="left">搜索</span>
    </div>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="100">
        <Row>
          <Col span="5">
            <FormItem label="视频名称" :label-width="60">
              <Input type="text" v-model="formCustom.ep_name"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源视频ID">
              <Input type="text" v-model="formCustom.source_ep_id"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源专辑ID">
              <Input type="text" v-model="formCustom.source_chn_id"></Input>
            </FormItem>
          </Col>

          <Col span="5">
            <FormItem label="所属频道">
              <Select v-model="formCustom.cid">
                <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
        <template slot-scope="{ row, index }" slot="tv_img_950_470" >
          <img :src="row.tv_img_950_470" alt="" width="100%" style="padding: 10px">
        </template>
        <template slot-scope="{ row, index }" slot="tv_img_570_570" >
          <img :src="row.tv_img_570_570" alt="" width="100%" style="padding: 10px">
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
import { getChannelList, getOperatingResultList } from '@/api/media-data'
import { setSelectAll } from '@/libs/util'
export default {
  name: 'IQY-operating-results',
  data () {
    return {
      loading: true,
      formCustom: {
        source_ep_id: '',
        source_chn_id: '',
        ep_name: '',
        cid: ''
      },
      pageInfo: {},
      album_columns: [
        {
          title: '视频名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '来源视频ID',
          key: 'source_ep_id',
          align: 'center'
        },
        {
          title: '来源专辑ID',
          key: 'source_chn_id',
          align: 'center'
        },
        {
          title: '所属频道',
          key: 'cname',
          align: 'center'
        },
        {
          title: '运营结果（950*470）',
          slot: 'tv_img_950_470',
          align: 'center'
        },
        {
          title: '运营结果（570*570）',
          slot: 'tv_img_570_570',
          align: 'center'
        }
      ],
      album_data: [],
      channelList: []
    }
  },
  methods: {
    changePage (p) {
      this.loading = true
      this.pageInfo.current = p || 1
      let page = p
      let page_size = this.pageInfo.page_size
      let source_ep_id = this.formCustom.source_ep_id.trim()
      let source_chn_id = this.formCustom.source_chn_id.trim()
      let ep_name = this.formCustom.ep_name.trim()
      let cid = this.formCustom.cid || -1
      let params = {
        page,
        page_size,
        source_ep_id,
        source_chn_id,
        ep_name,
        cid
      }
      getOperatingResultList(params).then(res => {
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
    Promise.all([getChannelList(-1), getOperatingResultList({cid: -1})]).then(result => {
      let channelListRe = result[0].data
      let operatingResultListRe = result[1].data
      if (channelListRe.errno === 10000) {
        let channelList = setSelectAll(channelListRe.data)
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
