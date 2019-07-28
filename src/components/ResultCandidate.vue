<template functional>
  <v-card>
    <v-img
      v-if="props.image"
      class="white--text"
      height="200px"
      :src="props.image"
    >
      <v-avatar :color="props.pos < 2 ? 'success' : color">{{
        props.pos
      }}</v-avatar>
    </v-img>
    <v-card-title>
      {{ props.name }}
    </v-card-title>
    <v-list>
      <v-list-item>
        <v-list-item-title>Perolehan Suara</v-list-item-title>
        <v-list-item-subtitle class="text-right">
          <v-chip>{{ props.count }}</v-chip>
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Peringkat</v-list-item-title>
        <v-list-item-subtitle class="text-right">
          <v-chip>{{ props.pos }}</v-chip>
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Nomor Urut</v-list-item-title>
        <v-list-item-subtitle class="text-right">
          <v-chip>{{ props.number }}</v-chip>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>