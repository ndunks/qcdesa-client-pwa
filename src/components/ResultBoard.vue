<template functional>
  <v-list>
    <v-list-item v-for="(item, index) in props.list" :key="index"
      @click="listeners.click( item, props.locationName )">
      <v-list-item-avatar :color="color" class="white--text">
        <span style="position: absolute">{{ index + 1 }}</span>
        <img v-if="item.image" :src="item.image" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item.name"></v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-icon
          :v-show="!!item.move"
          :color="item.moveColor"
          v-text="item.move"
        ></v-icon>
      </v-list-item-action>
      <v-list-item-action
        ><v-chip>{{ item.count }}</v-chip></v-list-item-action
      >
    </v-list-item>
  </v-list>
</template>
<style>
.result-board > .v-dialog__container {
  position: absolute;
}
</style>
