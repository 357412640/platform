<template>
  <div class="count-style">
    <p>欢迎使用GOME TV管理系统</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      platformName: ''
    }
  },
  methods: {
    ...mapGetters([
      'getPlatformName'
    ])
  },
  mounted () {
    //
  },
  created () {
    this.platformName = this.getPlatformName()
  }
}
</script>

<style lang="less" scoped>
.count-style{
  font-size: 40px;
  height: 50px;
  line-height: 50px;
  position: relative;
  top: 50%;
  margin-top: -50px;
  text-align: center;
}
</style>
