<template>
  <div>
    <BeadMenu />
    <el-card>
      <div class="box">
        <i class="el-alert__icon el-icon-info"></i>
        <span>添加用户信息</span>
      </div>
      <!-- 步骤条 -->
      <el-steps :space="400" :active="nowTab-0" finish-status="success" align-center>
        <el-step title="基础信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-form :model="goodsobj" label-width="80px">
        <el-tabs tab-position="left" style="height:300px" @tab-click="changeTab" v-model="nowTab">
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称">
              <el-input v-model="goodsobj.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsobj.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsobj.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsobj.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="goodsobj.goods_cat"
                :options="catelist"
                :props="setobj"
                @change="goodage"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="3">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              list-type="picture"
              :headers="fileobj"
              :on-success="upload"
              :on-remove="removeFile"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <quill-editor v-model="goodsobj.goods_introduce" style="min-height:300px"></quill-editor>
            <el-button type="primary" @click="addData()">添加用户</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import BeadMenu from "../BeadMenu";
export default {
  components: { BeadMenu },
  data() {
    return {
      nowTab: 0,
      //商品对象
      goodsobj: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: "",
        pics: [],
        goods_introduce: ""
      },
      //分类数据
      catelist: [],
      //设置分类的规则
      setobj: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //文件上传
      fileobj: {
        Authorization: ""
      }
    };
  },
  methods: {
    changeTab() {},
    goodage() {},
    upload(res, file, filelist) {
      var obj = { pic: res.data.tmp_path };
      this.goodsobj.pics.push(obj);
    },
    removeFile(file, filelist) {
      var filename = file.response.data.tmp_path;
      var index = this.goodsobj.pics.findIndex((item, key) => {
        return item.pic == filename;
      });
      this.goodsobj.pics.splice(index, 1);
    },
    //添加用户
    async addData() {
    //   this.goodsobj.goods_cat = this.goodsobj.goods_cat.join(",");
    //   console.log(this.goodsobj);
      var { data: res } = await this.$axios.post("goods", this.goodsobj);
      console.log(res);
    },
    async goodsUser() {
      var { data: res } = await this.$axios.get("categories");
      this.catelist = res.data;
    }
  },
  mounted() {
    var loginmsg = JSON.parse(sessionStorage.getItem("04A_token"));
    this.fileobj.Authorization = loginmsg.token;
    console.log(loginmsg);
    this.goodsUser();
  }
};
</script>
<style lang="scss" scope>
.el-card {
  margin-top: 10px;
  height: 600px;
}
.el-button {
  margin-top: 10px;
}
.el-tabs {
  margin-top: 20px;
  height: 100% !important;
}
.box {
  line-height: 30px;
  background: #f4f4f5;
  color: #909399;
  margin: 0px 0px 10px;
  border-radius: 4px;
  text-align: center;
}
</style>