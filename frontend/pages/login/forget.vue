<template>
  <view class="content">
    <view class="list">
      <view class="tishi" style="margin-top:120rpx;">若您忘记了密码，可在此重新设置新密码。</view>
      <view class="list-call"  style="margin-top:100rpx;">
        <image class="img" src="/static/loginimg/1.png"></image>
        <input class="sl-input" type="text" v-model="mail" placeholder="请输入邮箱" />
      </view>
      <view class="list-call"  style="margin-top:100rpx;">
        <image class="img" src="/static/loginimg/2.png"></image>
        <input class="sl-input" type="text" v-model="password" maxlength="32" placeholder="请输入新密码" :password="!showPassword" />
        <image class="img" :src="showPassword?'/static/loginimg/op.png':'/static/loginimg/cl.png'" @tap="display"></image>
      </view>
      <view class="list-call"  style="margin-top:100rpx;">
        <image class="img" src="/static/loginimg/3.png"></image>
        <input class="sl-input" type="number" v-model="code" maxlength="6" placeholder="验证码" />
        <view class="yzm" :class="{ yzms: second>0 }" @tap="getcode">{{yanzhengma}}</view>
      </view>
    </view>
    <view class="button-login" hover-class="button-hover" @tap="bindLogin()" style="margin-top:120rpx;">
      <text>修改密码</text>
    </view>

  </view>
</template>

<script>
  var _this, js;
  export default {
    data() {
      return {
        mail: '',
        second: 0,
        code: "",
        showPassword: false,
        password: ''
      }
    },
    onLoad() {
      _this = this;
    },
    computed: {
      yanzhengma() {
        if (this.second == 0) {
          return '获取验证码';
        } else {
          if (this.second < 10) {
            return '重新获取0' + this.second;
          } else {
            return '重新获取' + this.second;
          }
        }
      }
    },
    onUnload() {
      this.clear()
    },
    methods: {
      display() {
        this.showPassword = !this.showPassword
      },
      clear(){
        clearInterval(js)
        js = null
        this.second = 0
      },
      getcode() {
        if (!this.mail.endsWith('@qq.com')) {
          uni.showToast({
            icon: 'none',
            title: '邮箱不正确'
          });
          return;
        }
        if (this.second > 0) {
          return;
        }
        _this.second = 60;
        js = setInterval(function() {
          _this.second--;
          if (_this.second == 0) {
            _this.clear()
          }
        }, 1000)
   //      uni.request({
			// //TODO:
   //        url: 'http://***/getcode.html', 
   //        data: {
   //          mail: this.mail,
   //          type: 'forget'
   //        },
   //        method: 'POST',
   //        dataType: 'json',
   //        success: (res) => {
   //          if (res.data.code != 200) {
   //            uni.showToast({
   //              title: res.data.msg,
   //              icon: 'none'
   //            });
   //            _this.second = 0;
   //          } else {
   //            uni.showToast({
   //              title: res.data.msg
   //            });
   //            _this.second = 60;
   //            js = setInterval(function() {
   //              _this.second--;
   //              if (_this.second == 0) {
   //                _this.clear()
   //              }
   //            }, 1000)
   //          }
   //        },fail() {
   //          this.clear()
   //        }
   //      });
      },
      bindLogin() {
        if (!this.mail.endsWith('@qq.com')) {
          uni.showToast({
            icon: 'none',
            title: '申请的必须是QQ邮箱'
          });
          return;
        }
        if (this.password.length < 6) {
          uni.showToast({
            icon: 'none',
            title: '密码不正确'
          });
          return;
        }
        if (this.code.length != 6) {
          uni.showToast({
            icon: 'none',
            title: '验证码不正确'
          });
          return;
        }
        uni.request({
          url: 'http://***/forget.html',
          data: {
            mail: this.mail,
            password: this.password,
            code: this.code
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            if (res.data.code != 200) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: res.data.msg
              });
              setTimeout(function() {
                uni.navigateBack();
              }, 1500)
            }
          }
        });

      }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .tishi {
    color: #999999;
    font-size: 28rpx;
    line-height: 50rpx;
    margin-bottom: 50rpx;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
    padding-left: 70rpx;
    padding-right: 70rpx;
  }

  .list-call {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    color: #333333;
    border-bottom: 0.5px solid #e2e2e2;
  }

  .list-call .img {
    width: 40rpx;
    height: 40rpx;
	
  }

  .list-call .sl-input {
    flex: 1;
    text-align: left;
    font-size: 32rpx;
    margin-left: 16rpx;
  }

  .button-login {
    color: #FFFFFF;
    font-size: 34rpx;
    width: 470rpx;
    height: 100rpx;
   background: rgb(46,107,224);
    box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
    border-radius: 50rpx;
    line-height: 100rpx;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100rpx;
  }

  .button-hover {
     background: rgb(46,107,224,0.8);
  }

  .yzm {
    color: rgb(46,107,224);
    font-size: 24rpx;
    line-height: 64rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;
    width: auto;
    height: 64rpx;
    border: 1rpx solid rgb(46,107,224);
    border-radius: 50rpx;
  }

  .yzms {
    color: #999999 !important;
    border: 1rpx solid #999999;
  }
</style>
