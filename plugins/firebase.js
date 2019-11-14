import firebase from 'firebase'
// normally we should not push any config file to git
const firebaseConfig = require('~/config/json/firebase-config.json')

let app = null
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig)
}

export const db = app.database()