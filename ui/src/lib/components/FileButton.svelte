<script lang="ts">
  import { createDefaultAppState } from "$lib/helpers/functions";
  import type { IScript } from "$lib/helpers/types";

  let { children, mode, loadData, data  }: { children: any; mode: "save" | "load" | "init", loadData?: (data: Record<string, any>) => void, data?:IScript } = $props();

  const onButtonClick = (): void => {
    if (mode === "save") {
      saveFile();
    } else if (mode === "load") {
      loadFile();
    } else {
      if (!loadData) return;
      loadData(createDefaultAppState())
    }
  };

  const saveFile = (): void => {
    if (!data) return;
    const json = JSON.stringify(data, null, 2);

    //@ts-ignore
    window.external.invoke(`saveFile:${json}`)
  };

  const loadFile = (): void => {
    //@ts-ignore
    window.external.invoke(`loadFile:`)
  }

</script>

<div class="h-full">
  <button
    type="button"
    class="p-1 h-full w-[60px] hover:bg-secondary-400/50"
    onclick={onButtonClick}
  >
    {@render children()}
  </button>
</div>