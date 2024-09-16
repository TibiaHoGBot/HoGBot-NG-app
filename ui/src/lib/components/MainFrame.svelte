<script lang="ts">
  import DetailsPanel from "$lib/components/DetailsPanel.svelte";
  import SidebarItem from "$lib/components/SidebarItem.svelte";
  import Tree from "$lib/components/Tree.svelte";
  import { navItems } from "$lib/data/navItems";
  import {
    generateShortUUID,
    isPersistenceRuleNode,
  } from "$lib/helpers/functions";
  import {
    ENodeTypes,
    type IHealthRuleNode,
    type IPersistenceRuleNode,
    type ITargetingRuleNode,
    type ITreeNode,
  } from "$lib/helpers/types";
  import { nodeContext, selectedNode, treeActions } from "$lib/stores";

  import CodeEditor from "./CodeEditor.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import DropdownModal from "./DropdownModal.svelte";
  let currentTab = $state(0);
  let isDetailsVisible = $state(true);
  let isCollapseButtonVisible = $state(false);
  let editorValue = $state("");

  const targetingRules: (ITreeNode | ITargetingRuleNode)[] = [
    {
      id: "723z",
      label: "Targeting Rules",
      children: [],
      childrenType: ENodeTypes["ITargetingRuleNode"],
      expanded: true,
      type: ENodeTypes["ITreeNode"],
    },
  ];

  const healerRules: [ITreeNode, ...IHealthRuleNode[]] = [
    {
      id: "74",
      label: "Heal Rules",
      childrenType: ENodeTypes["IHealthRuleNode"],
      expanded: true,
      type: ENodeTypes["ITreeNode"],
    },
    {
      type: ENodeTypes["IHealthRuleNode"],
      id: "62",
      parentId: "74",
      label: "Health Potion",
      value: {
        enabled: false,
        method: "266",
        mpMin: 0,
        mpMax: 100,
        hpMin: 60,
        hpMax: 100,
        extraCondition: "0",
      },
    },
    {
      type: ENodeTypes["IHealthRuleNode"],
      id: "63",
      parentId: "74",
      label: "Mana Potion",
      value: {
        enabled: false,
        method: "268",
        mpMin: 50,
        mpMax: 80,
        hpMin: 0,
        hpMax: 100,
        extraCondition: "0",
      },
    },
  ];

  for (let i = 0; i < 1000; ++i) {
    const n: IHealthRuleNode = {
      id: generateShortUUID(),
      parentId: "74",
      label: `TestNode - ${i}`,
      type: ENodeTypes["IHealthRuleNode"],
      value: {
        enabled: false,
        method: "268",
        mpMin: 50,
        mpMax: 80,
        hpMin: 0,
        hpMax: 100,
        extraCondition: "0",
      },
    };
    healerRules.push(n);
  }

  const persistencesRules: [ITreeNode, ...IPersistenceRuleNode[]] = [
    {
      id: "213",
      label: "Persistences",
      childrenType: ENodeTypes["IPersistenceRuleNode"],
      type: ENodeTypes["ITreeNode"],
    },
    {
      type: ENodeTypes["IPersistenceRuleNode"],
      id: "612",
      parentId: "213",
      label: "Auto Haste",
      value: {
        enabled: false,
        code: 'auto(3000)\nif cancast("utani hur") then\n\tcast("utani hur")\nend',
      },
    },
  ];

  let data:
    | (ITreeNode | IHealthRuleNode)[]
    | (ITreeNode | IPersistenceRuleNode)[] = $derived.by(() => {
    switch (currentTab) {
      case 2:
        return JSON.parse(JSON.stringify(persistencesRules));
      case 3:
        return JSON.parse(JSON.stringify(targetingRules));
      default:
        return JSON.parse(JSON.stringify(healerRules));
    }
  });

  let idMapping: Record<string, number> = $derived.by(() => {
    const acc: Record<string, number> = {};

    data.forEach((el, i) => {
      acc[el.id] = i;
    }, {});

    return acc;
  });

  let treeData: (ITreeNode | IHealthRuleNode)[] = $state([]);

  const initTree = (data: (ITreeNode | IHealthRuleNode)[]) => {
    let tree: (ITreeNode | IHealthRuleNode)[] = [];
    data.forEach((el) => {
      if (!el.parentId) {
        tree[0] = el;
        return;
      }

      const parentEl = data[idMapping[el.parentId]];

      parentEl.children = [...(parentEl.children || []), el];
    });
    treeData = tree;
  };

  const unselectNode = () => {
    if ($selectedNode && $selectedNode.selected) {
      $selectedNode.selected = false;
    }

    selectedNode.set(undefined);
  };

  $effect(() => {
    initTree(data);
  });

  // let gradient = "bg-gradient-to-r  to-[80%] from-tertiary-400 to-tertiary-500"
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
    class="grid w-full overflow-hidden {!isDetailsVisible
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
{:else if $nodeContext?.context === "codeEditor" && isPersistenceRuleNode($selectedNode)}
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
