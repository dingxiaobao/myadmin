<template>
  <div>
    <BradMenu />
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="addFlag=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="roleslist" border>
        <el-table-column type="expand" width="100%">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0 ? 'bdtop': '','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  effect="dark"
                  closable
                  @close="removedel(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套二级权限 -->
                <el-row
                  :class="[i2===0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      effect="dark"
                      closable
                      @close="removedel(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      effect="dark"
                      closable
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removedel(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50" />
        <el-table-column label="角色名称" prop="roleName" />
        <el-table-column label="角色描述" prop="roleDesc" />
        <el-table-column label="操作" width="340">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row)"
            >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="qxUser(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加 -->
    <el-dialog title="添加角色" :visible.sync="addFlag">
      <el-form :model="addform" :rules="rules" ref="addForm">
        <el-form-item label="角色名称" :label-width="'80px'" prop="roleName">
          <el-input v-model="addform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'80px'" prop="roleDesc">
          <el-input v-model="addform.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag= false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑-->
    <el-dialog title="编辑角色" :visible.sync="editFlag">
      <el-form :model="edituser" :rules="rules" ref="editForm">
        <el-form-item label="角色名称" :label-width="'80px'" prop="roleName">
          <el-input v-model="edituser.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'80px'" prop="roleDesc">
          <el-input v-model="edituser.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFlag= false">取 消</el-button>
        <el-button type="primary" @click="editget">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限 -->
    <el-dialog title="分配权限" :visible.sync="qxFlag" width="60%" :close="qxClose">
      <!-- 树形控件 -->
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qxFlag = false">取 消</el-button>
        <el-button type="primary" @click="qxget">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BradMenu from "../BeadMenu";
import { log } from "util";
export default {
  components: { BradMenu },
  data() {
    return {
      roleslist: [],
      //添加
      addFlag: false,
      addform: {
        roleName: "",
        roleDesc: ""
      },
      //编辑
      editFlag: false,
      edituser: {
        id: 0,
        roleName: "",
        roleDesc: ""
      },
      // 正则
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      //分配
      qxFlag: false,
      rightlist: [],
      //树形控件的属性控制对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      defkeys: [],
      //将分配分配的id
      roleId: ""
    };
  },
  mounted() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      var { data: res } = await this.$axios.get("/roles");
      // console.log(res);
      this.roleslist = res.data;
    },
    //添加
    addUser(addForm) {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          var { data: res } = await this.$axios.post("/roles", this.addform);
          if (res.meta.status == 201) {
            this.addFlag = false;
            this.getRoles();
            this.$refs.addForm.resetFields();
          }
        }
      });
    },
    //删除
    del(id) {
      this.$confirm("亲，你确定要删除吗？删除就不能恢复了", "删除用户", {
        confirmButtonText: "确定删除",
        cancelButtonText: "再想想",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`roles/${id}`).then(res => {
            if (res.data.meta.status !== 200) {
              this.$message.error("删除失败");
              return;
            } else {
              this.$message.success("删除成功");
              this.getRoles();
            }
          });
        })
        .catch(() => {
          this.$message("你已取消删除");
        });
    },
    //编辑
    editUser(row) {
      this.edituser = {
        id: row.id,
        roleName: row.roleName,
        roleDesc: row.roleDesc
      };
      this.editFlag = true;
    },
    editget(editForm) {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          var obj = {
            roleName: this.edituser.roleName,
            roleDesc: this.edituser.roleDesc
          };
          var { data: res } = await this.$axios.put(
            `roles/${this.edituser.id}`,
            obj
          );
          if (res.meta.status == 200) {
            this.editFlag = false;
            this.getRoles();
            this.$message.success("修改成功");
          }
        }
      });
    },
    //所有权限列表
    async qxUser(role) {
      this.roleId = role.id;
      var { data: res } = await this.$axios.get("rights/tree");
      console.log(res);
      //把获取的权限保存到data中
      this.rightlist = res.data;
      console.log(this.rightlist);
      //递归获取三级节点的id
      this.getdefkerys(role, this.defkeys);
      this.qxFlag = true;
    },
    //权限删除
    removedel(role, rightId) {
      this.$confirm("亲，你确定要删除吗？删除就不能恢复了", "删除权限", {
        confirmButtonText: "确定删除",
        cancelButtonText: "再想想",
        type: "warning"
      }).then(async () => {
        var { data: res } = await this.$axios.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          this.$message.error("删除权限失败");
          return;
        }
        this.$message.success("删除权限成功");
        role.children = res.data;
      });
    },
    //通过递归的形式保存角色下三级权限的id，并保存到defkeys数组中
    getdefkerys(node, arr) {
      if (!node.children) {
        //如果node不包含children属性 就是三级节点
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getdefkerys(item, arr));
    },
    //监听分配权限对话框
    qxClose() {
      this.defkeys = [];
    },
    //点击为角色分配权限
    async qxget() {
      var keys = [
        this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // console.log(keys);
      var idStr = keys.join(",");
      var { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      });
      console.log(res);
      this.$message.success("分配权限成功");
      this.getRoles();
      this.qxFlag = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  width: 100%;
  margin-top: 20px;
  font-size: 12px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
