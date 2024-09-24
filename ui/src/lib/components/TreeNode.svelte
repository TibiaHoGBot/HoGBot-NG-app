<script module lang="ts">
  export type FHandleSelectNode = (
    e: MouseEvent & {
        currentTarget: EventTarget & HTMLDivElement;
      },
    node: UNodes,
    parentNode: Extract<UNodes, { children: any }> | undefined
  ) => void

  export type FHandleDragOver = (
    e: MouseEvent & {
        currentTarget: EventTarget & HTMLDivElement;
      },
    node: UNodes,
    parentNode: Extract<UNodes, { children: any }> | undefined
  ) => void

  export type FHandleEnableNode= (e: MouseEvent & {
    currentTarget: EventTarget & HTMLButtonElement;
  }, node: Extract<UNodes, {value: {enabled: boolean}}>) => void;

  export type ITreeNodeProps = {
    node: UNodes;
    depth: number;
    parentNode: Extract<UNodes, UNodeRoots | ITargetingRuleNode> | undefined;
    idx: number;
    handleDragOver: FHandleDragOver
    handleSelectNode: FHandleSelectNode;
    handleEnableNode: FHandleEnableNode;
  };
</script>

<script lang="ts">
  import { hasEnabledField } from '$lib/helpers/functions';
  import type { ITargetingRuleNode, UNodeRoots, UNodes } from '$lib/helpers/types';
  import { draggedNodeInfo, dropInfo, m, nodeContext, selectedNode, treeActions } from '$lib/stores';
  
  let {
    node,
    depth = 0,
    parentNode,
    handleDragOver,
    handleSelectNode,
    handleEnableNode,
    idx
  }: ITreeNodeProps = $props();

  let pl = `${20 * depth + 10}px`;
</script>

<div class={`flex flex-col gap-1 w-full text-sm`} class:opacity-30={$draggedNodeInfo?.id === node.id}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    style="padding-left: {pl};"
    onfocus={(e) => { 
      e.preventDefault();
    }}
    class:bg-secondary-500={node.id === $selectedNode?.id}
    class="{$dropInfo?.dropBorderNodeId === node.id
      ? $dropInfo?.dropBorder
      : ''} flex items-center gap-[20px] w-full p-2 rounded-md transition-transform duration-300"
    oncontextmenu={(e) => {
      e.preventDefault();
      m.set({ x: e.clientX, y: e.clientY });
      nodeContext.set({
        context: "nodeMenu"
      });
    }}
    onmouseover={(e) => handleDragOver(e,node,parentNode)}
    onmousedown={(e) => handleSelectNode(e, node, parentNode)}
    draggable="false"
  >
    {#if "children" in node && node.children.length > 0}
      <button
        class:pointer-events-none={$draggedNodeInfo}
        class="flex items-center justify-center border rounded-sm min-w-[20px] h-[20px] transition-transform duration-150 ease-out "
        class:rotate-90={node.expanded}
        onclick={(_e) => {
          if (!$treeActions.onToggle) return;
          $treeActions.onToggle(node);
        }}
      >
      <div class="w-0 h-0 translate-x-[10%] border-t-4 border-b-4 border-transparent border-l-8 border-l-white"></div>
      </button>
    {:else if "children" in node}
    <div class="flex items-center justify-center min-w-[20px] h-[20px] border rounded-sm">
      -
    </div>
    {:else if hasEnabledField(node)}
      <button
        class:pointer-events-none={$draggedNodeInfo}
        onmousedown={(e) => handleEnableNode(e, node)}
        class="flex items-center justify-center min-w-[20px] h-[20px]"
      >
      <div class="min-w-[10px] min-h-[10px] rounded-full {node.value.enabled ? "bg-success-500" : "bg-error-500"}"></div>
      </button>
    {:else}
      <div class="flex items-center justify-center min-w-[20px] text-xs max-w-[20px] h-[20px]">
        #{idx}
      </div>
    {/if}
    <div class="select-none pointer-events-none">
      {node.label}
    </div>
  </div>

  {#if node?.expanded && node?.children}
    {#each node.children as child, idx (child.id)}
      <svelte:self
        {handleDragOver}
        {handleSelectNode}
        {handleEnableNode}
        parentNode={node}
        node={child}
        depth={depth + 1}
        {idx}
      />
    {/each}
  {/if}
</div>
