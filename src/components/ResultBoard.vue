<template functional>
  <div>
    <v-dialog v-for="(item, index) in props.list" :key="item.name" max-width="500">
      <template v-slot:activator="{ on }">
        <v-list-item v-on="on">
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
      </template>
      <ResultCandidate v-bind="item" :locationName="props.locationName" :locations="props.locations" />
    </v-dialog>
  </div>
</template>
