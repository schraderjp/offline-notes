<script>
  export let onClick = null;
  export let classFn = null;
</script>

<button
  on:click={onClick}
  class="mx-0.5 my-1 flex h-7 w-7 cursor-default select-none items-center justify-center rounded-md bg-slate-200 hover:brightness-90 active:brightness-75"
  class:active={classFn}
>
  <slot />
</button>

<style>
  button {
    transition: filter 0.2s;
  }

  button.active {
    @apply bg-blue-300;
  }
</style>
