<template>
  <div class="form-add">
    <header class="common-header">
      <h2>{{title}} 版本信息</h2>
      <Button type="primary" @click="$router.go(-1)">返回</Button>
    </header>
    <div class="background" style="position: relative">
      <Spin v-if="loading" fix></Spin>
      <Form ref="formAdd" :model="formAdd" :rules="ruleValidate" :label-width="100"
            class="form-page-common-top form-wrapper">
        <FormItem label="设备类型" prop="device_type">
          <Select v-model="formAdd.device_type">
<!--            <Option value="TV">TV</Option>-->
<!--            <Option value="Fridge">Fridge</Option>-->
            <Option v-for="item in deviceTypeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model.trim="formAdd.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="包名" prop="package_name">
          <Input v-model.trim="formAdd.package_name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="版本名称" prop="version_name">
          <Input v-model.trim="formAdd.version_name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="版本号" prop="version_code" class="common-nowrap">
          <Input v-model.trim="formAdd.version_code" placeholder="请输入"></Input>
          （请填写versioncode）
        </FormItem>
        <FormItem label="版本描述" prop="version_description">
          <Input v-model="formAdd.version_description" type="textarea" :autosize="{minRows: 5,maxRows: 10}"
                 placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="上传apk文件" prop="file_url">
          <input type="file" name="file" ref="upload" style="display: none" @change="uploadFile"/>
          <Input v-model="formAdd.file_url" style="display: none"/>
          <Button icon="ios-cloud-upload-outline" size="small" @click="chooseFile">选择文件</Button>
          <div class="upload-files-process" v-show="formAdd.file_url || showUpdateStatus">
            <h3>{{processPercent === 'error' ? '上传失败' : (formAdd.file_url || processPercent === 100 ? '上传完成' : '上传中')
              }}</h3>
            <div style="border: 1px solid #ccc;padding: 10px; width: max-content;min-width: 100%;" class="clearfix">
              <div class="left">上传apk文件</div>
              <div class="right">
                <h4>{{formAdd.file_url || uploadName}}</h4>
                <div>
                  <!--<Progress :percent="formAdd.file_url ? 100 : processPercent" status="wrong" v-if="processPercent === 'error'"/>-->
                  <Progress :percent="formAdd.file_url ? 100 : processPercent"
                            :status="processPercent === 'error' ? 'wrong' : (processPercent === 100 ? 'success' : 'active') "/>
                </div>
              </div>
            </div>
          </div>
        </FormItem>
        <FormItem label="MD5" prop="md5">
          <Input v-model.trim="formAdd.md5" disabled></Input>
        </FormItem>
        <FormItem label="下载优先级" prop="priority_level" class="common-nowrap num">
          <InputNumber v-model.trim="formAdd.priority_level" placeholder="请输入"></InputNumber>
          （正整数，数字越大优先级越高）
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formAdd.remark" type="textarea" :autosize="{minRows: 5,maxRows: 10}"
                 placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="save">保存</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import {requestUpgradeEdit, reqUpgradeDetail} from '@/api/app_updateself'
  import {uploadRequest} from '@/api/upload'
  import BMF from 'browser-md5-file'
  import {getDeviceList} from '@/api/device-data'

  export default {
    name: 'applist-add',
    data() {
      return {
        title: '',
        formAdd: {
          name: '',
          package_name: '',
          version_name: '',
          version_code: null,
          version_description: '',
          file_url: '',
          md5: '',
          device_type: 'TV',
          priority_level: 0,
          remark: ''
        },
        ruleValidate: {
          device_type: [{required: true}],
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          package_name: [{required: true, message: '包名不能为空', trigger: 'blur'}],
          version_name: [{required: true, message: '版本名称不能为空', trigger: 'blur'}],
          version_code: [{required: true, message: '版本号不能为空', trigger: 'blur'}],
          version_description: [{required: true, message: '版本描述不能为空', trigger: 'blur'}],
          file_url: [{required: true, message: '请上传文件'}],
          md5: [{required: true, message: '请上传文件计算MD5'}]
        },
        showUpdateStatus: false,
        processPercent: 0,
        uploadName: '',
        loading: false,
        deviceTypeList: []
      }
    },
    mounted() {
      this.getDeviceList()
      if (this.$route.query.tableid) {
        this.getDetail()
        this.title = '编辑'
      } else {
        this.title = '新建'
      }
    },
    methods: {
      async getDetail() {
        this.loading = true
        try {
          const res = await reqUpgradeDetail({id: Number(this.$route.query.tableid)})
          if (res.errno === 10000) {
            this.formAdd = res.data
            console.log(this.formAdd)
            // this.formAdd.device_type = 'TV'
          } else {
            throw res.errmsg
          }
        } catch (e) {
          this.$Message.error(e)
        } finally {
          this.loading = false
        }
      },
      async chooseFile() {
        this.$refs.upload.click()
      },
      progressEvent(val) {
        let _this = this
        this.$nextTick(() => {
          _this.processPercent = (val.loaded / val.total) * 100
          console.log('_this.processPercent', _this.processPercent)
        })
      },
      async uploadFile(fi) {
        try {
          const file = fi.target.files[0]
          this.uploadName = file.name
          const formdata = new FormData()
          formdata.append('uploadfile', file)
          this.formAdd.file_url = ''
          this.formAdd.md5 = ''
          if (/.apk$/.test(file.name)) {
            this.showUpdateStatus = true
            const res = await uploadRequest(formdata, this.progressEvent)
            console.log('返回请求', res)
            if (res.errno === 10000) {
              this.formAdd.file_url = res.data.fileUrl
              // const fileReader = new FileReader()
              // fileReader.readAsArrayBuffer(file)
              // fileReader.onloadend = (e) => {
              //   this.formAdd.md5 = new MD5().update(e.target.result).digest('hex')
              // }
              const bmf = new BMF()
              bmf.md5(file,
                (err, md5) => {
                  this.formAdd.md5 = md5
                })
            } else {
              this.processPercent = 'error'
              throw res.errmsg
            }
          } else {
            this.showUpdateStatus = false
            this.$Message.error('只能上传apk文件哦~')
          }
        } catch (e) {
          console.log(e)
        }
      },
      save() {
        this.$refs.formAdd.validate((valid) => {
          if (valid) {
            this.resSave()
          } else {
            this.$Message.error('请将信息填写完整!')
          }
        })
      },
      async resSave() {
        try {
          if (!this.formAdd.priority_level) this.formAdd.priority_level = 0
          console.log('save', this.formAdd)
          const res = await requestUpgradeEdit(this.formAdd)
          if (res.errno === 10000) {
            this.$Message.success('保存成功~')
            this.$router.go(-1)
          } else {
            throw res.errmsg
          }
        } catch (e) {
          this.$Message.error(e)
        }
      },
      // 获取设备类型
      async getDeviceList() {
        await getDeviceList().then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.deviceTypeList = data.data.list
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .form-add {
    .background {
      /*padding: 20px 450px 10px 10px;*/
      background-color: #fff;
    }

    .form-wrapper {
      width: 500px;
      padding: 20px 10px;
    }

    .left-width {
      width: 327px;
    }

    .input-width {
      width: 300px;
    }

    .input-width-right {
      width: 380px;
    }

    .right-margin {
      width: 313px;
      margin-left: 50px;
    }

    .item-padding {
      padding: 0px 0 20px 0;
    }

    .upload-files-process {
      .left {
        float: left;
        width: 80px;
      }

      .right {
        float: right;
        width: calc(~"100% - 82px");
      }
    }

    .num .ivu-input-number {
      width: 100%;
    }
  }
</style>
