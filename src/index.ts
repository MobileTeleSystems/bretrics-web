import {Metric, onLCP, onCLS, onFCP, onINP, onTTFB} from "web-vitals";
import type {IMetric} from "./interfaces/IMetric";

export class Bretrics {

    public apiPath: string = "/bretrics";

    public labels: Record<string, number | string> = {};

    public sendWebVitalsMetrics (): this {
        onLCP((metric: Metric) => this.sendWebVitals(metric));
        onCLS((metric: Metric) => this.sendWebVitals(metric));
        onFCP((metric: Metric) => this.sendWebVitals(metric));
        onINP((metric: Metric) => this.sendWebVitals(metric));
        onTTFB((metric: Metric) => this.sendWebVitals(metric));

        return this;
    }

    public setup (config: Partial<this>): this {
        this.apiPath = config.apiPath ?? this.apiPath;

        return this;
    }

    public sendMetrics (metric: Record<string, number>): this {
        this.sendToMicroservice(metric);

        return this;
    }

    public useDefaultMonitoring (): this {
        this.useDefaultLabels();
        this.sendWebVitalsMetrics();

        Promise.resolve().then(() => {
            this.sendMetrics({
                // eslint-disable-next-line camelcase
                elements_count: document.getElementsByTagName("*").length
            });
        });

        return this;
    }

    public useDefaultLabels (): this {
        const defaultLabels = {
            // eslint-disable-next-line camelcase
            device_type: this.getDeviceType(),
            path: decodeURIComponent(location.pathname) // Decode for human readable non latin chars
        };
        this.labels = {
            ...this.labels,
            ...defaultLabels
        };

        return this;
    }

    public setLabels (labels: Record<string, number | string>): this {
        this.labels = {
            ...this.labels,
            ...labels
        };

        return this;
    }

    protected sendWebVitals (webVitalsMetric: Metric): void {
        const webmonMetrics = {};
        Reflect.set(webmonMetrics, webVitalsMetric.name.toLowerCase(), webVitalsMetric.value);

        this.sendToMicroservice(webmonMetrics);
    }


    protected sendToMicroservice (metrics: Record<string, IMetric | number>): void {
        const path = `${this.apiPath}/send-metrics/metrics`;
        const body = JSON.stringify(this.prepareData(metrics));

        if (typeof navigator.sendBeacon === "function") {
            navigator.sendBeacon(path, body);
        } else {
            fetch(path, {
                body,
                method: "POST",
                keepalive: true
            });
        }
    }

    protected prepareData (metrics: Record<string, IMetric | number>): Record<string, IMetric | number> {
        const sendMetrics = {};
        const metricsNames = Reflect.ownKeys(metrics);
        const labelsCount = Reflect.ownKeys(this.labels).length;

        for (const metricsName of metricsNames) {
            const metricValue = Reflect.get(metrics, metricsName) as IMetric | number;

            if (typeof metricValue === "number" && labelsCount === 0) {
                Reflect.set(sendMetrics, metricsName, metricValue);
            } else if (typeof metricValue === "number") {
                Reflect.set(sendMetrics, metricsName, {
                    value: metricValue,
                    labels: this.labels
                });
            } else {
                Reflect.set(sendMetrics, metricsName, {
                    value: metricValue.value,
                    labels: {
                        ...this.labels,
                        ...metricValue.labels
                    }
                });
            }
        }

        return sendMetrics;
    }


    // eslint-disable-next-line class-methods-use-this
    protected getDeviceType (): string {
        const ua = navigator.userAgent;
        // eslint-disable-next-line prefer-named-capture-group
        if ((/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/iu).test(ua)) {
            return "tablet";
        }
        if (
            // eslint-disable-next-line prefer-named-capture-group
            (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/u).test(ua)
        ) {
            return "mobile";
        }
        return "desktop";
    }

}

export const bretrics = new Bretrics();
