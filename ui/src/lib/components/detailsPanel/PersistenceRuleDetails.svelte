<script lang="ts">
  import { nodeContext, treeActions } from "$lib/stores";
  import CodeEditor from "$lib/components/CodeEditor.svelte";
  import IconArrowsMaximize from "$lib/assets/arrows-maximize.svg?raw";
  import type { IPersistenceRuleNode } from "$lib/helpers/types";

  let {
    selectedNode,
    editorValue,
  }: { selectedNode: IPersistenceRuleNode; editorValue: string } = $props();
</script>

<div class="relative h-[600px] p-4 group">
  <button
    class="invisible group-hover:visible absolute -translate-x-[4px] translate-y-[4px] right-0 top-0 z-[10]"
    onclick={(e) => {
      e.stopImmediatePropagation();
      nodeContext.set({
        context: "codeEditor",
      });
    }}
  >
    {@html IconArrowsMaximize}
  </button>
  <div
    class="h-3/4 bg-primary-600 overflow-y-scroll group-focus-within:border group-focus-within:border-secondary-500"
  >
    {#if !$nodeContext}
      <CodeEditor bind:editorValue code={selectedNode.value.code} />
    {/if}
  </div>
  <div class="flex items-center justify-center mt-4">
    <button
      onclick={(_e) => {
        if (!$treeActions.onUpdate) return;
        $treeActions.onUpdate(selectedNode, {
          ...selectedNode.value,
          code: editorValue,
        });
      }}
      disabled={editorValue === selectedNode.value.code}
      class="p-2 btn font-semibold hover:bg-secondary-500/50 border border-secondary-600 w-full"
      >SAVE
    </button>
  </div>
</div>
