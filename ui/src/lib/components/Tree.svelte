<script lang="ts">
  import { onMount } from "svelte";

  import {
    createCavebotRuleNode,
    createHealthRuleNode,
    createPersistenceRuleNode,
    createTargetingRuleNode,
    createTargetingSettingsRuleNode,
    createWaypointNode,
    exhaustiveGuard,
    findParentNode,
    generateShortUUID,
    getModuleName,
  } from "$lib/helpers/functions";
  import type {
    DropInfo,
    IUpdateStateParams,
    UNodeRoots,
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
    type FOnAdd,
    type FOnDrag,
    type FOnEnable,
    type FOnRemove,
    type FOnRename,
    type FOnSelect,
    type FOnToggle,
    type FOnUpdate,
  } from "$lib/stores";

  import type {
    FHandleDragOver,
    FHandleEnableNode,
    FHandleSelectNode,
  } from "$lib/components/TreeNode.svelte";
  import TreeNode from "$lib/components/TreeNode.svelte";

  let {
    treeData = $bindable(),
  }: {
    treeData: UNodeRoots[];
  } = $props();

  const onToggle: FOnToggle = (node) => {
    node.expanded = !node.expanded;
  };

  const onEnable: FOnEnable = (node, moduleName) => {
    const val = !node.value.enabled;

    node.value.enabled = val;

    const obj: IUpdateStateParams = {
      action: "enable",
      moduleName: moduleName,
      id: node.id,
      value: val,
    };

    //@ts-ignore
    window.external.invoke(`update:${JSON.stringify(obj)}`);
  };

  const onSelect: FOnSelect = (node) => {
    if ($selectedNode && $selectedNode.id === node.id) return;
    nodeContext.set(undefined);
    selectedNode.set(node);
  };

  const onAdd: FOnAdd = (node, childrenNode) => {
    type Single<T extends any[]> = T[number];
    const newId = generateShortUUID();
    const cType = node.childrenType;

    const createChildNode = (
      cType: (typeof node)["childrenType"]
    ): Single<typeof node.children> | undefined => {
      switch (cType) {
        case ENodeTypes["HealthRuleNode"]: {
          if (node.type !== ENodeTypes["HealthRootNode"]) return;
          return createHealthRuleNode(node.id, newId);
        }
        case ENodeTypes["CavebotRuleNode"]: {
          if (node.type !== ENodeTypes["CavebotRootNode"]) return;
          const childId = generateShortUUID();
          return createCavebotRuleNode(node.id, newId, childId);
        }
        case ENodeTypes["PersistenceRuleNode"]: {
          if (node.type !== ENodeTypes["PersistenceRootNode"]) return;
          return createPersistenceRuleNode(node.id, newId);
        }
        case ENodeTypes["TargetingRuleNode"]: {
          if (node.type !== ENodeTypes["TargetingRootNode"]) return;
          const childId = generateShortUUID();
          return createTargetingRuleNode(node.id, newId, childId);
        }
        case ENodeTypes["TargetingSettingsRuleNode"]: {
          if (node.type !== ENodeTypes["TargetingRuleNode"]) return;
          return createTargetingSettingsRuleNode(node.id, newId);
        }
        case ENodeTypes["WaypointNode"]: {
          if (node.type !== ENodeTypes["CavebotRuleNode"]) return;
          return childrenNode ?? createWaypointNode(node.id, newId);
        }
        default:
          exhaustiveGuard(cType);
      }
    };

    const newNode = createChildNode(cType);

    if (newNode) {
      //@ts-ignore
      node.children.push(newNode);
      if ("value" in newNode) {
        const moduleName = getModuleName(newNode.type);
        const obj: IUpdateStateParams = {
          moduleName: moduleName,
          action: "create",
          value: newNode.value,
          id: newNode.id,
        };

        //@ts-ignore
        window.external.invoke(`update:${JSON.stringify(obj)}`);
      }
    }
  };

  const onRemove: FOnRemove = (node, moduleName) => {
    const parentNode = findParentNode(treeData, node.parentId);

    if ("children" in node) {
      node.children = [];
    }

    if (parentNode) {
      parentNode.children = parentNode.children?.filter((ch) => {
        return ch.id !== node.id;
      }) as typeof parentNode.children;
      selectedNode.set(undefined);
    }

    const obj: IUpdateStateParams = {
      action: "remove",
      moduleName: moduleName,
      id: node.id,
    };

    //@ts-ignore
    window.external.invoke(`update:${JSON.stringify(obj)}`);
  };

  const onRename: FOnRename = (node, newLabel) => {
    node.label = newLabel;
  };

  const onDrag: FOnDrag = (parentNode, newChildren) => {
    parentNode.children = newChildren;
  };

  const onUpdate: FOnUpdate = (node, newValue, moduleName) => {
    node.value = newValue;

    const obj: IUpdateStateParams = {
      action: "update",
      moduleName: moduleName,
      id: node.id,
      value: node.value,
    };

    //@ts-ignore
    window.external.invoke(`update:${JSON.stringify(obj)}`);
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
    const moduleName = getModuleName(node.type);
    onEnable(node, moduleName);
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
    {#each treeData as node, idx (node.id)}
      <TreeNode
        {node}
        {handleDragOver}
        {handleEnableNode}
        {handleSelectNode}
        parentNode={undefined}
        depth={0}
        {idx}
      />
    {/each}
  </div>

  <div
    class="sticky top-0 bottom-0 right-0 w-[30px] h-full flex items-center justify-center transition-all duration-300 translate-x-1/2"
  >
    <div class="relative h-full w-[1px] bg-secondary-500/20"></div>
  </div>
</div>
