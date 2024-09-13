<script lang="ts">
  let { children, label, labelTwo }: {children: any, label: string, labelTwo: string} = $props();
</script>


<div class="grid grid-cols-[3fr_1fr_3fr] items-center w-full">
  <p class="font-semibold">{label}</p>
  <span class="invisible"></span>
  <p class="font-semibold">{labelTwo}</p>
</div>

<div class="grid grid-cols-[3fr_1fr_3fr] items-center w-full">
  {@render children()}
</div>
