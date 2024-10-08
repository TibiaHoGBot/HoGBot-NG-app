<script lang="ts">
  import IconEdit from "$lib/assets/edit.svg?raw";
  import { ENodeTypes } from "$lib/helpers/types";
  import { selectedNode, treeActions } from "$lib/stores";

  import HealthRuleDetails from "$lib/components/detailsPanel/HealthRuleDetails.svelte";
  import PersistenceRuleDetails from "$lib/components/detailsPanel/PersistenceRuleDetails.svelte";
  import TargetingRuleDetails from "$lib/components/detailsPanel/TargetingRuleDetails.svelte";
  import TargetingSettingsRuleDetails from "$lib/components/detailsPanel/TargetingSettingsRuleDetails.svelte";

  import CavebotRuleDetails from "$lib/components/detailsPanel/CavebotRuleDetails.svelte";
  import WaypointDetails from "$lib/components/detailsPanel/WaypointDetails.svelte";

  let { editorValue = $bindable() }: { editorValue: string } = $props();

  let isEditingLabel = $state(false);
  let labelElement: HTMLInputElement | undefined = $state(undefined);

  let cNodeLabelBg = $derived.by(() => {
    if (
      $selectedNode &&
      "value" in $selectedNode &&
      "enabled" in $selectedNode.value
    ) {
      if ($selectedNode.value.enabled === true) {
        return "bg-success-500 text-black";
      } else if ($selectedNode?.value?.enabled === false) {
        return "bg-error-500";
      }
    } else {
      return "bg-secondary-500";
    }
  });

  const handleFocusIn = (
    e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const inputElement = e.currentTarget;
    inputElement.setSelectionRange(0, inputElement.value.length);
  };

  const handleFocusOut = (
    e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }
  ): number | null => {
    const num = parseInt(e.currentTarget.value);

    if (num == null || isNaN(num)) {
      e.preventDefault();
      return null;
    }

    if (num < 0) {
      return 0;
    } else if (num > 100) {
      return 100;
    } else {
      return num;
    }
  };

  const validateKeypress = (
    e: KeyboardEvent & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (!/^\d*$/.test(e.key)) {
      e.preventDefault();
    }
  };

  $effect(() => {
    if (isEditingLabel && labelElement !== undefined) {
      labelElement.focus();
    }
  });
</script>

<div class="h-full flex flex-col gap-1 hide-scrollbar overflow-y-scroll pb-5">
  {#if $selectedNode}
    <div
      class="flex justify-center items-center mx-4 mt-4 rounded-sm {cNodeLabelBg} "
    >
      <div
        role="button"
        tabindex="0"
        aria-label="Double click to rename node"
        class="relative flex w-full h-full cursor-default"
        ondblclick={(e) => (isEditingLabel = true)}
      >
        {#if isEditingLabel}
          <div class="absolute top-0 right-0 p-2">{@html IconEdit}</div>
          <input
            bind:this={labelElement}
            onkeydown={(e) => {
              if (e.key === "Escape") {
                isEditingLabel = false;
              } else if (
                e.key === "Enter" &&
                $treeActions.onRename &&
                labelElement
              ) {
                $treeActions.onRename($selectedNode, labelElement.value);
                isEditingLabel = false;
              }
            }}
            onfocusout={(e) => {
              isEditingLabel = false;
            }}
            class="text-xl text-center font-bold mx-auto p-2 w-full {cNodeLabelBg} selection:bg-primary-500 outline-none border border-secondary-400"
            value={$selectedNode.label}
          />
        {:else}
          <p class="text-xl font-bold mx-auto p-2">
            {$selectedNode.label}
          </p>
        {/if}
      </div>
    </div>
    {#if $selectedNode?.type === ENodeTypes["PersistenceRuleNode"]}
      <PersistenceRuleDetails selectedNode={$selectedNode} bind:editorValue />
    {:else if $selectedNode.type === ENodeTypes["HealthRuleNode"]}
      <HealthRuleDetails
        selectedNode={$selectedNode}
        {validateKeypress}
        {handleFocusIn}
        {handleFocusOut}
      />
    {:else if $selectedNode.type === ENodeTypes["CavebotRuleNode"]}
      <CavebotRuleDetails
        selectedNode={$selectedNode}
        currentPos={{ x: 0, y: 0, z: 0 }}
      />
    {:else if $selectedNode.type === ENodeTypes["WaypointNode"]}
      <WaypointDetails
        selectedNode={$selectedNode}
        {validateKeypress}
        {handleFocusIn}
        {handleFocusOut}
      />
    {:else if $selectedNode?.type === ENodeTypes["TargetingRuleNode"]}
      <TargetingRuleDetails
        {validateKeypress}
        {handleFocusIn}
        {handleFocusOut}
        selectedNode={$selectedNode}
      />
    {:else if $selectedNode?.type === ENodeTypes["TargetingSettingsRuleNode"]}
      <TargetingSettingsRuleDetails
        selectedNode={$selectedNode}
        {validateKeypress}
        {handleFocusIn}
        {handleFocusOut}
      />
    {/if}
  {/if}
</div>
