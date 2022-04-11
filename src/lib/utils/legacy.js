import { get } from 'svelte/store';
import { editor } from '../stores';

export function download(filename = 'note.html', text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/html,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function readFileInput(e) {
  let fr = new FileReader();
  fr.onload = function () {
    get(editor).commands.setContent(fr.result);
  };
  fr.readAsText(e.target.files[0]);
}
