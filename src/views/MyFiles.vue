<template>
  <file-browser :initPath="initPath"></file-browser>
</template>

<script lang="ts">
import Vue from "vue";
import FileBrowser from "../components/FileBrowser.vue";
export default Vue.extend({
  name: "MyFiles",
  components: {
    FileBrowser,
  },
  data: () => ({
    initPath: "",
  }),
});
</script>
