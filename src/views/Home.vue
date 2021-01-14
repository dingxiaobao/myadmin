<template>
  <div>
    <el-container>
      <el-header>
        <div class="logo">
          <img src="@/assets/logo.png" alt />
          电商后台管理
        </div>
        <el-button type="info" @click="clear">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="flag?'64px':'200px'">
          <div id="left_top" @click="flag=!flag">|||</div>
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            :collapse="flag"
            :collapse-transition="false"
            unique-opened
            router
          >
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconlist[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="it.path"
                  v-for="it in item.children"
                  :key="it.id"
                  @click="breadmenu(item.authName,it.authName)"
                >
                  <i class="el-icon-s-order"></i>
                  <span>{{it.authName}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      menulist: [],
      iconlist: {
        "125": "el-icon-user-solid",
        "103": "el-icon-goods",
        "101": "el-icon-picture",
        "102": "el-icon-video-camera-solid",
        "145": "el-icon-message-solid"
      },
      flag: false
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    //退出
    clear() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const res = await this.$axios.get("/menus");
      console.log(res);
      this.menulist = res.data.data;
    },
    //面包屑
    breadmenu(name1,name2){
      var obj={'one':name1,'two':name2}
      sessionStorage.setItem('path',JSON.stringify(obj))
    }
  }
};
</script>
<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background: #373d41;
  justify-content: space-between;
  display: flex;
  align-items: center;
  .logo {
    color: white;
    font-size: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
}

.el-aside {
  background-color: #4d5864;
  color: #333;
  min-height: 400px;
  #left_top {
    line-height: 30px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    letter-spacing: 2px;
  }
  .el-menu {
    border: none;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
