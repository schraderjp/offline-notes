<script>
  import tippy from 'sveltejs-tippy';
  export let onClick = null;
  export let classFn = null;
  export let tooltip = '';
  export let placement = 'bottom';
  const props = {
    content: `<span>${tooltip}</span>`,
    allowHTML: true,
    touch: ['hold', 500],
    placement: placement,
  };
</script>

<button
  on:click={onClick}
  use:tippy={props}
  class="mx-0.5 my-1 flex h-7 w-7 cursor-default select-none items-center justify-center rounded-md bg-slate-200 hover:brightness-90 active:brightness-75 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-indigo-700 dark:active:bg-indigo-700"
  class:active={classFn}
>
  <slot />
</button>

<style>
  button {
    transition: filter 0.2s;
  }

  /* button.active {
    @apply bg-blue-300;
  } */
</style>
