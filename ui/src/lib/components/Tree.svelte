<script lang="ts">
  import {
    createHealthRuleNode,
    createPersistenceRuleNode,
    createTargetingRuleNode,
    createTargetingSettingsRuleNode,
    exhaustiveGuard,
    findParentNode,
    generateShortUUID,
    isAbleToAddChildren,
  } from "$lib/helpers/functions";
  import type {
    DropInfo,
    IHealthRuleNode,
    IPersistenceRuleNode,
    ITargetingRuleNode,
    ITargetingSettingsRuleNode,
    ITreeNode,
    UNodeTypes,
  } from "$lib/helpers/types";
  import { ENodeTypes } from "$lib/helpers/types";
  import {
    draggedNodeInfo,
    dragTimer,
    dropInfo,
    m,
    nodeContext,
    selectedNode,
    treeActions,
  } from "$lib/stores";
  import { onMount } from "svelte";
  import type {
    FHandleDragOver,
    FHandleEnableNode,
    FHandleSelectNode,
  } from "./TreeNode.svelte";
  import TreeNode from "./TreeNode.svelte";

  let {
    treeData = $bindable(),
  }: {
    treeData: ITreeNode[];
  } = $props();

  const onToggle = (
    node: Extract<
      UNodeTypes,
      {
        children: any;
      }
    >
  ) => {
    if (!node.children) return;

    node.expanded = !node.expanded;
  };

  const onEnable = (
    node: Extract<
      UNodeTypes,
      {
        value: {
          enabled: boolean;
        };
      }
    >
  ) => {
    if (!node.value) return;

    node.value.enabled = !node.value.enabled;
  };

  const onSelect = (node: UNodeTypes) => {
    if ($selectedNode && $selectedNode.id === node.id) return;
    nodeContext.set(undefined);
    selectedNode.set(node);
  };

  const onAdd = (node: Extract<UNodeTypes, ITreeNode | ITargetingRuleNode>) => {
    const newId = generateShortUUID();

    const createChildrenNode = (
      node: Extract<UNodeTypes, ITreeNode | ITargetingRuleNode>
    ) => {
      switch (node.childrenType) {
        case ENodeTypes["IHealthRuleNode"]:
          return createHealthRuleNode(node.id, newId);
        case ENodeTypes["ICavebotRuleNode"]:
          return;
        case ENodeTypes["IPersistenceRuleNode"]:
          return createPersistenceRuleNode(node.id, newId);
        case ENodeTypes["ITargetingRuleNode"]:
          const childId = generateShortUUID();
          return createTargetingRuleNode(node.id, newId, childId);
        case ENodeTypes["ITargetingSettingsRuleNode"]:
          return createTargetingSettingsRuleNode(node.id, newId);
        default:
          return exhaustiveGuard(node.childrenType);
      }
    };

    let newNode = createChildrenNode(node);

    if (!newNode || node.childrenType !== newNode.type) return;

    if (node.children?.length) {
      node.children.push(newNode);
    } else {
      node["children"] = [newNode];
    }
  };

  const onRemove = (node: Exclude<UNodeTypes, ITreeNode>) => {
    if (!node.parentId) return;

    const parentNode = findParentNode(treeData, node.parentId);

    if ("children" in node) {
      node.children = [];
    }

    if (parentNode) {
      parentNode.children = parentNode.children?.filter(
        (ch) => ch.id !== node.id
      );

      selectedNode.set(undefined);
    }
  };

  const onRename = (node: UNodeTypes, newLabel: string) => {
    node.label = newLabel;
  };

  const onDrag = (
    parentNode: Extract<UNodeTypes, { children: any }>,
    newChildren: Exclude<UNodeTypes, ITreeNode>[]
  ) => {
    parentNode.children = newChildren;
  };

  const onUpdate = <
    T extends Extract<UNodeTypes, { value: Record<string, any> }>,
  >(
    node: T,
    newValue: T["value"]
  ) => {
    node.value = newValue;
  };

  const handleSelectNode: FHandleSelectNode = (e, node, parentNode) => {
    e.preventDefault();

    if (e.button !== 0 && e.button !== 2) return;

    onSelect(node);

    if (e.button === 0 && parentNode?.children) {
      clearTimeout($dragTimer);
      dragTimer.set(
        setTimeout(() => {
          draggedNodeInfo.set({ id: node.id, parentNode: parentNode });
        }, 200)
      );
    }
  };

  const handleDragOver: FHandleDragOver = (e, node, parentNode) => {
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
      if ("children" in node) {
        const lastChild = node.children.at(-1);
        if (lastChild && node.expanded) {
          dropBorderNodeId = lastChild.id;
        }
      }
      newDropInfo.dropBorder = "border-b-2 border-secondary-500 rounded-none";
    } else {
      newDropInfo.dropBorder = "border-t-2 border-secondary-500 rounded-none";
    }

    newDropInfo.dropableNodeId = node.id;
    newDropInfo.dropBorderNodeId = dropBorderNodeId;
    newDropInfo.startIdx = startIdx;
    newDropInfo.dropIdx = dropIdx;

    dropInfo.set(newDropInfo);
  };

  const handleEnableNode: FHandleEnableNode = (e, node) => {
    e.preventDefault();
    e.stopPropagation();

    nodeContext.set(undefined);

    onEnable(node);
  };

  onMount(() => {
    treeActions.set({
      onUpdate,
      onToggle,
      onEnable,
      onSelect,
      onAdd,
      onRemove,
      onRename,
      onDrag,
    });

    return () => {
      treeActions.set({
        onUpdate: null,
        onToggle: null,
        onEnable: null,
        onSelect: null,
        onAdd: null,
        onRemove: null,
        onRename: null,
        onDrag: null,
      });
    };
  });
</script>

<div class="flex relative h-full overflow-y-scroll hide-scrollbar">
  <div class="w-full mt-4 mx-4">
    {#each treeData as node (node.id)}
      <TreeNode
        {node}
        {handleDragOver}
        {handleEnableNode}
        {handleSelectNode}
        parentNode={undefined}
        depth={0}
      />
    {/each}
  </div>

  <div
    class="sticky top-0 bottom-0 right-0 w-[30px] h-full flex items-center justify-center transition-all duration-300 translate-x-1/2"
  >
    <div class="relative h-full w-[1px] bg-secondary-500/20"></div>
  </div>
</div>
