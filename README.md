# Bretrics

[![npm version](https://img.shields.io/npm/v/@mts-pjsc/bretrics.svg?style=flat)](https://www.npmjs.com/package/@mts-pjsc/bretrics)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

A lightweight TypeScript library for Real User Monitoring (RUM) that collects browser performance metrics and sends them to a Prometheus-compatible backend.

## Overview

Bretrics enables you to monitor the performance of your web applications from the perspective of real users. It collects Core Web Vitals, custom performance metrics, and business metrics, then transmits them to your metrics collection endpoint using the efficient `navigator.sendBeacon` API.

## Features

- **Core Web Vitals**: Collects LCP, CLS, FCP, INP, and TTFB metrics from the [Web Vitals initiative](https://web.dev/vitals/)
- **Custom Metrics**: Track application-specific performance indicators
- **Business Metrics**: Monitor conversion funnels and user behavior
- **Prometheus Labels**: Attach metadata to metrics for detailed analysis
- **Device Detection**: Automatic classification of desktop, mobile, and tablet devices
- **Lightweight**: Minimal bundle size with zero runtime dependencies beyond web-vitals
- **TypeScript**: Full type safety and IntelliSense support
- **Extensible**: OOP-based architecture allows custom implementations

## Installation

```bash
npm install @mts-pjsc/bretrics
```

```bash
yarn add @mts-pjsc/bretrics
```

```bash
pnpm add @mts-pjsc/bretrics
```

## Quick Start

```typescript
import { bretrics } from "@mts-pjsc/bretrics";

bretrics
    .setup({ apiPath: "/bretrics" })
    .useDefaultMonitoring();
```

This configuration enables automatic collection of:
- Core Web Vitals (LCP, CLS, FCP, INP, TTFB)
- DOM element count
- Device type detection
- Current page path

## Usage

### Basic Configuration

```typescript
import { bretrics } from "@mts-pjsc/bretrics";

bretrics
    .setup({ apiPath: "/api/metrics" })
    .useDefaultMonitoring()
    .sendMetrics({ custom_metric: 42 });
```

### Adding Labels

Labels provide additional context for metric aggregation and filtering in Prometheus.

```typescript
import { bretrics } from "@mts-pjsc/bretrics";

bretrics
    .setup({ apiPath: "/bretrics" })
    .useDefaultMonitoring()
    .setLabels({
        environment: "production",
        version: "2.1.0"
    })
    .sendMetrics({
        page_load_time: 1250,
        api_response_time: {
            value: 340,
            labels: { endpoint: "/api/users" }
        }
    });
```

### Extending the Library

For advanced use cases, extend the `Bretrics` class to implement custom behavior.

```typescript
import { Bretrics } from "@mts-pjsc/bretrics";

export class CustomMetricsService extends Bretrics {

    public override sendMetrics(metrics: Record<string, number>): this {
        // Add preprocessing logic
        const enrichedMetrics = this.enrichMetrics(metrics);

        super.sendMetrics(enrichedMetrics);

        return this;
    }

    private enrichMetrics(metrics: Record<string, number>): Record<string, number> {
        return {
            ...metrics,
            timestamp: Date.now()
        };
    }
}

export const metricsService = new CustomMetricsService();
```

## API Reference

### Class: Bretrics

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `apiPath` | `string` | `"/bretrics"` | Endpoint path for metrics submission |
| `labels` | `Record<string, number \| string>` | `{}` | Default labels applied to all metrics |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `setup(config)` | `this` | Configure the instance with custom settings |
| `useDefaultMonitoring()` | `this` | Enable automatic Web Vitals and DOM metrics collection |
| `useDefaultLabels()` | `this` | Set default labels (device_type, path) |
| `sendWebVitalsMetrics()` | `this` | Subscribe to Web Vitals events |
| `sendMetrics(metrics)` | `this` | Send custom metrics to the backend |
| `setLabels(labels)` | `this` | Add or update metric labels |

### Interface: IMetric

```typescript
interface IMetric {
    value: number;
    labels: Record<string, number | string>;
}
```

## Collected Metrics

### Core Web Vitals

| Metric | Description |
|--------|-------------|
| `lcp` | Largest Contentful Paint (ms) |
| `cls` | Cumulative Layout Shift (score) |
| `fcp` | First Contentful Paint (ms) |
| `inp` | Interaction to Next Paint (ms) |
| `ttfb` | Time to First Byte (ms) |

### Default Metrics

| Metric | Description |
|--------|-------------|
| `elements_count` | Total DOM elements on page load |

### Default Labels

| Label | Description |
|-------|-------------|
| `device_type` | Device category: desktop, mobile, or tablet |
| `path` | Current page pathname |

## Backend Integration

Bretrics sends metrics via HTTP POST to `{apiPath}/send-metrics/metrics`. The request body contains a JSON object with metric names as keys and values or `IMetric` objects.

A ready-to-use backend microservice for collecting and exposing metrics to Prometheus is available at [MobileTeleSystems/bretrics](https://github.com/MobileTeleSystems/bretrics).

Example payload:

```json
{
    "lcp": {
        "value": 2500,
        "labels": {
            "device_type": "mobile",
            "path": "/products"
        }
    },
    "custom_metric": 42
}
```

## Browser Support

Bretrics supports all modern browsers. The library uses `navigator.sendBeacon` when available, with a `fetch` fallback for older browsers.

## Contributing

Contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Related Projects

- [web-vitals](https://github.com/GoogleChrome/web-vitals) - Library for measuring Web Vitals metrics
