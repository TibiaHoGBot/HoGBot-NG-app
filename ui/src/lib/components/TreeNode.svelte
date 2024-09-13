<script lang="ts">
  import type { DropInfo, IHealthRuleNode, ITreeNode } from '$lib/helpers/types';
  import { draggedNodeInfo, dragTimer, dropInfo, m, nodeContext, selectedNode, treeActions } from '$lib/stores';

  let {
    node,
    depth = 0,
    parentNode,
  }: {
    node: ITreeNode | IHealthRuleNode;
    depth: number;
    parentNode: ITreeNode | IHealthRuleNode | undefined;
  } = $props();

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
    onmouseover={(e) => {
   
      if (
        $draggedNodeInfo === undefined ||
        $draggedNodeInfo?.parentNode.id !== parentNode?.id ||
        $dropInfo?.dropableNodeId === node.id ||
        !parentNode?.children
      )
        return;

      let newDropInfo = {} as DropInfo;

      m.set({ x: e.clientX, y: e.clientY });
      const c = parentNode.children;
      const startIdx = c.findIndex((n) => n.id === $draggedNodeInfo.id);

      const dropIdx = c.findIndex((n) => n.id === node.id);
      if (startIdx === undefined || dropIdx === undefined) return;
      if (startIdx === dropIdx) return;

      let dropBorderNodeId = node.id;
      if (dropIdx > startIdx) {
        const lastChild = node.children?.at(-1);
        if (lastChild && node.expanded) {
          dropBorderNodeId = lastChild.id;
        }
        newDropInfo.dropBorder = 'border-b-2 border-secondary-500 rounded-none';
      } else {
        newDropInfo.dropBorder = 'border-t-2 border-secondary-500 rounded-none';
      }

      newDropInfo.dropableNodeId = node.id;
      newDropInfo.dropBorderNodeId = dropBorderNodeId;
      newDropInfo.startIdx = startIdx;
      newDropInfo.dropIdx = dropIdx;

      dropInfo.set(newDropInfo);
    }}
    onmousedown={(e) => {
  
      e.preventDefault();

      if (e.button !== 0 && e.button !== 2) return;
      
      $treeActions.onSelect(node);

      if (e.button === 0 && parentNode?.children) {
        clearTimeout($dragTimer);
        dragTimer.set(
          setTimeout(() => {
            draggedNodeInfo.set({ id: node.id, parentNode: parentNode });
          }, 200)
        );
      }
    }}
    draggable="false"
  >
    {#if node.children && node.children.length > 0}
      <button
        class:pointer-events-none={$draggedNodeInfo}
        class="flex items-center justify-center border rounded-sm min-w-[20px] h-[20px] transition-transform duration-150 ease-out "
        class:rotate-90={node.expanded}
        onclick={(e) => {
          $treeActions.onToggle(node);
        }}
      >
      <div class="w-0 h-0 translate-x-[10%] border-t-4 border-b-4 border-transparent border-l-8 border-l-white"></div>
      </button>
    {:else if "value" in node}
      <button
      class:pointer-events-none={$draggedNodeInfo}
        onmousedown={(e) => {
          e.preventDefault()
          e.stopPropagation()
 
          nodeContext.set(undefined);
          $treeActions.onEnable(node as IHealthRuleNode);
        }}
        class="flex items-center justify-center min-w-[20px] h-[20px]"
      >
      <div class="min-w-[10px] min-h-[10px] rounded-full {node.value.enabled ? "bg-success-500" : "bg-error-500"}"></div>
      </button>
    {:else}
      <div class="flex items-center justify-center min-w-[20px] h-[20px]">
        -
      </div>
    {/if}
    <div class="select-none pointer-events-none">
      {node.label}
    </div>
  </div>

  {#if node.expanded && node.children}
    {#each node.children as child (child.id)}
      <svelte:self
        parentNode={node}
        node={child}
        depth={depth + 1}
      />
    {/each}
  {/if}
</div>
