# Technical Documentation

## Purpose
This directory contains the essential technical documentation for the Domos Underwriter Engine - a system for LIHTC preservation investment analysis with full-spectrum underwriting, transparent decision-making, and edge-case adaptability.

## Core Documents

### System Architecture & Implementation
- [System Architecture & Pipeline](./SYSTEM_ARCHITECTURE.md) - Design overview, component structure, and pipeline flow
- [Workflow & Process Flow](./WORKFLOW.md) - Operational workflow and tool interactions

### API & Usage
- [API Documentation](./API_DOCUMENTATION.md) - Integration endpoints and interfaces
- [Usage Guide](./USAGE.md) - Command-line tools and practical usage

### Development
- [Roadmap](./ROADMAP.md) - Development plan in crawl-walk-run progression
- [Template](./TEMPLATE.md) - Standard format for documentation

## Using This Documentation

### For Integrators
Start with:
1. **[System Architecture & Pipeline](./SYSTEM_ARCHITECTURE.md)** for the overall system design
2. **[Workflow & Process Flow](./WORKFLOW.md)** to understand the operational process
3. **[Usage Guide](./USAGE.md)** for practical command-line instructions
4. **[API Documentation](./API_DOCUMENTATION.md)** for integration endpoints
5. **[System Architecture & Pipeline](./SYSTEM_ARCHITECTURE.md)** for data structures

### For Planning
Refer to:
1. **[Roadmap](./ROADMAP.md)** for development milestones and priorities

## Document Format
Each document includes:
- Clear purpose statement at the beginning
- Structured content with descriptive headings
- Code examples where applicable
- Standard metadata section at the end

## Document Maintenance

### When Updating Documents
1. Keep content focused on essential information
2. Verify accuracy against the actual implementation
3. Update the metadata section with current date and version
4. Use the template for any new documents

### Using the Metadata Updater
To update document metadata:
```
node update-metadata.js <file-path> --version X.Y --owner "Team Name"
```

For batch updates of all documents:
```
node update-metadata.js --batch --version X.Y
```

---

**Document Metadata**  
**Last Updated**: July 4, 2025  
**Document Version**: 1.0  
**Owner**: Engineering Team  
**Status**: Active
