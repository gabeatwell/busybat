<script lang="ts">
	import { SanityStudio } from '@sanity/sveltekit';
	import config from '$lib/sanity/sanity.config';
</script>

<SanityStudio {config} />
