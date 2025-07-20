[![Codacy Badge](https://app.codacy.com/project/badge/Grade/e9e573d8408945168d14d83c81a103e6)](https://www.codacy.com/gh/LabEG/reca/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=LabEG/reca&amp;utm_campaign=Badge_Grade)
[![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/reca)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/LabEG/reca/blob/main/LICENSE)

# Bretrics - Realtime user Browser Monitoring

Monitor the performance of the user's browser and code for real users. Allows you to collect WebVitals metrics, performance and business metrics through the Prometheus monitoring system.

## Features

- **WebVitals** - allows you to collect the main performance metrics of the [WebVitals initiative](https://web.dev/vitals/),
- **Custom Metrics** - allows you to collect the [custom performance metrics](https://web.dev/custom-metrics/),
- **Business Metrics** - allows you to collect any business metrics and sales funnels,
- **Network Metrics** - allows you to evaluate the quality of the connection from clients to your servers,
- **Leaks Detection** - allows you to detect leaks in DOM elements, listeners, js and others.

## Installation

npm:

```bash
npm install @mts-pjsc/bretrics
```

yarn

```bash
yarn add @mts-pjsc/bretrics
```

## Examples

### Example Default Monitoring

The package has a pre-configured monitoring mode that includes the necessary webvitals metrics.

``` typescript
import {bretrics} from "@mts-pjsc/bretrics";

bretrics
    .setup({apiPath: "/bretrics"}) // <-- microservice deploy location
    .useDefaultMonitoring()
    .sendMetrics({my_metric: 5}); // <-- custom metrics
```

If you need to send custom metric, you must use the `sendMetrics` method.

### Example Metrics with labels

Prometheus labels can be set as default for all metrics, or individually for each value.

``` typescript
import {bretrics} from "@mts-pjsc/bretrics";

bretrics
    .setup({apiPath: "/bretrics"})
    .useDefaultMonitoring()
    .setLabels({stage: "beta", path: location.pathname})
    .sendMetrics({
        my_metric: {
            value: 5,
            labels: {path: "/blog"}
        }
    });
```

The default labels will be added to the metrics if you didn't pass them in the `sendMetrics` method.

### Example Bretrics customization

The library exports the web monitoring constructor class, so you can inherit from it and implement logic according to OOP principles.

``` typescript
import {Bretrics} from "@mts-pjsc/bretrics";

export class BretricsService extends Bretrics {

    public override sendMetrics (metric: Record<string, number>): this {
        super.sendMetrics(metric);

        // ... your code here ...

        return this;
    }

}
```

## License

WebMon is [MIT licensed](https://github.com/LabEG/reca/blob/main/LICENSE).
