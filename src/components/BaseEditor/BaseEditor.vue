<script lang="ts" setup>
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { onBeforeUnmount, watch } from 'vue';
import {
  always,
  applyTo,
  bind,
  call,
  compose,
  converge, equals,
  flip, identity,
  lensPath, not,
  pipe,
  view,
  when,
} from 'ramda';
import { isTruthy } from '@/utils/isTruthy';
import { lensValue } from '@/utils/lensValue';
import { lensModelValue } from '@/utils/lensModelValue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const withProps = applyTo(props);

const emit = defineEmits(['update:modelValue']) as any;
const viewValue = view(lensValue);

const editor = useEditor({
  content: withProps(view(lensModelValue)),
  extensions: [
    StarterKit,
  ],
  onUpdate: () => {
    call(when(pipe(view(lensValue), isTruthy), converge(emit, [
      always('update:modelValue'),
      pipe(view(compose(lensValue, lensPath(['getHTML']))), flip(bind)(viewValue(editor)), call),
    ])), editor);
  },
});
const withEditor = applyTo(editor);
const getEditorHTML = () => withEditor(pipe(
  view(compose(lensValue, lensPath(['getHTML']))),
  flip(bind)(viewValue(editor)),
  call,
));

onBeforeUnmount(() => {
  withEditor(pipe(
    view(compose(lensValue, lensPath(['destroy']))),
    when(isTruthy, pipe(flip(bind)(withEditor(viewValue)), call)),
  ));
});

const onChangeOutside = when(
  () => withEditor(
    pipe(view(lensValue), isTruthy),
  ),
  when(
    converge(compose(not, equals), [
      getEditorHTML,
      identity,
    ]),
    (value: string) => editor.value?.commands.setContent(value, false),
  ),
);

watch(() => withProps(view(lensModelValue)), onChangeOutside);
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
