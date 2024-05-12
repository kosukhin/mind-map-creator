<script lang="ts" setup>
import {
  EditorContent, BubbleMenu, useEditor, Editor,
} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { onBeforeUnmount, Ref, watch } from 'vue';
import { branchCombinator } from '@/modules/combinators/branchCombinator';
import { AnyFn } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const { when } = branchCombinator;
// eslint-disable-next-line no-use-before-define
const whenEditor = (cb: AnyFn) => when(editor.value, cb);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
  ],
  onUpdate: () => {
    whenEditor(
      () => {
        emit('update:modelValue', editor.value.getHTML());
      },
    );
  },
}) as Ref<Editor>;

onBeforeUnmount(() => {
  whenEditor(
    () => {
      editor.value.destroy();
    },
  );
});

watch(() => props.modelValue, (value) => {
  whenEditor(() => {
    when(
      editor.value.getHTML() !== value,
      () => {
        editor.value.commands.setContent(value, false);
      },
    );
  });
});
</script>

<template>
  <div class="rounded-main p-2 border border-solid border-body-dark">
    <editor-content :editor="editor" />
    <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
    >
      <div class="flex gap-2 p-2 bg-white border border-solid border-body-dark rounded-main">
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'font-bold': editor.isActive('bold') }">
          bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'font-bold': editor.isActive('italic') }">
          italic
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'font-bold': editor.isActive('strike') }">
          strike
        </button>
      </div>
    </bubble-menu>
  </div>
</template>
