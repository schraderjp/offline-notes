<script>
  import Dropdown from './Dropdown.svelte';
  import { dropdown, editor, currentNoteId, fileHandle } from './stores.js';
  import Fa from 'svelte-fa';
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
  import { getHTMLFromFragment } from '@tiptap/core';
  let textAlign = '';
  function checkTextAlign() {
    if ($editor.isActive({ textAlign: 'left' })) textAlign = 'left';
    if ($editor.isActive({ textAlign: 'center' })) textAlign = 'center';
    if ($editor.isActive({ textAlign: 'right' })) textAlign = 'right';
    if ($editor.isActive({ textAlign: 'justify' })) textAlign = 'justify';
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
  <header class="relative z-20 flex flex-wrap bg-slate-200 shadow-md">
    <ToolbarButton onClick={saveNewFile}>
      <Fa icon={faSave} />
    </ToolbarButton>
    <ToolbarButton onClick={openFile}>
      <Fa icon={faFolderOpen} />
    </ToolbarButton>
    <!-- <ToolbarButton onClick={() => importMdFile()}
      ><Fa icon={faFileImport} /></ToolbarButton
    >
    <ToolbarButton onClick={() => exportMdFile($fileHandle, $editor.getHTML())}
      ><Fa icon={faFileExport} /></ToolbarButton
    > -->
    <Dropdown name="heading">
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
      onClick={() => $editor.chain().focus().toggleBold().run()}
      classFn={$editor.isActive('bold')}
    >
      <Fa icon={faBold} /></ToolbarButton
    >

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleItalic().run()}
      classFn={$editor.isActive('italic')}
    >
      <Fa icon={faItalic} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleUnderline().run()}
      classFn={$editor.isActive('underline')}
    >
      <Fa icon={faUnderline} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleStrike().run()}
      classFn={$editor.isActive('strike')}
    >
      <Fa icon={faStrikethrough} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleHighlight().run()}
      classFn={$editor.isActive('highlight')}
    >
      <Fa icon={faHighlighter} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleCode().run()}
      classFn={$editor.isActive('code')}
    >
      <Fa icon={faCode} />
    </ToolbarButton>

    <ToolbarButton
      classFn={$editor.isActive('codeBlock')}
      onClick={() => $editor.chain().focus().toggleCodeBlock().run()}
    >
      <span class="font-bold">CB</span>
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleOrderedList().run()}
      classFn={$editor.isActive('orderedList')}
    >
      <Fa icon={faListOl} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleBulletList().run()}
      classFn={$editor.isActive('bulletList')}
    >
      <Fa icon={faListUl} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleTaskList().run()}
      classFn={$editor.isActive('taskList')}
    >
      <Fa icon={faTasks} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().setHorizontalRule().run()}
    >
      <Fa icon={faArrowsAltH} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => $editor.chain().focus().toggleBlockquote().run()}
      classFn={$editor.isActive('blockquote')}
    >
      <Fa icon={faQuoteLeft} />
    </ToolbarButton>

    <Dropdown>
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
