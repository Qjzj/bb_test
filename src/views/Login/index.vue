<template>
  <div class="loginPage">
    <div v-if="type === 0" class="form">
      <h2 class="title">登录</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" :hide-require-asterisk="true">
        <el-form-item
          prop="user"
        >
          <el-input
            class="input"
            v-model="loginForm.user"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="input"
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          />
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        class="btn"
        @click="login"
      >
        登录
      </el-button>
      <el-button
        class="btn forget"
        type="text"
        @click="forgetPassword"
      >
        忘记密码
      </el-button>
    </div>
    <div v-else class="form">
      <h2 class="title">找回密码</h2>
      <template v-if="step === 1">
        <el-form :model="forgetForm" :rules="forgetRules" label-width="0px" :hide-required-asterish="true" ref="forgetForm">
          <el-form-item
            prop="phone"
          >
            <el-input class="input" prefix-icon="el-icon-mobile-phone" v-model="forgetForm.phone" />
          </el-form-item>
          <el-form-item
            prop="code"
          >
            <el-input class="input" prefix-icon="el-icon-key" v-model="forgetForm.code" maxlength="6" >
              <template slot="append">
                <div :class="['codeTxt', _disable && 'disable']" @click="getCode">{{_disable ? this.count + ' s' : '获取验证码'}}</div>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button class="btn" type="primary" @click="forgetNext">下一步</el-button>
      </template>
      <template v-else>
        <el-form :model="passwordForm" :rules="passwordRules" label-width="80px" :hide-required-asterisk="true"  ref="passwordForm">
          <el-form-item
            label="新密码"
            prop="pwd"
          >
            <el-input class="input" type="password" v-model="passwordForm.pwd" prefix-icon="el-icon-lock" />
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="pwdAgain"
          >
            <el-input class="input" type="password" v-model="passwordForm.pwdAgain" prefix-icon="el-icon-lock" />
          </el-form-item>
          <el-form-item label-width="0px">
            <el-button class="btn" type="primary" @click="modifyPwd">提交</el-button>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script>
  import {validatePwd, validatePhone, setCookie} from "../../utils";
  import {login} from "../../api/user";
  import {mapActions} from 'vuex'

  const mockCheckCode = function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const flag = Math.random() > 0.5;
        if(flag) resolve({errorCode: 0, message: 'OK'});
        reject({errorCode: 1, message: '验证码错误'});
      }, 3000)
    })
  };

  const _validatePwd = function(rule, value, callback) {
    if(validatePwd(value)) {
      callback();
    }else {
      callback(new Error('字母开头8-16位，必须包含数字、字母'));
    }
  };

  const _validatePhone = (rule, value, callback) => {
    if(validatePhone(value)) {
      callback();
    }else {
      callback(new Error('请输入有效的手机号'));
    }
  };

  export default {
    name: "Login",
    data() {

      const _validatePwdAgain = (rule, value, callback) => {
        if(value !== this.passwordForm.pwd) {
          callback(new Error('两次密码不一致'))
        }else {
          callback();
        }
      };


      return {
        type: 0,   // 0 登录  1 修改密码
        step: 1,   // 1 修改密码第一步  2 修改密码第2步
        user: '',
        password: '',
        count: 0,
        timer: null,
        loginForm: {
          user: '',
          password: ''
        },
        loginRules: {
          user: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        forgetForm: {
          phone: '',
          code: ''
        },
        forgetRules: {
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: _validatePhone, message: '请输入有效的手机号', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ],
        },
        passwordForm: {
          pwd: '',
          pwdAgain: ''
        },
        passwordRules: {
          pwd: [
            { required: true, message: '新密码不能为空' },
            { validator: _validatePwd, trigger: 'blur' }
          ],
          pwdAgain: [
            { required: true, message: '新密码不能为空' },
            { validator: _validatePwdAgain, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      _disable() {
        return this.count > 0;
      }
    },
    methods: {
      ...mapActions(['updateUser']),
      login() {
        this.$refs.loginForm.validate(async valid => {
          if(valid) {
            // TODO 登录验证
            const {user, password} = this.loginForm;
            try {
              const result = await login(user, password);
              console.log('*********result', result)
              if(result['error_code'] !== 0) {
                this.loginRules.password.push({validator: (rule, value ,callback) => callback(new Error(result['message']))});
                this.$refs.loginForm.validateField('password');

                // 去除规则
                this.loginRules.password.pop();
              }else {
                setCookie('x-token', result['data']['_id']);
                await this.updateUser();
                this.$router.replace('/');
              }
            }catch (e) {
              console.log(e);
            }
          }
        })
      },
      forgetPassword() {
        this.type = 1;
      },
      getCode() {
        if(this._disable) return;
        this.$refs.forgetForm.validateField('phone', err => {
          if(err) return;
          // 开始计时
          this.count = 59;
          this.timer = setInterval(() => {
            if(this.count === 0) {
              clearInterval(this.timer);
            }else {
              this.count --;
            }
          }, 1000);

        })
      },
      forgetNext() {
        this.$refs.forgetForm.validate(valid => {
          if(valid) {
            // 验证通过
            // TODO 验证短信验证码
            mockCheckCode().then(data => {
              console.log(data);
              //
              this.step = 2;
            }).catch(e => {
              console.log('失败', e);
              this.forgetRules.code.push({
                validator: (rule, value, callback) => {callback(new Error('验证码错误'))}
              });
              this.$refs.forgetForm.validateField('code');
              this.forgetRules.code.pop();
            });

          }
        })


      },
      modifyPwd() {
        console.log('修改密码');

      },
      resetLoginForm() {
        if(this.$refs.loginForm) {
          this.$refs.loginForm.resetFields();
          this.$refs.loginForm.clearValidate();
        }
      },
      resetForgetForm() {
        if(this.$refs.forgetForm) {
          this.$refs.forgetForm.resetFields();
          this.$refs.forgetForm.clearValidate();
        }
      },
      resetPasswordForm() {
        if(this.$refs.passwordForm) {
          this.$refs.passwordForm.resetFields();
          this.$refs.passwordForm.clearValidate();
        }
      }
    },
    beforeMount() {
      if(this.timer) clearInterval(this.timer);
    }
  }
</script>

<style scoped lang="scss">

  @import "../../assets/css/base";
  .loginPage {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(135deg, #8069DB, #46b8db, #A5DBAF);

    .form {
      margin: 10% auto 0;
      padding: 40px 25px;
      width: 350px;
      background: rgba(255, 255, 255, 0.35);
      border: 1px solid #fff;
      border-radius: 15px;

      .title {
        margin-bottom: 20px;
        color: #fff;
        font-size: 18px;
        font-weight: normal;
      }

      /deep/ .el-form-item {
        margin-bottom: 20px;

        .el-form-item__label {
          line-height: 40px;
        }
      }

      /deep/ .input {
        .el-input__inner {
          height: 40px;
          line-height: 40px;
        }

        .el-input-group__append {
          padding: 0;
        }


        .codeTxt {
          width: 100px;
          height: 38px;
          background: $theme-color;
          text-align: center;
          line-height: 38px;
          color: #fff;
          cursor: pointer;
          user-select: none;

          &.disable {
            background: #F5F7FA;
            color: #909399;
            cursor: default;
          }
        }

      }

      .tip {
        padding-left: 5px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #f00;
      }

      .btn {
        width: 100%;
        height: 45px;
        font-size: 16px;
        /*line-height: 40px;*/

        &.forget {
          margin-top: 10px;
          height: 40px;
          font-size: 15px;
        }
      }
    }
  }

</style>
