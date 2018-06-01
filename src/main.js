import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import App from './App.vue';

const options = {
  color: '#42A5F5',
  failedColor: '#874b4b',
  thickness: '6px',
  transition: {
    speed: '0.4s',
    opacity: '0.6s',
    termination: 300
  },
  location: 'top',
  inverse: false
};

Vue.use(VueProgressBar, options);

new Vue({
  el: '#app',
  render: h => h(App)
});
