<script lang="ts">
  import type { PrismEditor } from "prism-code-editor";
  import "prism-code-editor/prism/languages/lua";
  import { basicEditor } from "prism-code-editor/setups";
  import { registerTheme } from "prism-code-editor/themes";
  import { onMount } from "svelte";
  let {
    editorValue = $bindable(),
    code,
  }: {
    code: string;
    editorValue: string;
  } = $props();

  let editorElement: HTMLElement;
  let editor: PrismEditor;
  onMount(() => {
    registerTheme("editor-theme", () => import("$lib/editor-theme.css?inline"));
    editor = basicEditor(
      editorElement,
      {
        value: code,
        language: "lua",
        theme: "editor-theme",
        wordWrap: true,
        tabSize: 2,
        onUpdate: (val) => {
          editorValue = val;
        },
      },
      () => {
        console.log("rdy");
      }
    );

    return () => {
      editor.remove();
    };
  });

  $effect(() => {
    if (editor) {
      editor.setOptions({ value: code });
    }
  });
</script>

<div class="relative flex flex-col items-end gap-2">
  <div id="editor" class=" w-full" bind:this={editorElement}></div>
</div>
