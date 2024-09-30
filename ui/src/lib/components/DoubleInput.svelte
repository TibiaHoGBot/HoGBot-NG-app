<script lang="ts">
  let { children, label, labelTwo }: {children: any, label: string, labelTwo: string} = $props();
</script>


<div class="grid grid-cols-[4fr_1fr_4fr] items-center w-full">
  <p class="font-semibold text-sm">{label}</p>
  <span class="invisible"></span>
  <p class="font-semibold text-sm">{labelTwo}</p>
</div>

<div class="grid grid-cols-[4fr_1fr_4fr] items-center w-full">
  {@render children()}
</div>
