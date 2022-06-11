
<template>
    <Layout>
      <div class="btn-wrapper">
        <el-button type="success" icon="el-icon-edit" @click="showForm = !showForm">
          {{showUpload ? '修改OSS信息' : '填写OSS信息'}}
        </el-button>
        <el-button type="primary" icon="el-icon-position" @click="toGithub">
          Github 源码
        </el-button>
      </div>
      <div class="form-wrapper" v-if="showForm">
        <el-alert
          class="alert"
          title="提示：纯前端静态测试页面，不收集数据，仅供您测试,请放心填写！！！"
          type="info"
          :closable="false"
          show-icon>
        </el-alert>
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="AccessKeyId" prop="AccessKeyId">
            <el-input v-model="form.AccessKeyId" placeholder="Please enter your AccessKeyId"></el-input>
          </el-form-item>
          <el-form-item label="AccessKeySecret" prop="AccessKeySecret">
            <el-input v-model="form.AccessKeySecret" placeholder="Please enter your AccessKeySecret"></el-input>
          </el-form-item>
          <el-form-item label="roleArn" prop="roleArn">
            <el-input v-model="form.roleArn" placeholder="Please enter your roleArn"></el-input>
          </el-form-item>
          <el-form-item label="roleSessionName" prop="roleSessionName">
            <el-input v-model="form.roleSessionName" placeholder="Please enter your roleSessionName"></el-input>
          </el-form-item>
          <el-form-item label="bucket" prop="bucket">
            <el-input v-model="form.bucket" placeholder="Please enter your bucket"></el-input>
          </el-form-item>
          <el-form-item label="region" prop="region">
            <el-input v-model="form.region" placeholder="Please enter your region"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleConfirm('ruleForm')">立即校验STS凭证</el-button>
            <el-button>取 消</el-button>
          </el-form-item>
        </el-form>
        </div>
        <div class="upload-wrapper" v-if="showUpload">
          <UploadPan
            ref="upload"
            v-model="fileList"
            :form="form"
            class="create-folder reset"
            :model="model"
            @on-close="handleCloseUpload"/>
        </div>
    </Layout>
</template>

<script>
import Layout from './layout'
import UploadPan from '@/components/Upload/index'
import { getToken } from '@/api/token'
export default {
  name: 'App',
  components: {
    Layout,
    UploadPan
  },
  data() {
    return {
      showForm: false,
      fileList: [],
      model: 'test',
      form: {
        AccessKeyId: '',
        AccessKeySecret: '',
        roleArn: '',
        roleSessionName: 'alice',
        bucket: '',
        region: ''
      },
      rules: {
        AccessKeyId: [{
          required: true, message: 'Please enter your AccessKeyId', trigger: 'blur' 
        }],
        AccessKeySecret: [{
          required: true, message: 'Please enter your AccessKeySecret', trigger: 'blur' 
        }],
        roleArn: [{
          required: true, message: 'Please enter your roleArn', trigger: 'blur' 
        }],
        roleSessionName: [{
          required: true, message: 'Please enter your roleSessionName', trigger: 'blur' 
        }],
        bucket: [{
          required: true, message: 'Please enter your bucket', trigger: 'blur' 
        }],
        region: [{
          required: true, message: 'Please enter your region', trigger: 'blur' 
        }],
      },
      showUpload: false
    }
  },
  methods: {
    handleCloseUpload() {
      this.fileList = []
    },
    toGithub() {
      window.open('https://github.com/hu-snail/vue-upload-oss')
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            getToken(this.form).then(() => {
              this.$message.success('获取STS凭证成功')
              this.showUpload = true
              this.showForm = false
            }).catch(err => {
              this.$notify.error({
                title: '请求失败',
                dangerouslyUseHTMLString: true,
                message: err.data.msg
              });
              this.showUpload = false
            })
          } else {
            this.showUpload = false
            return false;
          }
        })
    },
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.btn-wrapper {
  margin: 20px 0;
}
.form-wrapper {
  width: 500px;
  margin: 25px auto;
  .alert {
    margin-bottom: 10px;
  }
}
</style>