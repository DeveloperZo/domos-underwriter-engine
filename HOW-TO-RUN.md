# How to Run the Process-Deal Command

There are several ways to run the process-deal command, depending on your environment and preferences.

## Option 1: Using the Batch File (Windows)

The most reliable way to pass arguments correctly is to use the batch file:



This will:
- Process the deal from `sample-deals/DueDiligence`
- Save the output to `processed-deals/testMe-[timestamp]`

## Option 2: Using Node Directly

You can use Node.js directly with the tsx compiler:

```bash
npx tsx src/process-deal.ts "DueDiligence" "testMe"
```

## Option 3: Using npm run

If you're using `npm run`, you need to separate your script arguments with a double dash:

```bash
npm run process-deal -- "DueDiligence" "testMe"
```

The double dash `--` tells npm that everything after it should be passed to the script, not interpreted as npm arguments.

## Option 4: Using the Debug Script

For testing purposes, you can use the debug script:

```bash
npm run debug-process
```

This script has hardcoded paths for testing and will process the DueDiligence folder.

## Checking the Output

After running any of these commands, check the `processed-deals` directory for the output. Each run creates a new folder with a timestamp, so you'll see something like:

```
processed-deals/
├── testMe-2023-01-01T12-34-56
│   ├── deal.json
│   ├── tenants.json
│   ├── financialSummary.json
│   └── AnalysisJourney.md
```

## Troubleshooting

If you don't see any output:

1. Check the console for error messages
2. Make sure the `processed-deals` directory exists (it will be created automatically)
3. Verify that the input folder path is correct
4. Try running with the debug script to get more detailed logging
