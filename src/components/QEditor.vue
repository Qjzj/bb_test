<template>
  <quillEditor
    :content="content"
    :options="editorOptions"
    @change="onEditorChange($event)"
  />
</template>

<script>
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import {quillEditor} from 'vue-quill-editor'

  export default {
    name: "QEditor",
    components: {
      quillEditor,
    },
    data() {
      return {
        editorOptions: {

        },
        content: '',
      }
    },
    methods: {
      onEditorChange({quill, html, text}) {
        this.context = html;
        this.$emit('editorChange', {quill, html, text});
      },

    }
  }
</script>

<style scoped>

</style>
