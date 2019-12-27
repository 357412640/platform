<template>
  <div class="forbid-box">
    <p class="title">欢迎使用GOME TV管理系统</p>
    <p class="worn">您的账号未开通权限或已禁止，与管理员联系</p>
    <p class="line"></p>
    <div class="route-box">
      <p class="route-title">网站地图</p>
      <div class="route-list" v-for="item in routerList" :key="item.name" v-if="!item.meta.hideInMenu">
        <p class="route-list-title">{{ item.meta.title }}</p>
        <ul class="route-ul" v-if="item.children.length">
          <li class="route-li" v-for="li in item.children" :key="li.name" v-if="!li.meta.hideInMenu">
            <p>
              {{ li.meta.title }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'forbid',
  data () {
    return {
      routerList: this.$router.options.routes
    }
  }
}
</script>

<style lang="less" scoped>
  .forbid-box {
    .title {
      font-size: 40px;
      font-weight: 700;
      margin-top: 50px;
      text-align: center;
    }
    .worn {
      font-size: 14px;
      text-align: center;
      margin-top: 40px;
      padding-bottom: 50px;
      color: #ed4014;
    }
    .line {
      height: 1px;
      background-color: #515a6e;
      margin: 0 20px;
    }
    .route-box {
      margin: 20px 0 0 50px;
      overflow: hidden;
      .route-title {
        font-size: 30px;
        font-weight: 700;
      }
      .route-list {
        float: left;
        margin-right: 80px;
        .route-list-title{
          font-size: 20px;
          margin: 20px 0 15px;
        }
        .route-ul {
          display: inline-block;
          list-style: none;
          .route-li {
            border-left: 1px solid #515a6e;
            padding: 6px 10px;
            font-size: 16px;
            margin-left: 10px;
          }
        }
      }
    }
  }
</style>
