import type { DropInfo, INodeContext, UItemTypes, UNodeChildren, UNodeRoots, UNodes } from "$lib/helpers/types";
import { writable, type Writable } from "svelte/store";

export type FOnUpdate = (<T extends Extract<UNodes, { value: Record<string, any> }>>(node: T, newValue: T["value"], itemType: UItemTypes, parentNode?: Extract<UNodes, { children: any[] }>) => void) | null
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
>, itemType: UItemTypes) => void) | null
export type FOnSelect = ((node: UNodes, parentNode?: Extract<UNodes, { children: any[] }>) => void) | null
export type FOnAdd = (<T extends Extract<UNodes, { children: UNodeChildren }>> (
  node: T,
  childNode?: T['children'][number]
) => void) | null
export type FOnRemove = ((node: Exclude<UNodes, UNodeRoots>, itemType: UItemTypes, parentNode?: Extract<UNodes, { children: any[] }>) => void) | null
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
export const selectedParentNode: Writable<Extract<UNodes, { children: any[] }> | undefined> = writable(undefined);