<template lang="pug">
  b-card
    header: h1 Write a post!
    .post-content
      p Go to <code>`./${ROOT}/blog`</code> folder and create your first post, creating <code>first-post.md</code> file filled with the following content:
      pre.
        ---
        title: First post
        tag:
        - news
        ---
        # This is my first post!
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  
})
</script>