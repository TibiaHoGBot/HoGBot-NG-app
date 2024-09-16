import type { DropInfo, IHealthRuleNode, INodeContext, IPersistenceRuleNode, ITargetingRuleNode, ITargetingSettingsRuleNode, ITreeNode, UNodeTypes } from "$lib/helpers/types";
import { writable, type Writable } from "svelte/store";


export const treeActions: Writable<{
  onUpdate: (<T extends IHealthRuleNode | IPersistenceRuleNode | ITargetingRuleNode | ITargetingSettingsRuleNode>(node: T, newValue: T["value"]) => void) | null
  onToggle: ((node: ITreeNode) => void) | null
  onEnable: ((node: IHealthRuleNode | IPersistenceRuleNode) => void) | null
  onSelect: ((node: ITreeNode) => void) | null
  onAdd: ((node: ITreeNode) => void) | null,
  onRemove: ((node: ITreeNode) => void) | null
  onRename: ((node: UNodeTypes, newLabel: string) => void) | null
  onDrag: ((parentNode: ITreeNode, newChildren: ITreeNode[]) => void) | null
}> = writable({
  onUpdate: null,
  onToggle: null,
  onEnable: null,
  onSelect: null,
  onAdd: null,
  onRemove: null,
  onRename: null,
  onDrag: null
});
export const m = writable({ x: 0, y: 0 });
export const nodeContext: Writable<INodeContext | undefined> = writable(undefined)
export const draggedNodeInfo: Writable<{ id: string, parentNode: ITreeNode | IHealthRuleNode } | undefined> = writable(undefined)
export const dragTimer: Writable<NodeJS.Timeout | number | undefined> = writable(undefined);
export const dropInfo: Writable<DropInfo | undefined> = writable(undefined);
export const selectedNode: Writable<(ITreeNode | IHealthRuleNode | IPersistenceRuleNode | ITargetingRuleNode | ITargetingSettingsRuleNode) | undefined> = writable(undefined);
