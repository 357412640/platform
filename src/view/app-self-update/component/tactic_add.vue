<template>
  <div class="tactic-add" style="position: relative">
    <Spin fix v-if="loading"></Spin>
    <Form ref="formAdd" :model="formAdd" :rules="ruleValidate" :label-width="80"
          class="form-page-common-top background">
      <FormItem label="生效状态" prop="effect_status">
        <RadioGroup v-model="formAdd.effect_status ">
          <Radio :label="1">生效</Radio>
          <Radio :label="0">失效</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="生效时间" prop="startime">
        <DatePicker type="datetime" placeholder="请选择" style="width: 240px" v-model="formAdd.startime"></DatePicker>
        &nbsp;至&nbsp;
        <DatePicker type="datetime" show-week-numbers placeholder="请选择" style="width: 240px" v-model="formAdd.endtime"></DatePicker>
      </FormItem>
      <FormItem label="下载方式" prop="download_type">
        <RadioGroup v-model="formAdd.download_type ">
          <Radio :label="1">静默下载</Radio>
          <Radio :label="2">非静默下载</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="安装方式" prop="installation">
        <RadioGroup v-model="formAdd.installation ">
          <Radio :label="1">强制安装</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="系统版本区间" prop="sys_version_begin" style="white-space: nowrap" class="common-nowrap">
        <Input v-model.trim="formAdd.sys_version_begin" placeholder="请输入" style="width: 240px"></Input>
        &nbsp;至&nbsp;
        <Input v-model.trim="formAdd.sys_version_end" placeholder="请输入" style="width: 240px"></Input>
        （请填写系统版本名称）
      </FormItem>
      <FormItem label="生效范围" prop="strategy_type">
        <RadioGroup v-model="formAdd.strategy_type" @on-change="changeStrategyType">
          <Radio label="mac">设备ID</Radio>
          <Radio label="model">设备型号</Radio>
          <Radio label="group">设备分组</Radio>
          <Radio label="all">全部</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="内容" :prop="(formAdd.strategy_type === 'model' || formAdd.strategy_type === 'group') ? 'strategy_content' : 'strategy_content_textarea'">
        <Input v-model="formAdd.strategy_content_textarea" type="textarea" :autosize="{minRows: 5,maxRows: 10}"
               style="width: 500px"
               v-if="formAdd.strategy_type === 'mac'"
               placeholder="填写设备MAC，去掉冒号，多个设备以英文逗号分隔..."></Input>
        <div style="width: 500px" v-if="formAdd.strategy_type === 'model'">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <CheckboxGroup v-model="formAdd.strategy_content" @on-change="checkAllGroupChange">
            <Checkbox
              v-for="(item, index) in strategy_content_group"
              :label="item.id"
              :key="index">
              {{item.name}}
            </Checkbox>
          </CheckboxGroup>
        </div>
        <div style="width: 500px" v-if="formAdd.strategy_type === 'group'">
          <div v-for="(item, index) in groupTitle" :key="index">
            <div>
              <Checkbox
              :indeterminate="indeterminateGroup[item]"
              :value="checkAllGroup[item]"
                @click.prevent.native="handleCheckAll(item)">{{item}}全选</Checkbox>
            </div>
            <CheckboxGroup v-model="formAdd.strategy_content" @on-change="checkAllGroupChange" style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                v-for="(val, i) in groupList[item]"
                :label="val.group_id"
                :key="i">
                {{val.group_name}}
              </Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <p v-if="formAdd.strategy_type === 'all'">所有设备</p>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="formAdd.remark" type="textarea" :autosize="{minRows: 5,maxRows: 10}"
               style="width: 500px"
               placeholder="请输入..."></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="cansave()">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { reqStrategyDetail, reqStrategyGroup, requestStrategyEdit } from '@/api/app_updateself'
import { getModelTypeList } from '@/api/device-data'
const formData = {
  id: '',
  effect_status: null,
  startime: '',
  endtime: '',
  strategy_type: 'mac',
  strategy_content: [],
  download_type: 1,
  installation: 1,
  remark: '',
  strategy_content_textarea: '',
  sys_version_begin: '',
  sys_version_end: ''
}
export default {
  name: 'add',
  data () {
    return {
      formAdd: {},
      strategy_content_group: [],
      indeterminate: false,
      checkAll: false,
      ruleValidate: {
        effect_status: [{required: true, message: '请选择生效状态'}],
        startime: [{ required: true, message: '开始时间必填' }],
        download_type: [{ required: true, message: '下载方式不能为空' }],
        installation: [{ required: true, message: '安装方式不能为空' }],
        strategy_type: [{ required: true, message: '请选择策略类型' }],
        strategy_content_textarea: [{required: true, message: '策略内容不能为空'}],
        strategy_content: [{ required: true, message: '策略内容不能为空' }]
      },
      loading: false,
      indeterminateGroup: {},
      checkAllGroup: {},
      groupList: {},
      groupTitle: []
    }
  },
  props: {editId: '', device_type: ''},
  mounted () {
    if (this.editId) {
      this.getDetail()
    } else {
      this.formAdd = JSON.parse(JSON.stringify(formData))
    }
  },
  methods: {
    async getDetail () {
      this.loading = true
      try {
        const res = await reqStrategyDetail({ id: this.editId })
        if (res.errno === 10000) {
          this.formAdd = res.data
          this.formAdd.version_id = this.$route.query.tableid
          this.formAdd.id = this.editId
          // 策略类型为设备ID时，转为字符串
          if (this.formAdd.strategy_type === 'mac') {
            this.formAdd.strategy_content_textarea = this.formAdd.strategy_content.join(',')
          }
          // 时间戳转字符串
          if (this.formAdd.effect_startime) this.formAdd.startime = new Date(this.formAdd.effect_startime * 1000)
          if (this.formAdd.effect_endtime) this.formAdd.endtime = new Date(this.formAdd.effect_endtime * 1000)
          // 按策略类型不同，请求不同接口
          if (this.formAdd.strategy_type === 'model') {
            this.getModelList(true)
          } else if (this.formAdd.strategy_type === 'group') {
            this.getGroupList(true)
          } else if (this.formAdd.strategy_type === 'all') {
            // 范围为全部时候，内容不校验
            this.formAdd.strategy_content_textarea = 'all'
          }
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.formAdd = {}
        this.$Message.error(e)
      } finally {
        this.loading = false
      }
    },
    cansave () {
      this.$refs.formAdd.validate((valid) => {
        if (valid) {
          this.save()
        } else {
          this.$Message.error('请将信息填写完整!')
        }
      })
    },
    async save () {
      // 处理时间&策略内容
      this.formAdd.effect_startime = this.formAdd.startime.valueOf().toString().length === 10 ? this.formAdd.startime.valueOf() : Math.floor(this.formAdd.startime.valueOf() / 1000)
      if (this.formAdd.endtime) {
        this.formAdd.effect_endtime = this.formAdd.endtime.valueOf().toString().length === 10 ? this.formAdd.endtime.valueOf() : Math.floor(this.formAdd.endtime.valueOf() / 1000)
      } else {
        this.formAdd.effect_endtime = ''
      }
      if (this.formAdd.strategy_type === 'mac') {
        this.formAdd.strategy_content = this.formAdd.strategy_content_textarea.split(',')
      } else if (this.formAdd.strategy_type === 'all') {
        delete this.formAdd.strategy_content
      }
      try {
        const {id, version_id, effect_status, effect_startime, effect_endtime, strategy_type, strategy_content, download_type, installation, remark, sys_version_begin, sys_version_end} = this.formAdd
        const newData = {id, version_id, effect_status, effect_startime, effect_endtime, strategy_type, strategy_content, download_type, installation, remark, sys_version_begin, sys_version_end}
        console.log('save', newData)
        if (!newData.version_id) {
          newData.version_id = this.$route.query.tableid
          delete newData.id
        }
        // 校验时间
        if (newData.effect_endtime && (newData.effect_endtime < newData.effect_startime)) {
          this.$Message.error('亲，生效时间的结束时间不能小于开始时间哦~')
          return
        }
        const res = await requestStrategyEdit(newData)
        if (res.errno === 10000) {
          this.$Message.success('保存成功')
          this.$emit('list')
          this.$emit('refreshList')
          this.$emit('cleareditId')
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    changeStrategyType () {
      if (this.formAdd.strategy_content_textarea) this.formAdd.strategy_content_textarea = ''
      this.formAdd.strategy_content = []
      this.formAdd = {...this.formAdd, device_type: this.device_type}
      if (this.formAdd.strategy_type === 'group') this.getGroupList()
      if (this.formAdd.strategy_type === 'model') {
        this.indeterminate = false
        this.checkAll = false
        this.getModelList(true)
      }
      if (this.formAdd.strategy_type === 'all') {
        this.formAdd.strategy_content_textarea = 'all'
        this.$nextTick(() => {
          this.$refs.formAdd.validateField('strategy_content_textarea')
        })
      }
    },
    async getModelList (isinit) {
      try {
        const res = await getModelTypeList({device_type: this.formAdd.device_type === 'Fridge' ? 'FRIDGE' : 'TV'})
        if (res.status === 200 && res.data.errno === 10000) {
          this.strategy_content_group = res.data.data.list
          if (isinit) this.initCheckAll()
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getGroupList (isinit) {
      try {
        this.groupTitle = []
        const res = await reqStrategyGroup({device_type: this.formAdd.device_type === 'Fridge' ? 'FRIDGE' : 'TV'})
        if (res.errno === 10000) {
          this.groupList = res.data.list
          this.groupTitle = Object.keys(this.groupList)
          // 初始化为全选赋初值
          this.groupTitle.forEach(item => {
            this.indeterminateGroup[item] = false
            this.checkAllGroup[item] = false
          })
          if (isinit) this.initCheckAll()
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    handleCheckAll (item) {
      if (this.formAdd.strategy_type === 'model') {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
          this.formAdd.strategy_content = JSON.parse(JSON.stringify(this.filterGroup(this.strategy_content_group, 'model')))
        } else {
          this.formAdd.strategy_content = []
        }
      } else if (this.formAdd.strategy_type === 'group') {
        if (this.indeterminateGroup[item]) {
          this.checkAllGroup[item] = false
        } else {
          this.checkAllGroup[item] = !this.checkAllGroup[item]
        }
        this.indeterminateGroup[item] = false

        if (this.checkAllGroup[item]) {
          this.formAdd.strategy_content.push(...this.filterGroup(this.groupList[item], 'group').concat())
        } else {
          // 找到组内元素，逐个删除
          this.filterGroup(this.groupList[item], 'group').forEach(val => {
            const index = this.formAdd.strategy_content.indexOf(val)
            if (index !== -1) {
              this.formAdd.strategy_content.splice(index, 1)
            }
          })
        }
      }
      // 手动触发校验
      this.$nextTick(() => {
        this.$refs.formAdd.validateField('strategy_content')
      })
    },
    checkAllGroupChange (data) {
      if (this.formAdd.strategy_type === 'model') {
        if (data.length === this.strategy_content_group.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
      } else if (this.formAdd.strategy_type === 'group') {
        this.groupTitle.forEach(item => {
          if (this.hasCheckAll(item) === 'all') {
            this.indeterminateGroup[item] = false
            this.checkAllGroup[item] = true
          } else if (this.hasCheckAll(item) > 0) {
            this.indeterminateGroup[item] = true
            this.checkAllGroup[item] = false
          } else {
            this.indeterminateGroup[item] = false
            this.checkAllGroup[item] = false
          }
        })
      }
    },
    initCheckAll () {
      switch (this.formAdd.strategy_type) {
        case 'model':
          if (this.formAdd.strategy_content.length === this.strategy_content_group.length) {
            this.indeterminate = false
            this.checkAll = true
          } else if (this.formAdd.strategy_content.length > 0) {
            this.indeterminate = true
            this.checkAll = false
          } else {
            this.indeterminate = false
            this.checkAll = false
          }
          break
        case 'group':
          this.groupTitle.forEach(item => {
            if (this.hasCheckAll(item) === 'all') {
              this.indeterminateGroup[item] = false
              this.checkAllGroup[item] = true
            } else if (this.hasCheckAll(item) > 0) {
              this.indeterminateGroup[item] = true
              this.checkAllGroup[item] = false
            } else {
              this.indeterminateGroup[item] = false
              this.checkAllGroup[item] = false
            }
          })
          break
      }
    },
    filterGroup (list, type) {
      const newList = []
      if (type === 'model') {
        list.forEach(item => {
          newList.push(item.id)
        })
      } else {
        list.forEach(item => {
          newList.push(item.group_id)
        })
      }
      return newList
    },
    hasCheckAll (item) {
      let count = 0
      this.groupList[item].forEach(val => {
        if (this.formAdd.strategy_content.includes(val.group_id)) {
          count ++
        }
      })
      if (count === this.groupList[item].length) {
        return 'all'
      } else {
        return count
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .tactic-add {
    margin-top: 15px;
    .background {
      padding: 20px 450px 10px 10px;
      background-color: #fff;
    }

    .left-width {
      width: 327px;
    }

    .input-width {
      width: 300px;
    }
    .input-width-right{
      width: 380px;
    }

    .right-margin {
      width: 313px;
      margin-left: 50px;
    }

    .item-padding {
      padding: 0px 0 20px 0;
    }
    .err{
      color: red;
    }
  }

</style>
