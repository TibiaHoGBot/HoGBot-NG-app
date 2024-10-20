<script lang="ts">
  import { isWaypointNode, keyValToItems } from "$lib/helpers/functions";
  import { EWaypointType, type IWaypointNode } from "$lib/helpers/types";
  import { selectedParentNode, treeActions } from "$lib/stores";
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
    handleFocusOut: (e: FEvent) => number | null;
    validateKeypress: (e: KEvent) => void;
  } = $props();

</script>

<div class="flex flex-col gap-4 mx-4 mt-4 p-4 border border-primary-500/50 rounded-lg">


  <div class="flex flex-col gap-2 w-full">
    <p class="font-semibold text-sm">Waypoint Type</p>
    <SwitchSelect 
      onSelectItem={(itemId: string | number) => {
        const type = EWaypointType[itemId as keyof typeof EWaypointType]
        if (!isWaypointNode(selectedNode) || !$treeActions.onUpdate || !type) return;
        $treeActions.onUpdate(selectedNode, {...selectedNode.value, waypointType: type}, "waypoint", $selectedParentNode)
      }}
      value={selectedNode.value.waypointType}
      items={keyValToItems(EWaypointType)}/>
  </div>

  <div class="flex flex-col gap-2 w-full">
    <div class="flex items-center gap-2">
      <p class="font-semibold text-sm">Position</p>
      <p class="text-xs">(x-y-z)</p>
    </div>
    
    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-1">
        <input
          maxlength={8}
          onfocusin={handleFocusIn}
          onfocusout={(e) => {
            const oldVal = selectedNode.value.position.x;
            const newVal = parseInt(e.currentTarget.value)
            if (newVal == null) return;
            if (oldVal === newVal || !$treeActions?.onUpdate) return;
            $treeActions.onUpdate(selectedNode, {...selectedNode.value, position: {...selectedNode.value.position, x: newVal}}, "waypoint",  $selectedParentNode)
          }}
          ondragstart={(e) => e.preventDefault()}
          onmouseup={(e) => e.preventDefault()}
          draggable="false"
          onkeypress={validateKeypress}
          type="text"
          value={selectedNode.value.position.x}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <input
          maxlength={8}
          onfocusin={handleFocusIn}
          onfocusout={(e) => {
            const oldVal = selectedNode.value.position.y;
            const newVal = parseInt(e.currentTarget.value)
            if (newVal == null) return
            if (oldVal === newVal || !$treeActions?.onUpdate) return;
            $treeActions.onUpdate(selectedNode, {...selectedNode.value, position: {...selectedNode.value.position, y: newVal}}, "waypoint",  $selectedParentNode)
          }}
          ondragstart={(e) => e.preventDefault()}
          onmouseup={(e) => e.preventDefault()}
          draggable="false"
          onkeypress={validateKeypress}
          type="text"
          value={selectedNode.value.position.y}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <input
          maxlength={8}
          onfocusin={handleFocusIn}
          onfocusout={(e) => {
            const oldVal = selectedNode.value.position.z;
            const newVal = parseInt(e.currentTarget.value)
            if (newVal == null) return
            if (oldVal === newVal || !$treeActions?.onUpdate) return;
            $treeActions.onUpdate(selectedNode, {...selectedNode.value, position: {...selectedNode.value.position, z: newVal}}, "waypoint",  $selectedParentNode)
          }}
          ondragstart={(e) => e.preventDefault()}
          onmouseup={(e) => e.preventDefault()}
          draggable="false"
          onkeypress={validateKeypress}
          type="text"
          value={selectedNode.value.position.z}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
    </div>
  </div>
  {#if selectedNode.value.waypointType === "node"}
    <div class="flex flex-col gap-2 w-full">
      <div class="flex items-center gap-2">
        <p class="font-semibold text-sm">Range</p>
        <p class="text-xs">(x-y)</p>
      </div>
      <div class="flex items-center gap-6">
        <input
          maxlength={8}
          type="text"
          value={selectedNode.value.position?.range?.x ?? 0}
          onchange={(e) => {
            const oldVal = selectedNode.value.position?.range?.x;
            //@ts-ignore
            const newVal = handleFocusOut(e);
            if (newVal == null) return;
            if (oldVal === newVal || !$treeActions?.onUpdate) return;
            $treeActions.onUpdate(selectedNode, {...selectedNode.value, position: {...selectedNode.value.position, range: {y: selectedNode.value.position?.range?.y ?? 0, x: newVal}}}, "waypoint",  $selectedParentNode)
          }}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
        <hr class="!my-auto w-40  border-secondary-500/50" />
        <input
        maxlength={8}
        type="text"
        value={selectedNode.value.position?.range?.y ?? 0}
        onchange={(e) => {
          const oldVal = selectedNode.value.position?.range?.y;
          //@ts-ignore
          const newVal = handleFocusOut(e);
          if (newVal == null) return;
          if (oldVal === newVal || !$treeActions?.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {...selectedNode.value, position: {...selectedNode.value.position, range: {x: selectedNode.value.position?.range?.x ?? 0, y: newVal}}}, "waypoint",  $selectedParentNode)
        }}
        class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
       />
      </div>
    
    </div>
  {/if}
</div>
