<template>
  <div>
    <BradMenu />
    <el-card>
      <el-table :data="rightlist" border style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import BradMenu from "../BeadMenu";
import { log } from "util";
export default {
  components: { BradMenu },
  data() {
    return {
      rightlist: []
    };
  },
  mounted() {
    this.getRight();
  },
  methods: {
    async getRight() {
      var { data: res } = await this.$axios.get("rights/list");
      console.log(res);
      this.rightlist = res.data;
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
  font-size: 12px;
}
</style>
