<!-- 豆果美食运营结果 -->
<template>
  <div class="DGMS-choice">
    <div class="title-box">
      <span class="left">搜索</span>
    </div>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="100">
        <Row>
          <Col span="4">
            <FormItem label="名称" :label-width="40">
              <Input type="text" v-model="formCustom.title"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="菜谱ID">
              <Input type="text" v-model="formCustom.cook_id"></Input>
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
import { getDGMSList } from '@/api/media-data'
import { resetTime, setSerialNum } from '@/libs/util'
export default {
  name: 'IQY-operating-results',
  data () {
    return {
      loading: true,
      formCustom: {
        title: '',
        cook_id: ''
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
          title: '名称',
          key: 'title',
          align: 'center'
        },
        {
          title: '菜谱ID',
          key: 'cook_id',
          align: 'center'
        },
        {
          title: '更新时间',
          key: 'updateTime',
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
      let cook_id = this.searchInfo.cook_id
      let params = {
        page,
        page_size,
        title,
        cook_id
      }
      getDGMSList(params).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.album_data = this.resetCreateTime(setSerialNum(data.data.list, this.pageInfo))
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
      this.searchInfo.cook_id = this.formCustom.cook_id.trim()
      this.changePage()
    },
    // 后台返回操作时间的时间戳，重构数据
    resetCreateTime (list) {
      let data = list
      for (let i = 0; i < list.length; i++) {
        list[i].updateTime = resetTime(list[i].updateTime)
      }
      return data
    }
  },
  created () {
    this.handleSubmit()
  }
}
</script>
