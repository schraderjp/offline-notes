<script>
  import './global.css';
  import Editor from './lib/Editor.svelte';
  import Header from './lib/Header.svelte';
  import { dropdown, headerHeight } from './lib/stores.js';
  import '@fontsource/noto-sans';

  let appHeight = null;
  $: mainHeight = appHeight - $headerHeight;
</script>

<svelte:window bind:innerHeight={appHeight} />
<div
  on:click={() => ($dropdown = null)}
  class="wrapper fixed top-0 left-0 h-screen w-screen"
>
  <Header />
  <main style:height={mainHeight + 'px'}>
    <Editor />
  </main>
</div>

<style>
</style>
