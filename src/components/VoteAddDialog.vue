<template>
  <div class="text-center">
    <v-dialog v-model="visible" width="600" scrollable>
      <template v-slot:activator="{ on }">
        <v-btn icon @click="$emit('click')" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ title }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submit" ref="form" lazy-validation>
            <v-text-field
              label="Nama Voting *"
              type="text"
              required
              :rules="[v => !!v || 'Harus diisi']"
              :value="name"
              @input="$data._changed['name'] = $event"
            ></v-text-field>
            <v-text-field
              label="Passcode for Voters"
              type="text"
              :value="passcode"
              @input="$data._changed['passcode'] = $event"
            ></v-text-field>
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
                @change="(field, value) => (item[field] = value)"
              />

              <v-divider></v-divider>
            </div>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="error" text @click="visible = false">
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
  readonly desc: any;

  @Prop()
  readonly candidates: any[];

  candidateList: any[] = [{ number: 1 }]

  @Watch('candidates')
  candidatesChange(current: any[] | null, old): any[] {
    console.log('Candidate Changed');
    return this.candidateList = (current || []);
  }

  @Watch('name')
  reset() {
    this.$data._changed = {};
    if( this.$refs.form ){
      this.$refs.form.resetValidation();
    }
    if (this.name && this.name.length) {
      this.title = `Ubah ${this.name}`
    } else {
      this.title = 'Tambah QuickCount'
      this.candidates.splice(0, this.candidates.length, {number: 1});
    }
    this.visible = true;
  }

  title = 'Tambah QuickCount';
  visible: boolean | null = null;
  _changed: any = {};
  $data: {
    _changed: any;
  }
  
  $refs: {
    form: any
  }

  submit() {
    console.log('changed', this.$data._changed, this.candidateList)
    if (!this.$refs.form.validate()) {
      return;
    }
    this.$data._changed.candidates = this.candidateList;
    this.$emit('save', this.$data._changed)
    this.visible = false;
  }
  deleteCandidate(index, item) {
    console.log('Del', item);

    if (item && item.name && !confirm(`'Hapus ${item.name} dari kandidat?`)) {
      return;
    }
    this.candidateList.splice(index, 1)
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
