export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}
