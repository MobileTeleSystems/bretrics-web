export interface IMetric {
    value: number;
    labels: Record<string, number | string>;
}
