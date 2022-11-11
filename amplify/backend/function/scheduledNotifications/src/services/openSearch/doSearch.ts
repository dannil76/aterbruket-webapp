import { SearchResponse } from '@opensearch-project/opensearch/api/types';
import {
    OpenSearchClientError,
    ResponseError,
} from '@opensearch-project/opensearch/lib/errors';
import { RequestBody } from '@opensearch-project/opensearch/lib/Transport';
import { logDebug, logException } from '../../utils';
import getClient from './getClient';

export default async function doSearch<
    TResponse,
    TRequestBody extends RequestBody = Record<string, unknown>,
>(request: TRequestBody): Promise<TResponse[]> {
    try {
        const client = await getClient();
        const result = await client.search({
            index: 'advert',
            body: request,
        });

        const { hits: response } = result.body as SearchResponse<TResponse>;
        return response.hits.map((h) => {
            // eslint-disable-next-line no-underscore-dangle
            return h._source;
        });
    } catch (error) {
        const e = error as OpenSearchClientError;

        if (e.name === 'ResponseError') {
            const responseError = e as ResponseError;
            logException(
                `[doSearch] retrieved ResponseError with message: 
                "${JSON.stringify(responseError.body)}"`,
            );
        } else {
            logDebug(
                `[doSearch] retrieved unmapped error 
                "${e.name}": 
                ${JSON.stringify(error)}`,
            );
        }

        return [];
    }
}
