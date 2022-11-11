/* eslint-disable no-underscore-dangle */
import { Client, Connection } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Credentials, sign } from 'aws4';
import { OpenSearchRequestArgs } from '../../models';
import { opensearchUrl, region } from '../../config';

const createAwsConnector = (credentials: Credentials) => {
    class AmazonConnection extends Connection {
        buildRequestObject(params: unknown) {
            const request = super.buildRequestObject(
                params,
            ) as OpenSearchRequestArgs;
            request.service = 'es';
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

export default async function getClient(): Promise<Client> {
    const credentials = await defaultProvider()();
    return new Client({
        ...createAwsConnector(credentials),
        node: opensearchUrl,
    });
}
