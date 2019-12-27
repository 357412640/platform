<!-- 爱奇艺移动运营结果 -->
<template>
  <div class="IQY-mo-choice">
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
            <FormItem label="来源视频ID">
              <Input type="text" v-model="formCustom.tvId"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="来源专辑ID">
              <Input type="text" v-model="formCustom.aid"></Input>
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
        <template slot-scope="{ row, index }" slot="image" >
          <img :src="row.image" alt="" width="100%" style="padding: 10px">
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
import { getIQYMOList } from '@/api/media-data'
import { setSerialNum } from '@/libs/util'
export default {
  name: 'IQY-operating-results',
  data () {
    return {
      loading: true,
      formCustom: {
        title: '',
        tvId: '',
        aid: ''
      },
      pageInfo: {},
      album_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          width: 100
        },
        {
          title: '视频名称',
          key: 'title',
          align: 'center'
        },
        {
          title: '来源视频ID',
          key: 'tvId',
          align: 'center'
        },
        {
          title: '来源专辑ID',
          key: 'aid',
          align: 'center'
        },
        {
          title: '运营结果',
          slot: 'image',
          align: 'center'
        }
      ],
      album_data: [],
      searchInfo: {}
    }
  },
  methods: {
    changePage (p) {
      this.loading = true
      this.pageInfo.current = p || 1
      let page = p
      let page_size = this.pageInfo.page_size
      let title = this.searchInfo.title
      let tvId = this.searchInfo.tvId
      let aid = this.searchInfo.aid
      let params = {
        page,
        page_size,
        title,
        tvId,
        aid
      }
      getIQYMOList(params).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.album_data = setSerialNum(data.data.list, this.pageInfo)
          console.log(this.album_data)
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
      this.searchInfo.title = this.formCustom.title.trim()
      this.searchInfo.tvId = this.formCustom.tvId.trim()
      this.searchInfo.aid = this.formCustom.aid.trim()
      this.changePage()
    }
  },
  created () {
    this.handleSubmit()
  }
}
</script>
