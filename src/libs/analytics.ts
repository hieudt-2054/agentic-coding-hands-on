export type AnalyticsProps = Record<string, unknown>;

export function trackEvent(name: string, props: AnalyticsProps = {}): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', name, props);
  }
  // TODO: forward to real analytics sink (Amplitude / GA4 / internal API) once wired.
}
