<template>
  <div class="project-management">
    <div class="title-box">
      <span class="left">专题管理</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/launcher-management/project_add')">新建专题</Button>
    </div>

    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="80" @submit.native.prevent>
        <Row>
          <Col span="5">
            <FormItem label="专题ID" :label-width="50">
              <Input type="text" v-model="formCustom.id"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="专题名称">
              <Input type="text" v-model="formCustom.name"></Input>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label-width="30">
              <Button type="primary" @click="handleSubmit">搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div>
      <Table stripe border :loading="loading" :columns="project_columns" :data="project_data" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="operate">
          <Button type="text" style="margin: 5px" @click="editProject(row.id)" >编辑</Button>
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
import { setSerialNum, resetTime } from '@/libs/util'
import { getProjectList} from '@/api/launcher-data'
export default {
  name: 'project-management',
  data () {
    return {
      loading: true,
      formCustom: {
        id: '',
        name: ''
      },
      project_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          width: 80
        },
        {
          title: '专题ID',
          key: 'id',
          align: 'center',
          width: 150
        },
        {
          title: '专题名称',
          key: 'name',
          align: 'center',
          minWidth: 200
        },
        {
          title: '创建人',
          key: 'create_user',
          align: 'center',
          width: 180
        },
        {
          title: '更新时间',
          key: 'update_time',
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
      project_data: [],
      pageInfo: {

      },
      searchInfo: {
        id: '',
        name: ''
      }
    }
  },
  methods: {
    changePage(page) {
      this.loading = true
      this.pageInfo.current = page || 1
      let params = {
        id: this.searchInfo.id,
        name: this.searchInfo.name,
        page_size: this.pageInfo.page_size || 20,
        page: page || 1
      }
      getProjectList(params).then(result => {
        let data = result.data
        if (data.errno === 10000) {
          this.loading = false
          this.pageInfo.current = data.data.page * 1
          this.pageInfo.page_size = data.data.page_size * 1
          this.pageInfo.total = data.data.total
          this.project_data = this.resetCreateTime(setSerialNum(data.data.list, this.pageInfo), 'update_time')
        } else {
          this.$Modal.warning({
            title: '专题列表获取失败',
            content: `原因:${data.errmsg}`
          })
        }
      })
    },
    handleSubmit() {
      this.searchInfo.name = this.formCustom.name.trim()
      this.searchInfo.id = this.formCustom.id.trim()
      this.changePage()
    },
    toPage(path) {
      this.$router.push({
        path
      })
    },
    editProject(id) {
      this.toPage(`/view/launcher-management/project_edit#${id}`)
    },
    // 后台返回操作时间的时间戳，重构数据
    resetCreateTime (list, time) {
      let data = list
      for (let i = 0; i < data.length; i++) {
        data[i][time] = resetTime(data[i][time])
      }
      return data
    }
  },
  mounted () {
    this.changePage()
  }
}
</script>

<style scoped>

</style>
