<template>
  <div class="equipment-add">
    <div class="title-box">
      <span class="left">设备导入</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/device_management/equipment_management')">返回</Button>
      <Button type="primary" @click="openFiles" ghost class="re-btn">批量导入</Button>
      <Button type="primary" @click="downloadTemp" ghost class="re-btn">下载导入模板</Button>
      <input type="file" multiple class="hidden" ref="uploadInput"
             accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadFilesList">
    </div>
    <Form :model="formCustom" :label-width="60">
      <Row>
        <Col span="4">
          <FormItem label="状态" :label-width="40">
            <Select v-model="formCustom.status">
              <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.status }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem label="上传时间" :label-width="80">
            <Row>
              <Col span="11">
                <DatePicker type="date" placeholder="开始日期" v-model="formCustom.startDate"></DatePicker>
              </Col>
              <Col span="2" style="text-align: center">至</Col>
              <Col span="11">
                <DatePicker type="date" placeholder="结束日期" v-model="formCustom.endDate"></DatePicker>
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col span="2">
          <FormItem :label-width="10">
            <Button type="primary" @click="handleSubmit">搜索</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <div>
      <Table stripe border :loading="loading" :columns="equip_columns" :data="equip_data" style="margin-top: 10px"></Table>
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
import { getUploadsList, getStatusList } from '@/api/device-data'
import { mapMutations, mapActions } from 'vuex'
import { resetTime, setSerialNum } from '@/libs/util'
export default {
  name: 'equipment-management',
  data () {
    return {
      formCustom: {
        status: '',
        startDate: '',
        endDate: ''
      },
      loading: false,
      equip_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          width: 80
        },
        {
          title: '文件名',
          key: 'file_name',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            // 如果有链接，则显示查看原因按钮
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  long: true
                },
                style: {
                  'overflow': 'hidden',
                  'text-overflow': 'ellipsis',
                  'max-width': '260px'
                },
                on: {
                  click: () => {
                    this.downloadFile(params.row.id, 'source')
                  }
                }
              }, params.row.file_name)
            ])
          }
        },
        {
          title: '数据量',
          key: 'row_number',
          align: 'center',
          width: 150
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 120
        },
        {
          title: '上传时间',
          key: 'create_time',
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          width: 120,
          render: (h, params) => {
            // 如果有链接，则显示查看原因按钮
            if (params.row.fail_file_url) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.downloadFile(params.row.id, 'fail')
                    }
                  }
                }, '失败原因')
              ])
            }
          }
        }
      ],
      equip_data: [],
      pageInfo: {},
      statusList: [
      ]
    }
  },
  methods: {
    ...mapMutations([
      'setFilesListShow'
    ]),
    ...mapActions([
      'uploadFiles'
    ]),
    // 搜索按钮
    handleSubmit () {
      this.changePage()
    },
    changePage (page) {
      this.loading = true
      this.pageInfo.current = page
      let startDate = new Date(this.formCustom.startDate).getTime()
      let endDate = new Date(this.formCustom.endDate).getTime()
      let start_time = startDate || ''
      let end_time = endDate || ''
      if (start_time !== '' && end_time !== '' && start_time > end_time) {
        this.$Modal.warning({
          title: '获取失败',
          content: '开始时间不能大于结束时间'
        })
      }
      let data = {
        status: this.formCustom.status,
        start_time,
        end_time,
        page: page || 1,
        page_size: this.pageInfo.page_size || 20
      }
      getUploadsList(data).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.pageInfo.total = data.data.total
          this.pageInfo.current = data.data.page
          this.pageInfo.page_size = data.data.page_size
          this.equip_data = setSerialNum(this.resetCreateTime(data.data.list), this.pageInfo)
        } else {
          this.$Modal.warning({
            title: '获取失败',
            content: `原因：${data.errmsg}`
          })
        }
        this.loading = false
      })
    },
    downloadFile (id, type) {
      window.open('/dms/upload/exportfile?id=' + id + '&type=' + type)
    },
    downloadTemp () {
      window.open('/dms/upload/templatefile')
    },
    toPage (path) {
      this.$router.push(path)
    },
    openFiles () {
      this.$refs.uploadInput.value = ''
      this.$refs.uploadInput.click()
    },
    uploadFilesList (files) {
      let filesList = files.target.files
      let data = {
        filesList: filesList,
        url: '/dms/upload/index'
      }
      this.uploadFiles(data)
      // console.log(files.target.files)
    },
    // 后台返回操作时间的时间戳，重构数据
    resetCreateTime (list) {
      let data = list
      for (let i = 0; i < list.length; i++) {
        list[i].create_time = resetTime(list[i].create_time)
      }
      return data
    },
    getStatusList () {
      getStatusList().then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.statusList = data.data.list
        } else {
          this.$Modal.warning({
            title: '获取状态列表失败',
            content: `原因：${data.errmsg}`
          })
        }
      }).catch(err => {
        console.error(err)
      })
    }
  },
  created () {
    this.changePage()
    this.getStatusList()
  },
  watch: {
    '$store.state.app.filesIndex': function () {
      this.changePage()
    }
  }
}
</script>
