<template>
  <div ref="contentMain">
    <div class="content-management" v-if="contentPage">
      <Form ref="contentForm" :model="saveData">
        <div class="page">
          <div class="tabs">
            <drag-list :list1.sync="listData" @on-change="handleDrag" class="clearfix">
              <div
                slot="left"
                slot-scope="left"
                @click="changeChannel(left.itemLeft.pageId)"
                v-if="left.itemLeft.channelStatus == 1"
                :class="['tab-item', {'btn-active': left.itemLeft.pageId === activeIndex}]">
                {{left.itemLeft.pageName}}
                &nbsp;&nbsp;
                <Icon type="md-eye-off" v-if="left.itemLeft.channelStatus != 1"/>
              </div>
              <div slot="right" style="display: none" slot-scope="right"></div>
            </drag-list>
            <div class="outline-list">
              <div
                v-for="(item, index) in listData"
                v-if="item.channelStatus != 1"
                :key="index"
                @click="changeChannel(item.pageId)"
                :class="['tab-item', {'btn-active': item.pageId === activeIndex}]">
                {{item.pageName}}
                &nbsp;&nbsp;
                <Icon type="md-eye-off" v-if="item.channelStatus != 1"/>
              </div>
            </div>
            <!--<Button class="tab-item" @click="addOrEditChannel(true)" style="width: 100%">+添加频道</Button>-->
            <Icon type="md-add-circle" color="#2d8cf0" size="40" @click="addOrEditChannel(true)"
                  class="add-channel-icon"/>
          </div>
          <div class="content">
            <header class="common-header">
              <h2 style="padding-left: 20px">{{saveData.pageName}}</h2>
              <div class="btn">
                <Button type="primary" class="common-margin-left-10" @click="saveEdit" :disabled="!saveOrPublic">保存
                </Button>
                <Button type="primary" class="common-margin-left-10" @click="preview"
                        :disabled="saveOrPublic || saveData.channelStatus != 1">预览
                </Button>
                <Button type="primary" class="common-margin-left-10" @click="TVpreview=true" :disabled="saveOrPublic">
                  TV预览
                </Button>
                <Button type="primary" class="common-margin-left-10" @click="showPubTip=true"
                        :disabled="!(!saveOrPublic && publishTime === 'init')">立即发布
                </Button>
                <Button type="primary" class="common-margin-left-10" @click="setTimeP"
                        :disabled="!(!saveOrPublic && publishTime === 'init')">定时发布
                </Button>
              </div>
            </header>
            <Alert style="margin: 20px 10px 10px 20px;">
              <Icon type="ios-send"/>
              当前数据发布状态：{{ saveData.dataStatus === 1 ? '已发布' : '未发布' }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Icon type="md-mail"/>
              线上版本生效时间：{{saveData.onlineTime !== 0 ? formatDate(saveData.onlineTime, true) : '未设置'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Icon type="ios-alarm"/>
              定时发布生效时间：{{saveData.publishTime !== 0 ? formatDate(saveData.publishTime, true) : '未设置'}}
            </Alert>
            <div class="des">
              <div class="status">
                <span>默认首页：{{saveData.isDefault == 1 ? '是' : '否'}}</span>
                <!--<span class="common-padding-left-30">频道排序：{{saveData.channelSor}}</span>-->
                <span class="common-padding-left-30">频道状态：<span :class="{'common-red': saveData.channelStatus != 1}">{{saveData.channelStatus == 1 ? '上线' : '下线'}}</span></span>
                <p>频道描述：{{saveData.pageDescription}}</p>
              </div>
              <div class="action">
                <Button type="primary" size="small" @click="addOrEditChannel(false)">修改</Button>
              </div>
            </div>
            <div class="detail">
              <div
                v-for="(rows, index) in saveData.rows"
                :key="index"
                :class="['item-bg', {'item-bg-set': rows.setInfo && rows.setInfo.operation === 'auto' && rows.setInfo.updateFrequency}]">
                <Card :bordered="false" :class="{'item-bg-hide': rows.hidden}">
                  <FormItem :prop="'rows.'+ index + '.title'"
                            :rules="!(rows.firstScreen && rows.firstScreen == 1) ? {required: true, message: '标题不能为空哦~'} : {}">
                    <Input class="edit-input" placeholder="编辑标题" v-model="rows.title"
                           v-if="!(rows.firstScreen && rows.firstScreen == 1)"/>
                  </FormItem>
                  <div>
                    <div
                      :class="['common-padding-left-10', 'background', {'common-padding-top-10': rowIndex % 2 !== 1}]"
                      v-for="(row, rowIndex) in rows.rows" :key="rowIndex">
                      <!--当前行为grid情况-->
                      <ul v-if="row.rowType === 'metro_grid'" class="common-flex">
                        <div
                          :style="{'height': (row.rowHeight + row.columnSpacing)/4 + 'px', 'display': 'flex', 'flex-direction': 'column', 'flex-wrap': 'wrap'}">
                          <div
                            v-for="(items, itemIndex) in row.items"
                            :key="itemIndex"
                            class="img-item-wrap"
                            :style="{'padding-right': '6px',
                                     'height': (row.rowHeight/(4 * row.rowCount)* items.height + 3) +'px'}">
                            <span v-if="items.itemMin">
                              <img
                                :src="items.bannerItems[0].itemSet && items.bannerItems[0].itemSet.img ? items.bannerItems[0].itemSet.img : imgOcupied"
                                class="img-item"
                                :style=" {'width': items.width/4 +'px',
                                 'height': (items.bannerItems[0].frontHeight/4 || row.rowHeight/(4 * row.rowCount)* items.bannerItems[0].height+ 3) +'px',
                                 'border-radius': '12px'}" v-if="items.itemSet.carousel === true || items.itemSet.carousel === '1'">
                              <img
                                :src="items.itemSet && items.itemSet.img ? items.itemSet.img : imgOcupied"
                                class="img-item"
                                :style=" {'width': items.width/4 +'px',
                                 'height': (items.bannerItems[0].frontHeight/4 || row.rowHeight/(4 * row.rowCount)* items.bannerItems[0].height+ 3) +'px',
                                 'border-radius': '12px'}" v-else>
                              <Button size="small" class="img-edit"
                                      @click="editItem(items.bannerItems[0].itemSet.position, index, true)">编辑
                              </Button>
                            </span>
                            <span v-else>
                              <img :src="items.itemSet && items.itemSet.img ? items.itemSet.img : imgOcupied"
                                   class="img-item"
                                   :style=" {'width': items.width/4 +'px',
                                   'height': row.rowHeight/(4 * row.rowCount)* items.height +'px',
                                   'border-radius': '12px'}"
                                   v-if="!items.items || (items.items && items.items.length === 0) && itemIndex === 0">
                              <img :src="items.itemSet && items.itemSet.img ? items.itemSet.img : imgOcupied"
                                   class="img-item"
                                   :style=" {'width': items.width/4 +'px',
                                     'height': (row.rowHeight/(4 * row.rowCount)* items.height - 3) +'px',
                                     'border-radius': '12px'}"
                                   v-if="!items.items || (items.items && items.items.length === 0) && itemIndex !== 0">
                              <Button size="small"
                                      class="img-edit"
                                      @click="editItem(items.itemSet.position, index)"
                                      v-if="!items.items || (items.items && items.items.length === 0)">编辑
                              </Button>
                            </span>
                            <div v-for="(itemIn, itemInIndex) in items.items"
                                 :key="itemInIndex"
                                 v-if="items.items.length !== 0"
                                 :class="['img-item-wrap', {'first-margin': itemInIndex === 0 && !items.itemMin}]"
                                 :style="{'display': 'inline-block'}">
                              <img :src="itemIn.itemSet && itemIn.itemSet.img ? itemIn.itemSet.img : imgOcupied"
                                   class="img-item"
                                   :style=" {'width': itemIn.width/4 +'px',
                                 'height': (row.rowHeight/(4 * row.rowCount)* itemIn.height+ 3) +'px',
                                 'border-radius': '12px'}">
                              <Button size="small" class="img-edit"
                                      @click="editItem(itemIn.itemSet.position, index, true)">编辑
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ul>
                      <!--当前行为list-->
                      <ul class="common-flex" v-else>
                        <li
                          v-for="(items, itemIndex) in row.items"
                          :key="itemIndex"
                          :style="{'padding-right': row.columnSpacing/4 + 'px', 'padding-bottom': row.rowSpacing/4 + 'px'}"
                        >
                          <div class="img-item-wrap">
                            <img :src="items.itemSet && items.itemSet.img ? items.itemSet.img : imgOcupied"
                                 class="img-item"
                                 :style=" { 'width': items.width/4 +'px',
                                        'height': items.height/4 +'px',
                                        'border-radius': '12px' }">
                            <Button size="small" class="img-edit" @click="editItem(items.itemSet.position, index)">编辑
                            </Button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
                <div class="item-action">
                  <p :class="[{'go-online': rows.hidden}, {'drop-line': !rows.hidden}]"
                     v-if="!rows.firstScreen || rows.firstScreen != 1">
                    <Button size="small" @click="rows.hidden=!rows.hidden">{{rows.hidden ? '上线' : '隐藏'}}</Button>
                  </p>
                  <!--<p class="drop-line"> <Button size="small" v-if="(!rows.firstScreen || rows.firstScreen != 1) && !rows.hidden"  @click="rows.hidden=true">隐藏</Button></p>-->
                  <p>
                    <Button size="small" @click="showSetRule(index)">设置</Button>
                  </p>
                  <p>
                    <Button size="small" @click="moveUp(index)">上移</Button>
                  </p>
                  <p>
                    <Button size="small" @click="moveDown(index)">下移</Button>
                  </p>
                  <p>
                    <Button size="small" @click="deleteRow(index)">删除</Button>
                  </p>
                </div>
              </div>
              <div class="item-bg common-margin-top-10 add" @click="goAddModule">
                <Icon type="md-add" class="add-module"/>
                <p class="add-module-btn">
                <p>添加模块</p></p>
              </div>
            </div>
          </div>
        </div>
      </Form>
      <!--设置规则-->
      <Modal
        v-model="setRule"
        title="设置"
        class="set-rules"
        :footer-hide="true">
        <Form :label-width="80" ref="setRuleForm" :model="setRuleData" :rules="setRuleValidate">
          <Spin fix v-if="setInfoLoading"></Spin>
          <FormItem label="模块标题" prop="moduleTitleHide">
            <RadioGroup v-model="setRuleData.moduleTitleHide">
              <Radio :label="0">显示</Radio>
              <Radio :label="1">隐藏</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="内容标题" prop="contentTitle">
            <RadioGroup v-model="setRuleData.contentTitle">
              <Radio :label="1">显示</Radio>
              <Radio :label="0">隐藏</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="运营方式" prop="operation">
            <RadioGroup v-model="setRuleData.operation" @on-change="changeOperationMode">
              <Radio label="auto">自动推荐</Radio>
              <Radio label="artificial">人工运营</Radio>
            </RadioGroup>
          </FormItem>
          <div v-if="setRuleData && setRuleData.operation === 'auto'">
            <FormItem label="推荐规则" prop="recommendRulesId"
                      :rules="setRuleData.operation !== 'auto' ? {} : { required: true, message: '请选择推荐规则', trigger: 'change' }">
              <Select style="width: 220px" v-model="setRuleData.recommendRulesId" filterable>
                <Option v-for="(item, index) in setRuleData.recommondRules" :key="index" :value="item.id">
                  {{item.name}}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="排序方式" prop="sort"
                      :rules="setRuleData.operation !== 'auto' ? {} : { required: true, message: '请选择排序方式', trigger: 'change' }">
              按
              <Select style="width: 205px" v-model="setRuleData.sort">
                <Option value="hot">热度</Option>
                <Option value="putawayTime">上架时间</Option>
                <Option value="releaseTime">上映时间</Option>
                <Option value="score">评分</Option>
              </Select>
              &nbsp;排序
              &nbsp;&nbsp;&nbsp;
              <Checkbox v-model="setRuleData.vipPriority">VIP资源优先</Checkbox>
            </FormItem>
            <FormItem label="更新频率" prop="updateFrequency"
                      :rules="setRuleData.operation !== 'auto' ? {} : { required: true, message: '请填写更新频率' }">
              每
              <!--<Input style="width: 30%; padding-right: 10px" v-model="setRuleData.updateFrequency" />-->
              <Select style="width: 64%" v-model="setRuleData.updateFrequency">
                <Option :value="3">3</Option>
                <Option :value="6">6</Option>
                <Option :value="12">12</Option>
                <Option :value="24">24</Option>
              </Select>
              小时&nbsp;&nbsp;刷新一次
            </FormItem>
          </div>

          <FormItem style="padding-left: 110px">
            <Button type="primary" @click="saveSetting">保存</Button>
          </FormItem>
        </Form>
      </Modal>
      <!--添加模块-->
      <Modal
        v-model="addModule"
        title="添加模块"
        class="modal-self"
        ref="addmodule"
        :footer-hide="true">
        <div class="modal-img-group">
          <Select style="width:200px" v-model="addModuleData.firstScreen" @on-change="getModuleList">
            <Option :value="1">首屏</Option>
            <Option :value="0">非首屏</Option>
          </Select>
          <div v-for="(list, index) in addModuleData.list" :key="index">
            <div class="module-sel">
              <div class="img-group" @click="chooseImgList($event, index)">
                <div>
                  <div :class="['common-padding-left-10', 'background', {'common-padding-top-10': rowIndex % 2 !== 1}]"
                       v-for="(row, rowIndex) in list.rows" :key="rowIndex">
                    <!--当前行为list情况-->
                    <ul class="common-flex" v-if="row.rowType === 'list'">
                      <li
                        v-for="(items, index) in row.items"
                        :key="index"
                        :style="{'padding-right': row.columnSpacing/4 + 'px', 'padding-bottom': row.rowSpacing/4 + 'px'}"
                      >
                        <div>
                          <i class="img-occupied-tab"
                             :style=" { 'width': items.width/4 +'px',
                                        'height': items.height/4 +'px',
                                        'line-height': items.height/4 +'px',
                                        'border-radius': '12px' }">{{items.width + '*' + items.height}}</i>
                          <p class="common-text-align">{{items.title}}</p>
                        </div>
                      </li>
                    </ul>
                    <!--当前行为grid情况-->
                    <ul v-else class="common-flex">
                      <div
                        :style="{'height': (row.rowHeight + row.columnSpacing)/4 + 'px', 'display': 'flex', 'flex-direction': 'column', 'flex-wrap': 'wrap'}">
                        <div
                          v-for="(items, itemIndex) in row.items"
                          :key="itemIndex"
                          class="img-item-wrap"
                          :style="{'padding-right': '6px',
                                     'height': (row.rowHeight/(4 * row.rowCount)* items.height + 3) +'px'}">
                          <i class="img-occupied-tab img-item"
                             :style=" { 'width': items.width/4 +'px',
                                       'height': row.rowHeight/(4 * row.rowCount)* items.height +'px',
                                        'line-height': row.rowHeight/(4 * row.rowCount)* items.height +'px',
                                        'border-radius': '12px' }"
                             v-if="!items.items || (items.items && items.items.length === 0) && itemIndex === 0">{{`${items.width}*${items.frontHeight
                            || items.height * (row.rowHeight/row.items[0].height)}`}}</i>
                          <i class="img-occupied-tab img-item"
                             :style=" { 'width': items.width/4 +'px',
                                       'height': (row.rowHeight/(4 * row.rowCount)* items.height - 3) +'px',
                                        'line-height': (row.rowHeight/(4 * row.rowCount)* items.height - 3) +'px',
                                        'border-radius': '12px' }"
                             v-if="!items.items || (items.items && items.items.length === 0) && itemIndex !== 0">{{`${items.width}*${items.frontHeight
                            || items.height * (row.rowHeight/row.items[0].height) - 12}`}}</i>
                          <p class="common-text-align" v-if="!items.items || (items.items && items.items.length === 0)">
                            {{items.title}}</p>
                          <div v-for="(itemIn, itemInIndex) in items.items"
                               :key="itemInIndex"
                               v-if="items.items.length !== 0"
                               :class="['img-item-wrap', {'first-margin': itemInIndex === 0 && !items.itemMin }]"
                               :style="{'display': 'inline-block'}">
                            <i class="img-occupied-tab img-item"
                               :style=" { 'width': items.width/4 +'px',
                                       'height': (itemIn.frontHeight/4 || row.rowHeight/(4 * row.rowCount)* itemIn.height + 3) +'px',
                                        'line-height': (itemIn.frontHeight/4 || row.rowHeight/(4 * row.rowCount)* itemIn.height + 3) +'px',
                                        'border-radius': '12px' }" v-if="items.itemMin && itemInIndex === 0">
                              {{`${items.width}*${itemIn.frontHeight || itemIn.height *
                              (row.rowHeight/row.items[0].height) - 12}`}}</i>
                            <i class="img-occupied-tab img-item"
                               :style=" { 'width': itemIn.width/4 +'px',
                                       'height': (row.rowHeight/(4 * row.rowCount)* itemIn.height + 3) +'px',
                                        'line-height': (row.rowHeight/(4 * row.rowCount)* itemIn.height + 3) +'px',
                                        'border-radius': '12px' }" v-else-if="!items.itemMin">
                              {{`${itemIn.width}*${itemIn.frontHeight || itemIn.height *
                              (row.rowHeight/row.items[0].height) - 12}`}}</i>
                            <p class="common-text-align">{{items.title}}</p>
                          </div>
                        </div>
                      </div>
                    </ul>
                  </div>
                  <p>说明：{{list.description}}</p>
                </div>
                <!-- <div class="des">
                  <p>说明：</p>
                  <p>{{list.description}}</p>
                </div> -->
              </div>
              <div :class="['choose',{'choose-hidden': chooseIndex !== index}]">
                <Button type="primary" @click="chooseModule(index)">选择</Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <!--定时发布-->
      <Modal
        v-model="setTimePublish"
        title="定时发布"
        class="set-rules"
        :footer-hide="true">
        <div class="common-text-align">
          <p class="public-tip"> 提示：点击“发布”之后，原有未生效的发布数据，全部失效</p>
          <label>发布时间</label>
          <DatePicker type="datetime" placeholder="请选择时间和日期" style="padding-left: 10px; width: 300px"
                      v-model="publicSpecificTime"></DatePicker>
          <div class="common-padding-top-20">
            <Button type="primary" @click="setPublishTime('setTime')">确定</Button>
          </div>
        </div>
      </Modal>
      <!--TV预览-->
      <Modal
        v-model="TVpreview"
        title="TV预览"
        class="set-rules"
        :footer-hide="true">
        <div class="common-text-align">
          <label>推送范围</label>
          <Input
            type="textarea"
            placeholder="请输入设备mac，多个mac以英文逗号分隔"
            :autosize="{minRows: 3}"
            v-model="mac"
            style="max-width: 85%; padding-left: 10px"/>
          <div class="common-padding-top-20">
            <Button type="primary" @click="TVconfirm">确定</Button>
          </div>
        </div>
      </Modal>
      <!--离开提示-->
      <Modal v-model="showLeave" width="360" :footer-hide="true">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>提示</span>
        </p>
        <div style="text-align:center">
          <p>当前页面有未保存修改，请先保存！</p>
          <div class="common-padding-top-20">
            <Button @click="giveUpModify">放弃修改</Button>
            <Button type="primary" class="common-margin-left-10" @click="showLeave=false">去保存</Button>
          </div>
        </div>
      </Modal>
      <!--预览-->
      <Modal
        v-model="showPreview"
        class="preview"
        style="position: relative"
        :footer-hide="true">
        <Spin v-if="previewLoading" fix></Spin>
        <div>
          <ul class="common-flex preview-tabs">
            <li
              :class="['preview-tab-style', {'active': item.pageId === previewData.pageId}]"
              v-if="item.channelStatus == 1"
              v-for="(item, index) in listData"
              :key="index">{{item.pageName}}
            </li>
          </ul>
          <div class="preview-content">
            <div class="preview-row" v-for="(rows, index) in previewData.rows" :key="index">
              <h3 style="padding-bottom: 5px;" v-if="!rows.setInfo || rows.setInfo && !rows.setInfo.moduleTitleHide">
                {{rows.title}}</h3>
              <!--当前行为list情况-->
              <ul class="common-flex" v-if="rows.rowType === 'list'">
                <li
                  v-for="(items, index) in rows.items"
                  :key="index"
                  :style="{'padding-right': rows.columnSpacing/2 + 'px', 'padding-bottom': rows.rowSpacing/2 + 'px'}"
                >
                  <div>
                    <img :src="items.itemSet && items.itemSet.img ? items.itemSet.img : imgOcupied"
                         :style=" {'width': items.width/2 +'px',
                               'height': items.height/2 +'px',
                               'border-radius': '12px'                    }">
                    <p class="common-text-align common-margin-top-10 text-ellipsis"
                       :style=" {'width': items.width/2 +'px'}"
                       v-if="rows.setInfo.contentTitle">{{items.itemSet.title}}</p>
                  </div>
                </li>
              </ul>
              <!--当前行为grid情况-->
              <ul v-else class="common-flex">
                <div
                  :style="{'height': (rows.rowHeight + rows.columnSpacing*2)/2 -12 + 'px', 'display': 'flex', 'flex-direction': 'column', 'flex-wrap': 'wrap'}">
                  <div
                    v-for="(items, itemIndex) in rows.items"
                    :key="itemIndex"
                    class="img-item-wrap"
                    :style="{'padding-right': 12 + 'px',
                    'height': (rows.rowHeight/(2 * rows.rowCount)* items.height + 6) +'px',
                    }">
                    <span v-if="!items.itemMin">
                      <img :src="items.itemSet && items.itemSet.img ? items.itemSet.img : imgOcupied"
                           class="img-item"
                           :style=" {'width': items.width/2 +'px',
                                     'height': rows.rowHeight/(2 * rows.rowCount)* items.height +'px',
                                     'border-radius': '12px'}"
                           v-if="!items.items || (items.items && items.items.length === 0) && itemIndex === 0">
                      <img :src="items.itemSet && items.itemSet.img ? items.itemSet.img : imgOcupied"
                           class="img-item"
                           :style=" {'width': items.width/2 +'px',
                                     'height': (rows.rowHeight/(2 * rows.rowCount)* items.height-6) +'px',
                                     'border-radius': '12px'}"
                           v-if="!items.items || (items.items && items.items.length === 0) && itemIndex !== 0">
                      <p class="common-text-align text-ellipsis"
                         :style=" {'width': items.width/2 +'px'}"
                         v-if="rows.setInfo.contentTitle && (!items.items || (items.items && items.items.length === 0))">
                        {{items.itemSet.title}}</p>
                       <!--特殊的子item-->
                      <div v-for="(itemIn, itemInIndex) in items.items"
                           :key="itemInIndex"
                           v-if="items.items.length !== 0"
                           :class="['img-item-wrap', {'first-padding': itemInIndex === 0}]"
                           :style="{'display': 'inline-block',
                    'height': (rows.rowHeight/(2 * rows.rowCount)* itemIn.height + rows.columnSpacing/4 + 6) +'px'}">
                        <img :src="itemIn.itemSet && itemIn.itemSet.img ? itemIn.itemSet.img : imgOcupied"
                             class="img-item"
                             :style=" {'width': itemIn.width/2 +'px',
                                     'height': (rows.rowHeight/(2 * rows.rowCount)* items.height-6) +'px',
                                     'border-radius': '12px'}">
                        <p class="common-text-align text-ellipsis"
                           :style=" {'width': itemIn.width/2 +'px'}"
                           v-if="rows.setInfo.contentTitle">{{items.itemSet.title}}</p>
                      </div>
                    </span>
                    <!-- 轮播的情况下，显示轮播 -->
                    <div :style="{'width': items.width/2 +'px'}"
                         v-else>
                      <span class="carousel-item" v-if="items.itemSet.carousel || items.itemSet.carousel === '1'">
                        <ul :style="{'display': 'inline-block',
                        'overflow':'hidden',
                        'margin-right': '1.5px',
                        'height': (rows.rowHeight/(2 * rows.rowCount)* items.height) +'px'}">
                          <li v-for="(itemIn, itemInIndex) in items.bannerItems"
                              :key="itemInIndex"
                              v-if="items.bannerItems.length !== 0"
                              :class="['banner-item-wrap',{'banner-cur': itemInIndex === 1 }]"
                              :style=" {'width': items.banner_info.banner_list_width/2 +'px',
                             'height': items.banner_info.banner_list_height/2 + 'px'}">
                            <p class="text-ellipsis" style="font-size: 15px;"
                            >{{itemIn.itemSet.title}}</p>
                            <p class="text-ellipsis" style="font-size: 12px;"
                            >{{itemIn.itemSet.description}}</p>
                          </li>
                        </ul>
                        <div style="display: inline-block">
                          <img
                            :src="items.bannerItems[0].itemSet && items.bannerItems[0].itemSet.img ? items.bannerItems[0].itemSet.img : imgOcupied"
                            class="img-item"
                            :style=" {'width': items.bannerItems[0].width/2 +'px',
                                       'height': items.bannerItems[0].height/2 +'px',
                                       'border-radius': '12px'}">
                        </div>
                      </span>
                      <span v-else>
                        <div style="display: inline-block">
                          <img
                            :src="items.itemSet && items.itemSet.img ? items.itemSet.img : imgOcupied"
                            class="img-item"
                            :style=" {'width': items.width/2 +'px',
                                       'height': (rows.rowHeight/(2 * rows.rowCount)* items.height) +'px',
                                       'border-radius': '12px'}">
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
      <!--发布提示-->
      <Modal
        v-model="showPubTip"
        title="提示"
        class="set-rules"
        :footer-hide="true">
        <div class="common-text-align">
          点击“发布”之后，原有未生效的发布数据，全部失效
          <div class="common-padding-top-20">
            <Button @click="showPubTip=false">取消发布</Button>
            <Button type="primary" class="common-margin-left-10" @click="setPublishTime('now')">确定发布</Button>
          </div>
        </div>
      </Modal>
    </div>
    <AddChanel v-else-if="addChanel" @goback="goBack" @refreshList="getListData"
               @channelDataChange="Object.assign({}, channelData)" :channelData="channelData" :tabsName="tabsName"
               @logId="logId"></AddChanel>
    <div class="img-edit" v-else>
      <div>
        <header class="common-header">
          <h2>编辑</h2>
          <div class="btn">
            <Button type="primary" class="common-margin-left-10" @click="goBack(true)">返回</Button>
          </div>
        </header>
        <Form class="edit-form" ref="editItemForm" :label-width="84" :rules="itemEditRule" :model="itemEditData">
          <FormItem label="位置">{{itemEditData.position}}</FormItem>
          <FormItem label="推荐位置类型">固定位</FormItem>

          <!-- 轮播添加 -->
          <FormItem label="是否轮播" v-if="canCarousel">
            <RadioGroup v-model="itemEditData.carousel">
              <Radio label="1">
                <span>是</span>
              </Radio>
              <Radio label="0">
                <span>否</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <!-- 根据是否轮播显示单个编辑还是多个创意编辑 -->
          <div v-if="itemEditData.carousel === '0'">
            <FormItem label="标题" prop="title">
              <Input placeholder="请输入..." class="common-input-maxWidth-400" v-model.trim="itemEditData.title"/>
            </FormItem>
            <FormItem label="描述">
              <Input placeholder="请输入..." class="common-input-maxWidth-400" v-model.trim="itemEditData.description"/>
            </FormItem>
            <FormItem label="跳转类型" prop="openType">
              <Select class="common-input-maxWidth-400" v-model="itemEditData.openType" @on-change="initCascading">
                <Option v-for="(list1tr, index) in typeList" :key="index" :value="list1tr.value">
                  {{list1tr.description}}
                </Option>
              </Select>
              <!--联动-->
              <div class="linkage-top-10">
                <FormItem prop="openSubType"
                          v-if="typeList2.list && typeList2.list.length && !(itemEditData.openType === 'custom' || itemEditData.openType === 'web')">
                  <div>
                    <label class="sec-label-width">类型：</label>
                    <label>
                      <Select class="sec-form-width" v-model="itemEditData.openSubType" @on-change="init_sec_cascading">
                        <Option v-for="(list2tr, index2) in typeList2.list" :key="index2" :value="list2tr.value">
                          {{list2tr.description}}
                        </Option>
                      </Select>
                    </label>
                  </div>
                </FormItem>
                <FormItem prop="openSubType"
                          v-else-if="(itemEditData.openType === 'custom' || itemEditData.openType === 'web')">
                  <div>
                    <label class="sec-label-width">参数：</label>
                    <label>
                      <Input class="sec-form-width" type="textarea" v-model.trim="itemEditData.openSubType"></Input>
                    </label>
                  </div>
                </FormItem>
                <div class="linkage-top-10" v-if="typeList3.list && typeList3.list.length">
                  <FormItem :prop="list3tr.key" v-for="(list3tr, index) in typeList3.list" :key="index">
                    <div class="linkage-top-20">
                      <label class="sec-label-width">{{list3tr.name}}：</label><Input class="sec-form-width"
                                                                                     v-model.trim="itemEditData[list3tr.key]"
                                                                                     placeholder="请输入..."/>
                    </div>
                  </FormItem>
                </div>
              </div>
            </FormItem>
            <FormItem label="图片" prop="img">
              <Upload :action="uploadUrl + '/uploadFdfs'" :format="['png', 'jpg']" name="uploadfile" :before-upload="isUpload"
                      :on-success="uploadItemImg" :show-upload-list="false" :on-format-error="formatError">
                <Button icon="ios-cloud-upload-outline" size="small">上传</Button>
              </Upload>
              <div>
                <div v-if="itemEditData.img">
                  <img :src="itemEditData.img" class="img-occupied img-bg"
                       :style="{'width': (itemEditData.noCarouselWidth || itemEditData.width)/4 + 'px', 'height': (itemEditData.noCarouselHeight || itemEditData.height)/4 + 'px'}">
                  <span>{{itemEditData.noCarouselWidth || itemEditData.width}}*{{itemEditData.noCarouselHeight ||
                  itemEditData.height}}</span>
                </div>
                <i class="img-occupied"
                   :style="{'width': (itemEditData.noCarouselWidth || itemEditData.width)/4 + 'px', 'height': (itemEditData.noCarouselHeight || itemEditData.height)/4 + 'px'}"
                   v-else>{{itemEditData.noCarouselWidth || itemEditData.width}}*{{itemEditData.noCarouselHeight ||
                  itemEditData.height}}</i>
              </div>
            </FormItem>
          </div>
          <div v-else>
            <!-- 一个创意 -->
            <div v-for="(wheelItem,index) in itemEditData.carouselData" :key="index">
              <div>
                <FormItem :label="'创意' + (index + 1)" :label-width=60 style="padding-left: 20px;position: relative">
                  <Icon type="ios-arrow-forward"
                        style="font-size: 20px;position: absolute;left: -80px;top: 5px;cursor:pointer;"
                        @click="openOrCloseWheel(index)" v-if="!wheelItem.isOpen"/>
                  <Icon type="ios-arrow-down"
                        style="font-size: 20px;position: absolute;left: -80px;top: 5px;cursor:pointer;"
                        @click="openOrCloseWheel(index)" v-else/>
                  <span>{{ wheelItem.title }}</span>
                  <Icon type="ios-trash-outline" style="margin: 0 10px;font-size: 20px;cursor:pointer;"
                        @click="makeSureDelete(index)"/>
                  <p style="margin-left: 10px;display: inline-block;line-height: 28px;" v-if="wheelItem.showDelete">
                    <span>确认删除？</span>
                    <span style="font-size: 16px;">
                        <Icon type="md-checkmark" style="margin-right: 10px;cursor: pointer" color="#19be6b"
                              @click="createDelete(index)"/>
                        <Icon type="md-close" style="margin-right: 10px;cursor: pointer" color="#ed4014"
                              @click="cancelDelete(index)"/>
                      </span>
                  </p>
                </FormItem>
              </div>
              <div class="wheelItem" v-if="wheelItem.isOpen">
                <FormItem label="标题"
                          :prop="'carouselData.' + index + '.title'"
                          :rules="{ validator: (rule, value, callback) => {checkFun(rule, value, callback, '标题')}, trigger: 'blur'}">
                  <Input placeholder="请输入..." class="common-input-maxWidth-400" v-model="wheelItem.title"/>
                </FormItem>
                <FormItem label="描述">
                  <Input placeholder="请输入..." class="common-input-maxWidth-400" v-model.trim="wheelItem.description"/>
                </FormItem>
                <FormItem label="跳转类型"
                          :prop="'carouselData.' + index + '.openType'"
                          :rules="{ validator: (rule, value, callback) => {checkFun(rule, value, callback, '跳转类型')}, trigger: ''}">
                  <Select class="common-input-maxWidth-400" v-model="wheelItem.openType"
                          @on-change="initWheelCascading(index)">
                    <Option v-for="(list1tr, index) in carouselTypeList[index].typeList" :key="index"
                            :value="list1tr.value">
                      {{list1tr.description}}
                    </Option>
                  </Select>
                  <!--联动-->
                  <div class="linkage-top-10">
                    <FormItem
                      :prop="'carouselData.' + index + '.openSubType'"
                      :rules="{ validator: (rule, value, callback) => {checkFun(rule, value, callback, '类型')}, trigger: ''}"
                      v-if="carouselTypeList[index].typeList2.list && carouselTypeList[index].typeList2.list.length && !(wheelItem.openType === 'custom' || wheelItem.openType === 'web')">
                      <div>
                        <label class="sec-label-width">类型：</label>
                        <label>
                          <Select class="sec-form-width" v-model="wheelItem.openSubType"
                                  @on-change="initWheel_sec_cascading(index)">
                            <Option v-for="(list2tr, index2) in carouselTypeList[index].typeList2.list" :key="index2"
                                    :value="list2tr.value">
                              {{list2tr.description}}
                            </Option>
                          </Select>
                        </label>
                      </div>
                    </FormItem>
                    <FormItem
                      :prop="'carouselData.' + index + '.openSubType'"
                      :rules="{ validator: (rule, value, callback) => {checkFun(rule, value, callback, '类型')}, trigger: ''}"
                      v-else-if="wheelItem.openType === 'custom' || wheelItem.openType === 'web'">
                      <div>
                        <label class="sec-label-width">参数：</label>
                        <label>
                          <Input class="sec-form-width" type="textarea" v-model.trim="wheelItem.openSubType"></Input>
                        </label>
                      </div>
                    </FormItem>
                    <div class="linkage-top-10"
                         v-if="carouselTypeList[index].typeList3.list && carouselTypeList[index].typeList3.list.length">
                      <FormItem
                        :prop="'carouselData.' + index + '.' +list3tr.key"
                        :rules="{ validator: (rule, value, callback) => {checkFun(rule, value, callback, list3tr.key)}, trigger: ''}"
                        v-for="(list3tr, i) in carouselTypeList[index].typeList3.list" :key="i">
                        <div class="linkage-top-20">
                          <label class="sec-label-width">{{list3tr.name}}：</label>
                          <Input class="sec-form-width"
                                 v-model.trim="wheelItem[list3tr.key]"
                                 placeholder="请输入..."/>
                        </div>
                      </FormItem>
                    </div>
                  </div>
                </FormItem>
                <FormItem label="图片"
                          :prop="'carouselData.' + index + '.img'"
                          :rules="{ validator: (rule, value, callback) => {checkFun(rule, value, callback, '图片')}, trigger: ''}">
                  <Upload :action="uploadUrl + '/uploadFdfs'" :format="['png', 'jpg']" name="uploadfile"
                          :on-success="uploadWheelImg" :show-upload-list="false" :on-format-error="formatError"
                          :before-upload="beforeUploadWheelImg">
                    <Button icon="ios-cloud-upload-outline" size="small">上传</Button>
                  </Upload>
                  <div>
                    <div v-if="wheelItem.img">
                      <img :src="wheelItem.img" class="img-occupied img-bg"
                           :style="{'width': itemEditData.width/4 + 'px', 'height': itemEditData.height/4 + 'px'}">
                      <span>{{itemEditData.width}}*{{itemEditData.height}}</span>
                    </div>
                    <i class="img-occupied"
                       :style="{'width': itemEditData.width/4 + 'px', 'height': itemEditData.height/4 + 'px'}" v-else>{{itemEditData.width}}*{{itemEditData.height}}</i>
                  </div>
                </FormItem>
              </div>
            </div>

            <div>
              <Button type="text" class="hide-focus" @click="addCreate">+增加创意</Button>
            </div>
          </div>
          <FormItem>
            <Button type="primary" @click="saveItem" style="margin-top: 10px;">保存</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  import imgOcupied from '@/assets/images/ocupied.png'
  import AddChanel from './add.vue'
  import DragList from '_c/drag-list'
  import {formatDate} from '@/libs/date'
  import axios from 'axios'
  import {
    getPreview,
    httpChannelList,
    cancel,
    httpChannelDetail,
    httpRuleList,
    httpModuleList,
    httpUpdateSort,
    httpSave,
    httpTVPreview,
    httpPublish,
    reqTypelist
  } from '@/api/launcher'
  import {deepcopy} from '@/libs/deepcopy'
  import {on, off} from '@/libs/tools'

  const initEdit = {
    pageId: '',
    pageName: '',
    pageDescription: '',
    isDefault: 0,
    channelStatus: 1,
    tabFocusImg: '',
    background: '',
    tabImg: '',
    lazyLoad: 0,
    lazyloadingdata: {
      recommendRulesId: '',
      sort: '',
      vipPriority: ''

    }
  }
  const itemEditData = {
    openType: '',
    openSubType: '',
    openEpId: '',
    openEqId: '',
    openSpecialId: '',
    openGameId: '',
    openParam: '',
    scrollTop: 0,
    carousel: false,
    carouselData: []
  }
  const carouselItemData = {
    openType: '',
    openSubType: '',
    openEpId: '',
    openEqId: '',
    openSpecialId: '',
    openGameId: '',
    openParam: '',
    scrollTop: 0,
    title: '',
    isOpen: false,
    showDelete: false
  }

  const CancelToken = axios.CancelToken

  export default {
    name: 'content_management',
    data() {
      return {
        imgOcupied,
        activeIndex: '',
        tabsName: [], // 添加名称去重时使用
        addModule: false,
        setRule: false,
        setTimePublish: false,
        TVpreview: false,
        showLeave: false,
        contentPage: true,
        addChanel: false,
        showPreview: false,
        showPubTip: false,
        saveFlag: true, // 保存按钮是否被点亮
        uploadUrl: '',
        formatDate,
        editItemid: {
          itemId: '',
          rowIndex: '',
          rowkIndex: '',
          itemIndex: '',
          itemOutIndex: ''
        },
        initEdit,
        setIndex: '', // 点击设置保存当前index
        previewData: {}, // 预览弹框data
        listData: [], // 请求的所有list数据
        saveData: {}, // 单页保存数据
        channelData: {}, // 新建修改数据
        pageId: '', // 当前页id
        mac: '', // TV预览中mac
        notsave: false, // 没有保存弹出弹框
        publicSpecificTime: null, // 定时发布时间
        itemEditData, // 坑位编辑
        setRuleData: {},
        addModuleData: {},
        typeList: [],
        typeList2: [],
        typeList3: [],
        setRuleValidate: {
          contentTitle: [{required: true}],
          moduleTitleHide: [{required: true}],
          operation: [{required: true}]
        },
        itemEditRule: {
          title: [{required: true, message: '标题名称不能为空！', trigger: 'blur'}],
          openType: [{required: true, message: '跳转类型不能为空！'}],
          openSubType: [{required: true, message: '二级不能为空！'}],
          openEpId: [{required: true, message: 'id不能为空！'}],
          img: [{required: true, message: '请上传图片！'}],
          openEqId: [{required: true, message: 'id不能为空！'}],
          openSpecialId: [{required: true, message: 'id不能为空！'}],
          // openGameId: [{required: true, message: 'id不能为空！'}],
          openParam: [{required: true, message: '跳转参数不能为空！'}],
          openAppId: [{required: true, message: '应用id不能为空！'}],
          openAppName: [{required: true, message: '应用名称不能为空！'}],
          openAppPackage: [{required: true, message: '应用包名不能为空！'}]
        },
        hasChangeNotSave: false, // 是否有页面未保存
        publishTime: 'init', // 定时发布还是立即发布
        chooseIndex: '',
        setInfoLoading: false,
        previewLoading: false,
        carouselItemData,
        itemMin: 0,
        itemMax: 0,
        carouselTypeList: [],
        carouselOpenIndex: -1,  //当前展开创意位置，全部关闭 -1
        carouselValid: true,
        canCarousel: true,
        isCarouselUpload: false,
        localBannerItems: [],
        hadEdit: false,
        imgUpload: false,
        source: CancelToken.source()
      }
    },
    components: {AddChanel, DragList},
    created() {
      this.getListData()
      this.uploadUrl = 'http://api.scloud.gome.inc/uploadfile'
      // 加载跳转类型列表
      this.getTypeList()
      // console.log(this.itemEditData)
    },
    mounted() {

    },
    watch: {
      saveData: {
        handler: function (val, oldval) {
          const newIndex = this.getRowIndex(val.pageId)
          if (newIndex !== -1 && JSON.stringify(this.listData[newIndex]) !== JSON.stringify(this.saveData)) {
            this.hasChangeNotSave = true
            console.log('saveData数据变化')
          }
        },
        deep: true,
        immediate: true
      },
      showPreview: {
        handler: function (newVal, oldval) {
          if (!newVal) {
            cancel && cancel('stop by user')
          }
        },
        immediate: true
      },
      contentPage: {
        handler: function (newVal, oldVal) {
          if (newVal) {
            itemEditData.carouselData = []
          }
        }
      }
    },
    computed: {
      saveOrPublic() {
        return this.saveFlag || this.hasChangeNotSave
      }
    },
    methods: {
      handleDrag({src, target, oldIndex, newIndex}) {
        if (oldIndex !== newIndex) {
          // 只有移动位置才请求接口
          const newSort = {sortData: {pageId: []}}
          this.$nextTick(async function () {
            // [this.tabsName[oldIndex], this.tabsName[newIndex]] = [this.tabsName[newIndex], this.tabsName[oldIndex]]
            const newPageId = []
            this.listData.forEach(item => {
              newPageId.push(item.pageId)
            })
            newSort.sortData.pageId = newPageId
            try {
              const res = await httpUpdateSort({sortData: JSON.stringify(newSort.sortData)})
              if (res.errno !== 10000) {
                this.getListData()
                throw res.errmsg
              }
            } catch (e) {
              this.$Message.error(e || '页面拖动失败!')
            }
          })
        }
      },
      async getListData(isSave) {
        try {
          const res = await httpChannelList()
          if (res.errno === 10000) {
            this.tabsName = []
            this.listData = res.data.list
            this.countOrder(true)
            // 如果初次加载页面，点亮第一个（不为下线）的tab，否则停留在当前页面
            if (!this.pageId) {
              // 默认第一个（不为下线）tab点亮
              const index = this.getOnlineIndex()
              this.activeIndex = this.listData[index].pageId
              // 默认第一个（不为下线）tab为当前页
              this.saveData = JSON.parse(JSON.stringify(this.listData[index]))
              // 记录当前页id
              this.pageId = this.saveData.pageId
            } else {
              const index = this.getRowIndex(this.pageId)
              this.saveData = JSON.parse(JSON.stringify(this.listData[index]))
            }
            // 过滤出tab名称
            this.listData.forEach(item => {
              this.tabsName.push({name: item.pageName, id: item.pageId})

              // // 新增：如果没有保存过，没有上线、隐藏字段则给初始值
              // item.rows.forEach(row => {
              //   if (!row.hasOwnProperty('hidden')) {
              //     row.hidden = false
              //   }
              // })
            })
            // 初次加载list列表，点亮保存按钮
            if (!isSave) this.saveFlag = true
          }
        } catch (e) {
          console.log(e)
          // 获取到请求数据之后，清空标识
          this.hasChangeNotSave = false
        }
      },
      changeChannel(id) {
        // 是否保存
        if (this.hasChangeNotSave) {
          this.showLeave = true
          return
        }
        this.saveFlag = true
        this.activeIndex = id
        // 记录当前页面id
        this.pageId = id
        const newIndex = this.getRowIndex(this.pageId)
        this.saveData = JSON.parse(JSON.stringify(this.listData[newIndex]))
        // this.hasChangeNotSave = false
      },
      async getPreviewData() {
        try {
          this.previewLoading = true
          const res = await getPreview({pageId: this.pageId})
          if (res.errno === 10000) {
            this.previewData = res.data
            console.log('返回数据', this.previewData)
          } else {
            throw res.errmsg
          }
        } catch (e) {
          console.log('cancel', e)
          this.previewData = {}
          if (axios.isCancel(e)) {
            console.log('Request canceled', e.message)
          } else {
            // 处理错误
            this.$Message.error(e)
          }
        } finally {
          this.previewLoading = false
        }
      },
      goBack(saveScroll) {
        this.addChanel = !(this.contentPage = true)
        if (saveScroll) {
          // 图片编辑后，返回到原页面编辑位置
          this.scrollTo()
        }
        // if (this.canCarousel && !this.hadEdit &&  this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].itemMin) {
        //   this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems = this.localBannerItems
        // }
        if (this.imgUpload) {
          this.source.cancel('上传取消')
        }
      },
      logId(id) {
        this.activeIndex = id
        this.pageId = id
      },
      preview() {
        this.showPreview = true
        this.getPreviewData()
      },
      // 内容保存
      saveEdit() {
        // 空页面保存提示
        if (!this.saveData.rows.length) {
          this.$Message.warning('页面为空不可保存~')
          return
        }
        // 非首屏校验是否填写标题
        this.$refs.contentForm.validate(async (valid) => {
          if (valid) {
            this.saveData.rows.forEach(row => {
              // 没有setInfo,添加
              if (!row.setInfo) {
                row.setInfo = {
                  contentTitle: 0,
                  moduleTitleHide: false,
                  operation: 'artificial'
                }
              }
              // 将moduleTitleHide转为boolean(设置规则中)
              if (typeof row.setInfo.moduleTitleHide !== 'boolean') {
                row.setInfo.moduleTitleHide = Boolean(row.setInfo.moduleTitleHide)
              }
              // itemSet去掉position
              // row.rows.forEach((item) => {
              //   item.items.forEach((val) => {
              //     if (Object.keys(val.itemSet).length === 1 && val.itemSet.position) {
              //       delete val.itemSet.position
              //     }
              //     if (val.items && val.items.length !== 0) {
              //       // 子item
              //       val.items.forEach((sonval) => {
              //         if (Object.keys(sonval.itemSet).length === 1 && sonval.itemSet.position) {
              //           delete sonval.itemSet.position
              //         }
              //       })
              //     }
              //   })
              // })
            })
            try {
              console.log('保存', {channelData: this.saveData})
              const res = await httpSave({channelData: JSON.stringify(this.saveData)})
              if (res.errno === 10000) {
                this.hasChangeNotSave = false
                this.saveFlag = false
                this.publishTime = 'init'
                // 保存后不刷新列表，依次更改saveData和listData的发布状态会影响saveData状态改变，所以改为刷新
                this.getListData(true)
              } else {
                throw res.errmsg
              }
            } catch (e) {
              console.log(e)
            }
          } else {
            this.$Message.error('请将内容填写完整！')
          }
        })
      },
      moveUp(index) {
        if (index !== 0) {
          this.saveData.rows[index - 1] = this.saveData.rows.splice(index, 1, this.saveData.rows[index - 1])[0]
          this.updateSave()
        }
      },
      moveDown(index) {
        if (index !== this.saveData.rows.length - 1) {
          this.saveData.rows[index] = this.saveData.rows.splice(index + 1, 1, this.saveData.rows[index])[0]
          this.updateSave()
        }
      },
      deleteRow(index) {
        this.saveData.rows.splice(index, 1)
        this.updateSave()
      },
      saveSetting() {
        this.$refs.setRuleForm.validate((valid) => {
          if (valid) {
            if (this.setRuleData.recommondRules) delete this.setRuleData.recommondRules
            this.saveData.rows[this.setIndex].setInfo = JSON.parse(JSON.stringify(this.setRuleData))
            this.saveData = Object.assign({}, this.saveData)
            this.setRule = false
          } else {
            this.$Message.error('请将表单填写完整')
          }
        })
      },
      async showSetRule(index) {
        this.setRuleData = {}
        this.setInfoLoading = true
        this.setRule = true
        // 存当前index，保存时替代数据
        this.setIndex = index
        // 未被设置的setInfo与saveData建立联系
        if (this.saveData.rows[index].setInfo) {
          if (this.saveData.rows[index].setInfo.operation === 'auto') {
            // 推荐规则列表
            try {
              const res = await httpRuleList({page_size: 100000})
              if (res.errno === 10000) {
                this.setRuleData = JSON.parse(JSON.stringify(this.saveData.rows[index].setInfo))
                // 字符串转为数字
                this.setRuleData.contentTitle = Number(this.setRuleData.contentTitle)
                this.setRuleData.moduleTitleHide = Number(this.setRuleData.moduleTitleHide)
                if (this.setRuleData.updateFrequency) this.setRuleData.updateFrequency = Number(this.setRuleData.updateFrequency)
                this.setRuleData.recommondRules = res.data.list
                // 解决视图不更新
                this.setRuleData = Object.assign({}, this.setRuleData)
              } else {
                throw res.errmsg
              }
            } catch (e) {
              console.log(e)
            } finally {
              this.setInfoLoading = false
            }
          } else {
            // 手动运营
            this.setRuleData = JSON.parse(JSON.stringify(this.saveData.rows[index].setInfo))
            // 字符串转为数字
            this.setRuleData.contentTitle = Number(this.setRuleData.contentTitle)
            this.setRuleData.moduleTitleHide = Number(this.setRuleData.moduleTitleHide)
            this.setRuleData = Object.assign({}, this.setRuleData)
            this.setInfoLoading = false
          }
        } else {
          this.setRuleData = {contentTitle: 0, moduleTitleHide: 0, operation: 'artificial'}
          this.setInfoLoading = false
        }
        // 如果当前更新频率没有选择单位，默认为小时，并将24整数倍转为天
        // this.setRuleData.unit = 'hour'
        // if (this.setRuleData.updateFrequency >= 24 && this.setRuleData.updateFrequency % 24 === 0) {
        //   this.setRuleData.updateFrequency = this.setRuleData.updateFrequency / 24
        //   this.setRuleData.unit = 'day'
        // }
      },
      async addOrEditChannel(isadd) {
        // 是否保存
        if (this.hasChangeNotSave) {
          this.showLeave = true
          return
        }
        if (isadd) {
          this.channelData = JSON.parse(JSON.stringify(initEdit))
          this.contentPage = !(this.addChanel = true)
        } else {
          this.channelData = JSON.parse(JSON.stringify(initEdit))
          // 调用修改接口，获取详情
          const res = await httpChannelDetail({pageId: this.pageId})
          if (res.errno === 10000) {
            this.channelData = Object.assign({}, this.channelData, res.data)
            // 字符串转为数字
            if (this.channelData.channelStatus) this.channelData.channelStatus = Number(this.channelData.channelStatus)
            if (this.channelData.isDefault) this.channelData.isDefault = Number(this.channelData.isDefault)
            this.contentPage = !(this.addChanel = true)
            if (this.channelData.rows) delete this.channelData.rows
            this.channelData.lazyLoad = this.channelData.lazyloading ? 1 : 0
          }
        }
      },
      // 点击坑位编辑
      editItem(itemId, rowIndex, isItemIn) {
        this.handleScroll()
        this.addChanel = this.contentPage = false
        let canCarousel = false
        // 图片尺寸赋值
        const {rowkIndex, itemIndex, itemOutIndex} = this.getItemIndex(itemId, rowIndex, isItemIn)
        this.editItemid.rowkIndex = rowkIndex
        this.editItemid.itemIndex = itemIndex
        this.editItemid.itemOutIndex = itemOutIndex

        let newData = {}
        let width = 0
        let height = 0
        let noCarouselWidth = 0
        let noCarouselHeight = 0
        if (this.saveData.rows[rowIndex].rows[rowkIndex].rowType === 'metro_grid') {
          // grid给的是比例，list给的直接宽高，电影模块和轮播模块的frontHeight 是直接高度，轮播模块内给的是轮播内的图片宽高，需要去外层查找
          if (isItemIn) {
            if (this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].itemMin) {
              this.hadEdit = false
              this.localBannerItems = [].concat(this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].bannerItems)
              newData = {
                ...this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].itemSet,
                itemIn: true
              }
              width = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].bannerItems[itemIndex].width
              height = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].bannerItems[itemIndex].frontHeight || this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].bannerItems[itemIndex].height * (this.saveData.rows[rowIndex].rows[rowkIndex].rowHeight / 3)
              if (itemId !== 1 && !this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].bannerItems[itemIndex].frontHeight) {
                height = height - 12
              }
            } else {
              newData = {
                ...this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].items[itemIndex].itemSet,
                itemIn: true
              }
              width = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].items[itemIndex].width
              height = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].items[itemIndex].frontHeight || this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].items[itemIndex].height * (this.saveData.rows[rowIndex].rows[rowkIndex].rowHeight / 3)
              if (itemId !== 1 && !this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].items[itemIndex].frontHeight) {
                height = height - 12
              }
            }

          } else {
            newData = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemIndex].itemSet
            width = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemIndex].width
            height = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemIndex].frontHeight || this.saveData.rows[rowIndex].rows[rowkIndex].items[itemIndex].height * (this.saveData.rows[rowIndex].rows[rowkIndex].rowHeight / this.saveData.rows[rowIndex].rows[rowkIndex].items[0].height)
            if (itemId !== 1 && !this.saveData.rows[rowIndex].rows[rowkIndex].items[itemIndex].frontHeight) {
              height = height - 12
            }
          }
          // 判断是否可以轮播，如果是轮播，添加两个新的外层宽高，给不轮播的时候使用
          if (this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex] && this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].itemMin) {
            canCarousel = true
            let itemMin = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].itemMin
            let itemMax = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].itemMax
            this.itemMin = itemMin
            this.itemMax = itemMax
            let len = 0
            if (!this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].itemSet.carouselData) {
              if (itemMin || itemMin === 0) {
                noCarouselWidth = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].width
                noCarouselHeight = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].bannerItems[itemIndex].height
                let newWheelData = []
                len = itemMin
                for (let i = 0; i < len; i++) {
                  newWheelData.push(Object.assign({}, this.carouselItemData))
                }
                itemEditData.carouselData = newWheelData
              }
            } else {
              len = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].itemSet.carouselData.length
              this.itemEditData.carouselData = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemOutIndex].itemSet.carouselData
            }
            let newCarouselTypeList = []
            for (let i = 0; i < len; i++) {
              let newTypeList = {
                typeList: [].concat(this.typeList),
                typeList2: [],
                typeList3: [],
              }
              newCarouselTypeList.push(newTypeList)
            }
            // this.itemEditData = JSON.parse(JSON.stringify(Object.assign({}, itemEditData, {carouselData: newWheelData})))
            this.carouselTypeList = newCarouselTypeList
          }
        } else {
          newData = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemIndex].itemSet
          width = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemIndex].width
          height = this.saveData.rows[rowIndex].rows[rowkIndex].items[itemIndex].height
        }
        // 根据判断坑位是否可以轮播，展示或者隐藏勾选按钮
        this.canCarousel = canCarousel
        this.itemEditData = JSON.parse(JSON.stringify(Object.assign({}, itemEditData, newData, {
          width,
          height,
          noCarouselWidth,
          noCarouselHeight
        })))
        this.itemEditData.carousel = this.itemEditData.carousel === '1' || this.itemEditData.carousel === true ? '1' : '0'
        // 存id和index，方便保存使用
        this.editItemid.rowIndex = rowIndex
        this.editItemid.itemId = itemId
        // 将跳转类型二三级初始化
        if (this.itemEditData.openType) {
          const index = this.findTypelistIndex(this.typeList, this.itemEditData.openType)
          if (index !== -1) {
            this.typeList2 = deepcopy(this.typeList[index])
            const index2 = this.findTypelistIndex(this.typeList2.list, this.itemEditData.openSubType)
            this.typeList3 = index2 === -1 ? {} : deepcopy(this.typeList2.list[index2])
          } else {
            this.typeList2 = {}
            this.typeList3 = {}
          }
        } else {
          this.typeList2 = {}
          this.typeList3 = {}
        }
        if (this.itemEditData.carousel === '1') {
          let newCarouselTypeList = []
          // console.log(this.carouselTypeList.length)
          for (let i = 0; i < this.carouselTypeList.length; i++) {
            let carousel = this.carouselTypeList[i]
            let carouselItem = this.itemEditData.carouselData[i]
            let typeList = carousel.typeList
            let typeList2 = {}
            let typeList3 = {}
            const index = this.findTypelistIndex(typeList, carouselItem.openType)
            if (index !== -1) {
              typeList2 = deepcopy(typeList[index])
              const index2 = this.findTypelistIndex(typeList2.list, carouselItem.openSubType)
              typeList3 = index2 === -1 ? {} : deepcopy(typeList2.list[index2])
            }
            newCarouselTypeList.push({typeList, typeList2, typeList3})
          }
          this.carouselTypeList = newCarouselTypeList
        }
        // 处理轮播二三级初始化
        // console.log(this.carouselTypeList)
        // console.log(this.itemEditData)

      },
      // 切换级联菜单后，初始化参数
      initCascading() {
        // 将所有跳转参数置空
        this.initTypelistParam(true)
        this.typeList3 = {}
        this.typeList2 = {}
        // 给二级菜单加初始化数据
        const index = this.findTypelistIndex(this.typeList, this.itemEditData.openType)
        this.typeList2 = deepcopy(this.typeList[index])
      },
      // 切换二级菜单，初始化参数
      init_sec_cascading() {
        // 将第二级跳转参数置空
        this.initTypelistParam()
        // 给二级菜单加初始化数据
        const index = this.findTypelistIndex(this.typeList2.list, this.itemEditData.openSubType)
        if (index !== -1 && this.typeList3) this.typeList3 = deepcopy(this.typeList2.list[index])
      },
      // 清空图片编辑中跳转类型的数据
      initTypelistParam(isfirst) {
        this.typeList.forEach(list1 => {
          if (list1.list && list1.list.length) {
            list1.list.forEach(list2 => {
              // 二级不清空数据
              if (isfirst && this.itemEditData.openSubType) this.itemEditData.openSubType = ''
              if (list2.list && list2.list.length) {
                list2.list.forEach(list3 => {
                  this.itemEditData[list3.key] = ''
                })
              }
            })
          }
        })
      },
      // 找到图片编辑中，跳转类型的第二级和第三级
      findTypelistIndex(list, value) {
        return list.findIndex(item => {
          return item.value === value
        })
      },
      // 初始化imgEditData
      initEditImgData() {
        itemEditData.openType = ''
        this.typeList.forEach(list1 => {
          if (list1.list && list1.list.length) {
            list1.list.forEach(list2 => {
              itemEditData[list2.key] = ''
              if (list2.list && list2.list.length) {
                list2.list.forEach(list3 => {
                  itemEditData[list3.key] = ''
                })
              }
            })
          }
        })
      },
      // 初始化跳转类型的prop
      initJumpProp() {
        this.typeList.forEach(list1 => {
          if (list1.list && list1.list.length) {
            list1.list.forEach(list2 => {
              if (list2.list && list2.list.length) {
                list2.list.forEach(list3 => {
                  if (!this.itemEditRule[list3.key] && list3.required) this.itemEditRule[list3.key] = [{
                    required: true,
                    message: '内容不能为空！'
                  }]
                })
              }
            })
          }
        })
      },
      validateCarousel(index) {
        let carouselData = this.itemEditData.carouselData
        carouselData[index].isOpen = true
        this.$nextTick(() => {
          this.$refs.editItemForm.validate((valid) => {
            if (valid) {
              carouselData[index].isOpen = false
              this.$nextTick(() => {
                if (carouselData.length - 1 === index) return
                this.validateCarousel(index + 1)
              })
            } else {
              // 为空不可保存
              // this.$Message.error('当前页数据为空，请填写后保存哦~')
              this.$Message.error('请将数据补全哦~')
              this.carouselOpenIndex = index
              this.carouselValid = false
            }
          })
        })
      },
      // 坑位保存
      saveItem() {
        if (this.isCarouselUpload) {
          this.$Message.error('图片还未上传完，请稍后保存~')
          return
        }
        this.carouselValid = true
        console.log('scroll', this.scrollTop)
        // 如果是轮播时候保存
        if (this.itemEditData.carousel === '1') {
          // 遍历轮播数据，打开个个轮播数据进行校验
          this.validateCarousel(0)
          // 因为隐藏的表单无法校验，所以需要分别展开渲染，而最后的校验属性carouselValid 可能在$nextTick异步前就执行，所以需要一个计时器来推迟
          setTimeout(() => {
            // console.log(this.carouselValid)
            if (this.carouselValid) {
              // 清空外层数据
              let clearObj = {
                openType: '',
                openSubType: '',
                openEpId: '',
                openEqId: '',
                openSpecialId: '',
                openGameId: '',
                openParam: '',
                description: '',
                img: '',
                position: '',
                title: ''
              }
              this.itemEditData = Object.assign(this.itemEditData, clearObj)
              const {rowkIndex, itemIndex, itemOutIndex} = this.getItemIndex(this.editItemid.itemId, this.editItemid.rowIndex, true)
              let carouselData = this.itemEditData.carouselData
              let i = 0
              let bannerItem = this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems[0]
              while (i < carouselData.length) {
                if (!this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems[i]) {
                  this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems[i] = Object.assign({}, bannerItem)
                }
                let itemSet = this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems[i].itemSet
                itemSet = Object.assign({}, itemSet, carouselData[i], {itemCarousel: this.itemEditData.carousel})
                // console.log(this.saveData.rows[this.editItemid.rowIndex].rows[rowkIndex].items[itemOutIndex].items[i].itemSet)
                this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems[i].itemSet = itemSet
                i++
              }
              // this.saveData.rows[this.editItemid.rowIndex].rows[rowkIndex].items[itemOutIndex].items[itemIndex].itemSet = JSON.parse(JSON.stringify(this.itemEditData))


              this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemIndex].itemSet = JSON.parse(JSON.stringify(this.itemEditData))
              this.saveData = Object.assign({}, this.saveData)
              // console.log('坑位编辑轮播', this.itemEditData)
              console.log('坑位编辑轮播s', this.saveData)
              // console.log(this.itemEditData)
              this.hadEdit = true
              this.goBack(true)
            }
          }, this.itemEditData.carouselData.length * 75)

        } else {
          this.$refs.editItemForm.validate((valid) => {
            if (valid) {
              // 清空轮播内数据
              let newWheelData = []
              let newCarouselTypeList = []
              for (let i = 0; i < this.itemMin; i++) {
                let newTypeList = {
                  typeList: [].concat(this.typeList),
                  typeList2: [],
                  typeList3: [],
                }
                newWheelData.push(Object.assign({}, this.carouselItemData))
                newCarouselTypeList.push(newTypeList)
              }
              this.itemEditData.carouselData = newWheelData
              this.carouselTypeList = newCarouselTypeList

              // if (this.itemEditData.title || this.itemEditData.openType || this.itemEditData.description || this.itemEditData.img) {
              // 不为空时候
              if (this.itemEditData.itemIn) {
                const {rowkIndex, itemIndex, itemOutIndex} = this.getItemIndex(this.editItemid.itemId, this.editItemid.rowIndex, true)

                if (this.canCarousel) {
                  let len = this.saveData.rows[this.editItemid.rowIndex].rows[rowkIndex].items[itemOutIndex].bannerItems.length
                  this.saveData.rows[this.editItemid.rowIndex].rows[rowkIndex].items[itemOutIndex].bannerItems.splice(1, len)
                  this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemIndex].itemSet = JSON.parse(JSON.stringify(this.itemEditData))
                } else {
                  this.saveData.rows[this.editItemid.rowIndex].rows[rowkIndex].items[itemOutIndex].items[itemIndex].itemSet = JSON.parse(JSON.stringify(this.itemEditData))
                }
              } else {
                const {rowkIndex, itemIndex} = this.getItemIndex(this.editItemid.itemId, this.editItemid.rowIndex)
                this.saveData.rows[this.editItemid.rowIndex].rows[rowkIndex].items[itemIndex].itemSet = JSON.parse(JSON.stringify(this.itemEditData))
              }
              this.saveData = Object.assign({}, this.saveData)
              console.log('坑位编辑', this.saveData)

              this.goBack(true)

            } else {
              // 为空不可保存
              // this.$Message.error('当前页数据为空，请填写后保存哦~')
              this.$Message.error('请将数据补全哦~')
            }
          })
        }
      },
      goAddModule() {
        this.addModule = true
        // 初始化加入默认非首屏
        this.addModuleData.firstScreen = 0
        this.getModuleList()
        // 初始化隐藏选择按钮
        // document.querySelectorAll('.choose-hidden').forEach(dom => {
        //   dom.style.opacity = 0
        // })
        this.chooseIndex = ''
      },
      // 模态框点击隐藏选择
      // addmoduleclick (e) {
      //   e.target.querySelectorAll('.choose-hidden').forEach(dom => {
      //     dom.style.opacity = 0
      //   })
      // },
      // 请求添加模块列表
      async getModuleList() {
        try {
          const res = await httpModuleList({firstScreen: this.addModuleData.firstScreen})
          if (res.errno === 10000) {
            this.addModuleData.list = res.data.list
            this.chooseIndex = ''
            this.addModuleData = Object.assign({}, this.addModuleData)
            this.countOrder()
          } else {
            throw res.errmsg
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getTypeList() {
        const res = await reqTypelist()
        if (res.errno === 10000) {
          this.typeList = res.data.list
          this.initEditImgData()
          this.initJumpProp()
        }
      },
      chooseImgList(e, index) {
        // 隐藏其他选择按钮，点亮当前选择
        // document.querySelectorAll('.choose-hidden').forEach(dom => {
        //   dom.style.opacity = 0
        // })
        // document.querySelectorAll('.choose-hidden')[index].style.opacity = 1
        this.chooseIndex = index
        // 不更新
        this.addModuleData = Object.assign({}, this.addModuleData)
      },
      chooseModule(index) {
        // 如果有首屏不能添加首屏
        const newindex = this.saveData.rows.findIndex(item => {
          return item.firstScreen == 1
        })
        this.addModuleData.list.forEach((list) => {
          list.moduleId = list._id
        })
        if (newindex !== -1 && this.addModuleData.firstScreen == 1) {
          this.$Message.error('您已经添加过首屏！')
        } else if (this.addModuleData.firstScreen == 1) {
          // 是首屏插入到第一条
          this.saveData.rows.unshift({...this.addModuleData.list[index], firstScreen: this.addModuleData.firstScreen})
          this.addModule = false
        } else {
          this.saveData.rows.push({...this.addModuleData.list[index], firstScreen: this.addModuleData.firstScreen})
          this.addModule = false
        }
      },
      async setPublishTime(type) {
        console.log('时间', this.publicSpecificTime, this.publicSpecificTime.valueOf(), this.publicSpecificTime.valueOf() / 1000)
        const specificTime = {publishTime: Math.round(this.publicSpecificTime.valueOf() / 1000)}
        const params = type === 'setTime' ? {pageId: this.pageId, ...specificTime} : {pageId: this.pageId}
        if (type === 'setTime' && !this.publicSpecificTime) {
          this.$Message.error('请选择发布时间~')
          return
        }
        try {
          const res = await httpPublish(params)
          if (res.errno === 10000) {
            this.publishTime = type
            this.showPubTip = false
            this.$Message.success('发布成功，敬请期待~')
            this.setTimePublish = false
            // 刷新列表请求数据，不刷新无法获取最近发布时间
            this.getListData()
          } else {
            throw res.errmsg
          }
        } catch (e) {
          this.$Message.error(e)
        }
      },
      setTimeP() {
        this.setTimePublish = true
        this.publicSpecificTime = ''
      },
      // 放弃修改
      giveUpModify() {
        this.getListData()
        this.showLeave = false
        this.hasChangeNotSave = false
      },

      uploadFile (file, successCb, failCb, finalCb) {
        let token = this.source.token
        console.log(token)
        let url = this.uploadUrl + '/uploadFdfs'
        let formData = new FormData()
        formData.append('uploadfile', file)
        axios.request({
          url,
          data: formData,
          method: 'post',
          upload: true,
          cancelToken: token
        }).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.imgUpload = false
            this.itemEditData.img = data.data.fileUrl
            this.itemEditData = Object.assign({}, this.itemEditData)
          } else {
            failCb && failCb(data.errmsg)
          }
          finalCb && finalCb(data)
        })
      },
      isUpload(file) {
        this.imgUpload = true
        this.uploadFile(file)
        return false
      },
      uploadItemImg(response, file, fileList) {
        // if (response.errno === 10000) {
        //   this.imgUpload = false
        //   this.itemEditData.img = response.data.fileUrl
        //   this.itemEditData = Object.assign({}, this.itemEditData)
        // } else {
        //   this.$Message.error(response.errmsg)
        // }
      },
      async TVconfirm() {
        try {
          const res = await httpTVPreview({pageId: this.pageId, mac: this.mac})
          if (res.errno === 10000) {
            this.TVpreview = false
          } else {
            throw res.errmsg
          }
        } catch (e) {
          console.log(e)
          this.$Message.error(e)
        }
      },
      // 更改运营方式时候，设置自动运营默认更新频率为24
      async changeOperationMode() {
        if (this.setRuleData.operation === 'auto' && !this.setRuleData.updateFrequency) this.setRuleData.updateFrequency = 24
        if (this.setRuleData.operation === 'auto') {
          // 请求接口
          this.getRecommendRulesList()
        }
      },
      async getRecommendRulesList() {
        try {
          const res = await httpRuleList({page_size: 100000})
          if (res.errno === 10000) {
            // this.setRuleData = JSON.parse(JSON.stringify(this.saveData.rows[index].setInfo))
            // // 字符串转为数字
            // this.setRuleData.contentTitle = Number(this.setRuleData.contentTitle)
            // if (this.setRuleData.updateFrequency) this.setRuleData.updateFrequency = Number(this.setRuleData.updateFrequency)
            this.setRuleData.recommondRules = res.data.list
            // 解决视图不更新
            this.setRuleData = Object.assign({}, this.setRuleData)
          } else {
            throw res.errmsg
          }
        } catch (e) {
          this.$Message.error(e || '推荐规则列表加载出错~')
        }
      },
      getOnlineIndex() {
        return this.listData.findIndex(s => {
          return s.channelStatus == 1
        })
      },
      getRowIndex(id) {
        return this.listData.findIndex(s => {
          return s.pageId === id
        })
      },
      getItemIndex(id, index, isItemIn) {
        let itemIndex = -1
        let rowkIndex = -1
        let itemOutIndex = -1
        this.saveData.rows[index].rows.every((s, i) => {
          if (!isItemIn) {
            itemIndex = s.items.findIndex(s => {
              return s.itemSet.position === id
            })
          } else {
            s.items.forEach((item, index) => {
              if (item.items && item.items.length !== 0) {
                itemIndex = item.items.findIndex(s => {
                  return s.itemSet.position === id
                })
                itemOutIndex = index
              } else if (item.bannerItems && item.bannerItems.length !== 0) {
                itemIndex = item.bannerItems.findIndex(s => {
                  return s.itemSet.position === id
                })
                itemOutIndex = index
              }
            })
          }
          if (itemIndex !== -1) {
            rowkIndex = i
            return false
          } else return true
        })
        return {itemIndex, rowkIndex, itemOutIndex}
      },
      // 触发saveData更新
      updateSave() {
        this.saveData = Object.assign({}, this.saveData)
      },
      formatError() {
        this.$Message.error("目前只支持'jpg'和'png'格式")
      },
      // 计算item位置
      countOrder(list) {
        if (list) {
          this.listData.forEach((list) => {
            if (list.rows) {
              list.rows.forEach((rows) => {
                let position = 0
                rows.rows.forEach((row) => {
                  row.items.forEach((item) => {
                    position++
                    if (item.itemSet) item.itemSet.position = position
                    else {
                      item.itemSet = {}
                      item.itemSet.position = position
                    }
                    if (item.itemMin || item.itemMin === 0) {
                      if (item.bannerItems) {
                        item.bannerItems.forEach((itemIn) => {
                          if (itemIn.itemSet) itemIn.itemSet.position = position
                          else {
                            itemIn.itemSet = {}
                            itemIn.itemSet.position = position
                          }
                          position++
                        })
                      }
                    } else {
                      if (item.items) {
                        item.items.forEach((itemIn) => {
                          if (itemIn.itemSet) itemIn.itemSet.position = position
                          else {
                            itemIn.itemSet = {}
                            itemIn.itemSet.position = position
                          }
                          position++
                        })
                      }
                    }
                  })
                })
              })
            }
          })
        } else {
          this.addModuleData.list.forEach((list) => {
            let position = 0
            list.rows.forEach((rows) => {
              rows.items.forEach((item) => {
                position++
                if (item.itemSet) item.itemSet.position = position
                else {
                  item.itemSet = {}
                  item.itemSet.position = position
                }
                if (item.itemMin || item.itemMin === 0) {
                  if (item.bannerItems) {
                    item.bannerItems.forEach((itemIn) => {
                      if (itemIn.itemSet) itemIn.itemSet.position = position
                      else {
                        itemIn.itemSet = {}
                        itemIn.itemSet.position = position
                      }
                      position++
                    })
                  }
                } else {
                  if (item.items) {
                    item.items.forEach((itemIn) => {
                      if (itemIn.itemSet) itemIn.itemSet.position = position
                      else {
                        itemIn.itemSet = {}
                        itemIn.itemSet.position = position
                      }
                      position++
                    })
                  }
                }
              })
            })
          })
        }
      },
      // 记录滚动条位置
      handleScroll() {
        this.scrollTop = this.$refs.contentMain.parentNode.scrollTop
      },
      // 滚动滚动条到记录位置
      scrollTo() {
        this.$nextTick(() => {
          this.$refs.contentMain.parentNode.scrollTop = this.scrollTop
        })
      },

      // 校验规则修改，轮播内的校验需要根据创意个数添加规则
      checkFun(rule, value, callback, name) {
        if (!value) {
          callback(new Error(name + '不能为空'))
        } else {
          callback()
        }
      },

      // 删除图标判断点击的是第几个，如果小于或者大于 限制个数，则提示不能删除， 否则提示是否删除确认
      makeSureDelete(index) {
        let carousel = this.itemEditData.carouselData
        let len = carousel.length
        if (len <= this.itemMin) {
          this.$Modal.warning({
            title: '无法删除创意',
            content: '已达到最小创意数'
          })
          return
        }
        for (let i = 0; i < len; i++) {
          carousel[i].showDelete = false
        }
        carousel[index].showDelete = true
      },
      // 取消删除
      cancelDelete(index) {
        let carousel = this.itemEditData.carouselData
        carousel[index].showDelete = false
      },
      // 确认删除
      createDelete(index) {
        let carousel = this.itemEditData.carouselData
        let typeList = this.carouselTypeList
        carousel.splice(index, 1)
        typeList.splice(index, 1)
        this.itemEditData.carouselData = carousel
        this.carouselTypeList = typeList

        this.saveData.rows[this.editItemid.rowkIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems.splice(index, 1)
      },

      addCreate() {
        let carouselLength = this.itemEditData.carouselData.length
        if (carouselLength >= this.itemMax) {
          this.$Modal.warning({
            title: '无法添加创意',
            content: '已达到最大创意数'
          })
        } else {
          let newCarouse = Object.assign({}, this.carouselItemData)
          this.itemEditData.carouselData.push(newCarouse)
          let newTypeList = {
            typeList: [].concat(this.typeList),
            typeList2: [],
            typeList3: [],
          }
          this.carouselTypeList.push(newTypeList)

          let addCarousel = Object.assign({}, this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems[0])
          addCarousel.itemSet = {}
          this.saveData.rows[this.editItemid.rowIndex].rows[this.editItemid.rowkIndex].items[this.editItemid.itemOutIndex].bannerItems.push(addCarousel)
          // this.saveData.rows[this.editItemid.rowIndex].rows[rowkIndex].items[itemOutIndex].items.push()
        }
      },

      // 点击展开或者收起的是第几个， 如果当前点击的收起状态， 则需要先收起所有创意，再展开当前创意
      openOrCloseWheel(index) {
        if (this.isCarouselUpload) {
          this.$Message.warning('正在上传图片，请稍后切换~')
          return
        }
        // console.log(this.itemEditData.carouselData[index])
        let carouselData = this.itemEditData.carouselData
        let carousel = this.itemEditData.carouselData[index]
        if (carousel.isOpen) { // 展开时
          carousel.isOpen = false
          this.carouselOpenIndex = -1
        } else { // 收起时
          carouselData.forEach(item => {
            item.isOpen = false
          })
          carousel.isOpen = true
          this.carouselOpenIndex = index
        }
      },

      beforeUploadWheelImg() {
        this.isCarouselUpload = true

      },

      // 上传轮播图片按钮 （新写或者修改以前的方法）, 判断上传的是第几个
      uploadWheelImg(response, file, fileList) {
        this.isCarouselUpload = false
        if (response.errno === 10000) {
          let index = this.carouselOpenIndex
          this.itemEditData.carouselData[index].img = response.data.fileUrl
          this.itemEditData = Object.assign({}, this.itemEditData)
        } else {
          this.$Message.error(response.errmsg)
        }
      },
      // 轮播跳转类型选择
      initWheelCascading(index) {
        // 将所有跳转参数置空
        this.initWheelTypelistParam(true, index)

        this.carouselTypeList[index].typeList3 = {}
        this.carouselTypeList[index].typeList2 = {}
        // 给二级菜单加初始化数据
        const i = this.findTypelistIndex(this.typeList, this.itemEditData.carouselData[index].openType)
        this.carouselTypeList[index].typeList2 = deepcopy(this.carouselTypeList[index].typeList[i])
      },
      // 清空图片编辑中跳转类型的数据
      initWheelTypelistParam(isfirst, index) {
        this.carouselTypeList[index].typeList.forEach(list1 => {
          if (list1.list && list1.list.length) {
            list1.list.forEach(list2 => {
              // 二级不清空数据
              if (isfirst && this.itemEditData.carouselData[index].openSubType) this.itemEditData.carouselData[index].openSubType = ''
              if (list2.list && list2.list.length) {
                list2.list.forEach(list3 => {
                  this.itemEditData.carouselData[index][list3.key] = ''
                })
              }
            })
          }
        })
      },
      // 切换二级菜单，初始化参数
      initWheel_sec_cascading(index) {
        // 将第二级跳转参数置空
        this.initWheelTypelistParam(false, index)
        // 给二级菜单加初始化数据
        const i = this.findTypelistIndex(this.carouselTypeList[index].typeList2.list, this.itemEditData.carouselData[index].openSubType)
        if (i !== -1 && this.carouselTypeList[index].typeList3) this.carouselTypeList[index].typeList3 = deepcopy(this.carouselTypeList[index].typeList2.list[i])
      }

    }
  }
</script>

<style scoped lang="less">
  .content-management {
    background-color: #fff;
    padding: 10px;

    .page {
      display: flex;
      padding-top: 20px;
    }

    .tabs {
      margin-top: 53px;
      padding-top: 20px;
      border-top: 1px solid #f8f8f9;

      .drag-list-wrapper {
        height: auto;

        .drag-list-con {
          width: 100%;
        }
      }

      .add-channel-icon {
        position: fixed;
        bottom: 10px;
        /*left: 300px;*/

        &:hover {
          cursor: pointer;
        }
      }

      .tab-item {
        margin: 0;
        height: 31px;
        padding: 5px 16px 4px;
        border: none;
        white-space: nowrap;
        border-radius: 4px 0 0 4px;
        /*transition: all .3s ease-in-out;*/
        /*background: #f8f8f9;*/

        &:hover {
          cursor: pointer;
        }
      }

      .btn-active {
        border-left: 2px solid #2d8cf0;
        background-color: #fff;
        color: #2d8cf0;
        border-right: 0;
      }
    }

    .content {
      width: 100%;
      padding: 10px 10px 10px 0;
      border-left: 1px solid #f8f8f9;

      .common-header {
        border-bottom: 1px solid #f8f8f9;
      }

      .des {
        padding: 10px 20px 10px 20px;
        margin: 0 10px 0 20px;
        /*background-color: #f8f8f9;*/
        display: flex;
        justify-content: space-between;
        border: 1px solid #eee;
      }

      .detail {
        padding: 0 20px;

        .img-item-wrap {
          display: inline-block;
          position: relative;

          .img-edit {
            position: absolute;
            top: 10px;
            left: 10%;
            width: 80%;
            background-color: transparent;
            color: white;
          }
        }

        .img-item {
          width: 100px;
          height: 100px;
        }

        .item-bg-set {
          background-color: #f8f8f9 !important;
        }

        .item-bg {
          /*background:#f8f8f9;*/
          margin-top: 20px;
          padding: 20px;
          position: relative;
          border: 1px solid #eee;
          width: calc(~"100% - 31px");

          .edit {
            color: #999;
          }

          .edit-input {
            width: 300px;
          }

          .item-action {
            position: absolute;
            top: 0;
            right: -40px;

            .go-online, .drop-line {
              position: relative;
            }

            .go-online:hover:before, .drop-line:hover:before {
              width: fit-content;
              padding: 3px 10px;
              border: 1px solid rgb(45, 140, 240);
              border-radius: 5px;
              position: absolute;
              right: 0;
              white-space: nowrap;
              top: -35px;
              display: inline-block;
              color: #fff;
              background-color: rgb(45, 140, 240);
            }

            .go-online:hover:after, .drop-line:hover:after {
              position: absolute;
              right: 14px;
              top: -10px;
              display: inline-block;
              font-size: 0;
              content: " ";
              border: solid 8px;
              border-color: #2d8cf0 transparent transparent transparent;
            }

            .go-online:hover:before {
              content: '点击显示模块';
            }

            .drop-line:hover:before {
              content: '点击隐藏模块';
            }
          }
        }

        .item-bg-hide {
          opacity: 0.4;
        }

        .add {
          text-align: center;

          &:hover {
            cursor: pointer;
          }

          .add-module::before {
            font-size: 80px;
            color: #ccc;
          }
        }
      }
    }
  }

  .img-edit {
    .edit-form {
      padding: 20px;
      background-color: #fff;

      .img-occupied {
        width: 192px;
        height: 108px;
        background-color: #eee;
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        font-style: normal;
        margin-right: 10px;
      }

      .img-bg {
        display: inline-block;
      }

      .linkage-top-10 {
        padding-top: 10px;

        .sec-label-width {
          width: 50px;
          display: inline-block;
        }

        .sec-form-width {
          width: 350px;
        }
      }

      .linkage-top-20 {
        padding-top: 20px;
      }
    }
  }

  .img-item {
    width: 100px;
    height: 100px;
  }

  .module-sel {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .img-group {
      background: #eee;
      display: flex;
      padding: 10px;
      width: min-content;
      cursor: pointer;

      .des {
        color: #999;
        flex: 1;
        background-color: white;
        padding: 20px;
      }

      .img-occupied-tab {
        display: inline-block;
        text-align: center;
        background-color: #eee;
      }

      .background {
        background-color: #fff;
        width: 446px;
      }
    }

    .choose {
      padding: 20px;
    }

    .choose-hidden {
      /*opacity: 0;*/
      display: none;
    }
  }

  .preview {
    .preview-tab-style {
      margin-right: 10px;
      padding: 4px 10px;
    }

    .preview-tabs {
      padding-bottom: 20px;
    }

    .preview-content {
      padding-left: 5px;
      margin-right: -10px;
      height: 70vh;
      overflow-y: auto;

      .text-ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 9px;
      }
    }

    .active {
      background: #0D92E1;
      border-radius: 30px;
    }

    .carousel-item {
      display: flex;
      flex-direction: row;
    }

    .banner-item-wrap {
      margin-bottom: 1.5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: rgba(135, 147, 191, 0.3);
    }

    .banner-cur {
      background-color: rgba(135, 147, 191, 0.55);
    }
  }

  .modal-img-group {
    height: 500px;
    overflow: auto;
  }

  .public-tip {
    margin-bottom: 15px;
    color: red;
  }

  .first-padding {
    padding-right: 12px;
  }

  .first-margin {
    margin-right: 6px;
  }

  .wheelItem {
    padding-left: 20px;
  }

  .hide-focus {
    color: #57a3f3;
  }

  .hide-focus:focus {
    box-shadow: none;
  }
</style>
<style lang="less">
  .img-edit {
    .edit-form .ivu-form-item-label {
      text-align: left;
    }
  }

  .preview .ivu-modal {
    width: max-content !important;
    min-width: 700px;
  }

  .preview .ivu-modal-body {
    background-color: #23283b;
    color: #fff;
    padding: 20px 40px;
  }

  .page .tabs .drag-list-con {
    width: 100%;
  }

  .content .ivu-alert-info {
    background-color: #fff;
    border: none;
    /*border-bottom: 1px solid #eee;*/
  }

  .add-module-btn .ivu-btn {
    border: none !important;
  }
</style>
