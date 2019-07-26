<template>
  <div>
    <div v-if="connected && results" class="voter">
      <v-sheet
        dark
        v-for="(item, index) of results"
        :key="index"
        :color="connected ? 'primary' : 'grey'"
        v-ripple
        class="d-flex align-center pa-3"
        @click="vote(index)"
        :style="{ backgroundImage: `url(${item.image})` }"
      >
        <div class="count white green--text">{{ item.count }}</div>
        <div class="title">{{ item.number }}. {{ item.name }}</div>
      </v-sheet>
      <v-sheet
        dark
        color="error"
        v-ripple
        class="d-flex align-center pa-3"
        @click="vote(-1)"
      >
        <div class="title">TIDAK SAH</div>
        <div class="count">{{ declined }}</div>
      </v-sheet>
      <div>
        <v-toolbar dense>
          <v-toolbar-items>
            <v-btn color="error" @click="selesai()">
              SELESAI
            </v-btn>
            <v-btn :disabled="cannotUndo" color="warning" @click="undo()">
              UNDO
            </v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn @click="goHome()">
              go Home
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </div>
    </div>

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
  </div>
</template>
<style>
.voter {
  user-select: none;
  -webkit-user-drag: none;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-content: space-between;
}

.voter > * {
  flex: 1;
  margin: 5px 10px;
  background-position: right center;
  background-size: auto 100%;
}

.voter > *:last-child {
  margin: 0px;
  flex: 0;
}

.voter .count {
  font-size: xx-large;
  height: 100%;
  text-align: center;
  display: flex;
  padding: 5%;
  margin-right: 2%;
  align-items: center;
}
</style>

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
  tps: number = -1;
  data: any = {};
  resultData: {
    started: number,
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
  _undo = [];
  $data: {
    _ws?: WebSocket
    _vote: DataView
    _undo: number[]
  }
  get cannotUndo() {
    return !this.$data._undo.length;
  }
  undo() {
    this.vote(this.$data._undo.pop(), -1, true);

  }
  goHome() {
    if (confirm('Anda yakin?')) {
      this.$router.push('/');
    }
  }
  mounted() {
    if (typeof (window['WebSocket']) != 'function') {
      alert('Perangkat anda tidak mendukung');
      return;
    }
    this.id = parseInt(this.$route.params['id']);
    this.tps = parseInt(this.$route.params['tps']);

    this.$api.listQuickcount().then(list => {
      if (list[this.id]) {
        this.data = list[this.id];
        this.connectWs()
      } else {
        this.$router.replace('/voter')
      }
    })
  }

  vote(index, add = 1, isUndo?: boolean) {
    if (!this.connected) {
      return alert('Tidak terhubung dengan server');
    }
    this.$data._vote.setInt8(0, index)
    this.$data._vote.setInt8(1, add)
    this.wsSend(this.$data._vote.buffer);
    if (!isUndo) {
      this.$data._undo.push(index);
    }
  }
  selesai() {
    if (confirm('Anda yakin?')) {
      setTimeout(() => {
        if (confirm('Jika ini dinyatakan selesai, maka anda tidak bisa membatalkannya. Yakin Sudah Selesai?')) {
          this.wsSend('SELESAI');
          this.$router.replace(`/result/${this.id}`);
        }
      }, 2000)
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
    if (this.$data._ws && this.$data._ws.readyState != WebSocket.CLOSED) {
      this.$data._ws.close()
    }
  }
  connectWs() {

    const passcode = localStorage[`voter_${this.id}_${this.tps}`] || '';
    const wsUrl = this.$api.getDirectUrl(`/voter/voting/${this.id}/${this.tps}`).replace(/^http(s)?/, 'ws$1');
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
        switch (e.data[0] || null) {
          case '{':
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
            break;
          case ':':
            alert(e.data.substr(1));
            this.$router.push('/voter');
            break
          default:
            console.warn('Unhandled server message', e.data);
            break;
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
