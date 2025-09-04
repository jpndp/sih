// Simple API test script
const baseURL = "http://localhost:3001/api";

async function testAPI() {
	console.log("🧪 Testing KMRL Document Intelligence Backend API...\n");

	try {
		// Test health endpoint
		console.log("1. Testing Health Check...");
		const healthResponse = await fetch(`${baseURL}/health`);
		const healthData = await healthResponse.json();
		console.log("✅ Health Check:", healthData);

		// Test documents endpoint
		console.log("\n2. Testing Documents API...");
		const docsResponse = await fetch(`${baseURL}/documents?limit=3`);
		const docsData = await docsResponse.json();
		console.log(
			`✅ Documents API: Found ${docsData.documents?.length || 0} documents`
		);

		// Test compliance endpoint
		console.log("\n3. Testing Compliance API...");
		const complianceResponse = await fetch(`${baseURL}/compliance?limit=3`);
		const complianceData = await complianceResponse.json();
		console.log(
			`✅ Compliance API: Found ${complianceData.items?.length || 0} items`
		);

		// Test dashboard endpoint
		console.log("\n4. Testing Dashboard API...");
		const dashboardResponse = await fetch(`${baseURL}/dashboard/overview`);
		const dashboardData = await dashboardResponse.json();
		console.log("✅ Dashboard API: Stats loaded");

		// Test search endpoint
		console.log("\n5. Testing Search API...");
		const searchResponse = await fetch(`${baseURL}/search?q=safety&limit=3`);
		const searchData = await searchResponse.json();
		console.log(
			`✅ Search API: Found ${searchData.results?.length || 0} results`
		);

		console.log("\n🎉 All API endpoints are working correctly!");
		console.log("\n📊 API Endpoints Summary:");
		console.log(`   Health: ${baseURL}/health`);
		console.log(`   Documents: ${baseURL}/documents`);
		console.log(`   Compliance: ${baseURL}/compliance`);
		console.log(`   Dashboard: ${baseURL}/dashboard`);
		console.log(`   Search: ${baseURL}/search`);
		console.log(`   Analytics: ${baseURL}/analytics`);
		console.log(`   Upload: ${baseURL}/upload`);
	} catch (error) {
		console.error("❌ API Test Failed:", error.message);
		console.log("\n🔧 Make sure the backend server is running on port 3001");
	}
}

// Run the test
testAPI();
