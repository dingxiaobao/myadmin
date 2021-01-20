<template>
  <div>
    <Breadmenu />
    <el-card>
      <!-- 表单区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="obj.query"
            clearable
            @clear="goodslist"
          >
            <el-button slot="append" icon="el-icon-search" @click="goodslist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" style="margin-left:20px" @click="add">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodsList.goods" border style="margin-top:20px;">
        <el-table-column label="#" type="index" />
        <el-table-column label="商品名称" prop="goods_name" width="500px" />
        <el-table-column label="商品价格(元)" prop="goods_number" />
        <el-table-column label="商品重量" prop="goods_weight" />
        <el-table-column label="创建时间" prop="add_time" />
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="getSize"
        @current-change="getPage"
        :current-page="obj.pagenum"
        :page-sizes="[2, 5, 15, 20]"
        :page-size="obj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsList.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import Breadmenu from "../../BeadMenu";
import qs from "qs";
export default {
  components: { Breadmenu },
  data() {
    return {
      //分页
      obj: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      //列表对象
      goodsList: {}
    };
  },
  mounted() {
    this.goodslist();
  },
  methods: {
    add() {
      var obj = { one: "商品管理", two: "添加商品" };
      sessionStorage.setItem("path", JSON.stringify(obj));
      this.$router.push("/goodslist");
    },
    //获取列表
    async goodslist() {
      var str = qs.stringify(this.obj);
      var { data: res } = await this.$axios.get("/goods?" + str);
      // console.log(res);
      this.goodsList = res.data;
    },
    //页码
    getPage(nowpage) {
      this.obj.pagenum = nowpage;
      this.goodslist();
    },
    //条数
    getSize(nowsize) {
      this.obj.pagesize = nowsize;
      this.goodslist();
    },
    //删除
    del(id) {
      this.$confirm("亲，你确定要删除吗？删除就不能恢复了", "删除用户", {
        confirmButtonText: "确定删除",
        cancelButtonText: "再想想",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`goods/${id}`).then(res => {
            console.log(res.data);
            if (res.data.meta.status !== 200) {
              this.$message.error("删除失败");
              return;
            }
            this.$message.success("删除成功");
            this.goodslist();
          });
        })
        .catch(() => {
          this.$message("你已取消删除");
        });
    }
  }
};
</script>
<style lang="scss" scope>
.el-card {
  margin-top: 10px;
}
</style>