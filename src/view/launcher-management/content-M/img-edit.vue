<template>
  <div class="img-edit">
    <header class="common-header">
      <h2>编辑</h2>
      <div class="btn">
        <Button type="primary" class="common-margin-left-10" @click="$router.go(-1)">返回</Button>
      </div>
    </header>
    <Form  class="edit-form" ref="addChannelForm" :label-width="84">
      <FormItem label="位置">1</FormItem>
      <FormItem label="推荐位置类型">固定位</FormItem>
      <FormItem label="标题">
        <Input placeholder="请输入..." class="common-input-maxWidth-400" />
      </FormItem>
      <FormItem label="描述">
        <Input placeholder="请输入..." class="common-input-maxWidth-400" />
      </FormItem>
      <FormItem label="跳转类型">
        <Select class="common-input-maxWidth-400">
          <Option value="beijing">无</Option>
          <Option value="beijing">桌面频道</Option>
          <Option value="beijing">爱奇艺</Option>
          <Option value="beijing">第三方应用市场</Option>
          <Option value="beijing">当贝市场</Option>
        </Select>
        <!--联动-->
        <div class="linkage-top-10">
           应用名称：<Input style="width: 200px" />
        </div>
      </FormItem>
      <FormItem label="图片">
        <Upload action="//jsonplaceholder.typicode.com/posts/" :format="['png', 'jpg']">
          <Button icon="ios-cloud-upload-outline" size="small">上传</Button>
        </Upload>
        <div>
          <img src="@/assets/images/talkingdata.png" class="img-occupied" v-if="false">
          <i class="img-occupied" v-else>141*57</i>
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="saveEdit">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'img-edit',
  data () {
    return {}
  },
  methods: {
    saveEdit () {}
  }
}
</script>

<style scoped lang="less">
  .img-edit {
    .edit-form {
      padding: 20px;
      background-color: #fff;
      .img-occupied{
        width: 192px;
        height: 108px;
        background-color: #eee;
        display: inline-block;
        text-align: center;
        line-height: 108px;
        font-style: normal;
      }
      .linkage-top-10{
        padding-top: 10px;
      }
    }
  }

</style>
<style lang="less">
  .img-edit{
    .edit-form .ivu-form-item-label{
      text-align: left;
    }
  }
</style>
