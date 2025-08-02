# API Documentation

## Overview
This document describes the APIs available within the Domos Underwriter Engine for integration and automation purposes.

## Core APIs

### Deal Management API

#### Create New Deal
```
POST /api/deals
```
Creates a new deal in the system and initializes the stage workflow.

**Request Body:**
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

## Authentication
All API endpoints require authentication using JWT tokens.

## Rate Limiting
API calls are rate limited to ensure system performance.

## Error Handling
Standardized error responses with appropriate HTTP status codes.

## Webhooks
Available webhook endpoints for system integration and notifications.
