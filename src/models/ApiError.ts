export interface GraphqlError {
    message: string;
    errorType: string;
}

export interface HaffaApiError {
    errors: GraphqlError[];
}
