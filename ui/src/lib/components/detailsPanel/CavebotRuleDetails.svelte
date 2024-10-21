<script lang="ts">
  import { generateShortUUID } from "$lib/helpers/functions";
  import {
    ENodeTypes,
    EWaypointType,
    type ICavebotRuleNode,
    type IWaypointNode,
  } from "$lib/helpers/types";
  import { treeActions } from "$lib/stores";

  let {
    selectedNode,
    currentPos = {
      x: 0,
      y: 0,
      z: 0,
    },
  }: {
    selectedNode: ICavebotRuleNode;
    currentPos: { x: number; y: number; z: number };
  } = $props();

  let waypointTypes = Object.keys(EWaypointType) as Array<
    keyof typeof EWaypointType
  >;
  let selectedType: (typeof EWaypointType)[keyof typeof EWaypointType] = $state(
    waypointTypes[0]
  );

  let selectedRange = $state({ x: 0, y: 0 });

  const createWaypoint = (
    position: IWaypointNode["value"]["position"],
    waypointType: keyof typeof EWaypointType
  ): IWaypointNode => {
    const id = generateShortUUID();
    position.range = selectedRange;
    return {
      id: id,
      label: `${waypointType} - ${id}`,
      parentId: selectedNode.id,
      type: ENodeTypes["WaypointNode"],
      value: {
        position,
        waypointType: waypointType,
      },
    };
  };

  const handleCreateWaypoint = (
    position: IWaypointNode["value"]["position"]
  ) => {
    if (!$treeActions?.onAdd) return;

    $treeActions.onAdd(selectedNode, createWaypoint(position, selectedType));
  };
</script>

<div
  class="flex flex-col gap-1 mx-4 py-6 px-4 border border-primary-500/50 rounded-lg mt-4"
>
  <div class="flex flex-col gap-6 w-full items-center">
    <div class="flex flex-wrap justify-center gap-2">
      {#each waypointTypes as type}
        <button
          onclick={(_e) => (selectedType = type)}
          class:!border-secondary-500={selectedType === type}
          class="bg-primary-500 text-sm p-2 w-14 border border-transparent"
          >{type}</button
        >
      {/each}
    </div>

    <div
      class="grid grid-cols-[1fr_1fr_1fr] text-sm gap-2 [&>*]:rounded-sm [&>*]:w-12 [&>*]:h-12 place-items-center w-fit"
    >
      <button
        class="bg-primary-500"
        onclick={(_e) =>
          handleCreateWaypoint({
            x: currentPos.x - 1,
            y: currentPos.y - 1,
            z: currentPos.z,
          })}>NW</button
      >
      <button
        class="bg-primary-500"
        onclick={(_e) =>
          handleCreateWaypoint({
            x: currentPos.x,
            y: currentPos.y - 1,
            z: currentPos.z,
          })}>N</button
      >
      <button
        class="bg-primary-500"
        onclick={(_e) =>
          handleCreateWaypoint({
            x: currentPos.x + 1,
            y: currentPos.y - 1,
            z: currentPos.z,
          })}>NE</button
      >

      <button
        class="bg-primary-500"
        onclick={(_e) =>
          handleCreateWaypoint({
            x: currentPos.x - 1,
            y: currentPos.y,
            z: currentPos.z,
          })}>W</button
      >
      <button
        class="bg-primary-500"
        onclick={(_e) => handleCreateWaypoint(currentPos)}>C</button
      >
      <button
        class="bg-primary-500"
        onclick={(_e) =>
          handleCreateWaypoint({
            x: currentPos.x + 1,
            y: currentPos.y,
            z: currentPos.z,
          })}>E</button
      >

      <button
        class="bg-primary-500"
        onclick={(_e) =>
          handleCreateWaypoint({
            x: currentPos.x - 1,
            y: currentPos.y + 1,
            z: currentPos.z,
          })}>SW</button
      >
      <button
        class="bg-primary-500"
        onclick={(_e) =>
          handleCreateWaypoint({
            x: currentPos.x,
            y: currentPos.y + 1,
            z: currentPos.z,
          })}>S</button
      >
      <button
        class="bg-primary-500"
        onclick={(_e) =>
          handleCreateWaypoint({
            x: currentPos.x + 1,
            y: currentPos.y + 1,
            z: currentPos.z,
          })}>SE</button
      >
    </div>
  </div>

  <div class="flex flex-row justify-center items-center gap-4 mt-4">
    <input
      type="number"
      bind:value={selectedRange.x}
      class="text-sm w-20 h-7 p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none focus:border-secondary-500 selection:bg-secondary-500"
    />

    <div class="flex flex-col items-center">
      <p class="text-xs">Range</p>
      <p class="text-xs">x - y</p>
    </div>
    <input
      type="number"
      bind:value={selectedRange.y}
      class="text-sm w-20 h-7 p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none focus:border-secondary-500 selection:bg-secondary-500"
    />
  </div>
</div>
