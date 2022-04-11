<script>
  // @ts-nocheck

  import Dropdown from './Dropdown.svelte';
  import {
    dropdown,
    editor,
    currentNoteId,
    fileHandle,
    headerHeight,
  } from './stores.js';
  import Fa from 'svelte-fa';
  import Portal from 'svelte-portal';
  import {
    faSave,
    faAlignCenter,
    faHighlighter,
    faAlignLeft,
    faAlignJustify,
    faAlignRight,
    faHeading,
    faFolderOpen,
    fa1,
    fa2,
    fa3,
    faBold,
    faItalic,
    faUnderline,
    faStrikethrough,
    faCode,
    faArrowsAltH,
    faQuoteLeft,
    faListUl,
    faListOl,
    faTasks,
    faFileImport,
    faFileExport,
    faBars,
    faDatabase,
    faHdd,
  } from '@fortawesome/free-solid-svg-icons';
  import DropdownItem from './DropdownItem.svelte';
  import ToolbarButton from './ToolbarButton.svelte';
  import {
    exportMdFile,
    importMdFile,
    openFile,
    saveNewFile,
  } from './utils/fileSystemAccess';
  import { onMount } from 'svelte';
  import { set } from 'idb-keyval';
  import { download, readFileInput } from './utils/legacy';
  import tippy from 'sveltejs-tippy';
  const props = {
    content: $fileHandle ? 'Saving to Local File' : 'Storing in Browser',
    placement: 'bottom',
  };
  let textAlign = '';
  function checkTextAlign() {
    if ($editor.isActive({ textAlign: 'left' })) textAlign = 'left';
    if ($editor.isActive({ textAlign: 'center' })) textAlign = 'center';
    if ($editor.isActive({ textAlign: 'right' })) textAlign = 'right';
    if ($editor.isActive({ textAlign: 'justify' })) textAlign = 'justify';
  }

  let filename = 'note.html';
  let filenameDialog = null;
  let modalShown = false;

  let isLegacy = false;

  onMount(() => {
    // @ts-ignore
    if (typeof window.showSaveFilePicker !== 'function') isLegacy = true;
  });

  function clearEditor() {
    $fileHandle = null;
    $editor.commands.setContent('');
    set('offline-notes', '');
  }

  $: $editor && checkTextAlign();

  let alignIcon = {
    left: faAlignLeft,
    center: faAlignCenter,
    right: faAlignRight,
    justify: faAlignJustify,
  };
</script>

{#if $editor}
  <header
    bind:offsetHeight={$headerHeight}
    class="relative z-20 flex flex-wrap bg-slate-200 shadow-md dark:bg-slate-800 md:mx-auto md:max-w-2xl"
  >
    {#if modalShown}
      <div
        class="fixed top-0 left-0 z-40 h-screen w-screen bg-black bg-opacity-40"
      />
    {/if}
    <dialog
      bind:this={filenameDialog}
      on:submit={e => {
        download(filename, $editor.getHTML());
        modalShown = false;
      }}
      class="z-50 rounded-md shadow-xl"
    >
      <form method="dialog">
        <label for="filename">Filename:</label>
        <input bind:value={filename} id="filename" type="text" />
        <button
          on:click|preventDefault={() => {
            filenameDialog.close();
            modalShown = false;
          }}>Cancel</button
        >
      </form>
    </dialog>
    <input
      on:change={readFileInput}
      class="hidden"
      type="file"
      id="import-file"
    />
    <Dropdown name="menu" tooltip="Menu">
      <Fa slot="trigger" icon={faBars} />
      <svelte:fragment slot="dropdown-content">
        <DropdownItem
          onClick={() => {
            if (isLegacy) {
              modalShown = true;
              filenameDialog.showModal();
            } else {
              saveNewFile();
            }
          }}
        >
          {isLegacy ? 'Download as HTML' : 'Save to File'}
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            isLegacy ? undefined : openFile();
          }}
        >
          {#if !isLegacy}
            Open HTML File
          {:else}
            <label for="import-file">Import HTML File</label>
          {/if}
        </DropdownItem>
        <DropdownItem onClick={clearEditor}>Clear Editor</DropdownItem>
      </svelte:fragment>
    </Dropdown>
    <div
      use:tippy={props}
      class="mx-0.5 my-1 flex h-7 w-7 cursor-default select-none items-center justify-center rounded-md bg-slate-200 hover:brightness-90 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-indigo-700"
    >
      {#if $fileHandle}
        <Fa icon={faHdd} />
      {:else}
        <Fa icon={faDatabase} />
      {/if}
    </div>
    <Dropdown name="heading" tooltip="Headings">
      <Fa slot="trigger" icon={faHeading} />
      <svelte:fragment slot="dropdown-content">
        <DropdownItem
          onClick={() =>
            $editor.chain().focus().toggleHeading({ level: 1 }).run()}
          classFn={$editor.isActive('heading', { level: 1 })}
        >
          <span class="m-1 inline-flex rounded-t-md">
            <Fa translateX="-0.2" icon={faHeading} />
            <Fa icon={fa1} />
          </span>
        </DropdownItem>

        <DropdownItem
          onClick={() =>
            $editor.chain().focus().toggleHeading({ level: 2 }).run()}
          classFn={$editor.isActive('heading', { level: 2 })}
          ><span class="m-1 inline-flex">
            <Fa translateX="-0.2" icon={faHeading} />
            <Fa icon={fa2} />
          </span></DropdownItem
        >

        <DropdownItem
          onClick={() =>
            $editor.chain().focus().toggleHeading({ level: 3 }).run()}
          classFn={$editor.isActive('heading', { level: 3 })}
          ><span class="m-1 inline-flex rounded-b-md">
            <Fa translateX="-0.2" icon={faHeading} />
            <Fa icon={fa3} />
          </span></DropdownItem
        >
      </svelte:fragment>
    </Dropdown>
    <ToolbarButton
      tooltip="Bold"
      onClick={() => $editor.chain().focus().toggleBold().run()}
      classFn={$editor.isActive('bold')}
    >
      <Fa icon={faBold} /></ToolbarButton
    >

    <ToolbarButton
      tooltip="Italic"
      onClick={() => $editor.chain().focus().toggleItalic().run()}
      classFn={$editor.isActive('italic')}
    >
      <Fa icon={faItalic} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Underline"
      onClick={() => $editor.chain().focus().toggleUnderline().run()}
      classFn={$editor.isActive('underline')}
    >
      <Fa icon={faUnderline} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Strikethrough"
      onClick={() => $editor.chain().focus().toggleStrike().run()}
      classFn={$editor.isActive('strike')}
    >
      <Fa icon={faStrikethrough} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Highlight"
      onClick={() => $editor.chain().focus().toggleHighlight().run()}
      classFn={$editor.isActive('highlight')}
    >
      <Fa icon={faHighlighter} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Inline Code"
      onClick={() => $editor.chain().focus().toggleCode().run()}
      classFn={$editor.isActive('code')}
    >
      <Fa icon={faCode} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Code Block"
      classFn={$editor.isActive('codeBlock')}
      onClick={() => $editor.chain().focus().toggleCodeBlock().run()}
    >
      <span class="font-bold">CB</span>
    </ToolbarButton>

    <ToolbarButton
      tooltip="Ordered List"
      onClick={() => $editor.chain().focus().toggleOrderedList().run()}
      classFn={$editor.isActive('orderedList')}
    >
      <Fa icon={faListOl} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Unordered List"
      onClick={() => $editor.chain().focus().toggleBulletList().run()}
      classFn={$editor.isActive('bulletList')}
    >
      <Fa icon={faListUl} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Tasklist"
      onClick={() => $editor.chain().focus().toggleTaskList().run()}
      classFn={$editor.isActive('taskList')}
    >
      <Fa icon={faTasks} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Horizontal Rule"
      onClick={() => $editor.chain().focus().setHorizontalRule().run()}
    >
      <Fa icon={faArrowsAltH} />
    </ToolbarButton>

    <ToolbarButton
      tooltip="Block  Quote"
      onClick={() => $editor.chain().focus().toggleBlockquote().run()}
      classFn={$editor.isActive('blockquote')}
    >
      <Fa icon={faQuoteLeft} />
    </ToolbarButton>

    <Dropdown name="align" tooltip="Text Alignment">
      <Fa slot="trigger" icon={alignIcon[textAlign]} />
      <svelte:fragment slot="dropdown-content">
        <DropdownItem
          onClick={() => {
            $editor.chain().focus().setTextAlign('left').run();
            textAlign = 'left';
          }}
          classFn={$editor.isActive({ textAlign: 'left' })}
        >
          <Fa icon={faAlignLeft} />
        </DropdownItem>

        <DropdownItem
          onClick={() => {
            $editor.chain().focus().setTextAlign('center').run();
            textAlign = 'center';
          }}
          classFn={$editor.isActive({ textAlign: 'center' })}
        >
          <Fa icon={faAlignCenter} />
        </DropdownItem>

        <DropdownItem
          onClick={() => {
            $editor.chain().focus().setTextAlign('right').run();
            textAlign = 'right';
          }}
          classFn={$editor.isActive({ textAlign: 'right' })}
        >
          <Fa icon={faAlignRight} />
        </DropdownItem>

        <DropdownItem
          onClick={() => {
            $editor.chain().focus().setTextAlign('justify').run();
            textAlign = 'center';
          }}
          classFn={$editor.isActive({ textAlign: 'justify' })}
        >
          <Fa icon={faAlignJustify} />
        </DropdownItem>
      </svelte:fragment>
    </Dropdown>
  </header>
{/if}
