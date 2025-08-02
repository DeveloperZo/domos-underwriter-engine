# API Documentation

## Purpose
This document describes the core APIs of the Domos Underwriter Engine for integration with other systems, providing programmatic access to deal creation, analysis, and reporting functions.

## API Endpoints

### Deal Management API

#### Create New Deal
```
POST /api/deals
```
Creates a new deal in the system and initializes the stage workflow.

**Request:**
```json
{
  "property_name": "string",
  "deal_date": "YYYY-MM-DD",
  "initial_data": {
    "property_type": "string",
    "units": "integer",
    "location": "string"
  }
}
```

**Response:**
```json
{
  "deal_id": "string",
  "status": "created",
  "stage": 1,
  "created_at": "timestamp"
}
```

#### Get Deal Status
```
GET /api/deals/{deal_id}/status
```
Retrieves current status and stage information for a deal.

#### Update Deal Stage
```
PUT /api/deals/{deal_id}/stage
```
Advances a deal to the next stage or updates current stage data.

### Analysis API

#### Run Financial Model
```
POST /api/analysis/financial
```
Executes financial underwriting models for a specific deal.

#### Generate Compliance Report
```
POST /api/analysis/compliance
```
Runs compliance checks and generates compliance reports.

#### Risk Assessment
```
POST /api/analysis/risk
```
Performs risk analysis and generates risk matrices.

### Transparency API

#### Get Decision Trace
```
GET /api/transparency/decisions/{deal_id}
```
Retrieves the complete decision audit trail for a deal.

#### Generate Explanation
```
POST /api/transparency/explain
```
Generates explanations for specific decisions or recommendations.

### Reporting API

#### Generate IC Deck
```
POST /api/reports/ic-deck
```
Creates Investment Committee presentation materials.

#### Export Deal Summary
```
GET /api/reports/summary/{deal_id}
```
Exports comprehensive deal summary reports.

## Implementation Notes
- All endpoints return standard HTTP status codes
- Responses use consistent JSON structure
- Authentication required for all endpoints
- Rate limiting applies (300 requests per minute per client)

## Integration Examples

### Create Deal and Run Analysis
```javascript
// Step 1: Create a new deal
const dealResponse = await fetch('/api/deals', {
  method: 'POST',
  body: JSON.stringify({
    property_name: "The Franklin",
    deal_date: "2025-07-01",
    initial_data: {
      property_type: "multifamily",
      units: 120,
      location: "Chicago, IL"
    }
  })
});

const { deal_id } = await dealResponse.json();

// Step 2: Run financial analysis
const analysisResponse = await fetch('/api/analysis/financial', {
  method: 'POST',
  body: JSON.stringify({
    deal_id,
    assumptions: {
      cap_rate: 5.2,
      vacancy: 3.5
    }
  })
});
```

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: zAITK (Zo AI Tool Kit) 
**Status**: Active  
**Related Issues**: #143, #189
