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
            @clear="getUser"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" style="margin-left:20px" @click="addflag=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userlist.users" border>
        <el-table-column label="#" prop="id" width="80" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="电话" prop="mobile" />
        <el-table-column label="角色" prop="role_name" />
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.mg_state"
              @change="saveState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="RolesSet(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="getSize"
        @current-change="getPage"
        :current-page="userlist.pagenum"
        :page-sizes="[2, 5, 15, 20]"
        :page-size="obj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userlist.total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户 " :visible.sync="addflag">
      <el-form :model="addform" :rules="rules" ref="Fromname">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="addform.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input v-model="addform.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="addform.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" label-width="80px" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addflag = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="editflag">
      <el-form :model="edituser" :rules="rules" ref="editName">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="edituser.username" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="edituser.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" label-width="80px" prop="mobile">
          <el-input v-model="edituser.mobile" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editflag = false">取 消</el-button>
        <el-button type="primary" @click="editget">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="Rolesflag" @close="Allroles">
      <el-form :model="userInfo" class="form">
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <P>
          分配新角色：
          <el-select v-model="setRoleId" placeholder="请选择新角色">
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </P>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Rolesflag = false">取 消</el-button>
        <el-button type="primary" @click="getAllroles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BradMenu from "../../BeadMenu";
import qs from "qs";
export default {
  components: { BradMenu },
  data() {
    var checkEmail = (rules, val, cb) => {
      var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (!reg.test(val)) {
        cb(new Error("请输入正确的邮箱格式"));
      } else {
        cb();
      }
    };
    var checkMobile = (rules, val, cb) => {
      var reg = /^1(3|4|5|6|7|8|9)+\d{9}$/;
      if (!reg.test(val)) {
        cb(new Error("请输入正确的电话格式"));
      } else {
        cb();
      }
    };
    return {
      userlist: [],
      obj: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      //添加
      addflag: false,
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //编辑
      editflag: false,
      edituser: {
        id: 0,
        email: "",
        mobile: ""
      },
      //分配权限
      Rolesflag: false,
      userInfo: {},
      roleslist: [],
      setRoleId: "",
      // 正则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      var str = qs.stringify(this.obj);
      var res = await this.$axios.get("/users?" + str);
      this.userlist = res.data.data;
    },
    //分页
    getPage(nowpage) {
      this.obj.pagenum = nowpage;
      this.getUser();
    },
    getSize(nowsize) {
      this.obj.pagesize = nowsize;
      this.getUser();
    },
    //设置状态
    async saveState(info) {
      var res = await this.$axios.put(`users/${info.id}/sate/${info.mg_state}`);
      console.log(res);
      if (res.status == 200) {
        this.$message.success("状态设置成功");
      }
    },
    //添加用户
    addUser(Fromname) {
      this.$refs.Fromname.validate(async valid => {
        if (valid) {
          var { data: res } = await this.$axios.post("/users", this.addform);
          console.log(res);
          if (res.meta.status == 201) {
            this.addflag = false;
            this.getUser();
            this.$refs.Fromname.resetFields();
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
          this.$axios.delete(`users/${id}`).then(res => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              this.$message.error("删除失败");
              return;
            } else {
              this.$message.success("删除成功");
              this.getUser();
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
        username: row.username,
        email: row.email,
        mobile: row.mobile
      };
      this.editflag = true;
    },
    editget(editName) {
      this.$refs.editName.validate(async rules => {
        if (rules) {
          var obj = {
            email: this.edituser.email,
            mobile: this.edituser.mobile
          };
          var { data: res } = await this.$axios.put(
            `users/${this.edituser.id}`,
            obj
          );
          if (res.meta.status == 200) {
            this.editflag = false;
            this.getUser();
            this.$message.success("修改成功");
          }
        }
      });
    },
    // 获取所有角色
    async RolesSet(info) {
      this.userInfo = info;
      //在展示对话框之前，获取所有角色的列表
      var { data: res } = await this.$axios.get("roles");
      // console.log(res);
      this.roleslist = res.data;
      this.Rolesflag = true;
    },
    async getAllroles() {
      if (!this.setRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      var { data: res } = await this.$axios.put(
        
        `users/${this.userInfo.id}/role`,
        {
          rid: this.setRoleId
        }
      );
      // debugger
      this.getUser();
      this.$message.success("更新成功");
      this.Rolesflag = false;
    },
    Allroles() {
      this.setRoleId = "";
      this.userInfo = {};
    }
  },
  computed: {}
};
</script>

<style lang="scss">
.el-card {
  margin-top: 20px;
}
.el-table {
  width: 100%;
  margin: 15px 0 15px 0;
  border-radius: 3px;
}
.form p {
  margin: 10px;
}
</style>
