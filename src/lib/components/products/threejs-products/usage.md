# usage of ThreeDee

this component links a 3d model from the page url.

```svelte
<a href="/products/vintage">Vintage</a>
<a href="/products/retro">Retro</a>
<a href="/products/needle">Needle</a>
```

depending on the url it will link the 3d model to that page. You must have the model saved in the static folder to be used easily.

you can also link the url/models programmatically:

```svelte
import { goto } from '$app/navigation';
import type { ModelKey } from '$lib/components/products/models';

function openModel(key: ModelKey) {
    goto(`/products/${key}`);
}
```
