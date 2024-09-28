<script lang="ts">
  let { children, mode }: { children: any; mode: "save" | "load" } = $props();

  const testObj = { name: "Kurasiook" };

  const onButtonClick = (): void => {

    if (mode === "save") {
      saveFile();
    } else {
      //todo
    }
  };

  const saveFile = (): void => {
    const data = JSON.stringify(testObj, null, 2);

    //@ts-ignore
    window.external.invoke(`saveFile:${data}`)
  };

</script>

<div>
  <button
    type="button"
    class="p-1 w-[60px] hover:bg-secondary-400/50"
    onclick={onButtonClick}
  >
    {@render children()}
  </button>
</div>