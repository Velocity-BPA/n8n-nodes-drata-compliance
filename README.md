# n8n-nodes-drata-compliance

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node that integrates with Drata's compliance automation platform. This node provides access to 7 key resources including controls, frameworks, evidence, assets, risks, vendors, and users, enabling automated compliance workflows and governance processes.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Compliance](https://img.shields.io/badge/compliance-automation-green)
![GRC](https://img.shields.io/badge/GRC-governance-orange)
![SOC2](https://img.shields.io/badge/SOC2-ready-purple)

## Features

- **Control Management** - Create, update, and monitor compliance controls across frameworks
- **Framework Integration** - Manage SOC 2, GDPR, HIPAA, and other compliance frameworks
- **Evidence Collection** - Automate evidence gathering and documentation processes
- **Asset Tracking** - Monitor and manage IT assets for compliance purposes
- **Risk Assessment** - Track and evaluate organizational risks and mitigation strategies
- **Vendor Management** - Oversee third-party vendor compliance and security assessments
- **User Administration** - Manage user access and permissions within Drata
- **Automated Workflows** - Streamline compliance processes with n8n's automation capabilities

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-drata-compliance`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-drata-compliance
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-drata-compliance.git
cd n8n-nodes-drata-compliance
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-drata-compliance
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Drata API key from the Drata dashboard | Yes |
| Base URL | Drata API base URL (usually provided by Drata) | Yes |

## Resources & Operations

### 1. Control

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific compliance control by ID |
| Get All | List all compliance controls with filtering options |
| Create | Create a new compliance control |
| Update | Update an existing compliance control |
| Delete | Remove a compliance control |

### 2. Framework

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific compliance framework by ID |
| Get All | List all available compliance frameworks |
| Create | Create a custom compliance framework |
| Update | Update framework configuration and settings |
| Delete | Remove a compliance framework |

### 3. Evidence

| Operation | Description |
|-----------|-------------|
| Get | Retrieve specific evidence documentation |
| Get All | List all evidence items with search and filtering |
| Create | Upload and create new evidence records |
| Update | Update evidence metadata and documentation |
| Delete | Remove evidence items |

### 4. Asset

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific IT asset by ID |
| Get All | List all tracked assets with filtering capabilities |
| Create | Add new assets to the compliance inventory |
| Update | Update asset information and compliance status |
| Delete | Remove assets from tracking |

### 5. Risk

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific risk assessment by ID |
| Get All | List all identified risks with severity filtering |
| Create | Document new organizational risks |
| Update | Update risk assessments and mitigation plans |
| Delete | Remove risk entries |

### 6. Vendor

| Operation | Description |
|-----------|-------------|
| Get | Retrieve specific vendor compliance information |
| Get All | List all vendors with compliance status |
| Create | Add new vendors to compliance tracking |
| Update | Update vendor assessments and certifications |
| Delete | Remove vendors from compliance oversight |

### 7. User

| Operation | Description |
|-----------|-------------|
| Get | Retrieve user account and permission details |
| Get All | List all users with role and access information |
| Create | Create new user accounts in Drata |
| Update | Update user permissions and profile information |
| Delete | Remove user access and accounts |

## Usage Examples

```javascript
// Get all SOC 2 controls for review
{
  "resource": "Control",
  "operation": "Get All",
  "framework": "SOC 2",
  "status": "active"
}
```

```javascript
// Create evidence for a security control
{
  "resource": "Evidence",
  "operation": "Create",
  "controlId": "ctrl_123456",
  "title": "Firewall Configuration Review",
  "description": "Monthly firewall rule review and documentation",
  "evidenceType": "screenshot",
  "file": "firewall_config_2024.png"
}
```

```javascript
// Update risk assessment status
{
  "resource": "Risk",
  "operation": "Update",
  "riskId": "risk_789012",
  "severity": "medium",
  "status": "mitigated",
  "mitigationPlan": "Implemented additional access controls and monitoring"
}
```

```javascript
// Add new vendor for compliance tracking
{
  "resource": "Vendor",
  "operation": "Create",
  "vendorName": "CloudSecure Inc",
  "category": "Cloud Infrastructure",
  "riskLevel": "medium",
  "certifications": ["SOC 2 Type II", "ISO 27001"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in credentials configuration |
| 403 Forbidden | Insufficient permissions for operation | Check user permissions in Drata dashboard |
| 404 Not Found | Resource ID does not exist | Verify the resource ID exists and is accessible |
| 429 Rate Limited | Too many API requests | Implement delays between requests or reduce frequency |
| 422 Validation Error | Invalid data format or required fields missing | Review API documentation for required fields |
| 500 Internal Server Error | Drata service temporarily unavailable | Retry the operation after a brief delay |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-drata-compliance/issues)
- **Drata API Documentation**: [Drata Developer Portal](https://developer.drata.com)
- **Compliance Resources**: [Drata Knowledge Base](https://help.drata.com)