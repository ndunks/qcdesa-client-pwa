<template functional>
  <v-list subheader color="transparent">
    <v-subheader> Aplikasi ini didukung oleh: </v-subheader>
    <v-list-item href="https://www.amikompurwokerto.ac.id" target="_blank">
      <v-list-item-avatar>
        <img
          src="https://kadowisudaku.com/wp-content/uploads/2020/04/Universitas-Amikom-Purwokerto.png"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>Universitas Amikom Purwokerto</v-list-item-title>
        <v-list-item-subtitle>Sponsor</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item href="https://www.uhb.ac.id" target="_blank">
      <v-list-item-avatar>
        <img src="https://www.uhb.ac.id/site/assets/images/logo_uhb140.png" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>Universitas Harapan Bangsa</v-list-item-title>
        <v-list-item-subtitle>Sponsor</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      href="https://www.facebook.com/Light-cctv-klampok-347276432868896/"
      target="_blank"
    >
      <v-list-item-avatar>
        <img
          src="https://scontent.fjog3-1.fna.fbcdn.net/v/t1.6435-9/83262982_502937553969449_3690972766787338240_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=gR_B2oJNKj0AX8HV9MV&_nc_ht=scontent.fjog3-1.fna&oh=207402f1c5ee127ca2f77b93f12f0dac&oe=61D33CA7"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>LightCCTV</v-list-item-title>
        <v-list-item-subtitle>Sponsor</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      v-show="!props.hide"
      href="https://www.facebook.com/kiraboshilpk"
      target="_blank"
    >
      <v-list-item-avatar>
        <img
          src="https://scontent.fjog3-1.fna.fbcdn.net/v/t1.6435-9/47573270_2106123336368613_7451100197871943680_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=_Nc5acjrMsgAX9gK3mr&_nc_ht=scontent.fjog3-1.fna&oh=63a07c00cae26c940764b1ddaefa0250&oe=61D456A6"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>LPK Kiraboshi</v-list-item-title>
        <v-list-item-subtitle>Sponsor</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      v-show="!props.hide"
      href="https://github.com/ndunks"
      target="_blank"
    >
      <v-list-item-avatar>
        <img src="https://avatars.githubusercontent.com/u/5500313" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>Mochamad Arifin</v-list-item-title>
        <v-list-item-subtitle>Programmer</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
