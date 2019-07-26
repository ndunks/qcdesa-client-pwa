<template>
  <div class="text-center">
    <v-dialog :value="value" @input="!$event && $emit('batal')" class="ma-0" max-width="600" scrollable>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="$emit('click')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card
        tag="form"
        @submit.prevent="$emit('save', $data._changed)"
        ref="form"
      >
        <v-card-text style="margin-top: 48px;">
          <v-tabs>
            <v-tab>Detail</v-tab>
            <v-tab>Kandidat</v-tab>
            <v-tab>TPS</v-tab>
            <v-tab-item>
              <v-text-field
                label="Nama QuickCount *"
                name="name"
                type="text"
                required
                :rules="[v => !!v || 'Harus diisi']"
                :value="name"
                @input="$data._changed['name'] = $event"
              ></v-text-field>
              <v-textarea
                label="Deskripsi"
                rows="2"
                :value="desc"
                @input="$data._changed['desc'] = $event"
              ></v-textarea>
              <v-switch label="Hide from Home" v-model="hideChanged"></v-switch>
            </v-tab-item>
            <v-tab-item>
              <div
                v-for="(item, index) of candidateList"
                :key="index"
                class="candidate"
              >
                <VoteInputCandidate
                  v-bind="item"
                  @delete="candidateList.splice(index, 1)"
                  @change="$set(item, arguments[0], arguments[1])"
                />
                <v-divider></v-divider>
              </div>
              <div class="text-center">
                <v-btn
                  text
                  color="primary"
                  @click="
                    candidateList.push({ number: candidateList.length + 1 })
                  "
                >
                  <v-icon>mdi-plus</v-icon> Tambah Kandidat
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div
                v-for="(item, index) of locationList"
                :key="index"
                class="candidate"
              >
                <VoteInputLocation
                  v-bind="item"
                  @delete="locationList.splice(index, 1)"
                  @change="$set(item, arguments[0], arguments[1])"
                />
                <v-divider></v-divider>
              </div>
              <div class="text-center">
                <v-btn
                  text
                  color="primary"
                  @click="
                    locationList.push({
                      name: `TPS ${locationList.length + 1}`
                    })
                  "
                >
                  <v-icon>mdi-plus</v-icon> Tambah Lokasi
                </v-btn>
              </div>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="$emit('batal')">
            <v-icon>mdi-close</v-icon> Batal
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn color="success" outlined type="submit">
            <v-icon>mdi-save</v-icon> Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style>
.v-dialog .v-card .v-tabs-bar {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  right: 0px;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import VoteInputCandidate from "./VoteInputCandidate.vue";
import VoteInputLocation from "./VoteInputLocation.vue";

@Component({
  name: 'VoteAddDialog',
  components: { VoteInputCandidate, VoteInputLocation }
})
export default class VoteAddDialog extends Vue {

  @Prop()
  readonly name: any;

  @Prop()
  readonly passcode: any;

  @Prop()
  readonly participant: any;

  @Prop()
  readonly desc: any;

  @Prop()
  readonly hide: any;

  @Prop()
  readonly candidates: any[];

  @Prop()
  readonly locations: any[];

  @Prop()
  readonly value: boolean | string | null;

  hideChanged = null;

  @Watch('hide')
  defaultHideChanged(cur, old) {
    this.hideChanged = cur;
  }

  @Watch('value')
  valueChanged(cur, old) {
    console.log('Dialog become', cur ? 'Visible' : 'Hidden', cur);
    if( cur ){

      if (cur == "new") {
        this.candidateList = [{ number: 1 }];
        this.locationList = [{ name: 'TPS 1' }];
        if (this.$refs.form) {
          this.$refs.form.$el.reset()
        }
      }
    }else{
      this.locationListChanged = false;
      this.candidateListChanged = false;
      this.$data._changed = {};
    }
    

  }

  @Watch('hideChanged')
  watchHideChanged(cur, old) {
    this.$data._changed['hide'] = cur;
  }

  candidateList: any[] = [{ number: 1 }]
  locationList: any[] = [{ name: 'TPS 1' }]

  @Watch('candidates')
  candidatesChange(current: any[] | null, old) {
    this.candidateList = (current || [{ number: 1 }]);
    this.$nextTick( () => {this.candidateListChanged = false})
  }

  @Watch('locations')
  locationsChange(current: any[] | null, old) {
    this.locationList = (current || [{ name: 'TPS 1' }]);
    this.$nextTick( () => {this.locationListChanged = false})
  }

  @Watch('candidateList', { deep: true })
  candidateListChange(cur, old) {
    this.candidateListChanged = true;
  }

  @Watch('locationList', { deep: true })
  locationListChange(cur, old) {
    this.locationListChanged = true;
  }

  candidateListChanged = false;
  @Watch('candidateListChanged')
  updateCandidateChanged(cur, old) {
    console.log('UpdateCandidateChanged', cur);
    if (cur) {
      this.$data._changed['candidates'] = this.candidateList;
    }else{
      delete this.$data._changed['candidates'];
    }
  }
  locationListChanged = false;
  @Watch('locationListChanged')
  updateCocationChanged(cur, old) {
    console.log('UpdateLocationChanged', cur);
    if (cur) {
      this.$data._changed['locations'] = this.locationList;
    }else{
      delete this.$data._changed['locations'];
    }
  }

  @Watch('name')
  nameChanged() {
    if (this.name && this.name.length) {
      this.title = `Ubah ${this.name}`
    } else {
      this.title = 'Tambah QuickCount'
    }
  }

  title = 'Tambah QuickCount';

  _changed: any = {};
  $data: {
    _changed: any;
  }

  $refs: {
    form: { $el: HTMLFormElement } & Vue
  }

}
</script>
<style>
.candidate {
  position: relative;
}
.candidate .delete-btn {
  position: absolute;
  right: 0px;
}
</style>
