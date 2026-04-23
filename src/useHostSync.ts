import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isTrusted, DEFAULT_TRUSTED_ORIGINS } from './utils';

export function useHostSync(
  trustedOrigins: string[] = DEFAULT_TRUSTED_ORIGINS,
  allowLocalhost: boolean = true,
): void {
  const location = useLocation();

  // React Router navigates via history.pushState which does not trigger
  // the native hashchange event — fire on location object instead.
  // pathname is included so the host can detect cross-page navigation
  // without needing cross-origin contentWindow.location access.
  useEffect(() => {
    if (window.parent === window) return;
    window.parent.postMessage(
      { type: 'HASH_CHANGED', hash: location.hash, pathname: location.pathname },
      '*',
    );
  }, [location]);

  useEffect(() => {
    if (window.parent === window) return;

    function handleMessage(event: MessageEvent): void {
      if (!isTrusted(event.origin, trustedOrigins, allowLocalhost)) return;
      if (event.data?.type !== 'NAVIGATE_TO_HASH') return;
      if (event.data.hash === undefined) return;
      const hash: string = event.data.hash;
      const next = hash.startsWith('#') ? hash : `#${hash}`;
      if (window.location.hash !== next) window.location.hash = next;
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [trustedOrigins, allowLocalhost]);
}
