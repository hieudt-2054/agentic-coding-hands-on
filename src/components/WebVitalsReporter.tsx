'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { trackEvent } from '@/libs/analytics';

export default function WebVitalsReporter() {
  useReportWebVitals(metric => {
    trackEvent('web_vitals', {
      name: metric.name,
      value: Math.round(metric.value),
      id: metric.id,
      rating: metric.rating,
    });
  });

  return null;
}
