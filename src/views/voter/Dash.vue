<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex v-for="(item, index) of list" :key="index" xs12 md4>
        <v-sheet
          color="primary"
          v-ripple
          class="d-flex align-center pa-3"
          height="200"
        >
          <div class="title">{{ item.name }}</div>
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VoteAddDialog from "@/components/VoteAddDialog.vue";

@Component({
  name: "AdminDash",
  components: { VoteAddDialog }
})
export default class AdminDash extends Vue {
  id: number = -1;
  data: any = {};
  get list() {
    return this.data.candidates || [];
  }
  _ws = null;
  $data: {
    _ws: WebSocket
  }

  mounted() {
    if (typeof (window['WebSocket']) != 'function') {
      alert('Perangkat anda tidak mendukung');
      return;
    }
    this.id = parseInt(this.$route.params['id']);
    this.$api.listQuickcount().then(list => {
      if (list[this.id]) {
        this.data = list[this.id];
        this.connectWs()
      } else {
        this.$router.replace('/voter')
      }
    })
  }

  vote(index) {

  }
  connectWs() {
    const passcode = localStorage[`voter_${this.id}`] || '';
    const baseUrl = this.$api.url.replace(/^http(s)?/, 'ws$1');
    const ws = new WebSocket(`${baseUrl}/voter/voting/${this.id}`, passcode || undefined)
    ws.onopen = (e: Event) => {
      console.log('WS OPENED', e);
    }
    ws.onclose = (e: Event) => {
      console.log('WS CLOSED', e);
    }
    ws.onmessage = (e) => {
      console.log('WS MESG', e);
    }
    ws.onerror = (e) => {
      console.log('WS ERR', e);
    }
  }
}
</script>
