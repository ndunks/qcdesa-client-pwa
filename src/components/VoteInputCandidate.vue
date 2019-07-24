<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex xs12 sm4>
        <v-text-field
          label="Nomor"
          type="text"
          required
          :rules="[v => !!v || 'Tidak boleh kosong']"
          :value="number"
          @input="$emit('change', 'number', $event)"
          outlined
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field
          label="Nama Kandidat"
          type="text"
          required
          :rules="[v => !!v || 'Tidak boleh kosong']"
          :value="name"
          @input="$emit('change', 'name', $event)"
          outlined
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
      <v-flex xs12 text-center>
        <div class="">
          <v-img v-if="imageUrl" :src="imageUrl" max-height="200" contain></v-img>
        </div>
        <v-btn
          text
          @click="$refs.input.click()"
          :loading="uploading"
          :disabled="uploading"
        >
          <v-icon>mdi-image</v-icon>
          {{ imageLabel }}
        </v-btn>
      </v-flex>
    </v-layout>
    <input
      ref="input"
      type="file"
      @change="fileChanged"
      accept=".jpg,.png,.gif"
      style="display:none"
    />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "VoteInputCandidate"
})
export default class VoteInputCandidate extends Vue {
  @Prop()
  number: number;

  @Prop()
  name: number;

  @Prop()
  image: string;

  @Watch('image')
  imageChanged(cur) {
    this.imageLabel = cur ? "Ubah Foto" : "Pilih Foto";
  }

  imageLabel = "Pilih Foto";
  uploading = false;
  uploadedImage = '';

  get imageUrl() {
    return this.uploadedImage || this.image
  }

  $refs: {
    input: HTMLInputElement
  }
  fileChanged(e: Event) {
    const target = (e.target as HTMLInputElement);
    const file = target.files && target.files.length ? target.files[0] : false;
    if (!file) {
      return;
    }
    this.uploading = true;
    this.$api.adminUpload(file).then(
      res => {
        this.$emit('change', 'image', this.uploadedImage = res.url);
      }
    ).catch(err => alert(err.message))
      .finally(() => this.uploading = false)
  }
}
</script>
