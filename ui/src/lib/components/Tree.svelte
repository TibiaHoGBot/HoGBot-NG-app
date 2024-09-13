<script lang="ts">
  import TreeNode from "$lib/components/TreeNode.svelte";
  import { findParentNode, generateShortUUID, createTargetingRuleNode } from "$lib/helpers/functions";
  import type {
    IHealthRuleNode,
    IPersistenceRuleNode,
    ITargetingRuleNode,
    ITreeNode,
  } from "$lib/helpers/types";
  import { nodeContext, selectedNode, treeActions } from "$lib/stores";
  import { onMount } from "svelte";

  let {
    treeData = $bindable(),
  }: {
    treeData: (IHealthRuleNode | ITreeNode)[];
  } = $props();

  const onToggle = (node: ITreeNode) => {
    if (!node.children) return;

    node.expanded = !node.expanded;
  };

  const onEnable = (node: IHealthRuleNode | IPersistenceRuleNode) => {
    if (!node.value) return;

    node.value.enabled = !node.value.enabled;
  };

  const onSelect = (node: ITreeNode) => {
    if ($selectedNode && $selectedNode.id === node.id) return;
    nodeContext.set(undefined);
    selectedNode.set(node);
  };

  const onAdd = (node: ITreeNode) => {
    let newNode: ITreeNode | IHealthRuleNode | undefined;

    const newId = generateShortUUID();

    switch (node.childrenType) {
      case "IHealthRuleNode":
        newNode = {
          id: newId,
          label: `${newId} - Node`,
          value: {
            enabled: false,
            hpMin: 0,
            hpMax: 0,
            mpMin: 0,
            mpMax: 0,
            method: "266",
          },

          parentId: node.id,
        } as IHealthRuleNode;
        if (node?.children) {
          node.children.push(newNode);
        } else {
          node["children"] = [newNode];
        }
        break;
      case "IPersistenceRuleNode":
        newNode = {
          id: newId,
          label: `${newId} - Node`,
          value: {
            enabled: false,
            code: "auto(1000)",
          },

          parentId: node.id,
        } as IPersistenceRuleNode;
        if (node?.children) {
          node.children.push(newNode);
        } else {
          node["children"] = [newNode];
        }
        break;

      case "ITargetingRuleNode":
        const childId = generateShortUUID()
        newNode = createTargetingRuleNode(node.id, newId, childId)
        if (node?.children) {
          node.children.push(newNode);
        } else {
          node["children"] = [newNode];
        }
        break;
      default:
        break;
    }
  };

  const onRemove = (node: ITreeNode) => {
    if (!node.parentId) return;

    const parentNode = findParentNode(treeData, node.parentId);

    if (node.children?.length) {
      node.children = undefined;
    }

    if (parentNode) {
      parentNode.children = parentNode.children?.filter(
        (ch) => ch.id !== node.id
      );

      selectedNode.set(undefined);
    }
  };

  const onRename = (node: ITreeNode, newLabel: string) => {
    node.label = newLabel;
  };

  const onDrag = (parentNode: ITreeNode, newChildren: ITreeNode[]) => {
    parentNode.children = newChildren;
  };

  const onUpdate = <
    T extends IHealthRuleNode | IPersistenceRuleNode | ITargetingRuleNode,
  >(
    node: T,
    newValue: T["value"]
  ) => {
    node.value = newValue;
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
      <TreeNode {node} parentNode={undefined} depth={0} />
    {/each}
  </div>

  <div
    class="sticky top-0 bottom-0 right-0 w-[30px] h-full flex items-center justify-center transition-all duration-300 translate-x-1/2"
  >
    <div class="relative h-full w-[1px] bg-secondary-500/20"></div>
  </div>
</div>
