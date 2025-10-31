require("dotenv").config();

if (!process.env.NOTION_TOKEN) {
  console.error("❌ Error: NOTION_TOKEN environment variable is not set!");
  console.log("\nTo set it up:");
  console.log(
    "1. Create a Notion integration at https://www.notion.so/my-integrations"
  );
  console.log("2. Copy the integration token");
  console.log("3. Set the environment variable:");
  console.log("   export NOTION_TOKEN=your_token_here");
  console.log("\nOr create a .env file with:");
  console.log("   NOTION_TOKEN=your_token_here");
  process.exit(1);
}

console.log("✅ NOTION_TOKEN is set");
console.log("✅ Ready to fetch posts from Notion!");
console.log("\nRun: npm run fetch-posts");
