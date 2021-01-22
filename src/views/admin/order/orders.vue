<template>
  <div>
    <BradMenu />
    <el-card>
      <!-- 表单区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="obj.query"
            clearable
            @clear="orderUser"
          >
            <el-button slot="append" icon="el-icon-search" @click="orderUser"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderlist.goods" border style="width: 100%">
        <el-table-column type="index" label="#" />
        <el-table-column prop="order_number" label="订单编号" />
        <el-table-column prop="order_price" label="订单价格" />
        <el-table-column label="是否付款">
          <el-button type="danger" size="mini">未付款</el-button>
          <!-- <el-button type="primary" size="mini">已付款</el-button> -->
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" />
        <el-table-column prop="update_time" label="下单时间" />
        <el-table-column label="操作">
          <template>
            <el-tooltip effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="收货地址" placement="top" :enterable="false">
              <el-button type="success" size="mini" icon="el-icon-location"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="getSize"
        @current-change="getPage"
        :current-page="obj.pagenum"
        :page-sizes="[10,15, 20, 25]"
        :page-size="obj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderlist.total"
      ></el-pagination>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BradMenu from "../../BeadMenu";
import qs from "qs";
export default {
  components: { BradMenu },
  data() {
    return {
      orderlist: [],
      obj: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      dialogVisible:false
    };
  },
  mounted() {
    this.orderUser();
  },
  methods: {
    async orderUser() {
      var str = qs.stringify(this.obj);
      var { data: res } = await this.$axios.get("/orders?" + str);
      console.log(res.data);
      this.orderlist = res.data;
    },
    //页码
    getPage(nowpage) {
      this.obj.pagenum = nowpage;
      this.orderUser();
    },
    //条数
    getSize(nowsize) {
      this.obj.pagesize = nowsize;
      this.orderUser();
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 15px;
}
</style>
