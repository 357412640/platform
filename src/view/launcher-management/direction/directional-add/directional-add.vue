<template>
  <div class="directional-add">
    <div class="title-box">
      <span class="left">{{ title }}</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/launcher-management/directional_promotion')">返回</Button>
    </div>
    <Form ref="formValidate" :model="formCustom" :label-width="80" label-position="left" :rules="ruleValidate" style="background-color:#fff;padding: 10px 20px;border: 1px solid #dcdee2;">
      <Row>
        <Col span="9">
          <FormItem label="频道" prop="pageId">
            <Select v-model="formCustom.pageId">
              <Option v-for="item in channelList" :value="item.pageId" :key="item.pageId">{{ item.pageName }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="5">
          <FormItem label="位置" prop="row">
            <Input type="text" v-model="formCustom.row" placeholder="行"></Input>
          </FormItem>
        </Col>
        <Col span="1">
           <div style="text-align: center; line-height: 32px">
             <span>—</span>
           </div>
        </Col>
        <Col span="3">
          <FormItem :label-width="0" prop="item">
            <Input type="text" v-model="formCustom.item" placeholder="item"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="固定位类型">
            <RadioGroup v-model="formCustom.recommendType">
              <Radio label="fixation">
                <span>固定位</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="标题" prop="title">
            <Input type="text" v-model="formCustom.title"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="描述">
            <Input type="text" v-model="formCustom.description"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="跳转类型" prop="openType">
            <Select v-model="formCustom.openType" @on-change="changeOpenType">
              <Option v-for="item in openTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <div style="padding-left: 80px" v-if="subTypeList.length > 1">
        <Row>
          <Col span="7">
            <FormItem label="跳转参数" :label-width="60" v-if="formCustom.openType === 'otherApp'">
              <Input type="textarea" v-model="formCustom.openParam"></Input>
            </FormItem>
            <FormItem label="类型" :label-width="60" v-else>
              <Select v-model="formCustom.openSubType">
                <Option v-for="item in subTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="7">
            <FormItem label="资源ID" :label-width="60" v-if="formCustom.openSubType === 'video'">
              <Input type="text" v-model="formCustom.openEpId"></Input>
            </FormItem>
            <FormItem label="资源ID" :label-width="60" v-else-if="formCustom.openSubType === 'album'">
              <Input type="text" v-model="formCustom.openEqId"></Input>
            </FormItem>
            <FormItem label="资源ID" :label-width="60" v-else-if="formCustom.openSubType === 'special'">
              <Input type="text" v-model="formCustom.openSpecialId"></Input>
            </FormItem>
            <FormItem label="游戏ID" :label-width="60" v-else-if="formCustom.openSubType === 'game'">
              <Input type="text" v-model="formCustom.openGameId"></Input>
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row>
        <Col span="9">
          <FormItem label="图片" prop="img">
            <Upload
              :action="uploadUrl + '/uploadFdfs'"
              :format="['png','jpg','jpeg']"
              accept="image/png, image/jpeg"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :show-upload-list="false"
              name="uploadfile">
              <Button type="primary">上传</Button>
            </Upload>
            <div style="width: 202px;height: 102px;display: flex;align-items: center;justify-content: center;border: 1px solid #dcdee2;margin-top: 20px;background-color:#fff;overflow:hidden;">
              <p ref="uploadP" style="text-align: center">支持jpg,png格式图片上传</p>
              <img ref="uploadImg" :src="formCustom.img" width="100%" alt="" style="display: none">
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="定向类型" prop="directionalType">
            <RadioGroup v-model="formCustom.directionalType" @on-change="directionalType">
              <Radio :label="item.id" v-for="item in directionalTypeList" :key="item.id">
                <span>{{item.name}}</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="定向内容" :prop="this.formCustom.directionalType === 'deviceId' ? 'directionalContentStr' : 'directionalContent'">
              <Input type="textarea" size="small" :rows="4" placeholder="填写设备MAC，去掉冒号，多个设备以英文逗号分隔" v-model="formCustom.directionalContentStr" v-if="formCustom.directionalType === 'deviceId'" class="testarea-box"></Input>
            <!-- 设备型号 -->
            <div v-else-if="formCustom.directionalType === 'deviceModel'">
              <div>
                <Checkbox
                  :indeterminate="deviceData.indeterminate"
                  :value="deviceData.checkAll"
                  @click.prevent.native="handleCheckAll">全选</Checkbox>
              </div>
              <CheckboxGroup v-model="formCustom.directionalContent" @on-change="checkAllGroupChange">
                <Checkbox v-for="item in deviceData.list" :label="item.id" :key="item.id">{{ item.name }}</Checkbox>
              </CheckboxGroup>
            </div>
            <!-- 设备分组 -->
            <div v-else-if="formCustom.directionalType === 'deviceGroup'" v-for="(item, index) in deviceData.list" style="border-bottom: 1px solid #dcdee2" :key="item.id">
              <div>
                <Checkbox
                  :indeterminate="deviceData.list[index].indeterminate"
                  :value="deviceData.list[index].checkAll"
                  @click.prevent.native="handleCheckAll(item)">{{ item.name }}全选</Checkbox>
              </div>
              <CheckboxGroup v-model="deviceData.list[index].con" @on-change="checkAllGroupChange">
                <Checkbox v-for="sub in item.list" :key="sub.group_id" :label="sub.group_id">{{ sub.group_name }}</Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button type="primary" style="width: 80px" @click="save('formValidate')">保存</Button>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import './index.less'
import {saveDirectional, getDirectionalDetail, getDirectionalChannel, getDirectionalContent} from '@/api/launcher-data'
export default {
  name: 'directional-add',
  data () {
    let $vm = this
    const ruleDirectionalContent = (rule, val, callback) => {
      if ($vm.formCustom.directionalType === 'deviceGroup') {
        let directionalContent = []
        $vm.deviceData.list.forEach(item => {
          directionalContent = directionalContent.concat(item.con)
        })
        $vm.formCustom.directionalContent = directionalContent
        if ($vm.formCustom.directionalContent.length) {
          callback()
        } else {
          callback(new Error('定向内容不能为空'))
        }
      } else {
        if ($vm.formCustom.directionalContent.length) {
          callback()
        } else {
          callback(new Error('定向内容不能为空'))
        }
      }
    }
    const ruleDirectionalContentStr = (rule, val, callback) => {
      if (!$vm.formCustom.directionalContentStr || $vm.formCustom.directionalContentStr.trim() === '') {
        callback(new Error('定向内容不能为空'))
      } else {
        callback()
      }
    }

    const ruleItemContent = (rule, val, callback) => {
      if (!$vm.formCustom.item || $vm.formCustom.item.toString().trim() === '') {
        callback(new Error('item不能为空'))
      }
      let flag = /^\d+$/.test($vm.formCustom.item * 1)
      if (!flag) {
        callback(new Error('请输入整数'))
      } else {
        callback()
      }
    }
    const ruleRowContent = (rule, val, callback) => {
      if (!$vm.formCustom.row || $vm.formCustom.row.toString().trim() === '') {
        callback(new Error('行不能为空'))
      }
      let flag = /^\d+$/.test($vm.formCustom.row * 1)
      if (!flag) {
        callback(new Error('请输入整数'))
      } else {
        callback()
      }
    }
    const ruleTitleContent = (rule, val, callback) => {
      if (!$vm.formCustom.title || $vm.formCustom.title.trim() === '') {
        callback(new Error('标题不能为空'))
      } else {
        callback()
      }
    }
    return {
      pageType: '',
      title: '',
      formCustom: {
        id: '',
        pageId: '',
        position: {
          row: '',
          item: ''
        },
        recommendType: 'fixation',
        title: '',
        description: '',
        openType: '',
        openSubType: '',
        img: '',
        directionalType:'',
        directionalContent: [],
        directionalContentStr: '',
        openEpId: '',
        openEqId: '',
        openSpecialId: '',
        openGameId: '',
        openParam: ''
      },
      ruleValidate: {
        pageId: [
          { required: true, message: '频道不能为空', trigger: 'change' }
        ],
        row: [
          {
            required: true,
            validator: ruleRowContent,
            trigger: 'blur'
          }
        ],
        item: [
          {
            required: true,
            validator: ruleItemContent,
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            validator: ruleTitleContent,
            trigger: 'blur'
          }
        ],
        openType: [
          { required: true, message: '跳转类型不能为空', trigger: 'change' }
        ],
        img: [
          { required: true, message: '图片不能为空', trigger: 'blur' }
        ],
        directionalType: [
          { required: true, message: '定向类型不能为空', trigger: 'change' }
        ],
        directionalContent: [
          { required: true, validator: ruleDirectionalContent }
        ],
        directionalContentStr: [
          {
            required: true, validator: ruleDirectionalContentStr, trigger: 'blur'
          }
        ]
      },
      uploadFile: {},
      channelList: [],
      openTypeList: [
        {
          id: 'hejia',
          name: '和家固话',
          subTypeList: []
        },
        {
          id: 'none',
          name: '无',
          subTypeList: []
        }
      ],
      subTypeList: [],
      uploadUrl: '',
      directionalTypeList: [
        {
          id: 'deviceId',
          name:'设备ID'
        },
        {
          id: 'deviceModel',
          name:'设备型号'
        },
        {
          id: 'deviceGroup',
          name:'设备分组'
        }
      ],
      deviceData: {
        indeterminate: false,
        checkAll: false,
        list: []
      },
      modelData: [],
      groupData: []
    }
  },
  methods: {
    handleCheckAll (item) {
      if (this.formCustom.directionalType === 'deviceGroup') {
        if (item.indeterminate) {
          item.checkAll = false
        } else {
          item.checkAll = !item.checkAll
        }
        item.indeterminate = false

        if (item.checkAll) {
          item.con = item.list.map((group) => {
            return group.group_id
          })
        } else {
          item.con = []
        }
      } else if (this.formCustom.directionalType === 'deviceModel') {
        if (this.deviceData.indeterminate) {
          this.deviceData.checkAll = false
        } else {
          this.deviceData.checkAll = !this.deviceData.checkAll;
        }
        this.deviceData.indeterminate = false
        if (this.deviceData.checkAll) {
          this.formCustom.directionalContent = this.deviceData.list.map((model) => {
            return model.id
          })
        } else {
          this.formCustom.directionalContent = []
        }
      }
    },
    initCheckGroup (directionalCon) {
      for (let i = 0; i < directionalCon.length; i++) {
        let groupId = directionalCon[i]
        this.deviceData.list.map(model => {
          for (let j = 0; j < model.list.length; j++) {
            let group = model.list[j]
            if (groupId === group.group_id.toString()) {
              model.con.push(group.group_id)
            }
          }
        })
      }
    },
    checkAllGroupChange (data) {
      if (this.formCustom.directionalType === 'deviceGroup') {
        this.deviceData.list.map(model => {
          if (model.con.length === model.list.length) {
            model.indeterminate = false
            model.checkAll = true
          } else if (model.con.length > 0) {
            model.indeterminate = true
            model.checkAll = false
          } else {
            model.indeterminate = false
            model.checkAll = false
          }
        })
      } else if (this.formCustom.directionalType === 'deviceModel') {
        if (data.length === this.deviceData.list.length) {
          this.deviceData.indeterminate = false
          this.deviceData.checkAll = true
        } else if (data.length > 0) {
          this.deviceData.indeterminate = true
          this.deviceData.checkAll = false
        } else {
          this.deviceData.indeterminate = false
          this.deviceData.checkAll = false
        }
      }
    },
    toPage (page) {
      this.$router.push(page)
    },
    uploadSuccess (res, file, fileList) {
      if (res.errno === 10000) {
        this.$Message.success('图片上传成功！')
        this.$refs.uploadP.style.display = 'none'
        this.$refs.uploadImg.style.display = ''
        this.formCustom.img = res.data.fileUrl
      } else {
        this.$Modal.warning({
          title: '图片上传失败',
          content: `原因：${res.errmsg}`
        })
      }
    },
    beforeUpload (file) {
      let fileArr = file.name.split('.')
      let len = fileArr.length - 1
      let fileType = fileArr[len].toLowerCase()
      if (!(fileType === 'jpeg' || fileType === 'jpg' || fileType === 'png')) {
        this.$Modal.warning({
          title: '图片上传失败',
          content: `原因：图片格式有误，只能上传jpg或png格式的图片`
        })
        return false
      }
    },
    directionalType (radio, flag) {
      if (!flag) {
        this.formCustom.directionalContent = []
        this.formCustom.directionalContentStr = ''
        this.deviceData.indeterminate = false
        this.deviceData.checkAll = false
      }
      switch (radio) {
        case 'deviceModel': {
          this.deviceData.list = JSON.parse(JSON.stringify(this.modelData))
          break
        }
        case 'deviceGroup': {
          let groupData = JSON.parse(JSON.stringify(this.groupData))
          this.deviceData.list = groupData
          break
        }
      }
    },
    changeOpenType (id) {
      let openTypeList = this.openTypeList
      for (let i = 0; i < openTypeList.length; i++) {
        let openType = openTypeList[i]
        if (openType.id === id) {
          this.subTypeList = openType.subTypeList
        }
      }
    },
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formCustom.directionalType === 'deviceId') {
            this.formCustom.directionalContent = this.formCustom.directionalContentStr.trim().split(',')
          }
          // else if (this.formCustom.directionalType === 'deviceGroup') {
          //
          // }
          this.formCustom.position = JSON.stringify({
            row: this.formCustom.row * 1,
            item: this.formCustom.item * 1
          })
          saveDirectional(this.formCustom).then(res => {
            let data = res.data
            if (data.errno === 10000) {
              this.$Message.success('保存成功！')
              this.toPage('/view/launcher-management/directional_promotion')
            } else {
              this.$Modal.warning({
                title: '保存失败',
                content: `原因：${data.errmsg}`
              })
            }
          }).catch(err => {
            console.error(err)
          })
        }
      })
    },
    createDirectional (createReq) {
      Promise.all(createReq).then(result => {
        let devRes = result[0].data
        let chanRes = result[1].data
        if (devRes.errno === 10000) {
          let deviceData = devRes.data.list
          // 型号下一定有分组，所以可以通过数组内第一个数据重构数组
          for (let model in deviceData) {
            let grope = deviceData[model][0]
            let modelItem = {}
            let groupItem = {}
            groupItem.name = modelItem.name = model
            groupItem.id = modelItem.id = grope.model_id.toString()
            groupItem.list = deviceData[model]
            groupItem.indeterminate = false
            groupItem.checkAll = false
            groupItem.con = []
            this.modelData.push(modelItem)
            this.groupData.push(groupItem)

            if (this.pageType === 'directional_edit') {
              let detailRes = result[2].data
              if (detailRes.errno === 10000) {
                let detail = detailRes.data
                this.formCustom.id = detail.id
                this.formCustom.pageId = detail.pageId
                this.formCustom.position = detail.position
                this.formCustom.row = detail.position.row
                this.formCustom.item = detail.position.item
                this.formCustom.recommendType = detail.recommendType
                this.formCustom.title = detail.title
                this.formCustom.description = detail.description || ''
                this.formCustom.openType = detail.openType
                this.formCustom.openSubType = detail.openSubType
                this.formCustom.img = detail.img
                this.formCustom.directionalType = detail.directionalType
                this.formCustom.directionalContent = JSON.parse(JSON.stringify(detail.directionalContent))
                this.formCustom.openEpId = detail.openEpId || ''
                this.formCustom.openEqId = detail.openEqId || ''
                this.formCustom.openSpecialId = detail.openSpecialId || ''
                this.formCustom.openGameId = detail.openGameId || ''
                this.formCustom.openParam = detail.openParam || ''

                this.$refs.uploadP.style.display = 'none'
                this.$refs.uploadImg.style.display = ''
                this.$refs.uploadImg.removeAttribute('width')
                this.$refs.uploadImg.removeAttribute('height')
                let width = this.$refs.uploadImg.width
                let height = this.$refs.uploadImg.height
                if (width/2 > height) {
                  this.$refs.uploadImg.setAttribute('width', '200px')
                } else {
                  this.$refs.uploadImg.setAttribute('height', '100px')
                }
                if (this.formCustom.directionalType === 'deviceId') {
                  this.formCustom.directionalContentStr = this.formCustom.directionalContent.join(',')
                } else if (this.formCustom.directionalType === 'deviceModel') {

                  this.directionalType(this.formCustom.directionalType, true)
                  this.checkAllGroupChange(this.formCustom.directionalContent)
                } else if (this.formCustom.directionalType === 'deviceGroup') {
                  this.directionalType(this.formCustom.directionalType, true)
                  this.initCheckGroup(this.formCustom.directionalContent)
                  this.checkAllGroupChange(this.formCustom.directionalContent)
                }
              } else {
                this.$Modal.warning({
                  title: '详情获取失败',
                  content: `原因：${detailRes.errmsg}`
                })
              }
            }
          }
        } else {
          this.$Modal.warning({
            title: '设备数据获取失败',
            content: `原因：${devRes.errmsg}`
          })
        }

        if (chanRes.errno === 10000) {
          this.channelList = chanRes.data.list
        } else {
          this.$Modal.warning({
            title: '频道获取失败',
            content: `原因：${chanRes.errmsg}`
          })
        }
      })
    }
  },
  mounted () {
    this.title = this.$router.history.current.meta.title
    this.uploadUrl = 'http://api.scloud.gome.inc/uploadfile'

    let href = location.href
    let createReq
    let hash
    let id
    if (~href.indexOf('directional_add')) { // 新建
      this.pageType = 'directional_add'
      this.title = '新建素材'
      createReq = [getDirectionalContent(), getDirectionalChannel()]
      this.createDirectional(createReq)
      this.formCustom.directionalType = 'deviceId'
    } else if (~href.indexOf('directional_edit')) { // 编辑
      hash = href.split('#')[1]
      if (hash) {
        id = hash.split('?')[0]
      } else {
        this.toPage('/view/launcher-management/directional_add')
      }
      this.pageType = 'directional_edit'
      this.title = '编辑素材'
      createReq = [getDirectionalContent(), getDirectionalChannel(), getDirectionalDetail(id)]
      this.createDirectional(createReq)
    }
  }
}
</script>
