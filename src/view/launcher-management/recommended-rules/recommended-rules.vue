<template>
  <div class="recommended-rules">
    <div class="title-box">
      <span class="left">推荐规则</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/launcher-management/recommended_add')" >新建规则</Button>
    </div>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="60" @submit.native.prevent>
        <Row>
          <Col span="6">
            <FormItem label="名称" :label-width="40">
              <Input type="text" v-model="formCustom.rule_name"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="来源">
              <Select v-model="formCustom.source">
                <Option v-for="item in sourceList" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label-width="10">
              <Button type="primary" @click="handleSubmit">搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div>
      <Table stripe border :loading="loading" :columns="rule_columns" :data="rule_data" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="operate">
          <Button type="text" style="margin: 5px" @click="checkRule(row.id)" >查看</Button>
          <Button type="text" style="margin: 5px" @click="copyRule(row.id)" >复制</Button>
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
import { setSerialNum, resetTime, setSelectAll } from '@/libs/util'
import { getRuleList, getSourceList } from '@/api/launcher-data'
export default {
  name: 'recommended-rules',
  data () {
    return {
      loading: true,
      formCustom: {
        rule_name: '',
        source: ''
      },
      rule_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          width: 70
        },
        {
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 150
        },
        {
          title: '来源',
          key: 'source_name',
          align: 'center',
          width: 120
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth: 150
        },
        {
          title: '创建人',
          key: 'user_name',
          align: 'center',
          width: 160
        },
        {
          title: '更新时间',
          key: 'time',
          align: 'center',
          width: 180
        },
        {
          title: '操作',
          slot: 'operate',
          align: 'center',
          width: 180
        }
      ],
      rule_data: [],
      pageInfo: {},
      searchInfo: {},
      sourceList: []
    }
  },
  methods: {
    toPage (path) {
      this.$router.push({
        path
      })
    },
    handleSubmit () {
      this.searchInfo.rule_name = this.formCustom.rule_name.trim()
      this.searchInfo.source = this.formCustom.source === -1 ? '' : this.formCustom.source
      this.changePage()
    },
    checkRule (id) {
      this.toPage(`/view/launcher-management/recommended_view#${id}`)
    },
    copyRule (id) {
      this.toPage(`/view/launcher-management/recommended_copy#${id}`)
    },
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let params = {
        name: this.searchInfo.rule_name,
        source: this.searchInfo.source,
        page_size: this.pageInfo.page_size || 20,
        page: page || 1
      }
      getRuleList(params).then(res => {
        this.loading = false
        const data = res.data
        if (data.errno === 10000) {
          this.pageInfo.current = data.data.page * 1
          this.pageInfo.page_size = data.data.page_size * 1
          this.pageInfo.total = data.data.total
          this.rule_data = this.resetCreateTime(setSerialNum(data.data.list, this.pageInfo))
        } else {
          this.$Modal.warning({
            title: '规则列表获取失败',
            content: `原因:${data.errmsg}`
          })
        }
      })
    },
    // 后台返回操作时间的时间戳，重构数据
    resetCreateTime (list) {
      let data = list
      for (let i = 0; i < data.length; i++) {
        data[i].time = resetTime(data[i].time)
      }
      return data
    }
  },
  created () {
    getSourceList().then(result => {
      const data = result.data
      if (data.errno === 10000) {
        this.sourceList = setSelectAll(data.data.list, {value: -1, name: '全部'})
      }else {
        this.$Modal.warning({
          title: '来源列表获取失败',
          content: `原因:${data.errmsg}`
        })
      }
    }).catch(err => {
      console.error(err)
    })
    this.changePage()
  }
}
</script>
