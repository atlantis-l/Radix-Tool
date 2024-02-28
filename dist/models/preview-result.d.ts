export declare interface PreviewResult {
    fee: string;
    status: string;
    errorMessage?: string;
    feeSummary: {
        execution_cost_units_consumed: number;
        finalization_cost_units_consumed: number;
    };
    costingParameters: {
        execution_cost_unit_limit: number;
        finalization_cost_unit_limit: number;
    };
}
