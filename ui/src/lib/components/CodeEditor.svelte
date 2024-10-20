<script lang="ts">
  import type { IPersistenceRuleNode } from "$lib/helpers/types";
  import { selectedParentNode, treeActions } from "$lib/stores";
  import type { PrismEditor } from "prism-code-editor";
  import "prism-code-editor/prism/languages/lua";
  import { basicEditor } from "prism-code-editor/setups";
  import { registerTheme } from "prism-code-editor/themes";
  import { onMount } from "svelte";
  let {
    editorValue = $bindable(),
    code,
    selectedNode,
  }: {
    code: string;
    editorValue: string;
    selectedNode: IPersistenceRuleNode;
  } = $props();

  let editorElement: HTMLElement | undefined = $state(undefined);
  let editor: PrismEditor | undefined = $state(undefined);

  onMount(() => {
    if (!editorElement) {
      console.error("editor failed to initialize");
      return;
    }
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
      () => {}
    );

    return () => {
      editor?.remove();
    };
  });

  $effect(() => {
    if (editor) {
      editor.setOptions({ value: code });
    }
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onkeydown={(e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      if (!$treeActions.onUpdate || !selectedNode) return;
      $treeActions.onUpdate(
        selectedNode,
        {
          ...selectedNode.value,
          code: editorValue,
        },
        "persistenceRule",
        $selectedParentNode
      );
    }
  }}
  class="relative h-full flex flex-col items-end gap-2"
>
  <div id="editor" class=" w-full" bind:this={editorElement}></div>
</div>
