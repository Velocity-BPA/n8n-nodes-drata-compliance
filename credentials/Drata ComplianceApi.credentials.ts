import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class DrataComplianceApi implements ICredentialType {
	name = 'drataComplianceApi';
	displayName = 'Drata Compliance API';
	documentationUrl = 'https://developers.drata.com/docs/authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key for Drata Compliance. Generate in Drata admin console under Integrations > API Keys.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://public-api.drata.com',
			required: true,
			description: 'Base URL for the Drata Compliance API',
		},
	];
}