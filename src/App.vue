<template>
  <div id="app" class="container">
    <h1>Sample Chat Room</h1>
    <!-- Messages -->
    <div v-for="message in messages" class="card" :key="message.id" :class="getClass(message)">
      <div class="card-body">
        <!-- nickname -->
        <h6 class="card-subtitle mb-2 text-muted">
          {{ message.nickname }}
          <small class="text-muted small" :class="getTimeClass(message)" v-html="getTime(message)"></small>
        </h6>
        <!-- content -->
        <p v-if="message !== editingMessage" class="card-text">{{ message.text }}</p>
        <textarea v-else v-model="messageText" class="form-control"></textarea>
        <!-- actions -->
        <div v-if="message.nickname === nickname">
          <div v-if="message !== editingMessage">
            <a @click.prevent="deleteMessage(message)" href="#" class="card-link delete text-danger">Delete</a>
            <a @click.prevent="editMessage(message)" href="#" class="card-link edit">Edit</a>
          </div>
          <div v-else>
            <a @click.prevent="cancelEditing" href="#" class="card-link">Cancel</a>
            <a @click.prevent="updateMessage" href="#" class="card-link">Update</a>
          </div>
        </div>
      </div>
    </div>

    <hr>
    <!-- New Message -->
    <form v-if="!editingMessage" @submit.prevent="storeMessage">
      <div class="form-group">
        <label>Message:</label>
        <textarea v-model.trim="messageText" class="form-control" @keyup.enter="storeMessage"></textarea>
      </div>
      <div class="form-group">
        <label>Nickname:</label>
        <input v-model.trim.lazy="nickname" class="form-control" @change="saveNickname"/>
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
      nickname: this.getNickname(),
      editingMessage: null
    }
  },
  methods: {
    storeMessage () {
      messagesRef.push({text: this.messageText, nickname: this.nickname, datetime: Date.now()})
      this.messageText = ''
    },
    deleteMessage (message) {
      messagesRef.child(message.id).remove()
    },
    editMessage (message) {

    },
    cancelEditing () {

    },
    updateMessage () {

    },
    isMyText (message){
      return message.nickname === this.nickname
    },
    getClass (message) {
      return {
        'text-right': !this.isMyText(message)
      }
    },
    getTimeClass (message) {
      return {
        'float-right': this.isMyText(message),
        'float-left': !this.isMyText(message)
      }
    },
    getTime (message){
      return new Date(message.datetime).toLocaleString('en-US');
    },
    saveNickname (){
      localStorage.setItem('nickname', this.nickname);
    },
    getNickname (){
      return localStorage.getItem('nickname') ? localStorage.getItem('nickname') : 'Palash';
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
    });

    // Once a record is deleted from Firebase
    messagesRef.on('child_removed', snapshot => {
      const deletedMessage = this.messages.find(message => message.id === snapshot.key)
      const index = this.messages.indexOf(deletedMessage)
      this.messages.splice(index, 1)
      if (snapshot.val().nickname !== this.nickname) {
        nativeToast({
            message: `Message deleted by ${snapshot.val().nickname}`,
            type: 'warning'
        })
      }
    });
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
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.35);
  margin-bottom: 10px;
  transition: box-shadow 0.3s ease-in-out;
}

.card:hover {
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.63);
}
.card-text {
  margin-bottom: 6px !important;
}
.card-body {
  padding-bottom: 8px;
}
.card-subtitle,
.card-link,
.card-text {
  font-size: 12px;
  letter-spacing: 0.05em;
}
.text-right {
  background: whitesmoke;
}
.small {
  font-size: 12px !important;
}

.edit,
.delete {
  position: absolute;
  right: 20px;
  bottom: 12px;
  display: none;
}
.delete {
  right: 60px;
}
.card:hover .edit,
.card:hover .delete {
  display: block;
}
</style>
