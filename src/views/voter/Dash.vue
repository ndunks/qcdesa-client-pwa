<template>
  <v-container grid-list-md style="user-select: none">
    <v-layout v-if="connected && results" wrap>
      <v-flex v-for="(item, index) of results" :key="index" xs12 md4>
        <v-sheet
          :color="connected ? 'primary' : 'grey'"
          v-ripple
          class="d-flex align-center pa-3"
          height="200"
          @click="vote(index)"
        >
          <div class="title">{{ item.name }}</div>
          <div class="count">{{ item.count }}</div>
        </v-sheet>
      </v-flex>
      <v-flex xs12 md4>
        <v-sheet
          color="warning"
          v-ripple
          class="d-flex align-center pa-3"
          height="200"
          @click="vote(-1)"
        >
          <div class="title">TIDAK SAH</div>
          <div class="count">{{ declined }}</div>
        </v-sheet>
      </v-flex>

      <v-flex xs12>
        <v-btn color="error" large outlined @click="selesai()">
          SELESAI
        </v-btn>
        <v-btn :disabled="cannotUndo" color="error" large outlined @click="undo()">
          UNDO
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-else align-center justify-center>
      <v-flex xs12 md4>
        <v-sheet
          dark
          :color="status == 'Not Connected' ? 'error' : 'orange'"
          height="200"
          class="text-center pa-3 elevation-3"
        >
          <h1 class="title">{{ status }}</h1>
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import VoteAddDialog from "@/components/VoteAddDialog.vue";
import { setTimeout } from 'timers';

@Component({
  name: "AdminDash",
  components: { VoteAddDialog }
})
export default class AdminDash extends Vue {
  id: number = -1;
  data: any = {};
  resultData: {
    started: number,
    // Total pemilih
    participant: number,
    updated?: number,
    finished?: number,
    accepted: number,
    declined: number,
    total: number,
    results: number[]
  } = null as any;
  isFinished = false;
  results: any[] = [];
  

  get declined() {
    return this.resultData ? this.resultData.declined : '?';
  }
  get list() {
    return this.data.candidates || [];
  }

  status: null | 'Connecting' | 'Connected' | 'Not Connected' = null;

  get connected() {
    return this.status == 'Connected';
  }

  _ws = null;
  _vote = new DataView(new ArrayBuffer(2));
  _lastVoted = false;
  $data: {
    _ws?: WebSocket
    _vote: DataView
    _lastVoted?: number | boolean
  }
  get cannotUndo(){
    return typeof(this.$data._lastVoted) != 'number';
  }
  undo(){
    this.vote(this.$data._lastVoted, -1);
    this.$data._lastVoted = false;
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

  vote(index, add = 1) {
    if (!this.connected) {
      return alert('Tidak terhubung dengan server');
    }
    this.$data._vote.setInt8(0, index)
    this.$data._vote.setInt8(1, add)
    this.wsSend(this.$data._vote.buffer);
    this.$data._lastVoted = index;
  }
  selesai() {
    if (confirm('Anda yakin?')) {
      setTimeout(() => {
        if (confirm('Jika ini dinyatakan selesai, maka anda tidak bisa membatalkannya. Yakin Sudah Selesai?')) {
          this.wsSend('SELESAI');
          this.$router.replace(`/result/${this.id}`);
        }
      }, 3000)
    }
  }
  wsSend(data: any) {
    if (this.$data._ws) {
      this.$data._ws.send(data);
    } else {
      console.error('Send message when no ws');
    }
  }
  beforeDestroy() {
    if(this.$data._ws && this.$data._ws.readyState != WebSocket.CLOSED ){
      this.$data._ws.close()
    }
  }
  connectWs() {

    const passcode = localStorage[`voter_${this.id}`] || '';
    const baseUrl = this.$api.url.replace(/^http(s)?/, 'ws$1');
    //const baseUrl = 'ws://localhost:8888'
    const wsUrl = `${baseUrl}/voter/voting/${this.id}`;
    const ws = this.$data._ws = new WebSocket(wsUrl, passcode || undefined);
    this.status = 'Connecting';
    ws.onopen = (e: Event) => {
      this.status = 'Connected';
    }
    ws.onclose = (e: Event) => {
      console.log('WS CLOSED', e);
      this.status = 'Not Connected';
      this.$data._ws = undefined;
    }
    ws.onmessage = (e) => {

      //console.log('WS MESG', typeof (e.data), e);
      if (typeof (e.data) == 'string') {
        if (e.data[0] === '{') {
          this.resultData = JSON.parse(e.data);
          this.isFinished = !!this.resultData.finished;
          if (this.isFinished) {
            alert("Quick Count Sudah Ditutup");
            ws.close();
            this.$router.replace(`/result/${this.id}`);
          }

          this.results.splice(0, this.results.length, ...this.data.candidates.map(
            (v, i) => {
              this.$set(v, 'count', this.resultData.results[i]);
              return v;
            }
          ))
        }
      } else {
        // Update indes result
        // is object, mean vote it!
        (new Response(e.data)).arrayBuffer().then(
          buf => {
            const int8 = new Int8Array(buf);
            const candidate = int8[0];
            const add = int8[1];
            //console.log('VOTE OK', int8);

            if (this.results[candidate]) {
              this.results[candidate].count += add;
              this.resultData.accepted += add;
            } else {
              this.resultData.declined += add;
            }
            this.resultData.total = this.resultData.accepted + this.resultData.declined;
          }
        )
      }
    }
    ws.onerror = (e) => {
      this.status = 'Not Connected';
      try {
        ws.close();
      } catch (error) { }
      console.log('WS ERR', e);
    }
  }
  @Watch('status')
  statusChanged(cur, old) {
    if (this.isFinished) {
      return;
    }
    document.title = `${this.data.name} - ${cur}`;
    if (this.status == 'Not Connected') {
      setTimeout(() => {
        if (this.status == 'Not Connected') {
          console.log('Reconnect WS');
          this.connectWs()
        }
      }, 2000);
    }
  }
}
</script>
