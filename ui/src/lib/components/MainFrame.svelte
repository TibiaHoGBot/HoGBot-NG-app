<script lang="ts">
  import { navItems } from "$lib/data/navItems";
  import { isPersistenceRuleNode } from "$lib/helpers/functions";
  import type { IScript, UNodeRoots } from "$lib/helpers/types";
  import {
    nodeContext,
    selectedNode,
    selectedParentNode,
    treeActions,
  } from "$lib/stores";

  import CodeEditor from "$lib/components/CodeEditor.svelte";
  import ContextMenu from "$lib/components/ContextMenu.svelte";
  import DetailsPanel from "$lib/components/DetailsPanel.svelte";
  import DropdownModal from "$lib/components/DropdownModal.svelte";
  import SidebarItem from "$lib/components/SidebarItem.svelte";
  import Tree from "$lib/components/Tree.svelte";
  import FileButton from "$lib/components/FileButton.svelte";

  let {
    data = $bindable(),
    loadData,
  }: { data: IScript; loadData: (data: Record<string, any>) => void } =
    $props();

  let currentTab = $state(0);
  let isDetailsVisible = $state(true);
  let isCollapseButtonVisible = $state(false);
  let editorValue = $state("");

  let treeData: UNodeRoots[] = $state([]);

  const unselectNode = () => {
    selectedNode.set(undefined);
    selectedParentNode.set(undefined);
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
  <div class="flex flex-col max-h-[600px] w-full">
    <div
      class="flex items-center w-full max-h-[35px] h-full bg-primary-900 font-bold"
    >
      <FileButton {data} mode="save"><span>Save</span></FileButton>
      <FileButton mode="load"><span>Load</span></FileButton>
      <FileButton {loadData} mode="init"><span>Init</span></FileButton>
    </div>
    <div class="flex h-[565px] w-full">
      <div class="flex flex-col w-[60px] bg-primary-500">
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
      class="py-8 h-full ml-[50px] w-[700px] rounded-sm"
    >
      <div class="relative bg-primary-500 rounded-sm h-full">
        <div class="h-[90%] bg-primary-600 overflow-y-scroll rounded-t-sm">
          <CodeEditor
            bind:editorValue
            code={$selectedNode.value.code}
            selectedNode={$selectedNode}
          />
        </div>
        <div class="p-2 flex items-center justify-between">
          <div>
            <p class="text-xs">Editing:</p>
            <p class="text-sm">{$selectedNode.label}</p>
          </div>

          <button
            onclick={(_e) => {
              if (!$treeActions.onUpdate) return;
              $treeActions.onUpdate(
                $selectedNode,
                {
                  ...$selectedNode.value,
                  code: editorValue,
                },
                "persistenceRule",
                $selectedParentNode
              );
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
