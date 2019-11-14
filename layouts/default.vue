<template>
  <el-container>
    <el-container>
      <el-header style="text-align: right; font-size: 12px; background-color: #409EFF; color: #fff; line-height: 60px;">
        <el-dropdown style="line-height: 5px;">
          <img
            :src="userInfo ? userInfo.photoURL : 'https://placehold.it/50x50'"
            style="border-radius: 100%; margin-top: 4px;"
            alt=""
            width="50px"
            height="50px" 
          />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item >
              <el-button @click="LogOut">Log out</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      
      <el-main>
        <nuxt />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import firebase from 'firebase'

export default {
  data: () => {
    return {
      userInfo: {}
    }
  },
  mounted () {
    let info = localStorage.getItem('firebase_user_data')
    this.userInfo = JSON.parse(info)
  },
  methods: {
    async LogOut () {
      try {
        console.log('sign out')
        await firebase.auth().signOut()
        localStorage.removeItem('firebase_user_data')
        console.log('sign out success')
        this.$router.push('/login')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
