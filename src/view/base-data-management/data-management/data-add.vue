<template>
    <div class="data-add">
      <div class="input-base-style common-flex" v-for="(item, index) in searchCondition" :key="index">
        <label class="layout-flex-vertical label"><span>{{item.columnname}}</span><span>{{'(' + item.columncode + ')'}}</span></label>
        <Input v-model.trim="params[item.columncode]"/>
      </div>
      <div class="save-btn">
        <p :class="['err', {'common-hidden': !error}]">尚未添加数据，不能保存哦~</p>
        <Button type="primary" @click="saveData()" class="btn-long">保存</Button>
      </div>
    </div>
</template>

<script>
import { addData, updateData, getDataDetail } from '@/api/basedataManagement'
export default {
  name: 'data-add',
  data () {
    return {
      params: {
        tableid: this.$route.query.tableid
      },
      error: false
      // detail: {}
    }
  },
  props: {
    searchCondition: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  created () {
    if (this.$route.query.update) {
      this.getRemoteForm()
    }
  },
  methods: {
    saveData () {
      // 不为空保存，为空提示
      if (notEmpty(this.params)) {
        this.error = false
        if (this.$route.query.update) {
          this.saveEdit()
        } else {
          this.saveAdd()
        }
      } else {
        this.error = true
      }
    },
    async saveAdd () {
      try {
        const res = await addData(this.params)
        if (res.errno === 10000) {
          this.$Message.success('数据创建成功！')
          // this.$router.push('data_management')
          this.$router.go(-1)
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async saveEdit () {
      try {
        const res = await updateData(this.params)
        if (res.errno === 10000) {
          this.$Message.success('数据创建成功！')
          this.$router.go(-1)
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getRemoteForm () {
      this.params.dataid = this.$route.query.dataId
      try {
        const res = await getDataDetail(this.params)
        if (res.errno === 10000) {
          this.params = res.data
          this.params.dataid = this.$route.query.dataId
          this.params.tableid = this.$route.query.tableid
        } else {
          throw (res.errmsg)
        }
      } catch (e) {
        this.$Message.error(e)
      }
    }
  }
}
// 判断对象属性是否为空
function notEmpty (obj) {
  let newObj = Object.assign({}, obj)
  delete newObj.tableid
  for (let key in newObj) {
    return obj[key] !== ''
  }
}
</script>

<style scoped lang="less">
.data-add{
  /*background-color: #fff;*/
  max-width:900px;
  padding: 10px;
  .label{
    width: 150px;
  }
  .save-btn{
    padding-top: 20px;
    text-align: center;
    .err{
      color: red;
    }
  }
  .btn-long {
    padding: 5px 25px;
  }
}
</style>
