let OSS = require('ali-oss')
import { filterSize } from '@/utils'
import { getToken } from '@/api/token'
export default {
  props: {
    // oss 凭证，正式为后端接口返回，案例改为填写
    form: {
        type: Object,
        default: () => {

        }
    },
    // 资源模块 other：其他 audio:音频
    model: {
      type: String,
      default: '',
    },
    // 绑定值
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    // 接受上传的文件类型
    accept: {
      type: String,
      default: '',
    },
    // 是否支持多文件上传
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
      audioInfo: {},
      file: null,
      tempCheckpoint: null,
      uploadId: '',
      uploadStatus: null,
      showAudio: false,
      percentage: 0,
      uploadName: '',
      client: null,
      year: new Date().getFullYear(),
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      dialogVisible: false,
      isDoing: false,
      unList: [],
      fileMap: {},
      map_max_key: 0,
      partSize: 1024 * 1024,
      parallel: 4,
      checkpoints: {},
      credentials: null,
    }
  },

  watch: {
    dialogVisible: {
      handler(val) {
        if (!val) {
          this.fileList = []
          this.$refs.upload.uploadFiles = []
        }
      },
    },
    fileList: {
      handler(val) {
        if (val.length) {
          this.dialogVisible = true
          let list = []
          let unList = []
          val.forEach((item) => {
            if (item.raw.name.indexOf('.') === -1)
              item.errMsg = '不支持此格式上传'
            if (item.percentage === 100) list.push(item)
            else unList.push(item)
          })
          if (list.length === val.length) {
            this.pauseDisabled = true
            this.isDoing = true
          } else {
            this.isDoing = false
          }
          this.unList = unList
        }
      },
      deep: true,
    },
  },

  mounted() {
    window.addEventListener('online', this.resumeUpload)
  },

  methods: {
    filterSize,
    handleExceed() {
      this.$confirm('上传文件数量不能超过100个，请重新选择！', '操作提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning',
      })
        .then(() => {
          this.fileList = []
          this.dialogVisible = false
        })
        .catch(() => {
          this.fileList = []
        })
    },
    handleDeleteChangeFile(index) {
      this.fileList.splice(index, 1)
      if (!this.fileList.length) this.dialogVisible = false
    },
    fileTypeIcon(item) {
      const { type } = item.raw
      const isVideo = type.indexOf('video') !== -1,
        isImage = type.indexOf('image') !== -1,
        isAudio = type.indexOf('audio') !== -1,
        isZip = type.indexOf('zip') !== -1,
        isDocument = type.indexOf('wordprocessingml') !== -1,
        isPDF = type.indexOf('pdf') !== -1,
        isTxt = type.indexOf('text') !== -1,
        isSheet = type.indexOf('sheet') !== -1
      if (isVideo) return 'MP4'
      else if (isImage) return 'JPG1'
      else if (isAudio) return 'mp3-1'
      else if (isZip) return 'yasuo'
      else if (isDocument) return 'DOCX'
      else if (isPDF) return 'wenjianleixing-biaozhuntu-PDFwendang'
      else if (isTxt) return 'div-1'
      else if (isSheet) return 'excel1'
      else return 'weizhiwenjian'
    },
    handleClose() {
      this.$emit('on-close')
      if (this.isDoing) this.dialogVisible = false
      else {
        this.$confirm(
          '正在上传文件，关闭后上传文件会丢失！是否继续？',
          '操作提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
          }
        )
          .then(() => {
            this.$emit('get-unlist')
            this.fileList.forEach((item) => {
              if (item.client && item.percentage < 100) item.client.cancel()
            })
            this.dialogVisible = false
          })
          .catch(() => {})
      }
    },

    async getOss() {
        // 请求后端接口，案例改为模拟数据
        let res = await getToken(this.form)
        let isPass = {
            pass: true,
        }
        if (res.status === 200) {
            this.credentials = res.data.Credentials
        } else {
            isPass = { ...res, pass: false }
        }
        return isPass
    },
    /**
     * 上传之前调用oss凭证
     */
    async handleBeforeUpload() {
      console.log(11)
    },

    handleStopChangeFile(index, item) {
      item.isPlay = !item.isPlay
      this.fileList.splice(index, 1, item)
      // window.removeEventListener('online', this.resumeUpload)
      if (!item.isPlay) item.client.cancel()
      else this.resumeMultipartUpload(item)
    },

    /**
     * @description 点击上传至服务器
     */
    async submitForm() {
      // await this.getOssCredential()

      this.uploadDisabled = true
      this.pauseDisabled = false
      this.multipartUpload()
    },

    /**
     * @description 暂停分片上传
     */
    stopUplosd() {
      this.resumeDisabled = false
      this.pauseDisabled = true
      // window.removeEventListener('online', this.resumeUpload)
      // let result = this.client.cancel()
      this.fileList.forEach((item) => {
        item.client.cancel()
        item.isPlay = false
      })
    },

    async change(i, value) {
      this.fileMap[i] = value
      this.map_max_key = i
    },

    async handle_network_speed_change(start_time, end_time, network_speed) {
      // 如果超过10秒没有传输数据,则清空map
      if (start_time - this.map_max_key >= 10000) {
        this.fileMap = {}
      }
      for (let i = start_time; i <= end_time; i++) {
        const value = await this.fileMap[i]
        if (value) {
          await this.change(i, value + network_speed)
        } else {
          await this.change(i, network_speed)
        }
      }
    },

    /**
     * @description 获取上传的网络状态
     * @param {*} res 文件信息
     * @param {*} partSize 分片大小
     * @param {*} p 上传进度
     * @returns 网速度 network_speed
     */
    handle_network_speed(res, partSize, p) {
      const spend_time = res.rt / 1000 //单位s
      const end_time = new Date(res.headers.date).getTime()
      const start_time = end_time - spend_time
      let network_speed = parseInt(partSize / spend_time) // 每s中上传的字节(b)数
      if (p === 0) network_speed = 0
      if (network_speed === 0) {
        // nothing to do
      } else {
        this.handle_network_speed_change(start_time, end_time, network_speed)
      }
      return network_speed ? filterSize(network_speed) : 0
    },

    /**
     * @description 恢复上传
     * @param {*} item 文件信息
     * @param {*} checkpoint 分片信息
     */
    async resumeUploadFile(item, checkpoint) {
        console.log(item, checkpoint)
      const { uploadId, file, name } = checkpoint
      try {
        const { raw, percentage } = item
        item.partSize = 0

        if (percentage < 100 && raw.name.indexOf('.') !== -1) {
          item.client
            .multipartUpload(uploadId, file, {
              parallel: this.parallel,
              partSize: this.partSize,
              progress: async (p, checkpoint, res) => {
                await this.onUploadProgress(item, p, checkpoint, res, name)
              },
              checkpoint,
            })
            .then(() => {
              delete this.checkpoints[checkpoint.uploadId]
              this.$emit('input', this.fileList)
              this.resumeDisabled = true
              if (this.unList.length && this.uploadDisabled)
                this.resumeDisabled = false
              this.onCreatePanFile(item)
            })
            .catch(async (err) => {
              await this.resetUpload(err, item)
            })
        }
      } catch {
        console.log('---err---')
      }
    },

    async resetUpload(err, item) {
      const msg = JSON.stringify(err)
      if (msg.indexOf('Error') !== -1) {
        if (item.client) {
          item.client.cancel()
        }
        await this.getOss()

        const { AccessKeyId, AccessKeySecret, SecurityToken  } = this.credentials
        const {  bucket, region } = this.form 
        item.client = new OSS({
          accessKeyId: AccessKeyId,
          accessKeySecret: AccessKeySecret,
          stsToken: SecurityToken,
          bucket,
          region,
        })
        await this.resumeMultipartUpload(item)
      }
    },

    /**
     * @description 恢复上传
     */
    async resumeMultipartUpload(item) {
      // 恢复单文件
      if (item) {
        const { tempCheckpoint } = item
        this.resumeUploadFile(item, tempCheckpoint)
      } else {
        // 多文件
        Object.values(this.checkpoints).forEach((checkpoint) => {
          const { uploadId } = checkpoint
          const index = this.fileList.findIndex(
            (option) => option.upload === uploadId
          )
          const item = this.fileList[index]
          this.resumeUploadFile(item, checkpoint)
        })
      }
    },

    async onUploadProgress(item, p, checkpoint, res, path) {
      if (checkpoint) {
        this.checkpoints[checkpoint.uploadId] = checkpoint
        item.speed = this.handle_network_speed(res, this.partSize, p)
        item.tempCheckpoint = checkpoint
        item.abortCheckpoint = checkpoint
        item.upload = checkpoint.uploadId
      }
      // 改变上传状态
      item.isPlay = true
      // 改变准备就绪状态
      if (item.isPlay) item.isLoading = false

      item.uploadName = path
      // 上传进度
      item.percentage = Number((p * 100).toFixed(2))
    },

    /**
     * @description 上传至OSS
     * @param {*} item 文件信息
     * @returns
     */
    async ossUpload(item) {
      let isPass = {
        pass: true,
        filePath: '',
      }
      try {
        const { raw, percentage } = item
        item.partSize = 0

        if (percentage < 100 && raw.name.indexOf('.') !== -1) {
          const file = raw
          const path = `${this.model ? this.model + '/' : ''}` +
            file.name
          await item.client
            .multipartUpload(path, file, {
              parallel: this.parallel,
              partSize: this.partSize,
              progress: async (p, checkpoint, res) => {
                await this.onUploadProgress(item, p, checkpoint, res, path)
              },
            })
            .then(() => {
              this.$emit('input', this.fileList)
              this.resumeDisabled = true
              this.onCreatePanFile(item)

              if (this.unList.length && this.uploadDisabled)
                this.resumeDisabled = false
            })
            .catch(async (err) => {
                console.log('err--', err)
            //   await this.resetUpload(err, item)
            })
        }
      } catch (e) {
        //上传失败处理
        isPass = {
          ...e,
          pass: false,
          filePath: '',
        }
      }
      //上传成功返回filepath
      return isPass
    },

    /**
     * @description 切片上传
     */
    async multipartUpload() {
      if (!this.file) {
        this.$message.error('请选择文件')
        return
      }

      this.fileList.forEach(async (item) => {
        item.isLoading = true
        const getOssRes = await this.getOss()
        const { AccessKeyId, AccessKeySecret, SecurityToken  } = this.credentials
        const {  bucket, region } = this.form 
        item.client = new OSS({
          accessKeyId: AccessKeyId,
          accessKeySecret: AccessKeySecret,
          stsToken: SecurityToken,
          bucket,
          secure:true,
          region,
        })
        if (!getOssRes.pass) {
          return this.$message.error('获取oss上传凭证异常')
        }
        await this.ossUpload(item, this.fileList)
      })
    },

    /**
     * @description 获取当前日期
     * @returns 返回当前日期
     */
    getToday() {
      const date = new Date()
      return `${date.getFullYear()}${
        date.getMonth() + 1
      }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    },

    /**
     * @description 恢复上传
     */
    async resumeUpload() {
      this.pauseDisabled = false
      this.uploadDisabled = this.resumeDisabled = true
      await this.resumeMultipartUpload()
    },

    /**
     * @description 选择文件
     * @param {*} file
     * @param {*} fileList
     */
    handleChange(file, fileList) {
      fileList.forEach((item) => {
        item.client = null
        item.isPlay = false
        item.isLoading = false
        item.abortCheckpoint = false
      })
      this.fileList = fileList
      this.file = file.raw
      this.uploadDisabled = false
      this.pauseDisabled = this.resumeDisabled = true
    },

    /**
     * @description 删除文件信息
     * @param {*} url
     */
    handleDeleteFile(url) {
        const startIndex = url.indexOf(this.model)
        const key = url.substring(startIndex, url.length)
        console.log(key, '根据key删除文件')
        this.$emit('on-delete')
        this.fileList = []
        this.$message.success('删除成功')
       
    },

    /**
     * @description 上传文件数据至数据库
     * @param {*} file 文件信息
     */
    async onCreatePanFile(file) {
        let params = await this.getParams(file)
        console.log('--提交数据---', params)
        this.$emit('on-update')

    },

    /**
     * @description 获取媒体文件信息
     * @param {*} type 文件类型
     * @returns
     */
    handleMediaRes(type) {
      return {
        image: async function (file) {
          return new Promise((resolve) => {
            var reader = new FileReader()
            reader.onload = function (e) {
              var data = e.target.result
              //加载图片获取图片真实宽度和高度
              var image = new Image()
              image.onload = function () {
                resolve({
                  Width: this.width,
                  Height: this.height,
                })
              }
              image.src = data
            }
            reader.readAsDataURL(file)
          })
        },

        audio: async function (file) {
          return new Promise((resolve) => {
            var reader = new FileReader()
            reader.onload = function (e) {
              var data = e.target.result
              //加载图片获取图片真实宽度和高度
              var audio = new Audio()
              audio.onloadeddata = function () {
                const duration = audio.duration
                resolve({
                  Duration: duration * 1000,
                })
              }
              audio.src = data
            }
            reader.readAsDataURL(file)
          })
        },
        video: async function (file) {
          return new Promise((resolve) => {
            var videoUrl = URL.createObjectURL(file)
            const video = document.createElement('video')
            video.src = videoUrl
            video.onloadeddata = function () {
              resolve({
                CoverImg: '',
                Duration: this.duration * 1000,
                Width: this.videoWidth,
                Height: this.videoHeight,
              })
            }
          })
        },
      }[type]
    },

    captureImage(url, t) {
      t = t || '3000 '
      var posterUrl = url + '?x-oss-process=video/snapshot,t_' + t + ',f_jpg'

      return posterUrl
    },

    async getParams(file) {
      const { type } = file.raw
      const isVideo = type.indexOf('video') !== -1,
        isImage = type.indexOf('image') !== -1,
        isAudio = type.indexOf('audio') !== -1
      let fileType = ''
      if (isVideo) fileType = 'video'
      else if (isImage) {
        if (type.indexOf('adobe') === -1) fileType = 'image'
      } else if (isAudio) fileType = 'audio'
      let option
      if (isVideo || isImage || isAudio) {
        if (fileType) option = await this.handleMediaRes(fileType)(file.raw)
      }
      return {
        ResTitle: file.name,
        ResDescribe: '',
        OssKey: file.uploadName,
        ContentType: type || 'application/octet-stream',
        ContentLength: file.size,
        ...option,
      }
    },
  },
}
