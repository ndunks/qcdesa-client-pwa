<template>
  <v-dialog v-model="visible" scrollable full-width fullscreen>
    <template #activator="{ on, value }">
      <v-btn v-on="on" text>Lihat Log</v-btn>
    </template>
    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-items>
          <v-select
            v-model="selected"
            flat
            hide-details
            solo
            :items="items"
            label="Pilih TPS"
          ></v-select>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn small text icon style="float: right" @click="loadItems">
            <v-icon>mdi-reload</v-icon>
          </v-btn>
          <v-btn small text icon style="float: right" @click="visible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-alert :value="!!message" v-text="message"></v-alert>
      <v-card-text class="text-center" v-if="loading">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-card-text>
      <v-card-text v-if="timelines" class="pa-0">
        <v-timeline align-top dense  class="pa-0">
          <v-timeline-item
          fill-dot left
            v-for="line in timelines"
            :key="line.key"
            :color="line.color"
          >
            <template v-slot:icon>
              <span v-text="line.icon" class="white--text"></span>
            </template>
            <v-layout justify-space-between pr-2 wrap>
              <v-flex xs12 sm7
                :class="`${line.color}--text`"
                v-text="line.value">
              ></v-flex>
              <v-flex xs12 sm5 text-right v-text="line.time"></v-flex>
            </v-layout>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  name: 'ResultLogs'
})
export default class ResultLogs extends Vue {
  @Prop()
  locations: any[]

  @Prop()
  candidates: any[]

  selected: number = -1;
  loading = false;
  get items() {
    return this.locations ? this.locations.map(v => {
      return {
        text: v.name,
        value: v.id
      }
    }) : ['Loading..']
  }
  message = ""
  lines = []
  timelines: any[] = [];
  visible = false
  id = -1

  @Watch('visible')
  visibleChanged(cur, old) {
    console.log('Visible changed', cur);
    if (cur) {
      this.loadItems()
    }
  }

  @Watch('selected')
  selectedChanged(cur, old) {
    console.log('selected changed', cur);
    this.loadItems()
  }

  mounted() {
    console.log('DISPLAYIT', this.$route.params);
    this.id = parseInt(this.$route.params.id)
  }
  loadItems() {
    if (this.selected < 0 || this.id < 0) {
      return;
    }
    this.message = "Memuat data..";
    const url = `${this.$api.url.replace(/\/+$/, '')}/public/${this.id}-${this.selected}.log`;
    let reLine = /^(\d+)\s(\w+)\s(.*)$/;
    let match;
    const dt = new Date();
    this.timelines = [];
    fetch(url).then(
      res => {
        if (res.ok) {
          this.message = '';
          const colors = [
            'purple', 'indigo', 'teal', 'orange', 'lime'
          ]
          this.readResponse(res).then(lines => {
            this.timelines = lines.map((line, index) => {
              if ((match = reLine.exec(line))) {
                let timestamp = match[1];
                let value = match[3];
                let key = `${this.id}${index}${timestamp}`
                let type = match[2];
                let icon = '#';
                let color = 'primary';
                dt.setTime(match[1]);
                if (type == 'VOTE') {
                  let tmp = value.match(/(-?\d+)\s+(-?\d+)/);
                  if (tmp) {
                    let cid = parseInt(tmp[1]);
                    let cnt = parseInt(tmp[2]);
                    value = cnt < 0 ? cnt : `+${cnt}`
                    if (cid >= 0) {
                      let candidate = this.candidates[cid];
                      icon = candidate.number;
                      value = `${candidate.name} ${value}`
                      color = colors[cid] || "success";
                    } else {
                      icon = "X";
                      value = `Tidak Sah ${value}`
                      color = "error";
                    }
                  }
                }
                const obj: any = {
                  timestamp,
                  time: dt.toLocaleTimeString(),
                  type, value, icon, color
                };
                if( obj.icon == '#' ){
                  //load browser info
                  let tmp = obj.value.match(/([\d.]+)\s(.*)/);
                  if( tmp ){
                    obj.ip = tmp[1];
                    obj.browser = tmp[2];
                    obj.value = '...';
                    fetch(`http://api.userstack.com/detect?access_key=a8e73e6f1c9b50d7e5769d634ad23946&ua=${encodeURI(obj.browser)}`)
                    .then( res => res.json().then( json => {
                      obj.value = `${obj.ip} ${json.brand} ${json.name} ${json.os ? json.os.name : ''}`
                    })).catch( console.error )

                  }
                }
                return obj;
              }
            }).reverse();
          })
        } else {
          this.message = 'Belum ada data'
        }
      }
    ).catch((e) => this.message = e.message)
  }

  async readResponse(response: Response) {
    const utf8Decoder = new TextDecoder("utf-8");
    if (response.body == null) {
      console.log('Response body is null');
      return []
    }
    const newLines: any[] = [];
    let reader = response.body.getReader();
    let read = await reader.read();
    let chunk = (read.value ? utf8Decoder.decode(read.value) : "");
    let match: any;
    let re = /\n|\r|\r\n/gm;

    let startIndex = 0;
    let result;
    for (; ;) {
      let result = re.exec(chunk);
      if (!result) {
        if (read.done) {
          break;
        }
        let remainder = chunk.substr(startIndex);
        read = await reader.read();
        chunk = remainder + (read.value ? utf8Decoder.decode(read.value) : "");
        startIndex = re.lastIndex = 0;
        continue;
      }
      newLines.push(chunk.substring(startIndex, result.index))
      startIndex = re.lastIndex;
    }
    if (startIndex < chunk.length) {
      // last line didn't end in a newline char
      newLines.push(chunk.substr(startIndex))
    }
    return newLines;
  }

}
</script>
