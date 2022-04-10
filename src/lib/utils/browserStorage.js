import { set, get } from 'idb-keyval';
import { nanoid } from 'nanoid';
import { currentNoteId } from '../stores';
import { get as getStore } from 'svelte/store';
import Dexie from 'dexie';

export const db = new Dexie('offlineNotes');
db.version(1).stores({
  notes: '++id, title, content',
});

export async function saveToBrowser(content) {
  if (getStore(currentNoteId)) return console.log('ID is already set.');
  try {
    const id = await db.notes.add({
      title: 'test',
      content: content,
    });
    currentNoteId.set(id);
    console.log(`Note with id ${id} added.`);
  } catch (error) {
    console.error(error);
  }
}

export function loadFromBrowser() {}
