# Database Schema

## Overview
This document describes the database schema used by the Domos Underwriter Engine for storing deal data, analysis results, and system metadata.

## Core Tables

### Deals
Primary table for deal information and tracking.

```sql
CREATE TABLE deals (
    deal_id UUID PRIMARY KEY,
    property_name VARCHAR(255) NOT NULL,
    deal_date DATE NOT NULL,
    current_stage INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'InProgress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    assigned_analyst VARCHAR(100)
);
```

### Deal_Stages
Tracks progress through the 9-stage process.

```sql
CREATE TABLE deal_stages (
    stage_id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deals(deal_id),
    stage_number INTEGER NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    start_date TIMESTAMP,
    completion_date TIMESTAMP,
    assigned_to VARCHAR(100),
    quality_gate_passed BOOLEAN DEFAULT FALSE
);
```

### Financial_Data
Core financial information for deals.

```sql
CREATE TABLE financial_data (
    financial_id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deals(deal_id),
    total_units INTEGER,
    acquisition_cost DECIMAL(15,2),
    renovation_cost DECIMAL(15,2),
    annual_noi DECIMAL(15,2),
    cap_rate DECIMAL(5,4),
    debt_amount DECIMAL(15,2),
    equity_amount DECIMAL(15,2),
    ltv_ratio DECIMAL(5,4),
    dscr DECIMAL(5,4)
);
```

### Compliance_Data
LIHTC and regulatory compliance information.

```sql
CREATE TABLE compliance_data (
    compliance_id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deals(deal_id),
    lihtc_eligible BOOLEAN,
    ami_percentage INTEGER,
    affordability_period INTEGER,
    qualified_basis DECIMAL(15,2),
    applicable_fraction DECIMAL(5,4),
    credit_amount DECIMAL(15,2),
    compliance_status VARCHAR(50)
);
```

### Risk_Assessments
Risk analysis and scoring data.

```sql
CREATE TABLE risk_assessments (
    risk_id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deals(deal_id),
    market_risk_score INTEGER,
    financial_risk_score INTEGER,
    operational_risk_score INTEGER,
    regulatory_risk_score INTEGER,
    overall_risk_score INTEGER,
    risk_rating VARCHAR(20),
    mitigation_strategies TEXT
);
```

### Decision_Audit
Transparency and decision tracking.

```sql
CREATE TABLE decision_audit (
    audit_id UUID PRIMARY KEY,
    deal_id UUID REFERENCES deals(deal_id),
    stage_number INTEGER,
    decision_point VARCHAR(255),
    decision_maker VARCHAR(100),
    decision_rationale TEXT,
    supporting_data JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes
Strategic indexes for performance optimization:

```sql
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_current_stage ON deals(current_stage);
CREATE INDEX idx_deal_stages_deal_id ON deal_stages(deal_id);
CREATE INDEX idx_decision_audit_deal_id ON decision_audit(deal_id);
```

## Views
Commonly used views for reporting and analysis:

```sql
CREATE VIEW deal_summary AS
SELECT 
    d.deal_id,
    d.property_name,
    d.current_stage,
    d.status,
    f.total_units,
    f.acquisition_cost,
    r.overall_risk_score
FROM deals d
LEFT JOIN financial_data f ON d.deal_id = f.deal_id
LEFT JOIN risk_assessments r ON d.deal_id = r.deal_id;
```

## Data Retention
- Active deals: Indefinite retention
- Archived deals: 7-year retention policy
- Audit logs: 10-year retention for compliance
