<script lang="ts">
  import { getitemType, hasEnabledField } from "$lib/helpers/functions";
  import {
    m,
    nodeContext,
    selectedNode,
    selectedParentNode,
    treeActions,
  } from "$lib/stores";

  let items: {
    label: string;
    shortcut: string;
    divider?: boolean;
    eventHandler: (_e: MouseEvent) => void;
  }[] = $derived.by(() => {
    const items = [];

    if ($selectedNode && "parentId" in $selectedNode) {
      const newItem = {
        label: "Remove Node",
        shortcut: "Del",
        eventHandler: (_e: MouseEvent) => {
          if (!$treeActions.onRemove) return;
          const itemType = getitemType($selectedNode.type);
          if (!itemType) {
            console.error("invalid item type");
            return;
          }
          $treeActions.onRemove($selectedNode, itemType, $selectedParentNode);
          nodeContext.set(undefined);
        },
      };
      items.push(newItem);
    }

    if ($selectedNode && "children" in $selectedNode) {
      const newItem = {
        label: "Add Node",
        shortcut: "Ctrl+A",
        eventHandler: (_e: MouseEvent) => {
          if (!$treeActions.onAdd) return;
          $treeActions.onAdd($selectedNode);
          nodeContext.set(undefined);
        },
      };

      items.push(newItem);
    }

    if ($selectedNode && hasEnabledField($selectedNode)) {
      const newItem = {
        label: $selectedNode.value.enabled ? "Disable" : "Enable",
        shortcut: "Ctrl+E",
        eventHandler: (_e: MouseEvent) => {
          if (!$treeActions.onEnable) return;
          const itemType = getitemType($selectedNode.type);
          if (!itemType) {
            console.error("invalid item type");
            return;
          }
          $treeActions.onEnable($selectedNode, itemType);
        },
        divider: true,
      };
      items.push(newItem);
    }
    return items;
  });
</script>

<div
  style="left: {$m.x}px; top: {$m.y}px; "
  class="absolute flex flex-col h-fit w-[200px] bg-primary-500 z-10 border-2 border-secondary-500/50 text-white"
>
  {#each items as { label, shortcut, eventHandler, divider }}
    {#if divider}
      <hr class="border-t border-secondary-500/50" />
    {/if}
    <button
      onclick={eventHandler}
      class="flex justify-between hover:bg-secondary-500 text-left w-full py-2 px-3 text-sm"
    >
      <p>{label}</p>
      {#if shortcut}
        <p class="text-xs">{shortcut}</p>
      {/if}
    </button>
  {/each}
</div>
