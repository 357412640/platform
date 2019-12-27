<template>
  <!--上传文件列表-->
  <div class="upload-files" v-show="filesListShow">
    <div class="title">
      <span class="left">上传列表</span>
      <div class="right">
        <Button type="primary" class="right" icon="md-remove" v-show=isShow @click="fold">
        </Button>
        <Button type="primary" class="right" icon="md-square-outline" v-show=!isShow @click="unfold">
        </Button>
      </div>
    </div>
    <ul class="upload-list" v-show="isShow">
      <li class="li" v-for="file in fileList">
        <span class="left" :title="file.name">{{ file.name }}</span>
        <span class="right" v-html="file.status"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import './index.less'
export default {
  name: 'upload-files',
  data () {
    return {
      isShow: true,
      fileList: []
    }
  },
  methods: {
    fold () {
      this.isShow = false
    },
    unfold () {
      this.isShow = true
    },
    getFileList () {
      this.fileList = []
      this.$nextTick(() => {
        this.fileList = this.$store.state.app.filesList
      })
    }
  },
  computed: {
    filesListShow () {
      return this.$store.state.app.filesListShow
    }
  },
  watch: {
    '$store.state.app.filesIndex': function () {
      this.getFileList()
    },
    '$store.state.app.filesList': function () {
      this.getFileList()
    }
  }
}
</script>
