<script lang="ts">
  import { isWaypointNode, keyValToItems } from "$lib/helpers/functions";
  import { EWaypointType, type IWaypointNode } from "$lib/helpers/types";
  import { treeActions } from "$lib/stores";
  import SwitchSelect from "../SwitchSelect.svelte";

  type KEvent = KeyboardEvent & {
    currentTarget: EventTarget & HTMLInputElement;
  };
  type FEvent = FocusEvent & { currentTarget: EventTarget & HTMLInputElement };

  let {
    selectedNode,
    handleFocusIn,
    handleFocusOut,
    validateKeypress,
  }: {
    selectedNode: IWaypointNode;
    handleFocusIn: (e: FEvent) => void;
    handleFocusOut: (e: FEvent) => void;
    validateKeypress: (e: KEvent) => void;
  } = $props();

</script>

<div class="flex flex-col gap-4 mx-4 mt-4">


  <div class="flex flex-col gap-2 w-full">
    <p class="font-semibold">Waypoint Type</p>
    <SwitchSelect 
      onSelectItem={(itemId: string | number) => {
        const type = EWaypointType[itemId as keyof typeof EWaypointType]
        if (!isWaypointNode(selectedNode) || !$treeActions.onUpdate || !type) return;
        $treeActions.onUpdate(selectedNode, {...selectedNode.value, waypointType: type})
      }}
      value={selectedNode.value.waypointType}
      items={keyValToItems(EWaypointType)}/>
  </div>

  <div class="flex flex-col gap-2 w-full">
    <p class=" font-semibold">Position</p>
    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-1">
        <p class="text-xs">x</p>
        <input
          maxlength={8}
          onfocusin={handleFocusIn}
          onfocusout={handleFocusOut}
          onkeypress={validateKeypress}
          type="text"
          value={selectedNode.value.position.x}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-xs">y</p>
        <input
          maxlength={8}
          onfocusin={handleFocusIn}
          onfocusout={handleFocusOut}
          onkeypress={validateKeypress}
          type="text"
          value={selectedNode.value.position.y}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-xs">z</p>
        <input
          maxlength={8}
          onfocusin={handleFocusIn}
          onfocusout={handleFocusOut}
          onkeypress={validateKeypress}
          type="text"
          value={selectedNode.value.position.z}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
    </div>
  </div>
  {#if "range" in selectedNode.value}
    <div class="flex flex-col gap-2 w-full">
      <p class=" font-semibold">Range</p>
      <input
        maxlength={8}
        type="text"
        value={selectedNode.value.position.x}
        class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
      />
    </div>
  {/if}
</div>
