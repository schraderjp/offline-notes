<script>
  import './global.css';
  import Editor from './lib/Editor.svelte';
  import Header from './lib/Header.svelte';
  import { dropdown } from './lib/stores.js';
</script>

<div
  on:click={() => ($dropdown = null)}
  class="wrapper fixed top-0 left-0 h-screen w-screen"
>
  <Header />
  <main class="h-full">
    <Editor />
  </main>
</div>

<style>
</style>
