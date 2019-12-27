<!-- 视频详情 -->
<template>
  <div class="video-detail">
    <div class="title-box">
      <span class="left">视频：{{ title }}</span>
      <Button type="primary" style="float: right;" @click="toPage('/view/media_assets/video_list')">返回</Button>
    </div>
    <div class="info-box">
      <div class="media-status">
        <p class="info-title">媒资状态</p>
        <ul :class="{ ul:true, border:true, isClose:mediaStatusClose }" ref="mediaStatus">
          <li class="left">
            <p class="mb10">
              <span class="w30">媒资ID</span>
              <span class="w70">{{ media_status._id }}</span>
            </p>
            <p class="mb10">
              <span class="w30">上架状态</span>
              <span v-if="media_status.isOnline === 1" class="w70">
                上架
              </span>
              <span v-else class="w70">
                下架
              </span>
            </p>
          </li>
          <li class="right">
            <p class="mb10">
              <span class="w30">来源</span>
              <span class="w70">{{ media_status.source_name }}</span>
            </p>
            <Button v-if="mediaStatusClose" type="primary" ghost class="open-btn" @click="turnOpen('mediaStatusClose')">展开</Button>
            <Button v-else type="primary" ghost class="open-btn" @click="turnOpen('mediaStatusClose')">收起</Button>
          </li>
        </ul>
      </div>
      <div class="basic-info">
        <p class="info-title">基本信息</p>
        <ul :class="{ ul:true, border:true, isClose:basicInfoClose }" ref="basicInfo">
          <li class="left">
            <p class="mb10">
              <span class="w30">来源视频ID</span>
              <span class="w70">{{ basic_info.source_ep_id }}</span>
            </p>
            <p class="mb10">
              <span class="w30">所属频道</span>
              <span class="w70">{{ basic_info.cname }}</span>
            </p>
            <p class="mb10">
              <span class="w30">所属专辑</span>
              <span class="w70">{{ basic_info.name }}</span>
            </p>
            <p class="mb10">
              <span class="w30">来源专辑ID</span>
              <span class="w70">{{ basic_info.source_chn_id }}</span>
            </p>
            <p class="mb10">
              <span class="w30">视频时长</span>
              <span class="w70">{{ basic_info.eq_len }}</span>
            </p>
            <p class="mb10">
              <span class="w30">内容类型</span>
              <span class="w70">{{ basic_info.content_type_name }}</span>
            </p>
            <p class="mb10">
              <span class="w30">上架日期</span>
              <span class="w70">{{ basic_info.init_issue_time }}</span>
            </p>
          </li>
          <li class="right">
            <p class="mb10">
              <span class="w30">集/期数</span>
              <span class="w70">{{ basic_info.epOrder }}</span>
            </p>
            <p class="mb10">
              <span class="w30">上映日期</span>
              <span class="w70">{{ basic_info.time }}</span>
            </p>
            <p class="mb10">
              <span class="w30">主演</span>
              <span class="w70">{{ basic_info.main_actor }}</span>
            </p>
            <p class="mb10">
              <span class="w30">导演</span>
              <span class="w70">{{ basic_info.director }}</span>
            </p>
            <p class="mb10">
              <span class="w30">国家地区</span>
              <span class="w70">{{ basic_info.country }}</span>
            </p>
            <p class="mb10">
              <span class="w30">语言</span>
              <span class="w70">{{ basic_info.language }}</span>
            </p>
            <Button v-if="basicInfoClose" type="primary" ghost class="open-btn" @click="turnOpen('basicInfoClose')">展开</Button>
            <Button v-else type="primary" ghost class="open-btn" @click="turnOpen('basicInfoClose')">收起</Button>
          </li>
        </ul>
      </div>
      <div class="operation-info">
        <p class="info-title">运营信息</p>
        <ul :class="{ ul:true, border:true, isClose:operationInfoClose }" ref="operationInfo">
          <li class="left">
            <p class="mb10">
              <span class="w30">来源上架状态</span>
              <span v-if="operation_info.effective === 1" class="w70">
                上架
              </span>
              <span v-else class="w70">
                下架
              </span>
            </p>
            <p class="mb10">
              <span class="w30">评分</span>
              <span class="w70">{{ operation_info.score }}</span>
            </p>
            <p class="mb10">
              <span class="w30">标签</span>
              <span class="w70">{{ operation_info.tag_names }}</span>
            </p>
            <p class="mb10">
              <span class="w30">是否VIP</span>
              <span v-if="operation_info.is_vip === 1" class="w70">
                是
              </span>
              <span v-else class="w70">
                否
              </span>
            </p>
            <p class="mb10">
              <span class="w30">是否点播券</span>
              <span v-if="operation_info.is_coupon === 1" class="w70">
                是
              </span>
              <span v-else class="w70">
                否
              </span>
            </p>
          </li>
          <li class="right">
            <p class="mb10">
              <span class="w30">热度值</span>
              <span class="w70">{{ operation_info.hot }}</span>
            </p>
            <p class="mb10">
              <span class="w30">描述</span>
              <span class="w70">{{ operation_info.desc }}</span>
            </p>
            <p class="mb10">
              <span class="w30">是否独播</span>
              <span v-if="operation_info.excl === 1" class="w70">
                是
              </span>
              <span v-else class="w70">
                否
              </span>
            </p>
            <p class="mb10">
              <span class="w30">是否点播套餐</span>
              <span v-if="operation_info.is_pkg === 1" class="w70">
                是
              </span>
              <span v-else class="w70">
                否
              </span>
            </p>
            <Button v-if="operationInfoClose" type="primary" ghost class="open-btn" @click="turnOpen('operationInfoClose')">展开</Button>
            <Button v-else type="primary" ghost class="open-btn" @click="turnOpen('operationInfoClose')">收起</Button>
          </li>
        </ul>
      </div>
      <div class="cover">
        <p class="info-title">封面图</p>
        <div style="width: 100%;overflow-x: auto;border: 1px solid #e8eaec;">
          <ul class="ul-border" ref="coverUl">
            <li v-for="item in cover" :key="item.id" class="img-li">
              <div class="img-box">
                <img :src="item.pic_url" alt="" ref="coverImg">
              </div>
              <p style="line-height: 24px;">{{ item.ratio }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="poster">
        <p class="info-title">海报图</p>
        <div style="width: 100%;overflow-x: auto;border: 1px solid #e8eaec;">
          <ul class="ul-border" ref="posterUl">
            <li v-for="item in poster" :key="item.id" class="img-li">
              <div class="img-box">
                <img :src="item.pic_url" alt="" ref="posterImg">
              </div>
              <p style="line-height: 24px;">{{ item.ratio }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './index.less'
import { getVideoDetail } from '@/api/media-data'
import { resetTime3, resetTime4 } from '@/libs/util'
import { mapMutations } from 'vuex'
export default {
  name: 'video-detail',
  data () {
    return {
      title: '',
      media_status: {},
      basic_info: {},
      operation_info: {},
      cover: [],
      poster: [],
      mediaStatusClose: true,
      basicInfoClose: true,
      operationInfoClose: true,
      current: 1
    }
  },
  methods: {
    ...mapMutations([
      'setMediaAssetsFlag'
    ]),
    toPage (path) {
      this.setMediaAssetsFlag(true)
      this.$router.push(path)
    },
    turnOpen (refClose) {
      this[refClose] = !this[refClose]
    },
    setImgSize (imgType) {
      this.$refs[imgType + 'Ul'].style.width = 200 * this[imgType].length + 2 + 'px'
      for (let i = 0; i < this[imgType].length; i++) {
        let ratioWidAndHei = this[imgType][i].ratio.split(':')
        let sizeWidAndHei = this[imgType][i].size.split(':')
        let imgWidth
        let imgHeight
        let img = this.$refs[imgType + 'Img'][i]
        if (ratioWidAndHei.length > 1) {
          imgWidth = ratioWidAndHei[0].trim()
          imgHeight = ratioWidAndHei[1].trim()
          if (imgWidth - imgHeight > 0) {
            img.setAttribute('width', '100%')
          } else if (imgWidth - imgHeight === 0) {
            img.setAttribute('max-width', '180px')
          } else {
            img.setAttribute('height', '100%')
          }
        } else if (sizeWidAndHei.length > 2) {
          imgWidth = sizeWidAndHei[0].trim()
          imgHeight = sizeWidAndHei[1].trim()
          if (imgWidth - imgHeight >= 0) {
            img.setAttribute('width', '100%')
          } else {
            img.setAttribute('height', '100%')
          }
        } else {
          img.setAttribute('width', '100%')
        }
      }
    }
  },
  beforeMount () {
    let href = location.href
    let hash
    let ep_id
    let current
    hash = href.split('#')[1]
    if (hash) {
      ep_id = hash.split('?')[0]
      current = hash.split('?')[1]
      this.current = current.split('=')[1]
    } else {
      this.$router.replace({
        path: `/view/media_assets/video_list`
      })
    }
    getVideoDetail(ep_id).then(res => {
      const data = res.data
      if (data.errno === 10000) {
        let info = data.data
        this.title = info.epName
        this.media_status = info.media_status
        info.basic_info.time = resetTime3(info.basic_info.time)
        info.basic_info.init_issue_time = info.basic_info.init_issue_time.split(' ')[0]
        info.basic_info.eq_len = resetTime4(info.basic_info.eq_len)
        this.basic_info = info.basic_info
        this.operation_info = info.operation_info
        this.cover = info.cover
        this.poster = info.poster

        this.$nextTick(() => {
          this.setImgSize('cover')
          this.setImgSize('poster')
        })
      } else {
        this.$Modal.warning({
          title: '视频详情获取失败',
          content: `原因: ${data.errmsg}`
        })
      }
    }).catch(err => {
      console.error(err)
    })
  }
}
</script>
