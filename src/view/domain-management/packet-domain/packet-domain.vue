<!-- 分组域名 -->
<template>
  <div class="packet-domain">
    <div class="title-box">
      <span class="left">分组域名</span>
      <Button type="primary" style="float: right;" @click="toPage({path: '/view/domain-management/packet_add'})">添加分组</Button>
    </div>
    <div class="search-box">
      <Form :model="formCustom" :label-width="60" @submit.native.prevent>
        <Row>
          <Col span="6">
            <FormItem label="分组名称">
              <Input type="text" v-model="formCustom.packet_name"></Input>
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
      <Table stripe border :loading="loading" :columns="packet_columns" :data="packet_data" style="margin-top: 10px"></Table>
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
import { getDomainList } from '@/api/domain-data'
import { resetTime, setSerialNum } from '@/libs/util'
export default {
  name: 'packet-domain',
  data () {
    return {
      loading: false,
      formCustom: {
        packet_name: ''
      },
      packet_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          tooltip: true,
          width: 80
        },
        {
          title: '分组名称',
          key: 'name',
          align: 'center',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '域名内容',
          key: 'domain_group',
          align: 'center',
          minWidth: 150
        },
        {
          title: '更新时间',
          key: 'update_time',
          align: 'center',
          tooltip: true,
          width: 160
        },
        {
          title: '操作人',
          key: 'update_user',
          align: 'center',
          tooltip: true,
          width: 120
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          tooltip: true,
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.toPage({
                      path: `/view/domain-management/packet_edit#${params.row.id}`
                    })
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      packet_data: [
      ],
      pageInfo: {}
    }
  },
  methods: {
    handleSubmit () {
      this.changePage()
    },
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let params = {
        group_name: this.formCustom.packet_name.trim(),
        page_size: this.pageInfo.page_size || 20,
        page: page || 1
      }
      getDomainList(params).then(res => {
        const data = res.data
        this.loading = false
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.packet_data = setSerialNum(this.resetCreateTime(data.data.list), this.pageInfo)
        } else {
          this.$Modal.warning({
            title: '分组域名列表获取失败',
            content: `原因:${data.errmsg}`
          })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    toPage (info) {
      this.$router.push(info)
    },
    // 后台返回操作时间的时间戳，重构数据
    resetCreateTime (list) {
      let data = list
      for (let i = 0; i < list.length; i++) {
        list[i].update_time = resetTime(list[i].update_time)
      }
      return data
    }
  },
  created () {
    this.changePage()
  }
}
</script>
