<script>
  import { linear } from 'svelte/easing';
  import { slide } from 'svelte/transition';
  export let name = '';
  import { dropdown } from './stores';
  import tippy from 'sveltejs-tippy';
  export let tooltip = '';
  export let placement = 'bottom';
  const props = {
    content: tooltip,
    touch: ['hold', 500],
    placement: placement,
  };

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
    use:tippy={props}
    on:click|stopPropagation={() => selectDropdown(name)}
    class="z-20 mx-0.5 my-1 flex h-7 w-7 cursor-default select-none items-center justify-center rounded-md bg-slate-200 hover:brightness-90 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-indigo-700 dark:active:bg-indigo-800"
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
