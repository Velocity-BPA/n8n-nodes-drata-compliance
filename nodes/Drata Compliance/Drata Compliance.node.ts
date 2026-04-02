/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-dratacompliance/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class DrataCompliance implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Drata Compliance',
    name: 'dratacompliance',
    icon: 'file:dratacompliance.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Drata Compliance API',
    defaults: {
      name: 'Drata Compliance',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'dratacomplianceApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Control',
            value: 'control',
          },
          {
            name: 'Framework',
            value: 'framework',
          },
          {
            name: 'Evidence',
            value: 'evidence',
          },
          {
            name: 'Asset',
            value: 'asset',
          },
          {
            name: 'Risk',
            value: 'risk',
          },
          {
            name: 'Vendor',
            value: 'vendor',
          },
          {
            name: 'User',
            value: 'user',
          }
        ],
        default: 'control',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['control'] } },
  options: [
    { name: 'Get All Controls', value: 'getAllControls', description: 'List all compliance controls', action: 'Get all controls' },
    { name: 'Get Control', value: 'getControl', description: 'Get specific control details', action: 'Get a control' },
    { name: 'Update Control', value: 'updateControl', description: 'Update control status and details', action: 'Update a control' },
    { name: 'Get Control Evidence', value: 'getControlEvidence', description: 'Get evidence for a control', action: 'Get control evidence' },
    { name: 'Upload Control Evidence', value: 'uploadControlEvidence', description: 'Upload evidence for a control', action: 'Upload control evidence' }
  ],
  default: 'getAllControls',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['framework'] } },
  options: [
    { name: 'Get All Frameworks', value: 'getAllFrameworks', description: 'List all available compliance frameworks', action: 'Get all frameworks' },
    { name: 'Get Framework', value: 'getFramework', description: 'Get specific framework details', action: 'Get a framework' },
    { name: 'Get Framework Controls', value: 'getFrameworkControls', description: 'Get controls for a framework', action: 'Get framework controls' },
    { name: 'Create Assessment', value: 'createAssessment', description: 'Start new compliance assessment', action: 'Create an assessment' },
  ],
  default: 'getAllFrameworks',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['evidence'],
		},
	},
	options: [
		{
			name: 'Get All Evidence',
			value: 'getAllEvidence',
			description: 'List all evidence items',
			action: 'Get all evidence',
		},
		{
			name: 'Get Evidence',
			value: 'getEvidence',
			description: 'Get specific evidence details',
			action: 'Get evidence',
		},
		{
			name: 'Create Evidence',
			value: 'createEvidence',
			description: 'Upload new evidence',
			action: 'Create evidence',
		},
		{
			name: 'Update Evidence',
			value: 'updateEvidence',
			description: 'Update evidence metadata',
			action: 'Update evidence',
		},
		{
			name: 'Delete Evidence',
			value: 'deleteEvidence',
			description: 'Delete evidence item',
			action: 'Delete evidence',
		},
	],
	default: 'getAllEvidence',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['asset'] } },
  options: [
    { name: 'Get All Assets', value: 'getAllAssets', description: 'List all monitored assets', action: 'Get all assets' },
    { name: 'Get Asset', value: 'getAsset', description: 'Get specific asset details', action: 'Get an asset' },
    { name: 'Create Asset', value: 'createAsset', description: 'Add new asset for monitoring', action: 'Create an asset' },
    { name: 'Update Asset', value: 'updateAsset', description: 'Update asset information', action: 'Update an asset' },
    { name: 'Delete Asset', value: 'deleteAsset', description: 'Remove asset from monitoring', action: 'Delete an asset' },
  ],
  default: 'getAllAssets',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['risk'] } },
	options: [
		{
			name: 'Get All Risks',
			value: 'getAllRisks',
			description: 'List all identified risks',
			action: 'Get all risks'
		},
		{
			name: 'Get Risk',
			value: 'getRisk',
			description: 'Get specific risk details',
			action: 'Get a risk'
		},
		{
			name: 'Create Risk',
			value: 'createRisk',
			description: 'Create new risk assessment',
			action: 'Create a risk'
		},
		{
			name: 'Update Risk',
			value: 'updateRisk',
			description: 'Update risk details and status',
			action: 'Update a risk'
		},
		{
			name: 'Delete Risk',
			value: 'deleteRisk',
			description: 'Remove risk from tracking',
			action: 'Delete a risk'
		}
	],
	default: 'getAllRisks'
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['vendor'],
		},
	},
	options: [
		{
			name: 'Get All Vendors',
			value: 'getAllVendors',
			description: 'List all vendors',
			action: 'Get all vendors',
		},
		{
			name: 'Get Vendor',
			value: 'getVendor',
			description: 'Get specific vendor details',
			action: 'Get a vendor',
		},
		{
			name: 'Create Vendor',
			value: 'createVendor',
			description: 'Add new vendor for assessment',
			action: 'Create a vendor',
		},
		{
			name: 'Update Vendor',
			value: 'updateVendor',
			description: 'Update vendor information',
			action: 'Update a vendor',
		},
		{
			name: 'Get Vendor Assessments',
			value: 'getVendorAssessments',
			description: 'Get vendor security assessments',
			action: 'Get vendor assessments',
		},
	],
	default: 'getAllVendors',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['user'],
		},
	},
	options: [
		{
			name: 'Get All Users',
			value: 'getAllUsers',
			description: 'List all users in the system',
			action: 'Get all users',
		},
		{
			name: 'Get User',
			value: 'getUser',
			description: 'Get specific user details',
			action: 'Get a user',
		},
		{
			name: 'Create User',
			value: 'createUser',
			description: 'Add new user to the system',
			action: 'Create a user',
		},
		{
			name: 'Update User',
			value: 'updateUser',
			description: 'Update user information',
			action: 'Update a user',
		},
		{
			name: 'Get User Training',
			value: 'getUserTraining',
			description: 'Get user training records',
			action: 'Get user training',
		},
	],
	default: 'getAllUsers',
},
{
  displayName: 'Framework ID',
  name: 'frameworkId',
  type: 'string',
  displayOptions: { show: { resource: ['control'], operation: ['getAllControls'] } },
  default: '',
  description: 'Filter controls by framework ID',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['control'], operation: ['getAllControls'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Pending', value: 'pending' }
  ],
  default: '',
  description: 'Filter controls by status',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: { show: { resource: ['control'], operation: ['getAllControls'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['control'], operation: ['getAllControls'] } },
  default: 50,
  description: 'Number of items per page',
},
{
  displayName: 'Control ID',
  name: 'controlId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['control'], operation: ['getControl', 'updateControl', 'getControlEvidence', 'uploadControlEvidence'] } },
  default: '',
  description: 'ID of the control',
},
{
  displayName: 'Status',
  name: 'controlStatus',
  type: 'options',
  displayOptions: { show: { resource: ['control'], operation: ['updateControl'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Pending', value: 'pending' }
  ],
  default: 'active',
  description: 'Status of the control',
},
{
  displayName: 'Notes',
  name: 'notes',
  type: 'string',
  displayOptions: { show: { resource: ['control'], operation: ['updateControl'] } },
  default: '',
  description: 'Notes about the control update',
},
{
  displayName: 'File',
  name: 'file',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['control'], operation: ['uploadControlEvidence'] } },
  default: '',
  description: 'Binary property name containing the file to upload',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  displayOptions: { show: { resource: ['control'], operation: ['uploadControlEvidence'] } },
  default: '',
  description: 'Description of the evidence being uploaded',
},
{
  displayName: 'Framework ID',
  name: 'frameworkId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['framework'],
      operation: ['getFramework', 'getFrameworkControls', 'createAssessment'],
    },
  },
  default: '',
  description: 'The ID of the framework',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['framework'],
      operation: ['getAllFrameworks'],
    },
  },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['framework'],
      operation: ['getAllFrameworks'],
    },
  },
  default: 20,
  description: 'Number of items per page',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'All', value: 'all' },
  ],
  displayOptions: {
    show: {
      resource: ['framework'],
      operation: ['getFrameworkControls'],
    },
  },
  default: 'all',
  description: 'Filter controls by status',
},
{
  displayName: 'Assessment Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['framework'],
      operation: ['createAssessment'],
    },
  },
  default: '',
  description: 'Name for the new assessment',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['framework'],
      operation: ['createAssessment'],
    },
  },
  default: '',
  description: 'Description for the assessment',
},
{
	displayName: 'Control ID',
	name: 'controlId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['getAllEvidence'],
		},
	},
	default: '',
	description: 'Filter evidence by control ID',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['getAllEvidence'],
		},
	},
	default: '',
	description: 'Filter evidence by type',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['getAllEvidence'],
		},
	},
	default: '',
	description: 'Filter evidence by status',
},
{
	displayName: 'Page',
	name: 'page',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['getAllEvidence'],
		},
	},
	default: 1,
	description: 'Page number for pagination',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['getAllEvidence'],
		},
	},
	default: 50,
	description: 'Number of items per page',
},
{
	displayName: 'Evidence ID',
	name: 'evidenceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['getEvidence', 'updateEvidence', 'deleteEvidence'],
		},
	},
	default: '',
	description: 'The ID of the evidence item',
},
{
	displayName: 'Control ID',
	name: 'controlId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['createEvidence'],
		},
	},
	default: '',
	description: 'The control ID to associate with this evidence',
},
{
	displayName: 'File',
	name: 'file',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['createEvidence'],
		},
	},
	default: '',
	description: 'The file to upload as evidence',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['createEvidence', 'updateEvidence'],
		},
	},
	default: '',
	description: 'Description of the evidence',
},
{
	displayName: 'Evidence Type',
	name: 'evidenceType',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['createEvidence'],
		},
	},
	default: '',
	description: 'Type of evidence being uploaded',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['evidence'],
			operation: ['updateEvidence'],
		},
	},
	default: '',
	description: 'Status of the evidence',
},
{
  displayName: 'Asset Type',
  name: 'type',
  type: 'string',
  default: '',
  description: 'Filter assets by type',
  displayOptions: { show: { resource: ['asset'], operation: ['getAllAssets'] } },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'string',
  default: '',
  description: 'Filter assets by status',
  displayOptions: { show: { resource: ['asset'], operation: ['getAllAssets'] } },
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  default: 1,
  description: 'Page number for pagination',
  displayOptions: { show: { resource: ['asset'], operation: ['getAllAssets'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Number of items per page',
  displayOptions: { show: { resource: ['asset'], operation: ['getAllAssets'] } },
},
{
  displayName: 'Asset ID',
  name: 'assetId',
  type: 'string',
  required: true,
  default: '',
  description: 'ID of the asset',
  displayOptions: { show: { resource: ['asset'], operation: ['getAsset', 'updateAsset', 'deleteAsset'] } },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  description: 'Name of the asset',
  displayOptions: { show: { resource: ['asset'], operation: ['createAsset'] } },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'Name of the asset',
  displayOptions: { show: { resource: ['asset'], operation: ['updateAsset'] } },
},
{
  displayName: 'Asset Type',
  name: 'assetType',
  type: 'string',
  required: true,
  default: '',
  description: 'Type of the asset',
  displayOptions: { show: { resource: ['asset'], operation: ['createAsset'] } },
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  default: '',
  description: 'Description of the asset',
  displayOptions: { show: { resource: ['asset'], operation: ['createAsset', 'updateAsset'] } },
},
{
  displayName: 'Owner',
  name: 'owner',
  type: 'string',
  default: '',
  description: 'Owner of the asset',
  displayOptions: { show: { resource: ['asset'], operation: ['createAsset', 'updateAsset'] } },
},
{
  displayName: 'Status',
  name: 'assetStatus',
  type: 'string',
  default: '',
  description: 'Status of the asset',
  displayOptions: { show: { resource: ['asset'], operation: ['updateAsset'] } },
},
{
	displayName: 'Severity',
	name: 'severity',
	type: 'options',
	displayOptions: { show: { resource: ['risk'], operation: ['getAllRisks'] } },
	options: [
		{ name: 'Low', value: 'low' },
		{ name: 'Medium', value: 'medium' },
		{ name: 'High', value: 'high' },
		{ name: 'Critical', value: 'critical' }
	],
	default: '',
	description: 'Filter risks by severity level'
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: { show: { resource: ['risk'], operation: ['getAllRisks'] } },
	options: [
		{ name: 'Open', value: 'open' },
		{ name: 'In Progress', value: 'in_progress' },
		{ name: 'Mitigated', value: 'mitigated' },
		{ name: 'Closed', value: 'closed' }
	],
	default: '',
	description: 'Filter risks by status'
},
{
	displayName: 'Category',
	name: 'category',
	type: 'string',
	displayOptions: { show: { resource: ['risk'], operation: ['getAllRisks'] } },
	default: '',
	description: 'Filter risks by category'
},
{
	displayName: 'Page',
	name: 'page',
	type: 'number',
	displayOptions: { show: { resource: ['risk'], operation: ['getAllRisks'] } },
	default: 1,
	description: 'Page number for pagination'
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: { show: { resource: ['risk'], operation: ['getAllRisks'] } },
	default: 50,
	description: 'Number of results per page'
},
{
	displayName: 'Risk ID',
	name: 'riskId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['risk'], operation: ['getRisk', 'updateRisk', 'deleteRisk'] } },
	default: '',
	description: 'The ID of the risk'
},
{
	displayName: 'Title',
	name: 'title',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['risk'], operation: ['createRisk'] } },
	default: '',
	description: 'The title of the risk'
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['risk'], operation: ['createRisk'] } },
	default: '',
	description: 'The description of the risk'
},
{
	displayName: 'Severity',
	name: 'createSeverity',
	type: 'options',
	required: true,
	displayOptions: { show: { resource: ['risk'], operation: ['createRisk'] } },
	options: [
		{ name: 'Low', value: 'low' },
		{ name: 'Medium', value: 'medium' },
		{ name: 'High', value: 'high' },
		{ name: 'Critical', value: 'critical' }
	],
	default: 'medium',
	description: 'The severity level of the risk'
},
{
	displayName: 'Category',
	name: 'createCategory',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['risk'], operation: ['createRisk'] } },
	default: '',
	description: 'The category of the risk'
},
{
	displayName: 'Owner',
	name: 'owner',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['risk'], operation: ['createRisk'] } },
	default: '',
	description: 'The owner of the risk'
},
{
	displayName: 'Severity',
	name: 'updateSeverity',
	type: 'options',
	displayOptions: { show: { resource: ['risk'], operation: ['updateRisk'] } },
	options: [
		{ name: 'Low', value: 'low' },
		{ name: 'Medium', value: 'medium' },
		{ name: 'High', value: 'high' },
		{ name: 'Critical', value: 'critical' }
	],
	default: '',
	description: 'The severity level of the risk'
},
{
	displayName: 'Status',
	name: 'updateStatus',
	type: 'options',
	displayOptions: { show: { resource: ['risk'], operation: ['updateRisk'] } },
	options: [
		{ name: 'Open', value: 'open' },
		{ name: 'In Progress', value: 'in_progress' },
		{ name: 'Mitigated', value: 'mitigated' },
		{ name: 'Closed', value: 'closed' }
	],
	default: '',
	description: 'The status of the risk'
},
{
	displayName: 'Mitigation Plan',
	name: 'mitigationPlan',
	type: 'string',
	displayOptions: { show: { resource: ['risk'], operation: ['updateRisk'] } },
	default: '',
	description: 'The mitigation plan for the risk'
},
{
	displayName: 'Risk Level',
	name: 'riskLevel',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getAllVendors'],
		},
	},
	options: [
		{ name: 'High', value: 'high' },
		{ name: 'Medium', value: 'medium' },
		{ name: 'Low', value: 'low' },
	],
	default: '',
	description: 'Filter vendors by risk level',
	required: false,
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getAllVendors'],
		},
	},
	options: [
		{ name: 'Active', value: 'active' },
		{ name: 'Inactive', value: 'inactive' },
		{ name: 'Pending', value: 'pending' },
	],
	default: '',
	description: 'Filter vendors by status',
	required: false,
},
{
	displayName: 'Page',
	name: 'page',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getAllVendors'],
		},
	},
	default: 1,
	description: 'Page number for pagination',
	required: false,
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getAllVendors'],
		},
	},
	default: 50,
	description: 'Number of vendors per page',
	required: false,
},
{
	displayName: 'Vendor ID',
	name: 'vendorId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getVendor', 'updateVendor', 'getVendorAssessments'],
		},
	},
	default: '',
	description: 'The ID of the vendor',
	required: true,
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['createVendor', 'updateVendor'],
		},
	},
	default: '',
	description: 'The name of the vendor',
	required: true,
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['createVendor'],
		},
	},
	default: '',
	description: 'Description of the vendor',
	required: false,
},
{
	displayName: 'Contact Email',
	name: 'contactEmail',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['createVendor'],
		},
	},
	default: '',
	description: 'Contact email for the vendor',
	required: true,
},
{
	displayName: 'Risk Level',
	name: 'riskLevel',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['createVendor', 'updateVendor'],
		},
	},
	options: [
		{ name: 'High', value: 'high' },
		{ name: 'Medium', value: 'medium' },
		{ name: 'Low', value: 'low' },
	],
	default: 'medium',
	description: 'Risk level of the vendor',
	required: true,
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['updateVendor'],
		},
	},
	options: [
		{ name: 'Active', value: 'active' },
		{ name: 'Inactive', value: 'inactive' },
		{ name: 'Pending', value: 'pending' },
	],
	default: 'active',
	description: 'Status of the vendor',
	required: false,
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getUser', 'updateUser', 'getUserTraining'],
		},
	},
	default: '',
	description: 'The ID of the user',
},
{
	displayName: 'Role',
	name: 'role',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getAllUsers'],
		},
	},
	default: '',
	description: 'Filter users by role',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Inactive',
			value: 'inactive',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
	],
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getAllUsers'],
		},
	},
	default: '',
	description: 'Filter users by status',
},
{
	displayName: 'Page',
	name: 'page',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getAllUsers'],
		},
	},
	default: 1,
	description: 'Page number for pagination',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['getAllUsers'],
		},
	},
	default: 50,
	description: 'Number of users per page',
},
{
	displayName: 'Email',
	name: 'email',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'Email address of the user',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser', 'updateUser'],
		},
	},
	default: '',
	description: 'Full name of the user',
},
{
	displayName: 'Role',
	name: 'userRole',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser', 'updateUser'],
		},
	},
	default: '',
	description: 'Role of the user',
},
{
	displayName: 'Department',
	name: 'department',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['createUser'],
		},
	},
	default: '',
	description: 'Department of the user',
},
{
	displayName: 'Status',
	name: 'userStatus',
	type: 'options',
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Inactive',
			value: 'inactive',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
	],
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['updateUser'],
		},
	},
	default: 'active',
	description: 'Status of the user',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'control':
        return [await executeControlOperations.call(this, items)];
      case 'framework':
        return [await executeFrameworkOperations.call(this, items)];
      case 'evidence':
        return [await executeEvidenceOperations.call(this, items)];
      case 'asset':
        return [await executeAssetOperations.call(this, items)];
      case 'risk':
        return [await executeRiskOperations.call(this, items)];
      case 'vendor':
        return [await executeVendorOperations.call(this, items)];
      case 'user':
        return [await executeUserOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeControlOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dratacomplianceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://public-api.drata.com';

      switch (operation) {
        case 'getAllControls': {
          const frameworkId = this.getNodeParameter('frameworkId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams = new URLSearchParams();
          if (frameworkId) queryParams.append('framework_id', frameworkId);
          if (status) queryParams.append('status', status);
          queryParams.append('page', page.toString());
          queryParams.append('limit', limit.toString());

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/controls?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getControl': {
          const controlId = this.getNodeParameter('controlId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/controls/${controlId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateControl': {
          const controlId = this.getNodeParameter('controlId', i) as string;
          const controlStatus = this.getNodeParameter('controlStatus', i) as string;
          const notes = this.getNodeParameter('notes', i) as string;

          const body: any = {
            status: controlStatus,
          };

          if (notes) {
            body.notes = notes;
          }

          const options: any = {
            method: 'PUT',
            url: `${baseUrl}/controls/${controlId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getControlEvidence': {
          const controlId = this.getNodeParameter('controlId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/controls/${controlId}/evidence`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'uploadControlEvidence': {
          const controlId = this.getNodeParameter('controlId', i) as string;
          const file = this.getNodeParameter('file', i) as string;
          const description = this.getNodeParameter('description', i) as string;

          const binaryData = this.helpers.assertBinaryData(i, file);
          
          const formData: any = {
            file: {
              value: binaryData.data,
              options: {
                filename: binaryData.fileName,
                contentType: binaryData.mimeType,
              },
            },
          };

          if (description) {
            formData.description = description;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/controls/${controlId}/evidence`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            formData,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeFrameworkOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dratacomplianceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAllFrameworks': {
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/frameworks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              page,
              limit,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getFramework': {
          const frameworkId = this.getNodeParameter('frameworkId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/frameworks/${frameworkId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getFrameworkControls': {
          const frameworkId = this.getNodeParameter('frameworkId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/frameworks/${frameworkId}/controls`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              status: status !== 'all' ? status : undefined,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createAssessment': {
          const frameworkId = this.getNodeParameter('frameworkId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/frameworks/${frameworkId}/assessments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              name,
              description,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeEvidenceOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dratacomplianceApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllEvidence': {
					const controlId = this.getNodeParameter('controlId', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const page = this.getNodeParameter('page', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;

					const queryParams = new URLSearchParams();
					if (controlId) queryParams.append('control_id', controlId);
					if (type) queryParams.append('type', type);
					if (status) queryParams.append('status', status);
					if (page) queryParams.append('page', page.toString());
					if (limit) queryParams.append('limit', limit.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/evidence${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEvidence': {
					const evidenceId = this.getNodeParameter('evidenceId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/evidence/${evidenceId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createEvidence': {
					const controlId = this.getNodeParameter('controlId', i) as string;
					const file = this.getNodeParameter('file', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const evidenceType = this.getNodeParameter('evidenceType', i) as string;

					const body: any = {
						control_id: controlId,
						file: file,
					};

					if (description) body.description = description;
					if (evidenceType) body.type = evidenceType;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/evidence`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateEvidence': {
					const evidenceId = this.getNodeParameter('evidenceId', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const status = this.getNodeParameter('status', i) as string;

					const body: any = {};
					if (description) body.description = description;
					if (status) body.status = status;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/evidence/${evidenceId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteEvidence': {
					const evidenceId = this.getNodeParameter('evidenceId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/evidence/${evidenceId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAssetOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dratacomplianceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllAssets': {
          const type = this.getNodeParameter('type', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams: any = {};
          if (type) queryParams.type = type;
          if (status) queryParams.status = status;
          if (page) queryParams.page = page;
          if (limit) queryParams.limit = limit;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/assets${queryString ? `?${queryString}` : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAsset': {
          const assetId = this.getNodeParameter('assetId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/assets/${assetId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAsset': {
          const name = this.getNodeParameter('name', i) as string;
          const assetType = this.getNodeParameter('assetType', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const owner = this.getNodeParameter('owner', i) as string;

          const body: any = {
            name,
            type: assetType,
          };
          if (description) body.description = description;
          if (owner) body.owner = owner;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/assets`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAsset': {
          const assetId = this.getNodeParameter('assetId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const owner = this.getNodeParameter('owner', i) as string;
          const assetStatus = this.getNodeParameter('assetStatus', i) as string;

          const body: any = {};
          if (name) body.name = name;
          if (description) body.description = description;
          if (owner) body.owner = owner;
          if (assetStatus) body.status = assetStatus;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/assets/${assetId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteAsset': {
          const assetId = this.getNodeParameter('assetId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/assets/${assetId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeRiskOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dratacomplianceApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllRisks': {
					const severity = this.getNodeParameter('severity', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const category = this.getNodeParameter('category', i) as string;
					const page = this.getNodeParameter('page', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;

					const params = new URLSearchParams();
					if (severity) params.append('severity', severity);
					if (status) params.append('status', status);
					if (category) params.append('category', category);
					params.append('page', page.toString());
					params.append('limit', limit.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/risks?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getRisk': {
					const riskId = this.getNodeParameter('riskId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/risks/${riskId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createRisk': {
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const severity = this.getNodeParameter('createSeverity', i) as string;
					const category = this.getNodeParameter('createCategory', i) as string;
					const owner = this.getNodeParameter('owner', i) as string;

					const body = {
						title,
						description,
						severity,
						category,
						owner,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/risks`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateRisk': {
					const riskId = this.getNodeParameter('riskId', i) as string;
					const severity = this.getNodeParameter('updateSeverity', i) as string;
					const status = this.getNodeParameter('updateStatus', i) as string;
					const mitigationPlan = this.getNodeParameter('mitigationPlan', i) as string;

					const body: any = {};
					if (severity) body.severity = severity;
					if (status) body.status = status;
					if (mitigationPlan) body.mitigation_plan = mitigationPlan;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/risks/${riskId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteRisk': {
					const riskId = this.getNodeParameter('riskId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/risks/${riskId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeVendorOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dratacomplianceApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllVendors': {
					const riskLevel = this.getNodeParameter('riskLevel', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const page = this.getNodeParameter('page', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;

					const params = new URLSearchParams();
					if (riskLevel) params.append('risk_level', riskLevel);
					if (status) params.append('status', status);
					if (page) params.append('page', page.toString());
					if (limit) params.append('limit', limit.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/vendors${params.toString() ? '?' + params.toString() : ''}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getVendor': {
					const vendorId = this.getNodeParameter('vendorId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/vendors/${vendorId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createVendor': {
					const name = this.getNodeParameter('name', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const contactEmail = this.getNodeParameter('contactEmail', i) as string;
					const riskLevel = this.getNodeParameter('riskLevel', i) as string;

					const body: any = {
						name,
						contact_email: contactEmail,
						risk_level: riskLevel,
					};

					if (description) {
						body.description = description;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/vendors`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateVendor': {
					const vendorId = this.getNodeParameter('vendorId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const riskLevel = this.getNodeParameter('riskLevel', i) as string;
					const status = this.getNodeParameter('status', i) as string;

					const body: any = {
						name,
						risk_level: riskLevel,
					};

					if (status) {
						body.status = status;
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/vendors/${vendorId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getVendorAssessments': {
					const vendorId = this.getNodeParameter('vendorId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/vendors/${vendorId}/assessments`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeUserOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dratacomplianceApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllUsers': {
					const role = this.getNodeParameter('role', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const page = this.getNodeParameter('page', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;

					const qs: any = {};
					if (role) qs.role = role;
					if (status) qs.status = status;
					if (page) qs.page = page;
					if (limit) qs.limit = limit;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUser': {
					const userId = this.getNodeParameter('userId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createUser': {
					const email = this.getNodeParameter('email', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const userRole = this.getNodeParameter('userRole', i) as string;
					const department = this.getNodeParameter('department', i) as string;

					const body: any = {
						email,
						name,
						role: userRole,
					};

					if (department) {
						body.department = department;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/users`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateUser': {
					const userId = this.getNodeParameter('userId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const userRole = this.getNodeParameter('userRole', i) as string;
					const userStatus = this.getNodeParameter('userStatus', i) as string;

					const body: any = {
						name,
						role: userRole,
						status: userStatus,
					};

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/users/${userId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserTraining': {
					const userId = this.getNodeParameter('userId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/users/${userId}/training`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
