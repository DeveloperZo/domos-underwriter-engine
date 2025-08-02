# Domos Underwriter Engine - Usage Guide

## Processing Deals

The Domos Underwriter Engine provides a command-line interface for processing real estate deals, particularly for LIHTC (Low-Income Housing Tax Credit) preservation properties.

### Basic Usage

The main command for processing deals is:

```bash
npm run process-deal <input-folder-name> [output-folder-name]
```

### Parameters

- `input-folder-name` (required): The name of the folder in `sample-deals` that contains the DueDiligence documents for the deal you want to process.
- `output-folder-name` (optional): A custom name for the output folder in `processed-deals`. If not provided, the input folder name will be used.

### Examples

1. Process a deal using the same name for input and output:
   ```bash
   npm run process-deal "DueDiligence"
   ```
   This will process the deal from `sample-deals/DueDiligence` and save the results to `processed-deals/DueDiligence-[timestamp]`.

2. Process a deal with a custom output name:
   ```bash
   npm run process-deal "DueDiligence" "testMe"
   ```
   This will process the deal from `sample-deals/DueDiligence` and save the results to `processed-deals/testMe-[timestamp]`.

### Output

For each processed deal, the system creates:

1. **deal.json** - Structured data about the property
2. **tenants.json** - Information about current tenants and occupancy
3. **financialSummary.json** - Financial metrics and projections
4. **AnalysisJourney.md** - Detailed processing log and analysis summary

These files are saved in a timestamped directory within the `processed-deals` folder to ensure that each processing run is preserved.

## Advanced Usage

### Running the Demo Stages

After processing a deal, you can run the demo stages to see the analysis pipeline in action:

```bash
npm run demo-stages
```

### Checking Processing Status

To check the status of all processed deals:

```bash
npm run status
```

### More Help

For more information and examples, run:

```bash
npm run help
```

## Troubleshooting

If you encounter any issues:

1. Make sure the input folder exists in the `sample-deals` directory
2. Check that you have the necessary permissions to create directories in `processed-deals`
3. Verify that the deal documents are in the expected format

For more detailed error messages, check the console output during processing.
