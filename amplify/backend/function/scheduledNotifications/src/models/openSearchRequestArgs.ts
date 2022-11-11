import { ClientRequestArgs } from 'http';

export interface OpenSearchRequestArgs extends ClientRequestArgs {
    service: string;
    region: string;
}
