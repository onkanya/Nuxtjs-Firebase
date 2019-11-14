<template>
  <div class="container">
    <div class="login-container">
      <div class="login-header">
        Exam Front-end
      </div>
      <div class="sub-login-header">
        Please Sign-in
      </div>
      <el-button @click="googleSignIn">
        <img src="~/static/google-icon.png" width="20px" style="vertical-align: middle;">
        <span>
          Sign-in with Gmail
        </span>
      </el-button>
    </div>

    <el-dialog
      width="60%"
      title="Register"
      :visible="registerDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <span>
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="120px" class="demo-registerForm">
          <!-- personal info -->
          <el-form-item label="First name" prop="fname">
            <el-input type="text" v-model="registerForm.fname"></el-input>
          </el-form-item>
          <el-form-item label="Last name" prop="lname">
            <el-input type="text" v-model="registerForm.lname"></el-input>
          </el-form-item>
          <el-form-item label="Age" prop="age">
            <input class="el-input__inner" type="number" v-model="registerForm.age" />
          </el-form-item>
          <!-- contact info -->
          <el-form-item label="Phone" prop="phone">
            <el-input v-model="registerForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="Address" prop="address">
            <el-input type="textarea" v-model="registerForm.address" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRegister">Cancel</el-button>
        <el-button type="primary" @click="register">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  layout: 'login',
  middleware: 'isNotLogin',
  data: () => {
    return {
      userData: {},
      registerDialog: false,
      registerForm: {
        fname: '',
        lname: '',
        age: 0,
        phone: '',
        address: ''
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
  methods: {
    googleSignIn () {
      let provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then(async result => {
        let document = await firebase.firestore().collection('users').doc(result.user.email).get()
        if (document.exists) {
          localStorage.setItem('firebase_user_data', JSON.stringify(result.user))
          this.$router.push('/')
          this.$notify.success('login success!')
          return
        }
        this.userData = result.user
        this.registerDialog = true
        const [fname, lname] = result.user.displayName.split(' ')
        this.registerForm = {
          ...this.registerForm,
          fname,
          lname,
        }
      }).catch(e => {
        this.$notify.error('login failed!')
        console.log(e)
      })
    },
    register () {
      this.$refs['registerForm'].validate(async (valid) => {
        if (valid) {
          try {
            await firebase.firestore().collection('users').doc(this.userData.email).set({
              ...this.registerForm,
              created_at: new Date().toUTCString(),
              email: this.userData.email
            })
            localStorage.setItem('firebase_user_data', JSON.stringify(this.userData))
            this.$router.push('/')
            this.$notify.success('login success!')
          } catch (e) {
            this.$notify.error('register failed!')
            this.cancelRegister()
            console.log(e)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    async cancelRegister () {
      try {
        await firebase.auth().signOut()
        localStorage.removeItem('firebase_user_data')
        this.$router.push('/login')
      } catch (e) {
        this.$notify.error('login failed!')
        console.log(e)
      }
    }
  }
}
</script>

<style>
  .container {
    color: #555;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('../static/2866128.jpg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    text-align: center;
  }

  .login-container {
    background-color: #fff;
    padding: 30px;
    border: #ccc solid 1px;
    border-radius: 8px;
  }

  .login-header {
    background: -webkit-linear-gradient(#00d5fc, #ee60f3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 34px;
    font-weight: 600;
  }

  .sub-login-header {
    color: #0e31af;
    text-align: center;
    margin: 5px 0 30px 0;
  }
</style>
