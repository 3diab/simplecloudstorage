<template>
  <div>
    <v-toolbar rounded="lg" flat>
      <v-toolbar-title class="ml-3">Help</v-toolbar-title>
    </v-toolbar>
    <v-card flat rounded="lg" class="mt-4">
      <v-card-title>Welcome to Open AR Cloud Storage</v-card-title>
      <v-card-text>
        Open AR Cloud Storage is a simple storage solution for hosting and
        serving files for your AR projects
        <v-img
          src="../assets/images/help-screenshot.png"
          contain
          width="1080"
        ></v-img>
        <v-alert text outlined color="deep-orange" icon="mdi-information">
          This is an public file serving platform, the file you upload is
          readable by anyone with the link. Do not store confidential files in
          this platform.
        </v-alert>
        <v-alert type="info">
          Deleting folders - Only empty folders can be deleted.
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Help",
  data: () => ({}),
});
</script>
