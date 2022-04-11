<script>
  export let onClick = null;
  export let classFn = null;
</script>

<button
  on:click={onClick}
  class:active={classFn}
  class="flex w-full cursor-default select-none bg-slate-300 py-2 px-2 text-left first-of-type:rounded-t-md last-of-type:rounded-b-md hover:bg-blue-300 active:brightness-75 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-indigo-700 dark:active:bg-indigo-800"
>
  <slot />
</button>
