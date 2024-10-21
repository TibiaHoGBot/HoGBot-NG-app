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
    const str = JSON.stringify(data, null, 2);

    webview.saveFile(str, (status, res) => {
      if (status) {
        
      } else {
        console.error(status, res)
      }
    })

  };

  const loadFile = (): void => {
    webview.loadFile("", (status, res) => {
      if (status) {
        if (!loadData) {
          console.error("Could not load data");
          return;
        }
        loadData(JSON.parse(res))
      } else {
        console.error(status, res)
      }
    })
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