const express = require("express")
const app = express()
const StsClient = require('@alicloud/sts-sdk');

const port = 5000 //服务器启动端口
app.all("*",function(req,res,next){
  // //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin",req.header.origin||"*")

    //允许的header类型
  res.header("Access-Control-Allow-Headers","*")

  // 跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","PUT,GET,POST,DELETE,OPTIONS")

  res.header(`Cccess-Control-Allow-Credentials`,true)
  


  if(req.method=="OPTIONS"){
    res.sendStatus(200)
  }else{
    next()
  }
})

app.get("/getToken",async function(req, res){
    const {AccessKeyId, AccessKeySecret, roleArn, roleSessionName} = req.query
    try {
      const sts = new StsClient({
          endpoint: 'sts.aliyuncs.com',
          accessKeyId: AccessKeyId,
          accessKeySecret: AccessKeySecret,
      });
      const data = await sts.assumeRole(roleArn, roleSessionName)
      if (!data.Credentials) {
        res.json({status: 201, data: {
          msg: '获取STS凭证失败，请检查参数，<a style="color: #409EFF;" href="https://help.aliyun.com/document_detail/371864.htm?spm=a2c4g.11186623.0.0.5feb73bdpwWLVu" target="_blank">查看文档</a>'
        }})
      } else {
        res.json({status: 200, data})
      }
    } catch {
      res.json({status: 201, data: {
        msg: '获取STS凭证失败，请检查参数，<a style="color: #409EFF;" href="https://help.aliyun.com/document_detail/371864.htm?spm=a2c4g.11186623.0.0.5feb73bdpwWLVu" target="_blank">查看文档</a>'
      }})
    }
    
})

app.listen(port,()=>{
  console.log(`Example app listening at http://localhost:${port}`)
})
