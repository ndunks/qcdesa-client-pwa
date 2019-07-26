<template>
  <div class="text-center">
    <v-dialog
      :value="value"
      @input="$listeners.input"
      class="ma-0"
      max-width="600"
      scrollable
    >
      <template v-slot:activator="{ on }">
        <v-btn icon @click="$emit('click')" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="success white--text">
          {{ title }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submit" ref="form" lazy-validation>
            <v-text-field
              label="Nama QuickCount *"
              type="text"
              required
              :rules="[v => !!v || 'Harus diisi']"
              :value="name"
              @input="$data._changed['name'] = $event"
            ></v-text-field>
            <v-text-field
              label="Total Pemilih *"
              type="text"
              required
              :rules="[v => !!v || 'Harus diisi']"
              :value="participant"
              @input="$data._changed['participant'] = $event"
            ></v-text-field>
            <v-text-field
              label="Passcode for Voters"
              type="text"
              :value="passcode"
              @input="$data._changed['passcode'] = $event"
            ></v-text-field>
            <v-switch label="Hide from Home" v-model="hideChanged"></v-switch>
            <v-textarea
              label="Deskripsi"
              rows="2"
              :value="desc"
              @input="$data._changed['desc'] = $event"
            ></v-textarea>
            <div
              v-for="(item, index) of candidateList"
              :key="index"
              class="candidate"
            >
              <VoteInputCandidate
                v-bind="item"
                @delete="deleteCandidate(index, item)"
                @change="changeCandidate(index, item, ...arguments)"
              />

              <v-divider></v-divider>
            </div>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="error" text @click="$emit('batal')">
            <v-icon>mdi-close</v-icon> Batal
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="candidateList.push({ number: candidateList.length + 1 })"
          >
            <v-icon>mdi-plus</v-icon> Tambah Kandidat
          </v-btn>
          <v-btn color="success" outlined @click="submit">
            <v-icon>mdi-save</v-icon> Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import VoteInputCandidate from "./VoteInputCandidate.vue";

@Component({
  name: 'VoteAddDialog',
  components: { VoteInputCandidate }
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

  @Prop({ type: Boolean })
  readonly value: boolean | null;

  hideChanged = null;

  @Watch('hide')
  defaultHideChanged(cur, old) {
    console.log('H', cur, old);
    this.hideChanged = cur;
  }

  @Watch('hideChanged')
  watchHideChanged(cur, old) {
    console.log('HC', cur, old);
    this.$data._changed['hide'] = cur;
  }


  candidateList: any[] = [{ number: 1 }]

  @Watch('candidates')
  candidatesChange(current: any[] | null, old): any[] {
    return this.candidateList = (current || []);
  }

  @Watch('name')
  reset() {
    this.$data._changed = {};
    if (this.name && this.name.length) {
      this.title = `Ubah ${this.name}`
    } else {
      this.title = 'Tambah QuickCount'
      this.candidateList.splice(0, this.candidateList.length, { number: 1 });
    }
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  title = 'Tambah QuickCount';

  _changed: any = {};
  $data: {
    _changed: any;
  }

  $refs: {
    form: any
  }

  submit() {
    if (this.$refs.form.validate()) {
      this.$emit('save', this.$data._changed)
    }
  }
  /** Mark all candidates as modified even just one field changed */
  deleteCandidate(index, item) {
    if (item && item.name && !confirm(`'Hapus ${item.name} dari kandidat?`)) {
      return;
    }
    this.candidateList.splice(index, 1)
    this.$data._changed.candidates = this.candidateList;
  }
  /** Mark all candidates as modified even just one field changed */
  changeCandidate(index, item, field, value) {
    item[field] = value;
    this.$data._changed.candidates = this.candidateList;
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
