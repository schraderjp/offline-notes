import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';

export const CustomOl = OrderedList.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-[': () => this.editor.commands.liftListItem('listItem'),
      'Mod-]': () => this.editor.commands.sinkListItem('listItem'),
    };
  },
});

export const CustomTl = TaskList.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-[': () => this.editor.commands.liftListItem('taskItem'),
      'Mod-]': () => this.editor.commands.sinkListItem('taskItem'),
    };
  },
});
