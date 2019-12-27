<template>
  <div class="add-channel">
    <header class="common-header">
      <h2>新建/编辑页面</h2>
      <div class="btn">
        <Button type="primary" class="common-margin-left-10" @click="$emit('goback')">返回</Button>
      </div>
    </header>
    <Form :model="channelData" :label-width="80" class="add-channel-form" :rules="ruleValidate" ref="addChannelForm">
      <FormItem label="页面名称" prop="pageName" class="ivu-self-required">
        <Input v-model.trim="channelData.pageName" placeholder="请输入..." class="common-input-maxWidth-400"></Input>
      </FormItem>
      <FormItem label="页面描述">
        <Input v-model="channelData.pageDescription" placeholder="请输入..." class="common-input-maxWidth-400"></Input>
      </FormItem>
      <FormItem label="默认频道" prop="isDefault">
        <RadioGroup v-model="channelData.isDefault">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="默认状态" prop="channelStatus">
        <RadioGroup v-model="channelData.channelStatus">
          <Radio :label="1">上线</Radio>
          <Radio :label="0">下线</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="懒加载" prop="lazyLoad">
        <RadioGroup v-model="channelData.lazyLoad" @on-change="changeLazy">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <div v-if="channelData.lazyLoad === 1">
        <FormItem label="推荐规则" prop="lazyloadingdata.recommendRulesId"
                  :rules="{ required: true, message: '请选择推荐规则', trigger: 'change' }">
          <Select style="width: 220px" v-model="channelData.lazyloadingdata.recommendRulesId" filterable>
            <Option v-for="(item, index) in ruleList" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="排序方式" prop="lazyloadingdata.sort"
                  :rules="{ required: true, message: '请选择排序方式', trigger: 'change' }">
          按
          <Select style="width: 205px" v-model="channelData.lazyloadingdata.sort">
            <Option value="hot">热度</Option>
            <Option value="putawayTime">上架时间</Option>
            <Option value="releaseTime">上映时间</Option>
            <Option value="score">评分</Option>
          </Select>
          &nbsp;排序
          &nbsp;&nbsp;&nbsp;
          <Checkbox v-model="channelData.lazyloadingdata.vipPriority">VIP资源优先</Checkbox>
        </FormItem>
      </div>
      <FormItem label="tab图(无焦点)" :label-width="90">
        <Upload :action="uploadUrl + '/uploadFdfs'" :format="['png', 'jpg']" name="uploadfile"
                :on-success="uploadOutFocus" :show-upload-list="false" :on-format-error="formatError">
          <Button icon="ios-cloud-upload-outline" size="small" disabled>上传</Button>
        </Upload>
        <div>
          <img :src="channelData.tabImg" class="img-occupied-tab" v-if="channelData.tabImg">
          <i class="img-occupied-tab" v-else>141*57</i>
          <Button size="small" class="common-margin-left-10" type="error" ghost @click="deleteImg('tabImg')">删除</Button>
        </div>
      </FormItem>
      <FormItem label="tab图(有焦点)" :label-width="90">
        <Upload :action="uploadUrl + '/uploadFdfs'" :format="['png', 'jpg']" name="uploadfile"
                :on-success="uploadOnfocus" :show-upload-list="false" :on-format-error="formatError">
          <Button icon="ios-cloud-upload-outline" size="small" disabled>上传</Button>
        </Upload>
        <div>
          <img :src="channelData.tabFocusImg" class="img-occupied-tab" v-if="channelData.tabFocusImg">
          <i class="img-occupied-tab" v-else>141*57</i>
          <Button size="small" class="common-margin-left-10" type="error" ghost @click="deleteImg('tabFocusImg')">删除
          </Button>
        </div>
      </FormItem>
      <FormItem label="背景图">
        <Upload :action="uploadUrl + '/uploadFdfs'" :format="['png', 'jpg']" name="uploadfile" :on-success="uploadBag"
                :show-upload-list="false" :on-format-error="formatError">
          <Button icon="ios-cloud-upload-outline" size="small">上传</Button>
        </Upload>
        <div>
          <img :src="channelData.background" alt="" class="img-occupied-bg" v-if="channelData.background">
          <i class="img-occupied-bg" v-else>1920*1080</i>
          <Button size="small" class="common-margin-left-10" type="error" ghost @click="deleteImg('background')">删除
          </Button>
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="saveItem">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { httpChannelEdit, httpRuleList } from '@/api/launcher'
import {deepcopy} from '../../../libs/deepcopy'

export default {
  name: 'content_management',
  props: {
    channelData: {
      type: Object,
      default: function () {
        return {
          isDefault: 0,
          channelStatus: 1,
          lazyLoad: 0,
          lazyloadingdata: {
            recommendRulesId: '',
            sort: '',
            vipPriority: ''
          }
        }
      }
    },
    tabsName: {
      type: Array,
      default: function () {
        return []
      }
    },
    isChannelAdd: ''
  },
  computed: {
    tabsNameArr: function () {
      return this.tabsName.reduce((accu, cur) => accu.concat(cur.name), [])
    }
  },
  mounted () {
    // 初始化页面时，记录当前页面名称，以便验证重复时排除
    this.curPageName = this.channelData.pageName
  },
  data () {
    const checkPageName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('页面名称不能为空'))
      } else if (this.curPageName !== this.channelData.pageName && this.tabsNameArr.indexOf(value) !== -1) {
        callback(new Error('页面名称重复，请重新填写！'))
      } else {
        callback()
      }
    }
    return {
      curPageName: '',
      ruleList: [],
      ruleValidate: {
        pageName: [{ validator: checkPageName }],
        isDefault: [{ required: true }],
        channelStatus: [{ required: true }]
        // channelSort: [ { required: true, message: '频道排序不能为空！', trigger: 'blur' },
        //   { pattern: /^[0-9]*$/, type: 'string', message: '只能输入数字哦！', trigger: 'blur' }]
      },
      uploadUrl: ''
    }
  },
  created () {
    this.uploadUrl = 'http://api.scloud.gome.inc/uploadfile'
    this.getRecommendRulesList()
  },
  methods: {
    changeLazy () {
      this.$emit('channelDataChange')
      this.channelData.lazyloadingdata.recommendRulesId = this.channelData.lazyloadingdata.sort = this.channelData.lazyloadingdata.vipPriority = ''
    },
    async getRecommendRulesList () {
      try {
        const res = await httpRuleList({ page_size: 100000, source: 'qiyi' })
        if (res.errno === 10000) {
          this.ruleList = res.data.list
        } else {
          throw res.errmsg
        }
      } catch (e) {
        console.log(e)
        this.$Message.error(e || '推荐规则列表加载出错~')
      }
    },
    uploadBag (response, file, fileList) {
      if (response.errno === 10000) {
        this.channelData.background = response.data.fileUrl
      } else {
        this.$Message.error(response.errmsg)
      }
    },
    uploadOnfocus (response, file, fileList) {
      if (response.errno === 10000) {
        this.channelData.tabFocusImg = response.data.fileUrl
      } else {
        this.$Message.error(response.errmsg)
      }
    },
    uploadOutFocus (response, file, fileList) {
      if (response.errno === 10000) {
        this.channelData.tabImg = response.data.fileUrl
      } else {
        this.$Message.error(response.errmsg)
      }
    },
    deleteImg (flag) {
      this.channelData[flag] = ''
    },
    saveItem () {
      this.$refs.addChannelForm.validate(async (valid) => {
        if (valid) {
          try {
            this.channelData.lazyloading = this.channelData.lazyLoad
            const data = deepcopy(this.channelData)
            data.lazyloadingdata = JSON.stringify(this.channelData.lazyloadingdata)
            this.isChannelAdd && delete data.pageId
            delete data.lazyLoad
            const res = await httpChannelEdit(data)
            if (res.errno === 10000) {
              this.$Message.success('保存成功!')
              this.$emit('logId', res.data.pageId)
              this.$emit('goback')
              this.$emit('refreshList')
              // this.channelData = {}
            } else {
              throw res.errmsg
            }
          } catch (e) {
            this.$Message.error(e)
          }
        } else {
          this.$Message.error('请按规则填写表单！')
        }
      })
    },
    formatError () {
      this.$Message.error('目前只支持\'jpg\'和\'png\'格式')
    }
  }
}
</script>

<style scoped lang="less">
  .add-channel {
    .add-channel-form {
      /*max-width: 900px;*/
      padding: 20px;
      background-color: #fff;

      .img-occupied-tab {
        width: 141px;
        height: 57px;
        background-color: #eee;
        display: inline-block;
        text-align: center;
        line-height: 57px;
        font-style: normal;
      }

      .img-occupied-bg {
        width: 192px;
        height: 108px;
        background-color: #eee;
        display: inline-block;
        text-align: center;
        line-height: 108px;
        font-style: normal;
      }
    }
  }

</style>
