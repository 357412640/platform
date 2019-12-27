<template>
  <div class="form-add">
    <header class="common-header">
      <h2>新建表单</h2>
      <Button type="primary" @click="$router.push({ path: 'form_management' })">返回</Button>
    </header>
    <Form ref="formAdd" :model="formAdd" :rules="ruleValidate" :label-width="80"
          class="form-page-common-top background">
      <div class="common-form-inline left-width">
        <FormItem label="表单名称" prop="tablename">
          <Input v-model.trim="formAdd.tablename" placeholder="请输入表单名称"></Input>
        </FormItem>
      </div>
      <div class="common-form-inline right-margin">
        <FormItem label="表单标识" prop="tablecode">
          <Input v-model="formAdd.tablecode" placeholder="请输入字母数字下划线"></Input>
        </FormItem>
      </div>
      <FormItem label="表单结构" class="ivu-self-required">
        <div class="common-form-inline input-width">
          <FormItem
            v-for="(item, index) in formAdd.columns"
            v-if="item.status"
            :key="index"
            :label="'字段名称'"
            class="item-padding"
            :prop="'columns.' + index + '.columnname'"
            :rules="{ validator: (rule, value, callback) => {checkFun(rule, value, callback)}, trigger: 'blur'}">
            <Row>
              <Col span="18">
                <Input type="text" v-model="item.columnname" placeholder="请输入字段名称"></Input>
              </Col>
            </Row>
          </FormItem>
        </div>
        <div class="common-form-inline input-width-right">
          <FormItem
            v-for="(item, index) in formAdd.columns"
            v-if="item.status"
            :key="index + 'flag'"
            :label="'字段标识 '"
            :prop="'columns.' + index + '.columncode'"
            class="item-padding"
            :rules="{ validator: (rule, value, callback) => {checkFunFlag(rule, value, callback)}, trigger: 'blur'}">
            <Row>
              <Col span="13">
                <Input type="text" v-model="item.columncode" placeholder="请输入字母数字下划线"></Input>
              </Col>
              <Col span="6" offset="1">
                <Button @click="handleRemove(index)" :disabled="!canDelete">删除</Button>
              </Col>
              <Col span="1" offset="1">
                <a v-if="item.index !== 1" @click="handlePrev(item.index)"><Icon type="md-arrow-round-up" /></a>
              </Col>
              <Col span="1" offset="1">
                <a v-if="item.index !== visibleLen" @click="handleNext(item.index)"><Icon type="md-arrow-round-down" /></a>
              </Col>
            </Row>
          </FormItem>
        </div>
        <FormItem style="display: block">
          <Row>
            <Col span="12">
              <Button type="dashed" size="small" @click="handleAdd" icon="md-add">增加</Button>
            </Col>
          </Row>
        </FormItem>
      </FormItem>
      <FormItem label="设备范围" prop="issetrange">
        <RadioGroup v-model="formAdd.issetrange ">
          <Radio label="0">关</Radio>
          <Radio label="1">开</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="表单描述" prop="description">
        <Input v-model="formAdd.description" type="textarea" :autosize="{minRows: 5,maxRows: 10}" style="width: 650px"
               placeholder="请输入..."></Input>
      </FormItem>
      <FormItem>
        <p :class="['err', {'common-hidden': !error}]">请检查字段名称或字段标识，不能有重复值哦~</p>
        <Button type="primary" @click="handleSubmit('formAdd')">保存</Button>
        <Button type="primary" @click="$router.push({ path: 'form_management' })" class="button-common-cancel">取消
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { addForm, updateForm, getDetail } from '@/api/basedataManagement'

export default {
  name: 'form-add',
  data () {
    const validateTablecode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('表单标识不能为空'))
      } else if (!/^\w+$/.test(value)) {
        callback(new Error('表单标识只能输入字母、数字、下划线'))
      } else {
        callback()
      }
    }
    return {
      formAdd: {
        tablecode: '',
        tablename: '',
        issetrange: '0',
        description: '',
        columns: [
          {
            columnname: '',
            columncode: '',
            index: 1,
            status: 1
          }
        ]
      },
      error: false,
      canDelete: false,
      index: 1, // 记录增加个数
      ruleValidate: {
        // tablecode: [{ required: true, message: '表单标识不能为空', trigger: 'blur' }],
        tablecode: [{ validator: validateTablecode, trigger: 'blur' }],
        tablename: [{ required: true, message: '表单名称不能为空', trigger: 'blur' }],
        issetrange: [{ required: true, message: '请选择设备范围', trigger: 'change' }],
        description: [{ required: true, message: '表单描述不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'formAdd.columns': {
      handler: function (val, oldVal) {
        this.canDelete = false
        let len = 0
        // 保存数据时，格式变成字符串
        if (typeof val !== 'string') {
          val.forEach(item => {
            if (item.status === 1) {
              len++
            }
          })
          if (len > 1) this.canDelete = true
        }
      },
      deep: true
    }
  },
  computed: {
    visibleLen: function () {
      let len = 0
      this.formAdd.columns.forEach(s => {
        if (s.status === 1) {
          len++
        }
      })
      return len
    }
  },
  created () {
    if (this.$route.params.update) {
      this.getRemoteForm()
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 判断是否有重复字段
          if (this.checkDouble()) {
            this.error = true
          } else {
            if (this.$route.params.update) {
              this.saveEdit()
            } else {
              this.saveAdd()
            }
          }
        } else {
          this.$Message.error('请将信息填写完整!')
        }
      })
    },
    async saveAdd () {
      let newData = JSON.parse(JSON.stringify(this.formAdd))
      newData.columns.forEach(s => {
        delete s.status
        delete s.index
      })
      newData.columns = JSON.stringify(newData.columns)
      try {
        const res = await addForm(newData)
        if (res.errno === 10000) {
          this.$Message.success('表单创建成功！')
          this.$router.push('form_management')
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async saveEdit () {
      let newData = JSON.parse(JSON.stringify(this.formAdd))
      newData.columns.forEach(s => {
        delete s.status
        delete s.index
      })
      newData.columns = JSON.stringify(newData.columns)
      try {
        const res = await updateForm(newData)
        if (res.errno === 10000) {
          this.$Message.success('表单添加成功！')
          this.$router.go(-1)
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getRemoteForm () {
      this.formAdd.id = this.$route.params.formId
      try {
        const res = await getDetail(this.formAdd)
        if (res.errno === 10000) {
          res.data.columns.forEach((item, index) => {
            item.status = 1
            item.index = index + 1
            // delete item.id
          })
          this.index = res.data.columns.length
          this.formAdd = res.data
          this.formAdd.issetrange = String(res.data.issetrange)
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    checkFun (rule, value, callback) {
      this.error = false
      if (!value) {
        callback(new Error('字段名称不能为空'))
      } else {
        callback()
      }
    },
    checkFunFlag (rule, value, callback) {
      this.error = false
      if (!value) {
        callback(new Error('字段标识不能为空'))
      } else if (!/^\w+$/.test(value)) {
        callback(new Error('字段标识只能输入字母、数字、下划线'))
      } else {
        callback()
      }
    },
    handlePrev (flag) {
      let exchange = null
      // 记录可交换的index
      for (let i = flag - 2; i >= 0; i--) {
        if (this.formAdd.columns[i].status === 1) {
          exchange = this.formAdd.columns[i].index
          break
        }
      }
      console.log('替换值', exchange, flag)
      // 交换index
      this.formAdd.columns.forEach(s => {
        if (s.index === flag) {
          s.index = exchange
        } else if (s.index === exchange) {
          s.index = flag
        }
      })
      // 记录元素在数组中位置
      this.formAdd.columns.forEach((s, index) => {
        if (s.index === flag) flag = index
        if (s.index === exchange) exchange = index
      })
      // // 交换元素位置
      this.formAdd.columns.splice(flag, 1, ...this.formAdd.columns.splice(exchange, 1, this.formAdd.columns[flag]))
      console.log('交换位置后', this.formAdd.columns)
    },
    handleNext (flag) {
      let exchange = null
      // 记录可交换的index
      for (let i = flag; i <= this.formAdd.columns.length; i++) {
        if (this.formAdd.columns[i].status === 1) {
          exchange = this.formAdd.columns[i].index
          break
        }
      }
      console.log('替换值', exchange, flag)
      // 交换index
      this.formAdd.columns.forEach(s => {
        if (s.index === flag) {
          s.index = exchange
        } else if (s.index === exchange) {
          s.index = flag
        }
      })
      // 记录元素在数组中位置
      this.formAdd.columns.forEach((s, index) => {
        if (s.index === flag) flag = index
        if (s.index === exchange) exchange = index
      })
      // // 交换元素位置
      this.formAdd.columns.splice(flag, 1, ...this.formAdd.columns.splice(exchange, 1, this.formAdd.columns[flag]))
      console.log('交换位置后', this.formAdd.columns)
    },
    handleAdd () {
      this.index++
      this.formAdd.columns.push({
        columnname: '',
        columncode: '',
        index: this.index,
        status: 1
      })
    },
    handleRemove (index) {
      this.formAdd.columns[index].status = 0
    },
    checkDouble () {
      const flag = this.formAdd.columns.some(val => {
        let checkNameLen = 0
        let checkCodeLen = 0
        this.formAdd.columns.forEach(s => {
          if (s.columnname === val.columnname) checkNameLen++
          if (s.columncode === val.columncode) checkCodeLen++
        })
        if (checkNameLen > 1) {
          return '请不要输入重复字段名称！'
        } else if (checkCodeLen > 1) {
          return '请不要输入重复字段标识！'
        }
      })
      return flag
    }
  }
}
</script>
<style lang="less" scoped>
  .form-add {
    .background {
      padding: 20px 0px 10px 10px;
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
