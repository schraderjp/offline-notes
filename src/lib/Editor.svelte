<script>
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
  import Underline from '@tiptap/extension-underline';
  import Highlight from '@tiptap/extension-highlight';
  import TextAlign from '@tiptap/extension-text-align';
  import TaskItem from '@tiptap/extension-task-item';
  import lowlight from 'lowlight';
  import { editor, fileHandle } from './stores.js';
  import { CustomOl, CustomTl } from './extensions/CustomOl.js';
  import { writeToFile } from './utils/fileSystemAccess.js';
  import { set, get } from 'idb-keyval';
  let element;

  async function saveLocalNote(content) {
    await set('offline-notes', content);
  }
  async function getLocalNote() {
    let note = await get('offline-notes');
    $editor.commands.setContent(note);
  }

  onMount(async () =>
    editor.set(
      new Editor({
        autofocus: 'end',
        element: element,
        extensions: [
          StarterKit.configure({
            codeBlock: false,
            orderedList: false,
          }),
          CustomOl,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          CustomTl,
          TaskItem.configure({
            nested: true,
          }),
          Underline,
          Highlight,
          CodeBlockLowlight.configure({ lowlight }),
        ],
        content: (await get('offline-notes')) ?? '',
        onUpdate({ editor }) {
          if ($fileHandle) {
            writeToFile($fileHandle, editor.getHTML());
          }
          saveLocalNote(editor.getHTML());
        },
        onTransaction: () => {
          // force re-render so `editor.isActive` works as expected
          $editor = $editor;
        },
      })
    )
  );

  onDestroy(() => {
    if ($editor) {
      $editor.destroy();
    }
  });
</script>

<div
  class="editor relative z-10 h-full overflow-y-auto lg:mx-auto lg:max-w-2xl"
  bind:this={element}
/>

<style>
  button {
    transition: filter 0.2s;
  }

  button.active {
    @apply brightness-90;
  }
</style>
