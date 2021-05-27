<template>
  <div class="bd">
    <van-overlay :show="show">
      <div class="wrapper" @click.stop>
        <van-loading class="block" type="spinner">加载中...</van-loading>
      </div>
    </van-overlay>

    <div id="container">
      <div id="form">
        <p>超星自动签到</p>
        <van-form @submit="onSubmit">
          <van-field
              v-model="username"
              :rules="[{ required: true, message: '请填写超星账号' }]"
              label="超星账号"
              name="username"
              placeholder="超星账号"
          />
          <van-field
              v-model="password"
              :rules="[{ required: true, message: '请填写密码' }]"
              label="密码"
              name="密码"
              placeholder="密码"
              type="password"
          />
          <div id="uploader" style="width: 100%">
            <van-uploader :after-read="afterRead">
              <van-button block icon="plus" type="primary">上传二维码(可选)</van-button>
            </van-uploader>
          </div>
          <div style="margin: 16px;">
            <van-button block native-type="submit" round type="info">提交</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import {getQrUrl} from './utils/QrcDecoderUtil';
import to from 'await-to-js'
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: '',
      enc: '',
      show: false
    }
  },
  methods: {
    onSubmit(values) {
      this.show = true
      if (this.enc) {
        values.enc = this.enc;
        console.log('submit', values);
        axios.get(`/api/sign?username=${values.username}&password=${values.password}&enc=${values.enc}`)
            .then(res => {
              console.log(res.data)
              this.show = false
              this.$dialog.alert({
                message: res.data.detail
              }).then(() => {
                this.$dialog.close()
              })
            })
            .catch(err => {
              this.show = false
              this.$dialog.alert({
                message: err
              }).then(() => {
                this.$dialog.close()
              })
            })

      } else {
        console.log('submit', values);
        axios.get(`/api/sign?username=${values.username}&password=${values.password}`)
            .then(res => {
              console.log(res.data)
              this.show = false
              this.$dialog.alert({
                message: res.data.detail
              }).then(() => {
                this.$dialog.close()
              })
            })
            .catch(err => {
              this.show = false
              this.$dialog.alert({
                message: err
              }).then(() => {
                this.$dialog.close()
              })
            })
      }
    },
    async afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
      const [err, res] = await to(getQrUrl(file.file))
      if (err) {
        console.error(err);
        alert("上传失败，请重新上传！")
      } else {
        if (res.data === undefined) {
          alert("未找到二维码，请重新上传！")
        } else {
          console.log(res.data)
          if (res.data.indexOf('enc=') !== -1) {
            console.log(true)
            this.enc = res.data.split('enc=')[1]
            console.log(res.data.split('enc=')[1])
          } else {
            console.log(false)
            alert("该二维码解析结果未发现含有超星学习通需要的ENC参数，请确认二维码无误")
          }
        }
      }
    },
  }
}
</script>

<style>
body {
  background-color: #f7f8fa;
}

@media (max-width: 768px) {
  #container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 90vw;
    text-align: center;
  }
}

@media (min-width: 768px) {
  #container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: auto;
    text-align: center;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
}
</style>
