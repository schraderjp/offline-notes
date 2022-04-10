<script>
  import { linear } from 'svelte/easing';
  import { slide } from 'svelte/transition';
  export let name = '';
  import { dropdown } from './stores';

  function selectDropdown(name) {
    if ($dropdown === name) {
      $dropdown = null;
    } else {
      $dropdown = name;
    }
  }
</script>

<div class="relative">
  <button
    on:click|stopPropagation={() => selectDropdown(name)}
    class="z-20 mx-0.5 my-1 flex h-7 w-7 cursor-default select-none items-center justify-center rounded-md bg-slate-200 hover:brightness-90"
  >
    <slot name="trigger" />
  </button>
  {#if $dropdown === name}
    <div
      transition:slide={{ easing: linear, duration: 150 }}
      class="absolute top-[calc(100%+.25rem)] left-2 z-30 w-max flex-auto rounded-md bg-slate-300 drop-shadow-lg"
    >
      <slot name="dropdown-content" />
    </div>
  {/if}
</div>
