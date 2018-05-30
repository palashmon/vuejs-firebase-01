<template>
  <div id="app" class="container">
    <h1>Sample Chat Room</h1>
    <!-- Messages -->
    <div v-for="(message, index) in messages" class="card" :key="index">
      <div class="card-body">
        <!-- nickname -->
        <h6 class="card-subtitle mb-2 text-muted">{{ message.nickname }}</h6>
        <!-- content -->
        <p v-if="message !== editingMessage" class="card-text">{{ message.text }}</p>
        <textarea v-else v-model="messageText" class="form-control"></textarea>
        <!-- actions -->
        <div v-if="message !== editingMessage">
          <a @click.prevent="deleteMessage(message)" href="#" class="card-link">Delete</a>
          <a @click.prevent="editMessage(message)" href="#" class="card-link">Edit</a>
        </div>
        <div v-else>
          <a @click.prevent="cancelEditing" href="#" class="card-link">Cancel</a>
          <a @click.prevent="updateMessage" href="#" class="card-link">Update</a>
        </div>
      </div>
    </div>

    <hr>
    <!-- New Message -->
    <form v-if="!editingMessage" @submit.prevent="storeMessage">
      <div class="form-group">
        <label>Message:</label>
        <textarea v-model="messageText" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label>Nickname:</label>
        <input v-model="nickname" class="form-control"/>
      </div>
      <button class="btn btn-primary">Send</button>
    </form>
  </div>
</template>

<script>

const config = require('../config');
firebase.initializeApp(config);
const database = firebase.database();
const messagesRef = database.ref('messages');

export default {
  name: 'app',
  data () {
    return {
      messages: [],
      messageText: '',
      nickname: 'palash',
      editingMessage: null
    }
  },
  methods: {
    storeMessage () {
      messagesRef.push({text: this.messageText, nickname: this.nickname, datetime: Date.now()})
      this.messageText = ''
    },
    deleteMessage (message) {

    },
    editMessage (message) {

    },
    cancelEditing () {

    },
    updateMessage () {

    }
  },
  created () {

    // Read Data from Firebase
    // value = snapshot.val() | key = snapshot.key
    messagesRef.on('child_added', snapshot => {
      // console.log({...snapshot.val()})
      this.messages.push({...snapshot.val(), id: snapshot.key})
      if (snapshot.val().nickname !== this.nickname) {
        nativeToast({
            message: `New message by ${snapshot.val().nickname}`,
            type: 'success'
        })
      }
    })
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
  background-color: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 20px;
}
.card {
  box-shadow: 3px 2px 10px 0px rgba(0, 0, 0, 0.35);
  margin-bottom: 10px;
  transition: box-shadow 0.3s ease-in-out;
}
.card:hover {
  box-shadow: 3px 2px 10px 0px rgba(0, 0, 0, 0.63);
}
.card-text {
  margin-bottom: 6px;
}
.card-body {
  padding-bottom: 8px;
}
.card-subtitle,
.card-link {
  font-size: 12px;
}
</style>
