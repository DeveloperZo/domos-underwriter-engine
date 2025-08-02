#!/usr/bin/env node
import DomosMCPServer from './mcp-server.js';
/**
 * Simple test to verify MCP server basic functionality
 */
async function testMCPBasics() {
    console.log('🧪 Testing Domos MCP Server...\n');
    const server = new DomosMCPServer();
    // Test 1: Check tools are available
    console.log('📋 Test 1: List Available Tools');
    const tools = server.getTools();
    console.log(`Found ${tools.length} tools:`);
    tools.forEach(tool => {
        console.log(`  ✅ ${tool.name}: ${tool.description}`);
    });
    // Test 2: Check tool call handling for invalid tool
    console.log('\n❌ Test 2: Invalid Tool Call');
    const invalidResult = await server.handleToolCall('invalidTool', {});
    console.log(`Response: ${invalidResult.content[0].text.substring(0, 50)}...`);
    // Test 3: Check basic file system assumptions
    console.log('\n📁 Test 3: File System Checks');
    const fs = await import('fs/promises');
    try {
        await fs.access('./sample-deals');
        console.log('  ✅ sample-deals directory exists');
    }
    catch {
        console.log('  ⚠️ sample-deals directory not found');
    }
    try {
        await fs.access('./specs');
        console.log('  ✅ specs directory exists');
    }
    catch {
        console.log('  ⚠️ specs directory not found');
    }
    try {
        await fs.access('./specs/stage-1-initial-intake.md');
        console.log('  ✅ Initial intake spec found');
    }
    catch {
        console.log('  ⚠️ Initial intake spec not found');
    }
    console.log('\n✅ Basic MCP server test completed!');
    console.log('\n🚀 Next steps:');
    console.log('  • Run "npm run demo-mcp" for full workflow test');
    console.log('  • Use individual MCP tools via npm scripts');
    console.log('  • Integrate with Claude MCP for live interaction');
}
testMCPBasics().catch(console.error);
//# sourceMappingURL=test-mcp.js.map