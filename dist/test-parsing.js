import { DealManager } from './deal-manager.js';
async function testDealProcessing() {
    console.log('Testing deal processing...');
    const dealManager = new DealManager();
    const sampleDealPath = process.cwd() + '/sample-deals';
    try {
        const result = await dealManager.processDealFromFolder(sampleDealPath);
        console.log('Success! Deal processed:', result.dealId);
        return true;
    }
    catch (error) {
        console.error('Test failed:', error);
        return false;
    }
}
testDealProcessing();
//# sourceMappingURL=test-parsing.js.map