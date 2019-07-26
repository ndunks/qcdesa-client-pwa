<template>
  <v-app-bar :color="color" dark>
    <v-btn icon @click="iconClick">
      <v-icon v-text="icon"></v-icon>
    </v-btn>
    <v-toolbar-title v-text="title"></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu left bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item to="/about">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Tentang</v-list-item-title>
        </v-list-item>
        <v-list-item to="/voter">
          <v-list-item-icon>
            <v-icon>mdi-account-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Voters</v-list-item-title>
        </v-list-item>
        <v-list-item to="/admin">
          <v-list-item-icon>
            <v-icon>mdi-account-tie</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Admin</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Go Home</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
  name: "Navbar"
})
export default class Navbar extends Vue {
  @Prop({ default: 'deep-purple accent-4' })
  color: string

  @Prop({ default: 'QuickCount' })
  title: string;

  @Prop({ default: false, type: Boolean })
  back: boolean

  get icon() {
    return this.back ? 'mdi-arrow-left' : 'mdi-poll';
  }
  iconClick() {

    if (this.back) {
      this.$router.back();
    } else {
      // Go home
      this.$router.push('/')
    }
  }
}
</script>

