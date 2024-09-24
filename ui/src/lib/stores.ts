import type { DropInfo, ICavebotRuleNode, INodeContext, ITargetingRuleNode, UNodeChildren, UNodeRoots, UNodes } from "$lib/helpers/types";
import { writable, type Writable } from "svelte/store";

export type FOnUpdate = (<T extends Extract<UNodes, { value: Record<string, any> }>>(node: T, newValue: T["value"]) => void) | null
export type FOnToggle = ((node: Extract<
  UNodes,
  {
    children: any;
  }
>) => void) | null
export type FOnEnable = ((node: Extract<
  UNodes,
  {
    value: {
      enabled: boolean;
    };
  }
>) => void) | null
export type FOnSelect = ((node: UNodes) => void) | null
export type FOnAdd = ((node: Extract<UNodes, { children: any[] }>, childNode?: typeof node.children[0]) => void) | null
export type FOnRemove = ((node: Exclude<UNodes, UNodeRoots>) => void) | null
export type FOnRename = ((node: UNodes, newLabel: string) => void) | null
export type FOnDrag = ((parentNode: Extract<UNodes, { children: any }>, newChildren: UNodeChildren) => void) | null

export const treeActions: Writable<{
  onUpdate: FOnUpdate;
  onToggle: FOnToggle;
  onEnable: FOnEnable;
  onSelect: FOnSelect;
  onAdd: FOnAdd;
  onRemove: FOnRemove;
  onRename: FOnRename
  onDrag: FOnDrag;
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
    UNodes,
    {
      children: any;
    }
  >
} | undefined> = writable(undefined)
export const dragTimer: Writable<NodeJS.Timeout | number | undefined> = writable(undefined);
export const dropInfo: Writable<DropInfo | undefined> = writable(undefined);
export const selectedNode: Writable<UNodes | undefined> = writable(undefined);
