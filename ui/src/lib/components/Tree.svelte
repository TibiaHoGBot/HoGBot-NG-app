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
    getitemType,
  } from "$lib/helpers/functions";
  import type {
    DropInfo,
    IUpdateStateParams,
    IWaypointNode,
    UNodeChildren,
    UNodeRoots,
    UNodes,
  } from "$lib/helpers/types";
  import { ENodeTypes } from "$lib/helpers/types";
  import {
    draggedNodeInfo,
    dragTimer,
    dropInfo,
    m,
    nodeContext,
    selectedNode,
    selectedParentNode,
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

  const onEnable: FOnEnable = (node, itemType) => {
    const val = !node.value.enabled;

    const params: IUpdateStateParams = {
      action: "enable",
      itemType: itemType,
      id: node.id,
      value: val,
    };

    webview.updateState(JSON.stringify(params), (status, res) => {
      if (status) {
        node.value.enabled = val;
      } else {
        console.error(status, res);
      }
    });
  };

  const onSelect: FOnSelect = (node, parentNode) => {
    if ($selectedNode && $selectedNode.id === node.id) return;
    nodeContext.set(undefined);
    selectedNode.set(node);

    if (parentNode) {
      selectedParentNode.set(parentNode);
    }
  };

  const onAdd: FOnAdd = (node, childrenNode) => {
    const createChildAndParams = <
      T extends Extract<UNodes, { children: UNodeChildren }>,
    >(
      node: T
    ): {
      newNode: T["children"][number];
      params: IUpdateStateParams | null;
    } => {
      const newId = generateShortUUID();
      const cType = node.childrenType;
      switch (cType) {
        case ENodeTypes["HealthRuleNode"]: {
          if (node.type !== ENodeTypes["HealthRootNode"]) break;
          const newNode = createHealthRuleNode(node.id, newId);
          const params: IUpdateStateParams = {
            action: "create",
            itemType: "healthRule",
            parentId: node.id,
            value: { id: newNode.id, ...newNode.value },
          };
          return { newNode, params };
        }
        case ENodeTypes["CavebotRuleNode"]: {
          if (node.type !== ENodeTypes["CavebotRootNode"]) break;
          const childId = generateShortUUID();
          const newNode = createCavebotRuleNode(node.id, newId, childId);

          const parentId = newNode.id;
          const params: IUpdateStateParams = {
            action: "create",
            itemType: "waypointGroup",
            parentId: node.id,
            value: {
              [parentId]: [
                {
                  id: newNode.children[0].id,
                  parentId: newNode.children[0].parentId,
                  ...newNode.children[0].value,
                },
              ],
            },
          };
          return { newNode, params };
        }
        case ENodeTypes["PersistenceRuleNode"]: {
          if (node.type !== ENodeTypes["PersistenceRootNode"]) break;
          const newNode = createPersistenceRuleNode(node.id, newId);

          const params: IUpdateStateParams = {
            action: "create",
            itemType: "persistenceRule",
            parentId: node.id,
            value: { id: newNode.id, ...newNode.value },
          };
          return { newNode, params };
        }
        case ENodeTypes["TargetingRuleNode"]: {
          if (node.type !== ENodeTypes["TargetingRootNode"]) break;
          const childId = generateShortUUID();
          const newNode = createTargetingRuleNode(node.id, newId, childId);

          const parentId = newNode.id;
          const params: IUpdateStateParams = {
            action: "create",
            itemType: "targetingRule",
            parentId: node.id,
            value: {
              ...newNode.value,
              id: parentId,
              settings: [
                {
                  id: newNode.children[0].id,
                  parentId: newNode.children[0].parentId,
                  ...newNode.children[0].value,
                },
              ],
            },
          };

          return { newNode, params };
        }
        case ENodeTypes["TargetingSettingsRuleNode"]: {
          if (node.type !== ENodeTypes["TargetingRuleNode"]) break;
          const newNode = createTargetingSettingsRuleNode(node.id, newId);

          const params: IUpdateStateParams = {
            action: "create",
            itemType: "targetingSetting",
            parentId: node.id,
            value: {
              ...newNode.value,
              id: newNode.id,
              parentId: node.id,
            },
          };
          return { newNode, params };
        }
        case ENodeTypes["WaypointNode"]: {
          if (node.type !== ENodeTypes["CavebotRuleNode"]) break;
          const newNode =
            (childrenNode as IWaypointNode) ??
            createWaypointNode(node.id, newId);

          const params: IUpdateStateParams = {
            action: "create",
            itemType: "waypoint",
            parentId: node.id,
            value: { id: newNode.id, ...newNode.value },
          };
          return { newNode, params };
        }
        default: {
          exhaustiveGuard(cType);
        }
      }
      throw new Error("Failed to add node");
    };

    try {
      const { newNode, params } = createChildAndParams(node);

      if (!params) return;

      webview.updateState(JSON.stringify(params), (status, res) => {
        if (status) {
          //@ts-ignore
          node.children.push(newNode);
        } else {
          console.error(status, res);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onRemove: FOnRemove = (node, itemType, parentNode) => {
    if (!parentNode) return;

    const idx = parentNode.children?.findIndex((child) => child.id === node.id);

    if (idx === -1) {
      console.error("Could not find the element in this collection");
      return;
    }

    const params: IUpdateStateParams = {
      action: "remove",
      itemType: itemType,
      id: node.id,
      parentId: parentNode.id,
    };

    webview.updateState(JSON.stringify(params), (status, res) => {
      if (status) {
        if ("children" in node) {
          node.children = [];
        }
        parentNode.children.splice(idx, 1);
        selectedNode.set(undefined);
        selectedParentNode.set(undefined);
      } else {
        console.error(status, res);
      }
    });
  };

  const onRename: FOnRename = (node, newLabel) => {
    node.label = newLabel;
  };

  const onDrag: FOnDrag = (parentNode, newChildren) => {
    parentNode.children = newChildren;
  };

  const onUpdate: FOnUpdate = (node, newValue, itemType, parentNode) => {
    const params: IUpdateStateParams = {
      action: "update",
      itemType: itemType,
      id: node.id,
      value: newValue,
      parentId: parentNode?.id,
    };

    webview.updateState(JSON.stringify(params), (status, res) => {
      if (status) {
        node.value = newValue;
      } else {
        console.error(status, res);
      }
    });
  };

  const handleSelectNode: FHandleSelectNode = (e, node, parentNode) => {
    e.preventDefault();

    if (e.button !== 0 && e.button !== 2) return;

    onSelect(node, parentNode);

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
    const itemType = getitemType(node.type);
    if (!itemType) {
      console.error("invalid item type");
      return;
    }
    onEnable(node, itemType);
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
