<!-- eslint-disable -->
<template>
  <div class="oss-upload">
    <el-upload
      ref="upload"
      action
      :show-file-list="false"
      multiple
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
      :auto-upload="false"
      :limit="100"
      :on-exceed="handleExceed"
      :accept="accept"
    >
      <el-button type="primary" icon="el-icon-upload2" round>上 传</el-button>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible"
      width="650px"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div slot="title" class="head-title">
        <span>上传</span>
        <span class="num">
          {{ fileList.length - unList.length }}/{{ fileList.length }}
        </span>
      </div>
      <div class="dialog-head">
        <div class="head-btn">
          <el-button
            size="small"
            type="primary"
            :disabled="uploadDisabled"
            icon="el-icon-video-play"
            @click="submitForm"
          >
            开始上传
          </el-button>
          <el-button
            class="item-btn"
            size="small"
            :disabled="resumeDisabled"
            icon="el-icon-refresh-right"
            type="success"
            @click="resumeUpload"
          >
            继续
          </el-button>
          <el-button
            class="item-btn"
            size="small"
            icon="el-icon-video-pause"
            type="danger"
            :disabled="pauseDisabled"
            @click="stopUplosd"
          >
            暂停
          </el-button>
        </div>
      </div>
      <div class="file-list">
        <div class="file-item" v-for="(item, index) in fileList" :key="index">
          <!-- <svg class="icon-file" aria-hidden="true">
            <use :xlink:href="`#icon-${fileTypeIcon(item)}`"></use>
          </svg> -->
          <div class="file-name">
            <div class="name">
              <span class="file-name-item">
                {{ index + 1 }}.{{ item.name }}
              </span>
              <span class="speed" v-if="item.isLoading && !item.isPlay">
                准备就绪
              </span>
              <span class="speed" v-if="item.isPlay && item.percentage !== 100">
                {{ item.speed }}/s
              </span>
              <span v-if="item.percentage === 100" class="success">完成</span>
              <!-- <div class="total" v-if="item.tempCheckpoint">
                {{ filterSize(item.partSize) }}/{{ filterSize(item.size) }}
              </div> -->
              <div class="total">
                {{ filterSize(item.size) }}
              </div>
            </div>
            <span class="name error" v-if="item.errMsg">{{ item.errMsg }}</span>
            <el-progress
              :percentage="item.percentage"
              v-if="item.percentage < 100 && !item.errMsg"
            ></el-progress>
            <template v-else>
              <el-progress
                :percentage="item.percentage"
                :status="item.errMsg ? 'exception' : 'success'"
              ></el-progress>
            </template>
          </div>
          <div class="tool">
            <span
              v-if="
                !item.percentage || (0 < item.percentage < 100 && !item.isPlay)
              "
              class="icon delete"
              @click="handleDeleteChangeFile(index)"
            >
              <i class="el-icon-close"></i>
            </span>
            <span
              v-if="item.percentage && item.percentage !== 100"
              class="icon"
              :class="item.isPlay ? 'delete' : 'success'"
              @click="handleStopChangeFile(index, item)"
            >
              <i
                :class="`el-icon-${
                  item.isPlay ? 'video-pause' : 'caret-right'
                }`"
              ></i>
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Mixin from './mixin'
  export default {
    mixins: [Mixin],
  }
</script>

<style lang="scss" scoped>
  .file-list {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .icon-file {
    width: 2.5em;
    height: 2.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  ::v-deep {
    .el-progress-circle {
      width: 40px !important;
      height: 40px !important;
    }
  }
  .file-item {
    display: flex;
    align-content: center;
    .file-name {
      flex: 1;
      .name {
        width: 100%;
        display: flex;
        .total {
          margin-left: 20px;
        }
        // justify-content: space-between;
        .file-name-item {
          font-weight: 500;
          width: 290px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
        }
        .speed {
          width: 120px;
          text-align: center;
          font-size: 13px;
          color: $base-color-default;
        }
        .success {
          text-align: center;
          width: 120px;
          color: #91cc75;
        }
        &.error {
          color: #f45;
          font-size: 12px;
        }
      }
    }
    border-bottom: 1px solid #ddd;
    padding: 15px 0;
    &:last-child {
      border-bottom: 0;
    }
    .tool {
      margin-left: 15px;
      .icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        background-color: #eee;
        border-radius: 5px;
        margin: 0px 4px;
        cursor: pointer;
        font-size: 15px;
        color: rgb(255, 68, 85);
        font-weight: 600;
        &.success {
          color: #91cc75;
          background-color: #eee;
        }
      }
    }
  }
  .head-title {
      text-align: left;
  }
  .dialog-head {
    display: flex;
    justify-content: space-between;
  }
  ::v-deep {
    .el-progress-bar {
        width: 320px !important;
    }
    .el-progress {
        text-align: left;
    }
  }
  .num {
    background: #515256a8;
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: 5px;
    color: #fff;
  }
</style>
