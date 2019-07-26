<template>
  <v-content>
    <Navbar back color="success" title="Administrator Access" />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm6 md4>
          <v-card class="elevation-12">
            <v-card-text>
              <v-form @submit.prevent="submit">
                <v-text-field
                  v-model="passcode"
                  label="Passcode"
                  autocomplete
                  type="password"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";

@Component({
  name: "AdminLogin",
  components: { Navbar }
})
export default class AdminLogin extends Vue {
  passcode = '';

  submit() {
    this.$api.adminLogin(this.passcode)
      .then(valid => {
        if (valid) {
          this.$router.replace('/admin/dash');
        } else {
          alert('Invalid Passcode')
        }
      }).catch(err => alert(err.message))
  }
}
</script>
