<template>
  <div class="project-add">
    <div class="title-box">
      <span class="left">新建专题</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/launcher-management/project_management')">返回</Button>
    </div>
      <Form ref="formValidate" :model="formCustom" :label-width="80" @submit.native.prevent label-position="left" :rules="ruleValidate">
        <Row>
          <Col span="10">
            <FormItem label="专题ID" v-if="pageType !== 'create'">
              <span>{{ formCustom.id }}</span>
            </FormItem>
            <FormItem label="专题名称" prop="name">
              <Input type="text" v-model="formCustom.name"></Input>
            </FormItem>
            <FormItem label="描述内容">
              <Input type="textarea" v-model="formCustom.description"></Input>
            </FormItem>
            <FormItem label="背景图" prop="img_url">
              <Upload
                :action="uploadUrl + '/uploadFdfs'"
                :format="['png','jpg','jpeg']"
                accept="image/png, image/jpeg"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :show-upload-list="false"
                name="uploadfile">
                <Button type="primary" style="margin-bottom: 20px">上传</Button>
              </Upload>
              <div class="upload-box">
                <div style="width: 202px;height: 102px;display: flex;align-items: center;justify-content: center;border: 1px solid #dcdee2;background-color:#fff;overflow:hidden;">
                  <div ref="uploadP">
                    <p style="text-align: center">支持jpg,png格式图片上传</p>
                    <p style="text-align: center">1920*1080</p>
                  </div>
                  <img ref="uploadImg" :src="formCustom.img_url" width="100%" alt="" style="display: none">
                </div>
                <div class="upload-left" v-if="formCustom.img_url">
                  <p style="text-align: center">支持jpg,png格式图片上传</p>
                  <p style="text-align: center">1920*1080</p>
                </div>
              </div>

            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="添加视频" prop="video">
              <div>

              </div>
              <drag-list :list1.sync="list1" :list2.sync="list2" :dropConClass="dropConClass" @on-change="handleChange" style="overflow:hidden;">
                <h3 slot="left-title">
                  <!--<span>待选</span>-->
                  <Input v-model="videoValue" prefix="search" placeholder="输入媒资ID或名称搜索" search @on-search="searchVideo"></Input>
                  <p class="video-error">{{ videoError }}</p>
                </h3>
                <Card class="drag-item" slot="left" slot-scope="left">
                  <span style="margin-right: 10px">{{ left.itemLeft.eqId }}</span>
                  <span>{{ left.itemLeft.epName }}</span>
                </Card>
                <h3 slot="right-title">
                  <span>已选</span>
                  <span style="float: right;">共 {{ list2Len }} 个</span>
                </h3>
                <Card class="drag-item" slot="right" slot-scope="right">
                  <span style="margin-right: 10px">{{ right.itemRight.eqId }}</span>
                  <span>{{ right.itemRight.epName }}</span>
                  <Button @click="deleteVideo(right.itemRight.eqId)" type="error" ghost shape="circle" style="border: 0;padding: 5px 0 6px;outline: none;border-color: transparent; box-shadow:none;position: absolute;right: 0;top: 0;">
                    <Icon type="ios-close" style="font-size: 22px; font-weight: 700;"/>
                  </Button>
                </Card>
              </drag-list>
            </FormItem>
            <Button type="primary" style="width: 80px;margin-left: 80px" @click="save('formValidate')">保存</Button>
          </Col>
        </Row>
      </Form>

  </div>
</template>

<script>
import './index.less'
import DragList from '_c/drag-list'
import { saveProject, getVideoById, getProjectDetail} from '@/api/launcher-data'
export default {
  components: {
    DragList
  },
  name: 'project-add',
  data () {
    return {
      title: '',
      pageType: '',
      videoValue: '',
      formCustom: {
        id: '',
        name: '',
        description: '',
        img_url: '',
        video_data: []
      },
      uploadUrl: '',
      ruleValidate: {
        name: [
          { required: true, message: '专题名称不能为空',
            validator: (rule, val, callback) => {
              if (!this.formCustom.name.trim()) {
                callback(new Error('专题名称不能为空'))
              } else {
                callback()
              }
            },
            trigger: 'blur' }
        ],
        img_url: [
          { required: true, message: '背景图不能为空'}
        ],
        video: [
          {
            required: true,
            validator: (rule, val, callback) => {
              if (!this.formCustom.video_data.length) {
                callback(new Error('已选视频不能为空'))
              } else {
                callback()
              }
            },
            trigger: 'none'
          }
        ]
      },
      list1: [
      ],
      list2: [
      ],
      list2Len: 0,
      dropConClass: {
        left: ['drop-box', 'left-drop-box'],
        right: ['drop-box', 'right-drop-box']
      },
      videoError: '',
      videoResult: []
    }
  },
  methods: {
    toPage (path) {
      this.$router.push({
        path
      })
    },
    uploadSuccess (res, file, fileList) {
      if (res.errno === 10000) {
        this.$Message.success('图片上传成功！')
        this.$refs.uploadP.style.display = 'none'
        this.$refs.uploadImg.style.display = ''
        this.formCustom.img_url = res.data.fileUrl
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
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formCustom.type = this.pageType
          if (this.pageType === 'create') {
            delete this.formCustom.id
          }
          this.formCustom.video_data = JSON.stringify(this.formCustom.video_data)
          this.formCustom.name = this.formCustom.name.trim()
          saveProject(this.formCustom).then(res => {
            let data = res.data
            if (data.errno === 10000) {
              this.$Message.success('保存成功！')
              this.toPage('/view/launcher-management/project_management')
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
    handleChange ({ src, target, oldIndex, newIndex }) {
      this.list1 = this.videoResult
      if (src === 'left' && target === 'right') {
        let newItem = this.list2[newIndex]
        for (let i = 0; i < this.list2.length; i++) {
          if (newIndex !== i) {
            let item = this.list2[i]
            if (newItem.eqId === item.eqId) {
              this.list2.splice(i, 1)
              break
            }
          }
        }
      }
      if (src === 'right' && target === 'left') {
        this.list2 = this.formCustom.video_data
      }
      this.formCustom.video_data = this.list2
      this.list2Len = this.list2.length
    },
    searchVideo (v) {
      let value = v.trim()
      if (value === '') return
      let params = {
        value
      }
      getVideoById(params).then(result => {
        let data = result.data
        if (data.errno === 10000) {
          let videoResult = data.data.list
          this.videoResult = videoResult
          if (videoResult.length) {
            this.list1 = videoResult
            this.videoError = ''
          } else {
            this.list1 = []
            this.videoError = '未找到相关资源'
          }
        } else {
          this.$Modal.warning({
            title: '获取视频失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    deleteVideo(eqId) {
      for (let i = 0; i < this.list2.length; i++) {
        let video = this.list2[i]
        if (eqId === video.eqId) {
          this.list2.splice(i, 1)
          break
        }
      }
      this.list2Len = this.list2.length
    }
  },
  mounted () {
    this.uploadUrl = 'http://api.scloud.gome.inc/uploadfile'
    let href = location.href
    let hash
    let id
    if (~href.indexOf('project_add')) { // 新建
      this.pageType = 'create'
      this.title = '新建专题'
    } else if (~href.indexOf('project_edit')) { // 编辑
      hash = href.split('#')[1]
      if (hash) {
        id = hash.split('?')[0]
      } else {
        this.toPage('/view/launcher-management/directional_add')
      }
      this.pageType = 'update'
      this.title = '编辑专题'
      let params = {
        id
      }
      getProjectDetail(params).then(result => {
        let data = result.data
        if (data.errno === 10000) {
          this.formCustom.id = data.data.id
          this.formCustom.name = data.data.name
          this.formCustom.description = data.data.description
          this.formCustom.img_url = data.data.img_url
          this.$refs.uploadP.style.display = 'none'
          this.$refs.uploadImg.style.display = ''
          this.list2 = this.formCustom.video_data = data.data.video_data
          this.list2Len = this.list2.length
        } else {
          this.$Modal.warning({
            title: '获取专题详情失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    }
  }
}
</script>
