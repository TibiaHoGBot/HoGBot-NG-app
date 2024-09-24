<script lang="ts">
  import { navItems } from "$lib/data/navItems";
  import { isPersistenceRuleNode } from "$lib/helpers/functions";
  import type { IScript, UNodeRoots } from "$lib/helpers/types";
  import { nodeContext, selectedNode, treeActions } from "$lib/stores";

  import CodeEditor from "$lib/components/CodeEditor.svelte";
  import ContextMenu from "$lib/components/ContextMenu.svelte";
  import DropdownModal from "$lib/components/DropdownModal.svelte";
  import DetailsPanel from "$lib/components/DetailsPanel.svelte";
  import SidebarItem from "$lib/components/SidebarItem.svelte";
  import Tree from "$lib/components/Tree.svelte";

  let { data = $bindable() }: { data: IScript } = $props();

  let currentTab = $state(0);
  let isDetailsVisible = $state(true);
  let isCollapseButtonVisible = $state(false);
  let editorValue = $state("");

  let treeData: UNodeRoots[] = $state([]);

  const unselectNode = () => {
    selectedNode.set(undefined);
  };

  $effect(() => {
    switch (currentTab) {
      case 1:
        treeData = data["hogSettings"]["cavebot"];
        break;
      case 2:
        treeData = data["hogSettings"]["persistences"];
        break;
      case 3:
        treeData = data["hogSettings"]["targeting"];
        break;
      default:
        treeData = data["hogSettings"]["healer"];
    }
  });
</script>

<div
  class:blur-sm={$nodeContext?.context === "dropdownMenu" ||
    $nodeContext?.context === "codeEditor"}
  class:opacity-50={$nodeContext?.context === "dropdownMenu" ||
    $nodeContext?.context === "codeEditor"}
  class="flex main-gradient w-[800px] h-[600px] border-secondary-500"
>
  <div class="flex flex-col h-full w-[60px] bg-primary-500">
    {#each navItems as { label, icon }, i}
      <SidebarItem bind:currentTab value={i} {icon} {unselectNode} />
    {/each}
  </div>

  <div
    class="grid w-full overflow-hidden select-none {!isDetailsVisible
      ? 'grid-cols-1'
      : 'grid-cols-2'}"
  >
    <Tree bind:treeData />

    <DetailsPanel bind:editorValue />
  </div>
</div>

{#if $nodeContext?.context === "dropdownMenu" && $nodeContext.meta}
  <div class="absolute z-10 w-[800px] h-[600px]">
    <DropdownModal
      selectedItemId={$nodeContext.meta.selectedId}
      items={$nodeContext.meta.options}
      onSelectItem={$nodeContext.meta.onSelectItem}
    />
  </div>
{:else if $selectedNode && $nodeContext?.context === "codeEditor" && isPersistenceRuleNode($selectedNode)}
  <div class="absolute z-10 w-[800px] h-[600px]">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      onclick={(e) => {
        e.stopPropagation();
      }}
      class="py-8 h-full ml-[80px] w-[670px] rounded-md"
    >
      <div class="relative bg-primary-500 rounded-md h-full">
        <div class="h-[90%] bg-primary-600 overflow-y-scroll rounded-t-lg">
          <CodeEditor bind:editorValue code={$selectedNode.value.code} />
        </div>
        <div class="p-2 flex items-center justify-between">
          <div>
            <p class="text-xs">Editing:</p>
            <p class="text-sm">{$selectedNode.label}</p>
          </div>

          <button
            onclick={(_e) => {
              if (!$treeActions.onUpdate) return;
              $treeActions.onUpdate($selectedNode, {
                ...$selectedNode.value,
                code: editorValue,
              });
            }}
            disabled={editorValue === $selectedNode.value.code}
            class="p-2 btn font-semibold hover:bg-secondary-500/50 border border-secondary-600 w-40"
            >SAVE</button
          >
        </div>
      </div>
    </div>
  </div>
{:else if $nodeContext?.context === "nodeMenu"}
  <ContextMenu />
{/if}
