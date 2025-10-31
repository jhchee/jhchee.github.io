#!/usr/bin/env node

/**
 * Quick setup script for Notion integration
 * This helps users get started quickly
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🚀 Notion Integration Setup\n");

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setup() {
  const envPath = path.join(__dirname, "..", ".env");
  const envExamplePath = path.join(__dirname, "..", ".env.example");

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question(
      ".env file already exists. Overwrite? (y/N): "
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("Setup cancelled.");
      rl.close();
      return;
    }
  }

  console.log("\n📝 Let's set up your Notion integration:\n");
  console.log("1. Go to https://www.notion.so/my-integrations");
  console.log('2. Click "+ New integration"');
  console.log("3. Give it a name and select your workspace");
  console.log('4. Copy the "Internal Integration Token"\n');

  const token = await question("Enter your Notion Integration Token: ");

  if (!token || token.trim() === "") {
    console.log("\n❌ Token is required. Setup cancelled.");
    rl.close();
    return;
  }

  console.log("\n5. Open your Notion database");
  console.log('6. Click the "..." menu → "Add connections"');
  console.log("7. Select your integration\n");

  const useDifferentDb = await question("Use a different database ID? (y/N): ");
  let databaseId = "472c5d14-117e-43bf-807e-c69e69bab9f8";

  if (useDifferentDb.toLowerCase() === "y") {
    databaseId = await question("Enter your database ID: ");
  }

  // Create .env file
  let envContent = `# Notion Integration Token\nNOTION_TOKEN=${token.trim()}\n\n`;

  if (useDifferentDb.toLowerCase() === "y") {
    envContent += `# Notion Database ID\nNOTION_DATABASE_ID=${databaseId.trim()}\n`;
  }

  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ .env file created successfully!");
  console.log("\n📦 Next steps:");
  console.log("1. Run: npm install --legacy-peer-deps (if not already done)");
  console.log("2. Run: npm run fetch-posts");
  console.log("\n🎉 You're all set!\n");

  rl.close();
}

setup().catch((err) => {
  console.error("Error:", err);
  rl.close();
  process.exit(1);
});
