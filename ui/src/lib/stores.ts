import type { DropInfo, IHealthRuleNode, INodeContext, IPersistenceRuleNode, ITargetingRuleNode, ITargetingSettingsRuleNode, ITreeNode, UNodeTypes } from "$lib/helpers/types";
import { writable, type Writable } from "svelte/store";


export const treeActions: Writable<{
  onUpdate: (<T extends Extract<UNodeTypes, { value: Record<string, any> }>>(node: T, newValue: T["value"]) => void) | null
  onToggle: ((node: Extract<
    UNodeTypes,
    {
      children: any;
    }
  >) => void) | null
  onEnable: ((node: Extract<
    UNodeTypes,
    {
      value: {
        enabled: boolean;
      };
    }
  >) => void) | null
  onSelect: ((node: UNodeTypes) => void) | null
  onAdd: ((node: Extract<UNodeTypes, ITreeNode | ITargetingRuleNode>) => void) | null,
  onRemove: ((node: Exclude<UNodeTypes, ITreeNode>) => void) | null
  onRename: ((node: UNodeTypes, newLabel: string) => void) | null
  onDrag: ((parentNode: Extract<UNodeTypes, { children: any }>, newChildren: Exclude<UNodeTypes, ITreeNode>[]) => void) | null
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
export const draggedNodeInfo: Writable<{
  id: string, parentNode: Extract<
    UNodeTypes,
    {
      children: any;
    }
  >
} | undefined> = writable(undefined)
export const dragTimer: Writable<NodeJS.Timeout | number | undefined> = writable(undefined);
export const dropInfo: Writable<DropInfo | undefined> = writable(undefined);
export const selectedNode: Writable<(ITreeNode | IHealthRuleNode | IPersistenceRuleNode | ITargetingRuleNode | ITargetingSettingsRuleNode) | undefined> = writable(undefined);
