<template>
  <div class="packet-add">
    <div class="title-box">
      <span class="left">{{ title }}</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/domain-management/packet_domain')">返回</Button>
    </div>
    <div>
      <Form :model="formCustom" :label-width="60">
        <FormItem label="分组:" style="width: 360px">
          <Select v-model="formCustom.device_gp_id" filterable :disabled= disabled>
            <Option v-for="item in packetList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="域名:">
          <Form :model="formCustom">
            <div class="form-title">
              <span class="form-name fl">资源名称</span>
              <span class="form-ide fl">资源标识</span>
              <span class="form-domain fl">域名内容</span>
            </div>
            <FormItem v-for="(item, index) in formCustom.domain_group">
              <div :class="{on:index%2===0,off:index%2!==0}">
                <span class="form-name">
                {{ item.name }}
                </span>
                <span class="form-ide">
                {{ item.identification }}
                </span>
                <span class="form-domain">
                  <Input type="text" v-model="item.url" style="width: 400px"></Input>
                </span>
              </div>
            </FormItem>
          </Form>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit" style="margin-right: 30px">保存</Button>
          <Button @click="cancelSubmit">取消</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import './index.less'
import { createDomain, updateDomain, getDomainDetail, getDeviceGroup } from '@/api/domain-data'
export default {
  name: 'packet-add',
  data () {
    return {
      loading: false,
      type: '',
      title: '',
      disabled: false,
      formCustom: {
        id: '',
        device_gp_id: '',
        domain_group: []
      },
      pageInfo: {},
      packetList: []
    }
  },
  methods: {
    toPage (page) {
      this.$router.push({
        path: page
      })
    },
    cancelSubmit () {
      this.toPage('/view/domain-management/packet_domain')
    },
    handleSubmit () {
      let type = this.type
      let data = this.formCustom
      if (type === 'packet_add') {
        if (data.id && data.id !== 0) {
          createDomain(data).then(res => {
            const data = res.data
            if (data.errno === 10000) {
              this.$Message.success('保存成功')
              this.toPage('/view/domain-management/packet_domain')
            } else {
              this.$Modal.warning({
                title: '保存失败',
                content: `原因：${data.errmsg}`
              })
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          this.$Modal.warning({
            title: '保存失败',
            content: `原因：分组不能为空`
          })
        }
      } else {
        updateDomain(data).then(res => {
          const data = res.data
          if (data.errno === 10000) {
            this.$Message.success('更新成功')
            this.toPage('/view/domain-management/packet_domain')
          } else {
            this.$Modal.warning({
              title: '更新失败',
              content: `原因：${data.errmsg}`
            })
          }
        }).catch(err => {
          console.error(err)
        })
      }
    }
  },
  created () {
    let href = location.href
    let hash
    let id
    let vm = this
    if (~href.indexOf('packet_edit')) {
      this.type = 'packet_edit'
      hash = href.split('#')[1]
      if (hash) {
        id = hash.split('?')[0]
        this.formCustom.id = id
        this.disabled = true
        this.title = '编辑'
      } else {
        this.toPage('/view/domain-management/packet_add')
      }
    } else {
      this.type = 'packet_add'
      this.disabled = false
    }
    Promise.all([getDomainDetail(id), getDeviceGroup()]).then(function (results) {
      let domainDetailData = results[0].data
      let deviceGroupData = results[1].data
      if (domainDetailData.errno === 10000) {
        vm.formCustom.domain_group = domainDetailData.data.list
      } else {
        vm.$Modal.warning({
          title: '获取失败',
          content: domainDetailData.errmsg
        })
      }
      if (deviceGroupData.errno === 10000) {
        vm.packetList = deviceGroupData.data.list
        vm.$nextTick(() => {
          vm.formCustom.device_gp_id = domainDetailData.data.device_gp_id
        })
      } else {
        vm.$Modal.warning({
          title: '获取失败',
          content: deviceGroupData.errmsg
        })
      }
    }).catch(err => {
      console.error(err)
    })
  }
}
</script>
<style type="less" scoped>
  .on{
    background-color: #fff;
    border-bottom: 1px solid #e8eaec;
  }
  .off{
    background-color: #f8f8f9;
    border-bottom: 1px solid #e8eaec;
  }
</style>
