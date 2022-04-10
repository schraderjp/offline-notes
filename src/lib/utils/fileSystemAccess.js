// @ts-nocheck
import { set } from 'idb-keyval';
import { editor, fileHandle } from '../stores';
import { get } from 'svelte/store';
import * as sd from 'showdown';

let converter = new sd.Converter();

export async function openFile() {
  let handle = await setFileHandle();
  let fileText = await readFile(handle);
  get(editor).commands.setContent(fileText);
}

export async function importMdFile() {
  let handle = await setFileHandle();
  let fileText = await readFile(handle);
  let html = converter.makeHtml(fileText);
  get(editor).commands.setContent(html);
}

export async function exportMdFile(fileHandle, content) {
  const writable = await fileHandle.createWritable();
  const md = converter.makeMarkdown(content);
  await writable.write({ type: 'write', data: md });
  await writable.close();
}

export async function setFileHandle() {
  let handle;
  [handle] = await window.showOpenFilePicker();
  fileHandle.set(handle);
  return handle;
}

export async function readFile(fileHandle) {
  const file = await fileHandle.getFile();
  return await file.text();
}

export async function writeToFile(fileHandle, content) {
  const writable = await fileHandle.createWritable();
  await writable.write({ type: 'write', data: content });
  await writable.close();
}

export async function saveNewFile() {
  const options = {
    types: [
      {
        description: 'Plain Text',
        accept: { 'text/plain': ['.txt'] },
      },
      {
        description: 'Markdown',
        accept: { 'text/plain': ['.md', '.markdown'] },
      },
      {
        description: 'HTML',
        accept: { 'text/html': ['.htm', '.html'] },
      },
    ],
  };

  const handle = await window.showSaveFilePicker(options);
  fileHandle.set(handle);
  return handle;
}

export async function getNotesFolder() {
  const handle = await window.showDirectoryPicker();
  if (!handle) {
    // User cancelled, or otherwise failed to open a file.
    return;
  }

  let array = [];

  for await (const [key, value] of handle.entries()) {
    array.push({ key, value });
  }

  return { array: array, handle: handle };
}

export async function* getFilesRecursively(entry) {
  if (entry.kind === 'file') {
    const file = await entry.getFile();
    if (file !== null) {
      file.relativePath = getRelativePath(entry);
      yield file;
    }
  } else if (entry.kind === 'directory') {
    for await (const handle of entry.values()) {
      yield* getFilesRecursively(handle);
    }
  }
}

export async function getFolderFiles(directoryHandle) {
  for await (const fileHandle of await getFilesRecursively(directoryHandle)) {
    console.log(fileHandle);
  }
}
