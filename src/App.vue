<template>
    <Layout>
      <div class="btn-wrapper">
        <el-button type="success" icon="el-icon-cloudy" @click="showForm = !showForm">上传测试</el-button>
        <el-button type="primary" icon="el-icon-position">Github</el-button>
      </div>
      <div class="form-wrapper" v-if="showForm">
        <el-alert
          class="alert"
          title="提示：纯前端静态测试页面，不收集数据，仅供您测试,请放心填写！！！"
          type="info"
          :closable="false"
          show-icon>
        </el-alert>
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="AccessKeyId">
            <el-input v-model="form.AccessKeyId" placeholder="Please enter your AccessKeyId"></el-input>
          </el-form-item>
          <el-form-item label="AccessKeySecret">
            <el-input v-model="form.AccessKeySecret" placeholder="Please enter your AccessKeySecret"></el-input>
          </el-form-item>
          <el-form-item label="stsToken">
            <el-input v-model="form.SecurityToken" placeholder="Please enter your SecurityToken"></el-input>
          </el-form-item>
          <el-form-item label="bucket">
            <el-input v-model="form.bucket" placeholder="Please enter your bucket"></el-input>
          </el-form-item>
          <el-form-item label="region">
            <el-input v-model="form.region" placeholder="Please enter your region"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">确 定</el-button>
            <el-button>取 消</el-button>
          </el-form-item>
        </el-form>
        </div>
    </Layout>
</template>

<script>
import Layout from './layout'

export default {
  name: 'App',
  components: {
    Layout
  },
  data() {
    return {
      showForm: false,
      form: {
        AccessKeyId: '',
        AccessKeySecret: '',
        SecurityToken: '',
        bucket: '',
        region: ''
      }
    }
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
