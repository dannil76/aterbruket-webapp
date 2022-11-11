/* eslint-disable no-underscore-dangle */
import { Client, Connection } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Credentials, sign } from 'aws4';
import {
    OpenSearchClientError,
    ResponseError,
} from '@opensearch-project/opensearch/lib/errors';
import { Advert } from 'models/haffaAdvert';
import {
    long,
    SearchResponse,
    SearchTotalHits,
} from '@opensearch-project/opensearch/api/types';
import { logDebug, logException } from '../utils';
import { OpenSearchRequestArgs } from '../models';
import { opensearchUrl, region } from '../config';

const createAwsConnector = (credentials: Credentials) => {
    class AmazonConnection extends Connection {
        buildRequestObject(params: unknown) {
            const request = super.buildRequestObject(
                params,
            ) as OpenSearchRequestArgs;
            request.service = 'es';
            logDebug(`region ${region}`);
            logDebug(`url ${opensearchUrl}`);
            request.region = region;
            request.headers = request.headers || {};
            request.headers.host = request.hostname;

            return sign(request, credentials);
        }
    }
    return {
        Connection: AmazonConnection,
    };
};

async function getClient() {
    const credentials = await defaultProvider()();
    return new Client({
        ...createAwsConnector(credentials),
        node: opensearchUrl,
    });
}

export async function getPickedUpItems(): Promise<Advert[]> {
    logDebug('[OpenSearchService] get client');
    const client = await getClient();
    const search = {
        query: {
            match: {
                'advertBorrowCalendar.calendarEvents.status': {
                    query: 'pickedUp',
                },
            },
        },
    };

    logDebug('[OpenSearchService] search picked up items');
    try {
        const result = await client.search({
            index: 'advert',
            body: search,
        });

        const { hits: response } = result.body as SearchResponse<Advert>;

        const total =
            (response.total as SearchTotalHits)?.value ??
            (response.total as long);

        logDebug(`[OpenSearchService] found ${total} adverts`);

        return response.hits.map((h) => {
            return h._source;
        });
    } catch (error) {
        const e = error as OpenSearchClientError;

        if (e.name === 'ResponseError') {
            const responseError = e as ResponseError;
            logException(
                `[OpenSearchService] retrieved ResponseError with message: 
                "${JSON.stringify(responseError.body)}"`,
            );
        } else {
            logDebug(
                `[OpenSearchService] retrieved unmapped error 
                "${e.name}": 
                ${JSON.stringify(error)}`,
            );
        }

        return [];
    }
}
