# mefly-nav

A small React library for embedding pages via iframe with:

- A popup navigation menu overlay (`MeflyNav`)
- A receiver that shows the menu when instructed by the host page (`MeflyNavReceiver`)
- A hook that keeps the URL hash in sync between a host page and its embedded iframe (`useHostSync`)

## Installation

```bash
npm install github:akhaisin/mefly-nav
# or
pnpm add github:akhaisin/mefly-nav
```

To pin a specific release:

```bash
pnpm add github:akhaisin/mefly-nav#v0.1.0
```

Import the stylesheet once in your app:

```ts
import 'mefly-nav/style.css';
```

**Peer dependencies:** `react >= 18`, `react-dom >= 18`, `react-router-dom >= 6`

---

## Components and hook

### `MeflyNav`

A fixed overlay button (bottom-left) that opens a vertical popup menu.

```tsx
import { MeflyNav } from 'mefly-nav';

<MeflyNav
  items={[
    { id: 'home', label: 'Home', iconUrl: '/icons/home.svg', url: 'https://app.example.com' },
    { id: 'settings', label: 'Settings', iconUrl: '/icons/settings.svg', url: 'https://settings.example.com' },
  ]}
  activeId="home"
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MeflyNavItem[]` | — | Navigation items to display |
| `activeId` | `string` | — | ID of the currently active item |
| `activationMode` | `'click' \| 'hover'` | `'click'` | How the menu is opened |
| `onSelect` | `(item: MeflyNavItem) => void` | — | Called on item click; suppresses default href navigation when provided |
| `style` | `CSSProperties` | — | Inline styles on the root element |

```ts
interface MeflyNavItem {
  id: string;
  label: string;
  iconUrl: string;
  url: string;
  disabled?: boolean;  // renders as non-interactive span
  devOnly?: boolean;   // shows an orange dot indicator
}
```

---

### `MeflyNavReceiver`

Render this inside an **embedded page**. It listens for a `MEFLY_MENU` postMessage from the host and displays `MeflyNav` with the received items. Renders nothing until a message arrives.

When inside an iframe it automatically intercepts item clicks and posts `MEFLY_NAV_SELECT` back to the host instead of following the item's `url` directly — this lets the host handle cross-origin navigation.

```tsx
import { MeflyNavReceiver } from 'mefly-nav';

// In your embedded page component:
<MeflyNavReceiver trustedOrigins={['https://host.example.com']} />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `trustedOrigins` | `string[]` | `[]` | Origins allowed to send `MEFLY_MENU` messages |
| `allowLocalhost` | `boolean` | `true` | Also trust any `localhost` origin |
| `style` | `CSSProperties` | — | Forwarded to `MeflyNav` |

---

### `useHostSync`

Call this inside an **embedded page** (one that uses React Router). It posts the current `pathname` and `hash` to the host whenever the React Router location changes, and navigates to a hash when the host sends `NAVIGATE_TO_HASH`.

```tsx
import { useHostSync } from 'mefly-nav';

function MyEmbeddedPage() {
  useHostSync(['https://host.example.com']);
  // ...
}
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `trustedOrigins` | `string[]` | `[]` | Origins allowed to send `NAVIGATE_TO_HASH` messages |
| `allowLocalhost` | `boolean` | `true` | Also trust any `localhost` origin |

---

## Host-side integration

The host page controls what the embedded page's menu shows by posting a `MEFLY_MENU` message after the iframe loads:

```ts
iframe.contentWindow.postMessage(
  {
    type: 'MEFLY_MENU',
    activeId: 'home',
    items: [
      { id: 'home',     label: 'Home',     iconUrl: '...', url: 'https://app.example.com' },
      { id: 'settings', label: 'Settings', iconUrl: '...', url: 'https://settings.example.com' },
    ],
  },
  '*', // or restrict to the embedded page's known origin
);
```

Listen for navigation events from the embedded page:

```ts
window.addEventListener('message', (e) => {
  if (e.data?.type === 'MEFLY_NAV_SELECT') {
    // user clicked a nav item inside the iframe
    const { item } = e.data; // item: MeflyNavItem
    // navigate host page or swap the embedded iframe src
  }

  if (e.data?.type === 'HASH_CHANGED') {
    // embedded page's hash or pathname changed
    const { hash, pathname } = e.data;
  }
});
```

---

## Styling

All visual properties can be overridden via CSS custom properties:

```css
.my-container {
  --mefly-nav-trigger-size: 40px;
  --mefly-nav-trigger-bg: #0f172a;
  --mefly-nav-trigger-bg-hover: #1e293b;
  --mefly-nav-trigger-color: #f8fafc;
  --mefly-nav-trigger-border: 1px solid rgba(255,255,255,0.1);
  --mefly-nav-trigger-shadow: 0 4px 12px rgba(0,0,0,0.5);
  --mefly-nav-trigger-hover-transform: scale(1.05);
}
```

Pass the override element's class (or an inline style) via the `style` prop on `MeflyNav` / `MeflyNavReceiver`.
