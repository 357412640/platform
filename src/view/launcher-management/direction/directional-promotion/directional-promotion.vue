<template>
  <!-- 定向推广 -->
  <div class="directional-promotion">
    <div class="title-box">
      <span class="left">定向推广</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/launcher-management/directional_add')">新建推广</Button>
    </div>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="60" :rules="ruleValidate">
        <Row>
          <Col span="5">
            <FormItem label="频道" :label-width="40">
              <Select v-model="formCustom.pageId">
                <Option v-for="item in channelList" :value="item.pageId" :key="item.pageId">{{ item.pageName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem label="位置" prop="row">
              <Input type="text" v-model="formCustom.position.row" placeholder="行" @on-change="validateCheck"></Input>
            </FormItem>
          </Col>
          <Col span="1">
            <div style="text-align: center; line-height: 32px">
              <span>—</span>
            </div>
          </Col>
          <Col span="2">
            <FormItem :label-width="0" prop="item">
              <Input type="text" v-model="formCustom.position.item" placeholder="item" style="padding-right: 15px" @on-change="validateCheck">></Input>
            </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="标题" :label-width="40">
            <Input type="text" v-model="formCustom.title"></Input>
          </FormItem>
          </Col>
          <Col span="3">
            <FormItem :label-width="0" style="text-align: center;">
              <Button type="primary" @click="handleSubmit('formCustom')">搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div>
      <Table stripe border :loading="loading" :columns="promotion_columns" :data="promotion_data" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="operate">
          <div>
            <Button @click="updateDirectional(row)" class="clear-box">编辑</Button>
            <span style="display: inline-block;width: 1px;height: 10px;background-color:#ccc;"></span>
            <Button @click="deletePopShow(row)" class="clear-box">删除</Button>
          </div>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>

    <Modal
      title="删除"
      v-model="deletePop.popShow"
      :mask-closable="false"
      width="400px"
      @on-ok="deleteDirectional"
      :loading="deletePop.popLoading">
      <p>
        确认要删除：{{ deletePop.title }}吗？
      </p>
    </Modal>
  </div>
</template>

<script>
import './index.less'
import {getDirectionalList, deleteDirectional, getDirectionalChannel} from '@/api/launcher-data'
import {setSerialNum, setSelectAll} from '@/libs/util'
export default {
  name: 'directional-promotion',
  data () {
    const $vm = this
    const hasItem = (rule, value, callback) => {
      if ($vm.formCustom.position.row || $vm.formCustom.position.item) {
        if ($vm.formCustom.position.row && $vm.formCustom.position.item) {
          callback()
        } else {
          callback(new Error(' '))
        }
      } else {
        callback()
      }
    }
    const hasRow = (rule, value, callback) => {
      if ($vm.formCustom.position.row || $vm.formCustom.position.item) {
        if ($vm.formCustom.position.row && $vm.formCustom.position.item) {
          callback()
        } else {
          callback(new Error(' '))
        }
      } else {
        callback()
      }
    }
    return {
      loading: true,
      deletePop: {
        popShow: false,
        popLoading: true,
        title: ''
      },
      formCustom: {
        pageId: '',
        position: {
          row: '',
          item: ''
        },
        title: ''
      },
      searchInfo: {
        pageId: '',
        position: {
          row: '',
          item: ''
        },
        title: ''
      },
      ruleValidate: {
        row: [
          {
            validator: hasRow
          }
        ],
        item: [
          {
            validator: hasItem
          }
        ]
      },
      channelList: [],
      pageInfo: {},
      promotion_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          tooltip: true,
          width: 80
        },
        {
          title: '频道',
          key: 'pageName',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '位置（行 - item）',
          key: 'location',
          align: 'center',
          tooltip: true,
          minWidth: 200
        },
        {
          title: '标题',
          key: 'title',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '定向类型',
          key: 'directionalName',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '操作',
          slot: 'operate',
          align: 'center',
          tooltip: true,
          minWidth: 100
        },
      ],
      promotion_data: [],
      directionalType: [
        {
          id: 'deviceId',
          name: '设备ID'
        },
        {
          id: 'deviceModel',
          name: '设备类型'
        },
        {
          id: 'deviceGroup',
          name: '设备分组'
        }
      ],
      deleteDirectionalData: ''
    }
  },
  methods: {
    toPage (page) {
      this.$router.push(page)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.searchInfo = JSON.parse(JSON.stringify(this.formCustom))
          this.changePage()
        }
      })
    },
    changePage (p) {
      this.loading = true
      this.pageInfo.current = p || 1
      let page = p
      let page_size = this.searchInfo.page_size || ''
      let pageId = this.searchInfo.pageId === -1 ? '' : this.searchInfo.pageId
      let title = this.searchInfo.title.trim() || ''
      let position
      if (this.searchInfo.position.row && this.searchInfo.position.item) {
        position = JSON.stringify({
          row: this.searchInfo.position.row * 1,
          item: this.searchInfo.position.item * 1
        })
      }
      let params = {
        page,
        page_size,
        pageId,
        title,
        position
      }
      getDirectionalList(params).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.loading = false
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.promotion_data = this.reDirectionalList(data.data.list)
        } else {
          this.$Modal.warning({
            title: '获取频道列表失败',
            content: `原因: ${data.errmsg}`
          })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    reDirectionalList (li) {
      let list = setSerialNum(li, this.pageInfo).map((item) => {
        item.location = item.position.row + ' - ' + item.position.item
        for (let i = 0; i < this.directionalType.length; i++) {
          let type = this.directionalType[i]
          if (type.id === item.directionalType) {
            item.directionalName = type.name
            break
          }
        }
        return item
      })
      return list
    },
    validateCheck () {
      this.$refs.formCustom.validateField('row')
      this.$refs.formCustom.validateField('item')
    },
    updateDirectional (row) {
      let id = row.id
      this.toPage('/view/launcher-management/directional_edit#' + id)
    },
    deleteDirectional () {
      let id = this.deleteDirectionalData.id
      deleteDirectional(id).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.$Message.info('删除成功！')
          this.changePage(this.pageInfo.current)
        } else {
          this.$Modal.warning({
            title: '删除',
            content: data.errmsg
          })
        }
        this.deletePop.popShow = false
      }).catch(err => {
        console.log(err)
      })
    },
    deletePopShow (row) {
      this.deleteDirectionalData = row
      this.deletePop.title = row.title
      this.deletePop.popShow = true
    }
  },
  mounted () {
    Promise.all([getDirectionalChannel(), getDirectionalList()]).then( result => {
      let channelRes = result[0].data
      let listRes = result[1].data
      if (channelRes.errno === 10000) {
        this.channelList = setSelectAll(channelRes.data.list, {pageId: -1, pageName: '全部'})
      } else {
        this.$Modal.warning({
          title: '获取频道列表失败',
          content: `原因: ${channelRes.errmsg}`
        })
        return
      }
      if (listRes.errno === 10000) {
        this.pageInfo.total = listRes.data.total
        this.pageInfo.current = listRes.data.page
        this.pageInfo.page_size = listRes.data.page_size
        this.promotion_data = this.reDirectionalList(listRes.data.list)
        this.loading = false
      } else {
        this.$Modal.warning({
          title: '获取搜索列表失败',
          content: `原因: ${listRes.errmsg}`
        })
      }
    }).catch(err => {
      console.error(err)
    })

  }
}
</script>
