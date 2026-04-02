/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { DrataCompliance } from '../nodes/Drata Compliance/Drata Compliance.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('DrataCompliance Node', () => {
  let node: DrataCompliance;

  beforeAll(() => {
    node = new DrataCompliance();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Drata Compliance');
      expect(node.description.name).toBe('dratacompliance');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Control Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://public-api.drata.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        assertBinaryData: jest.fn().mockReturnValue({
          data: Buffer.from('test file content'),
          fileName: 'test.pdf',
          mimeType: 'application/pdf'
        })
      },
    };
  });

  test('should get all controls successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllControls')
      .mockReturnValueOnce('framework123')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50);

    const mockResponse = { controls: [{ id: 'ctrl1', name: 'Control 1' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeControlOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://public-api.drata.com/controls?framework_id=framework123&status=active&page=1&limit=50',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  test('should get specific control successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getControl')
      .mockReturnValueOnce('ctrl123');

    const mockResponse = { id: 'ctrl123', name: 'Control 123', status: 'active' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeControlOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://public-api.drata.com/controls/ctrl123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  test('should update control successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateControl')
      .mockReturnValueOnce('ctrl123')
      .mockReturnValueOnce('inactive')
      .mockReturnValueOnce('Control updated for testing');

    const mockResponse = { id: 'ctrl123', status: 'inactive', notes: 'Control updated for testing' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeControlOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://public-api.drata.com/controls/ctrl123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        status: 'inactive',
        notes: 'Control updated for testing',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  test('should handle errors when continuing on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getControl');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeControlOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 },
    }]);
  });

  test('should throw error when not continuing on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getControl');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    const apiError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    await expect(executeControlOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});

describe('Framework Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://public-api.drata.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAllFrameworks', () => {
    it('should get all frameworks successfully', async () => {
      const mockResponse = { frameworks: [{ id: '1', name: 'SOC 2' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllFrameworks')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(20);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFrameworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getAllFrameworks error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllFrameworks');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFrameworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getFramework', () => {
    it('should get framework successfully', async () => {
      const mockResponse = { framework: { id: '1', name: 'SOC 2' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFramework')
        .mockReturnValueOnce('framework-123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFrameworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getFramework error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFramework');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Framework not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFrameworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Framework not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getFrameworkControls', () => {
    it('should get framework controls successfully', async () => {
      const mockResponse = { controls: [{ id: '1', name: 'Control 1' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFrameworkControls')
        .mockReturnValueOnce('framework-123')
        .mockReturnValueOnce('active');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFrameworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getFrameworkControls error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFrameworkControls');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Controls not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFrameworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Controls not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('createAssessment', () => {
    it('should create assessment successfully', async () => {
      const mockResponse = { assessment: { id: '1', name: 'New Assessment' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createAssessment')
        .mockReturnValueOnce('framework-123')
        .mockReturnValueOnce('New Assessment')
        .mockReturnValueOnce('Test assessment description');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFrameworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle createAssessment error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createAssessment');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Assessment creation failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeFrameworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Assessment creation failed' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Evidence Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://public-api.drata.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get all evidence successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
			switch (paramName) {
				case 'operation':
					return 'getAllEvidence';
				case 'controlId':
					return 'control-123';
				case 'page':
					return 1;
				case 'limit':
					return 50;
				default:
					return '';
			}
		});

		const mockResponse = { data: [{ id: 'evidence-1', control_id: 'control-123' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeEvidenceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
	});

	it('should handle getAllEvidence errors', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllEvidence');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeEvidenceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should get specific evidence successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
			switch (paramName) {
				case 'operation':
					return 'getEvidence';
				case 'evidenceId':
					return 'evidence-123';
				default:
					return '';
			}
		});

		const mockResponse = { id: 'evidence-123', control_id: 'control-456' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeEvidenceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
	});

	it('should create evidence successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
			switch (paramName) {
				case 'operation':
					return 'createEvidence';
				case 'controlId':
					return 'control-123';
				case 'file':
					return 'evidence.pdf';
				case 'description':
					return 'Test evidence';
				case 'evidenceType':
					return 'document';
				default:
					return '';
			}
		});

		const mockResponse = { id: 'new-evidence-123', control_id: 'control-123' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeEvidenceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
	});

	it('should update evidence successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
			switch (paramName) {
				case 'operation':
					return 'updateEvidence';
				case 'evidenceId':
					return 'evidence-123';
				case 'description':
					return 'Updated description';
				case 'status':
					return 'approved';
				default:
					return '';
			}
		});

		const mockResponse = { id: 'evidence-123', status: 'approved' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeEvidenceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
	});

	it('should delete evidence successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
			switch (paramName) {
				case 'operation':
					return 'deleteEvidence';
				case 'evidenceId':
					return 'evidence-123';
				default:
					return '';
			}
		});

		const mockResponse = { success: true };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeEvidenceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 },
		}]);
	});
});

describe('Asset Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://public-api.drata.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get all assets successfully', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Asset 1' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAllAssets';
      if (param === 'type') return 'server';
      if (param === 'page') return 1;
      if (param === 'limit') return 50;
      return '';
    });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://public-api.drata.com/assets?type=server&page=1&limit=50',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get a specific asset successfully', async () => {
    const mockResponse = { id: '123', name: 'Test Asset' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAsset';
      if (param === 'assetId') return '123';
      return '';
    });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://public-api.drata.com/assets/123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should create an asset successfully', async () => {
    const mockResponse = { id: '123', name: 'New Asset' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'createAsset';
      if (param === 'name') return 'New Asset';
      if (param === 'assetType') return 'server';
      if (param === 'description') return 'Test description';
      if (param === 'owner') return 'test@example.com';
      return '';
    });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://public-api.drata.com/assets',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'New Asset',
        type: 'server',
        description: 'Test description',
        owner: 'test@example.com',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should update an asset successfully', async () => {
    const mockResponse = { id: '123', name: 'Updated Asset' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'updateAsset';
      if (param === 'assetId') return '123';
      if (param === 'name') return 'Updated Asset';
      if (param === 'description') return 'Updated description';
      return '';
    });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://public-api.drata.com/assets/123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Updated Asset',
        description: 'Updated description',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should delete an asset successfully', async () => {
    const mockResponse = { success: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'deleteAsset';
      if (param === 'assetId') return '123';
      return '';
    });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://public-api.drata.com/assets/123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAllAssets';
      return '';
    });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw errors when continueOnFail is false', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAllAssets';
      return '';
    });

    await expect(executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});

describe('Risk Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://public-api.drata.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			}
		};
	});

	it('should get all risks successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllRisks')
			.mockReturnValueOnce('high')
			.mockReturnValueOnce('open')
			.mockReturnValueOnce('security')
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(50);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([{ id: '1', title: 'Test Risk' }]);

		const result = await executeRiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://public-api.drata.com/risks?severity=high&status=open&category=security&page=1&limit=50',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json'
			},
			json: true
		});
		expect(result).toEqual([{ json: [{ id: '1', title: 'Test Risk' }], pairedItem: { item: 0 } }]);
	});

	it('should get a specific risk successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getRisk')
			.mockReturnValueOnce('risk123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'risk123', title: 'Test Risk' });

		const result = await executeRiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://public-api.drata.com/risks/risk123',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json'
			},
			json: true
		});
		expect(result).toEqual([{ json: { id: 'risk123', title: 'Test Risk' }, pairedItem: { item: 0 } }]);
	});

	it('should create a risk successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createRisk')
			.mockReturnValueOnce('Security Risk')
			.mockReturnValueOnce('Data breach risk')
			.mockReturnValueOnce('high')
			.mockReturnValueOnce('security')
			.mockReturnValueOnce('john.doe@company.com');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'new-risk', title: 'Security Risk' });

		const result = await executeRiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://public-api.drata.com/risks',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json'
			},
			json: true,
			body: {
				title: 'Security Risk',
				description: 'Data breach risk',
				severity: 'high',
				category: 'security',
				owner: 'john.doe@company.com'
			}
		});
		expect(result).toEqual([{ json: { id: 'new-risk', title: 'Security Risk' }, pairedItem: { item: 0 } }]);
	});

	it('should update a risk successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateRisk')
			.mockReturnValueOnce('risk123')
			.mockReturnValueOnce('medium')
			.mockReturnValueOnce('in_progress')
			.mockReturnValueOnce('Implement security patches');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'risk123', status: 'in_progress' });

		const result = await executeRiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PUT',
			url: 'https://public-api.drata.com/risks/risk123',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json'
			},
			json: true,
			body: {
				severity: 'medium',
				status: 'in_progress',
				mitigation_plan: 'Implement security patches'
			}
		});
		expect(result).toEqual([{ json: { id: 'risk123', status: 'in_progress' }, pairedItem: { item: 0 } }]);
	});

	it('should delete a risk successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteRisk')
			.mockReturnValueOnce('risk123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

		const result = await executeRiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://public-api.drata.com/risks/risk123',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json'
			},
			json: true
		});
		expect(result).toEqual([{ json: { success: true }, pairedItem: { item: 0 } }]);
	});

	it('should handle API errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllRisks');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeRiskOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllRisks');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeRiskOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('Vendor Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://public-api.drata.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllVendors', () => {
		it('should get all vendors successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllVendors')
				.mockReturnValueOnce('high')
				.mockReturnValueOnce('active')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(50);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				vendors: [{ id: '1', name: 'Test Vendor' }],
			});

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://public-api.drata.com/vendors?risk_level=high&status=active&page=1&limit=50',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: { vendors: [{ id: '1', name: 'Test Vendor' }] }, pairedItem: { item: 0 } }]);
		});

		it('should handle getAllVendors error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllVendors');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('getVendor', () => {
		it('should get vendor successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getVendor')
				.mockReturnValueOnce('vendor123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'vendor123',
				name: 'Test Vendor',
			});

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://public-api.drata.com/vendors/vendor123',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: { id: 'vendor123', name: 'Test Vendor' }, pairedItem: { item: 0 } }]);
		});

		it('should handle getVendor error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getVendor');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Vendor not found'));

			await expect(executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Vendor not found');
		});
	});

	describe('createVendor', () => {
		it('should create vendor successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createVendor')
				.mockReturnValueOnce('New Vendor')
				.mockReturnValueOnce('A test vendor')
				.mockReturnValueOnce('contact@vendor.com')
				.mockReturnValueOnce('medium');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'vendor123',
				name: 'New Vendor',
			});

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://public-api.drata.com/vendors',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'New Vendor',
					description: 'A test vendor',
					contact_email: 'contact@vendor.com',
					risk_level: 'medium',
				},
				json: true,
			});
			expect(result).toEqual([{ json: { id: 'vendor123', name: 'New Vendor' }, pairedItem: { item: 0 } }]);
		});

		it('should handle createVendor error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createVendor');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Creation failed'));

			await expect(executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Creation failed');
		});
	});

	describe('updateVendor', () => {
		it('should update vendor successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateVendor')
				.mockReturnValueOnce('vendor123')
				.mockReturnValueOnce('Updated Vendor')
				.mockReturnValueOnce('high')
				.mockReturnValueOnce('active');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'vendor123',
				name: 'Updated Vendor',
			});

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://public-api.drata.com/vendors/vendor123',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Updated Vendor',
					risk_level: 'high',
					status: 'active',
				},
				json: true,
			});
			expect(result).toEqual([{ json: { id: 'vendor123', name: 'Updated Vendor' }, pairedItem: { item: 0 } }]);
		});

		it('should handle updateVendor error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('updateVendor');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Update failed'));

			await expect(executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Update failed');
		});
	});

	describe('getVendorAssessments', () => {
		it('should get vendor assessments successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getVendorAssessments')
				.mockReturnValueOnce('vendor123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				assessments: [{ id: '1', status: 'completed' }],
			});

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://public-api.drata.com/vendors/vendor123/assessments',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: { assessments: [{ id: '1', status: 'completed' }] }, pairedItem: { item: 0 } }]);
		});

		it('should handle getVendorAssessments error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getVendorAssessments');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Assessments not found'));

			await expect(executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Assessments not found');
		});
	});
});

describe('User Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://public-api.drata.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get all users successfully', async () => {
		const mockUsers = [
			{ id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
			{ id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
		];

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllUsers')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(50);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUsers);

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockUsers);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://public-api.drata.com/users',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			qs: { page: 1, limit: 50 },
			json: true,
		});
	});

	it('should get specific user successfully', async () => {
		const mockUser = { id: '123', name: 'John Doe', email: 'john@example.com', role: 'admin' };

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUser')
			.mockReturnValueOnce('123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUser);

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockUser);
	});

	it('should create user successfully', async () => {
		const mockCreatedUser = { id: '456', name: 'New User', email: 'new@example.com', role: 'user' };

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createUser')
			.mockReturnValueOnce('new@example.com')
			.mockReturnValueOnce('New User')
			.mockReturnValueOnce('user')
			.mockReturnValueOnce('Engineering');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCreatedUser);

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockCreatedUser);
	});

	it('should update user successfully', async () => {
		const mockUpdatedUser = { id: '123', name: 'Updated Name', role: 'admin', status: 'active' };

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateUser')
			.mockReturnValueOnce('123')
			.mockReturnValueOnce('Updated Name')
			.mockReturnValueOnce('admin')
			.mockReturnValueOnce('active');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdatedUser);

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockUpdatedUser);
	});

	it('should get user training successfully', async () => {
		const mockTraining = [
			{ id: '1', course: 'Security Training', completed: true, date: '2024-01-15' },
			{ id: '2', course: 'Compliance Training', completed: false, date: null },
		];

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUserTraining')
			.mockReturnValueOnce('123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTraining);

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockTraining);
	});

	it('should handle API errors gracefully when continueOnFail is true', async () => {
		const mockError = new Error('API Error');

		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllUsers');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'API Error' });
	});

	it('should throw error when continueOnFail is false', async () => {
		const mockError = new Error('API Error');

		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllUsers');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);

		await expect(executeUserOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});
});
