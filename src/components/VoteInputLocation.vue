<template>
  <v-container grid-list-md pa-0>
    <v-layout>
      <v-flex xs5>
        <v-text-field
          label="Nama Lokasi"
          type="text"
          required
          :rules="[v => !!v || 'Tidak boleh kosong']"
          :value="name"
          @input="$emit('change', 'name', $event)"
        ></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-text-field
          label="DPT"
          type="number"
          required
          :rules="[v => !!v || 'Tidak boleh kosong']"
          :value="participant"
          @input="$emit('change', 'participant', $event)"
        >
        </v-text-field>
      </v-flex>
      <v-flex xs5>
        <v-text-field
          label="Passcode"
          type="text"
          :rules="[v => !!v || 'Tidak boleh kosong']"
          :value="passcode"
          @input="$emit('change', 'passcode', $event)"
        >
          <template #append-outer>
            <v-icon
              color="error"
              @click="$emit('delete', $props)"
              style="cursor: pointer"
              >mdi-close</v-icon
            >
          </template>
        </v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "VoteInputLocation"
})
export default class VoteInputLocation extends Vue {
  @Prop()
  name: string;

  @Prop()
  passcode: string;

  @Prop()
  participant: number;

}
</script>
