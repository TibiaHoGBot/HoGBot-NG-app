<script lang="ts">
  import MainFrame from '$lib/components/MainFrame.svelte';
  import { moveItemInArray } from '$lib/helpers/functions';
  import "./app.postcss";

  import { draggedNodeInfo, dragTimer, dropInfo, nodeContext, treeActions } from '$lib/stores';

</script>

<svelte:window
  onmouseup={(e) => {
    if (!$draggedNodeInfo) {
      clearTimeout($dragTimer);
      return;
    }

    if ($treeActions.onDrag && $dropInfo) {
      const newChildren = moveItemInArray(
        $draggedNodeInfo.parentNode.children,
        $dropInfo.startIdx,
        $dropInfo.dropIdx
      );
      $treeActions.onDrag($draggedNodeInfo.parentNode, newChildren);
      e.preventDefault();
    }

    draggedNodeInfo.set(undefined);
    dropInfo.set(undefined);
  }}
  onkeydown={(e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
  
    nodeContext.set(undefined);
    clearTimeout($dragTimer);
    draggedNodeInfo.set(undefined);
    dropInfo.set(undefined);
  }}
/>



<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class:!cursor-grabbing={$draggedNodeInfo}
  onclick={(_e) => {
    nodeContext.set(undefined);
  }}
  class="flex  items-center justify-center bg-gradient-to-br from-surface-500 to-surface-600 w-full h-screen text-white"
>
  <MainFrame />
</div>

