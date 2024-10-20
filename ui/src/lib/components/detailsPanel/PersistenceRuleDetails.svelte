<script lang="ts">
  import { nodeContext, selectedParentNode, treeActions } from "$lib/stores";
  import CodeEditor from "$lib/components/CodeEditor.svelte";
  import IconArrowsMaximize from "$lib/assets/arrows-maximize.svg?raw";
  import type { IPersistenceRuleNode } from "$lib/helpers/types";

  let {
    selectedNode,
    editorValue = $bindable(),
  }: { selectedNode: IPersistenceRuleNode; editorValue: string } = $props();
</script>

<div class="relative h-full flex flex-col gap-2 p-4 group overflow-hidden">
  <button
    class="invisible group-hover:visible absolute -translate-x-1/2 translate-y-1/2 right-0 top-0 z-[10]"
    onclick={(e) => {
      e.stopImmediatePropagation();
      nodeContext.set({
        context: "codeEditor",
      });
    }}
  >
    {@html IconArrowsMaximize}
  </button>
  <p class="font-semibold text-sm">Script</p>
  <div
    class="h-full bg-primary-600 overflow-y-scroll group-focus-within:border group-focus-within:border-secondary-500 text-sm"
  >
    {#if !$nodeContext}
      <CodeEditor
        bind:editorValue
        code={selectedNode.value.code}
        {selectedNode}
      />
    {/if}
  </div>
  <div class="flex items-center justify-center mt-2">
    <button
      onclick={(_e) => {
        if (!$treeActions.onUpdate) return;
        $treeActions.onUpdate(
          selectedNode,
          {
            ...selectedNode.value,
            code: editorValue,
          },
          "persistenceRule",
          $selectedParentNode
        );
      }}
      disabled={editorValue === selectedNode.value.code}
      class="p-2 btn font-semibold hover:bg-secondary-500/50 border border-secondary-600 w-full"
      >SAVE
    </button>
  </div>
</div>
