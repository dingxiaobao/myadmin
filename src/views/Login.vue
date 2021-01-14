<template>
  <div class="login">
    <div class="box">
      <section class="logo">
        <p>
          <img src="@/assets/rus.jpg" />
        </p>
      </section>
      <section class="Form">
        <el-form ref="form" :model="obj" :rules="rules">
          <el-form-item prop="username">
            <el-input
              placeholder="请输入用户名"
              type="username"
              v-model="obj.username"
              prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              type="password"
              v-model="obj.password"
              prefix-icon="el-icon-s-goods"
            ></el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </div>
</template>
<script>
import { log } from "util";
export default {
  data() {
    return {
      obj: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到5个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      // this.$store.commit("dzzLogin",this.obj)
      // this.$message.success("登录成功")
      // this.$router.push("/home")
      this.$refs.form.validate(async valid => {
        if (valid) {
          let {data:res}=await this.$axios.post('/login',this.obj)
          if(res.meta.status==200){
            sessionStorage.setItem('04A_token',JSON.stringify(res.data))
            this.$message.success('登录成功')
            //跳转
            this.$router.push('/home')
          }
        }else{
          this.$message('登录失败')
          return false
        }
      });
    },
    //重置
    reset(){
      this.$refs.from.resetFields()
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: #334455;
  .box {
    width: 400px;
    height: 300px;
    background: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    border-radius: 3px;
  }

  .Form {
    padding: 90px 20px;
  }
  .right {
    display: flex;
    justify-content: flex-end;
  }
}
.logo {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid snow;
  background: #fff;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ddd;
  p {
    width: 100%;
    height: 100%;
    background: #efefef;
    border-radius: 50%;
    padding-top: 2px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
</style>
