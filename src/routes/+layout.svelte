<script lang="ts">
let { children } = $props();
</script>

<svelte:head>
	<title>Red Flag Speedrun</title>
	<meta
		name="description"
		content="Klinische triage trainer - herken alarmsignalen onder tijdsdruk"
	>
</svelte:head>

{@render children()}

<style>
:global(*) {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

:global(body) {
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	background: #0f172a;
	color: #e2e8f0;
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
