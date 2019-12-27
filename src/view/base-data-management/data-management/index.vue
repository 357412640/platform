<template>
  <div class="data-add">
    <header class="common-header">
      <h2>维护数据</h2>
      <div>
        <Button type="primary" @click="$router.push({ name: 'data_add', query: {tableid: $route.query.tableid}},)"
                v-if="$route.path.indexOf('data_management') !== -1">新建
        </Button>
        <Button type="primary" @click="$router.push({ name: 'import-page', query: {tableid: $route.query.tableid} })"
                class="btn-margin-left" v-if="$route.path.indexOf('data_management') !== -1">模板导入
        </Button>
        <Button type="primary" @click="exportFiles" class="btn-margin-left"
                v-if="$route.path.indexOf('data_management') !== -1">导出
        </Button>
        <Button type="primary" @click="downTemplate" class="btn-margin-left"
                v-if="$route.path.indexOf('import_page') !== -1">下载导入模板
        </Button>
        <Poptip trigger="hover" content="覆盖导入会清空原有数据哦~">
          <Button type="primary" @click="coverImport" class="btn-margin-left"
                  v-if="$route.path.indexOf('import_page') !== -1">覆盖导入
          </Button>
        </Poptip>
        <Button type="primary" @click="addImport" class="btn-margin-left"
                v-if="$route.path.indexOf('import_page') !== -1">增量导入
        </Button>
        <Button type="primary" @click="$router.go(-1)" class="btn-margin-left">返回</Button>
        <input type="file" ref="fileUp" style="display: none" @change="getExlFile($event)" multiple
               accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
      </div>
    </header>
    <div class="desciption">
      <p class="common-form-inline">表单名称：<span>{{formTitleDetail.tablename}}</span></p>
      <p class="common-form-inline margin-left">表单标识：<span>{{formTitleDetail.tablecode}}</span></p>
      <p>表单描述：<span>{{formTitleDetail.description}}</span></p>
    </div>
    <router-view :formTitleDetail="formTitleDetail" :searchCondition="searchCondition" ></router-view>
  </div>
</template>

<script>
import { getDetail, dataExport, exportTemplate } from '@/api/basedataManagement'
import { mapActions } from 'vuex'
export default {
  name: 'data-management-index',
  data () {
    return {
      formTitleDetail: {},
      searchCondition: [],
      hasMore: false,
      flag: null,
      importParams: {
        tableid: this.$route.query.tableid,
        xlsfile: '',
        type: ''
      }
    }
  },
  created () {
    this.getFormTitle()
  },
  methods: {
    async getFormTitle () {
      try {
        const res = await getDetail({ id: this.$route.query.tableid })
        if (res.errno === 10000) {
          this.formTitleDetail = res.data
          this.searchCondition = res.data.columns
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async exportFiles () {
      try {
        const res = await dataExport({ tableid: this.$route.query.tableid })
        if (res.errno === 10000) {
          this.downLoadFile(res.data.url)
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    downLoadFile (url) {
      let iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      document.body.appendChild(iframe)
    },
    async downTemplate () {
      try {
        const res = await exportTemplate({ tableid: this.$route.query.tableid })
        if (res.errno === 10000) {
          this.downLoadFile(res.data.url)
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    ...mapActions([
      'uploadFiles'
    ]),
    coverImport () {
      this.importParams.type = 1
      this.$refs.fileUp.click()
    },
    addImport () {
      this.importParams.type = 2
      this.$refs.fileUp.click()
    },
    getExlFile (e) {
      let filesList = e.target.files
      let data = {
        filesList: filesList,
        url: '/basedata/data/import',
        data: this.importParams
      }
      this.uploadFiles(data)
    }
  }
}
</script>

<style scoped lang="less">
  .data-add {
    .btn-margin-left {
      margin-left: 10px;
    }

    .desciption {
      background-color: #eee;
      padding: 10px;

      .margin-left {
        margin-left: 20px;
      }
    }

  }
</style>
