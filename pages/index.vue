<template>
  <div>
    <div>User List</div>
    <el-table :data="usersList">
      <el-table-column
        prop="created_at"
        label="Register Date"
      >
        <template slot-scope="scope">
          {{ $date(scope.row.created_at).format('DD/MM/YYYY') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="fname"
        label="First Name"
      >
      </el-table-column>
      <el-table-column
        prop="lname"
        label="Last Name"
      >
      </el-table-column>
      <el-table-column
        prop="age"
        label="Ages"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="Address"
      >
      </el-table-column>
      <el-table-column
        label="Options"
      >
        <template slot-scope="scope">
          <el-button @click="reqUpdateUser(scope.$index)">update</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- update modal -->
    <el-dialog
        width="60%"
        :title="`Update ${updateUser.fname} ${updateUser.lname}`"
        :visible="updateVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <span>
          <el-form :model="updateUser" status-icon :rules="rules" ref="updateUser" label-width="120px">
            <!-- personal info -->
            <el-form-item label="First name" prop="fname">
              <el-input type="text" v-model="updateUser.fname"></el-input>
            </el-form-item>
            <el-form-item label="Last name" prop="lname">
              <el-input type="text" v-model="updateUser.lname"></el-input>
            </el-form-item>
            <el-form-item label="Age" prop="age">
              <input class="el-input__inner" type="number" v-model="updateUser.age" />
            </el-form-item>
            <!-- contact info -->
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="updateUser.phone"></el-input>
            </el-form-item>
            <el-form-item label="Address" prop="address">
              <el-input type="textarea" v-model="updateUser.address" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelUpdate">Cancel</el-button>
          <el-button type="primary" @click="update">Confirm</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  middleware: 'isLogin',
  layout: 'default',
  data: () => {
    return {
      usersList: [],
      updateVisible: false,
      updateUser: {
        fname: '',
        lname: '',
        age: 0,
        phone: '',
        address: '',
        email: '',
        created_at: ''
      },
      rules: {
        fname: [{ required: true, message: 'Please enter first name', trigger: 'blur' }],
        lname: [{ required: true, message: 'Please enter last name', trigger: 'blur' }],
        age: [{ required: true, message: 'Please enter age', trigger: 'blur' }],
        phone: [{ required: true, message: 'Please enter phone number', trigger: 'blur' }],
        address: [{ required: true, message: 'Please enter address', trigger: 'blur' }]
      }
    }
  },
  async created () {
    await this.getUsersList()
  },
  methods: {
    async getUsersList () {
      const list = await firebase.firestore().collection('users').get()
      let tmpList = [] 
      list.forEach(doc => {
        tmpList.push(doc.data())
      })
      this.usersList = tmpList
    },
    reqUpdateUser (index) {
      this.updateUser = this.usersList[index]
      this.updateVisible = true
    },
    update () {
      this.$refs['updateUser'].validate(async (valid) => {
        if (valid) {
          try {
            await firebase.firestore().collection('users').doc(this.updateUser.email).update(this.updateUser)
            this.$notify.success('update success!')
            this.updateVisible = false
            this.getUsersList()
          } catch (e) {
            this.$notify.error('update failed!')
            this.cancelRegister()
            console.log(e)
          }
        }
      })
    },
    async cancelUpdate () {
      this.updateVisible = false,
      this.updateUser = {
        fname: '',
        lname: '',
        age: 0,
        phone: '',
        address: '',
        email: '',
        created_at: ''
      }
    }
  }
}
</script>

<style>
</style>
