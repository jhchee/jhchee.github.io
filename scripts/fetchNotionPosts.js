const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

// Load environment variables from .env file if it exists
try {
  require("dotenv").config();
} catch (e) {
  // dotenv is optional
}

// Validate environment variables
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

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID =
  process.env.NOTION_DATABASE_ID || "472c5d14-117e-43bf-807e-c69e69bab9f8";

// Helper functions
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        cleanDirectory(filePath);
        fs.rmdirSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getTitle(properties) {
  return properties.title.title[0]?.plain_text || "";
}

function getTags(properties) {
  return properties.tags.multi_select
    .map((tag) => tag.name)
    .filter((name) => name !== "");
}

function getPublishedDate(properties) {
  return properties["published date"]?.date?.start || "";
}

function getSection(properties) {
  return properties.section?.select?.name || "";
}

function getGeneratedId(properties) {
  return properties.id?.formula?.string || "";
}

function getFrontMatter(title, section, generatedId, publishedDate, tags) {
  let frontMatter = "---\n";
  frontMatter += `title: "${title}"\n`;
  frontMatter += `section: "${section}"\n`;
  frontMatter += `id: "${generatedId}"\n`;
  frontMatter += `date: "${publishedDate}"\n`;
  frontMatter += "tags:\n";
  tags.forEach((tag) => {
    frontMatter += `- ${tag}\n`;
  });
  frontMatter += "---\n\n";
  return frontMatter;
}

// Notion block to markdown converters
function convertRichText(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return "";

  return richTextArray
    .map((text) => {
      let content = text.plain_text;

      if (text.annotations.bold) content = `**${content}**`;
      if (text.annotations.italic) content = `*${content}*`;
      if (text.annotations.strikethrough) content = `~~${content}~~`;
      if (text.annotations.code) content = `\`${content}\``;
      if (text.href) content = `[${content}](${text.href})`;

      return content;
    })
    .join("");
}

async function downloadFile(url, filePath) {
  const https = require("https");
  const http = require("http");

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(filePath);

    protocol
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlinkSync(filePath);
        reject(err);
      });
  });
}

async function convertBlockToMarkdown(block, depth = 0, imageDir = "") {
  const indent = "  ".repeat(depth);
  let markdown = "";

  switch (block.type) {
    case "paragraph":
      const paragraphText = convertRichText(block.paragraph.rich_text);
      markdown = paragraphText ? `${indent}${paragraphText}\n\n` : "\n";
      break;

    case "heading_1":
      markdown = `${indent}# ${convertRichText(block.heading_1.rich_text)}\n\n`;
      break;

    case "heading_2":
      markdown = `${indent}## ${convertRichText(
        block.heading_2.rich_text
      )}\n\n`;
      break;

    case "heading_3":
      markdown = `${indent}### ${convertRichText(
        block.heading_3.rich_text
      )}\n\n`;
      break;

    case "bulleted_list_item":
      markdown = `${indent}- ${convertRichText(
        block.bulleted_list_item.rich_text
      )}\n`;
      break;

    case "numbered_list_item":
      markdown = `${indent}1. ${convertRichText(
        block.numbered_list_item.rich_text
      )}\n`;
      break;

    case "to_do":
      const checked = block.to_do.checked ? "x" : " ";
      markdown = `${indent}- [${checked}] ${convertRichText(
        block.to_do.rich_text
      )}\n`;
      break;

    case "toggle":
      markdown = `${indent}<details>\n${indent}<summary>${convertRichText(
        block.toggle.rich_text
      )}</summary>\n\n`;
      break;

    case "code":
      const language = block.code.language || "";
      const code = convertRichText(block.code.rich_text);
      markdown = `${indent}\`\`\`${language}\n${code}\n${indent}\`\`\`\n\n`;
      break;

    case "quote":
      markdown = `${indent}> ${convertRichText(block.quote.rich_text)}\n\n`;
      break;

    case "callout":
      const calloutText = convertRichText(block.callout.rich_text);
      markdown = `${indent}> 💡 ${calloutText}\n\n`;
      break;

    case "divider":
      markdown = `${indent}---\n\n`;
      break;

    case "image":
      const imageUrl =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      const caption = block.image.caption
        ? convertRichText(block.image.caption)
        : "";

      if (imageDir && block.image.type === "file") {
        try {
          const imageFileName = `image-${block.id}.${
            imageUrl.split(".").pop().split("?")[0]
          }`;
          const imageFilePath = path.join(imageDir, imageFileName);
          await downloadFile(imageUrl, imageFilePath);
          markdown = `${indent}![${caption}](/files/${imageFileName})\n\n`;
        } catch (error) {
          console.error(`Error downloading image: ${error.message}`);
          markdown = `${indent}![${caption}](${imageUrl})\n\n`;
        }
      } else {
        markdown = `${indent}![${caption}](${imageUrl})\n\n`;
      }
      break;

    case "bookmark":
      markdown = `${indent}[${block.bookmark.url}](${block.bookmark.url})\n\n`;
      break;

    case "table":
      // Table handling is done through children
      break;

    case "table_row":
      const cells = block.table_row.cells
        .map((cell) => convertRichText(cell))
        .join(" | ");
      markdown = `| ${cells} |\n`;
      break;

    default:
      markdown = `${indent}[${block.type} block not supported]\n\n`;
  }

  // Handle children
  if (block.has_children) {
    try {
      const children = await notion.blocks.children.list({
        block_id: block.id,
      });

      if (block.type === "table") {
        // Special handling for tables
        for (let i = 0; i < children.results.length; i++) {
          const row = children.results[i];
          const cells = row.table_row.cells
            .map((cell) => convertRichText(cell))
            .join(" | ");
          markdown += `| ${cells} |\n`;

          // Add header separator after first row
          if (i === 0) {
            const separator = row.table_row.cells.map(() => "---").join(" | ");
            markdown += `| ${separator} |\n`;
          }
        }
        markdown += "\n";
      } else {
        for (const child of children.results) {
          markdown += await convertBlockToMarkdown(child, depth + 1, imageDir);
        }

        if (block.type === "toggle") {
          markdown += `${indent}</details>\n\n`;
        }
      }
    } catch (error) {
      console.error(
        `Error fetching children for block ${block.id}:`,
        error.message
      );
    }
  }

  return markdown;
}

async function convertPageToMarkdown(pageId, imageDir) {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    let markdown = "";
    for (const block of blocks.results) {
      markdown += await convertBlockToMarkdown(block, 0, imageDir);
    }

    return markdown;
  } catch (error) {
    console.error(
      `Error converting page ${pageId} to markdown:`,
      error.message
    );
    throw error;
  }
}

async function fetchAndExportPosts() {
  const startTime = Date.now();

  try {
    // Query database
    console.log("Fetching posts from Notion...");
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: "public",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    const posts = response.results;
    console.log(`Found ${posts.length} posts to export`);

    // Setup directories
    const contentDir = path.join(__dirname, "..", "content");
    const imageDir = path.join(__dirname, "..", "public", "files");
    const dataDir = path.join(__dirname, "..", "data");

    cleanDirectory(contentDir);
    cleanDirectory(imageDir);
    ensureDirectoryExists(contentDir);
    ensureDirectoryExists(imageDir);
    ensureDirectoryExists(dataDir);

    const searchMetadataList = [];

    // Process each post
    for (const post of posts) {
      const properties = post.properties;

      const title = getTitle(properties);
      const tags = getTags(properties);
      const publishedDate = getPublishedDate(properties);
      const section = getSection(properties);
      const generatedId = getGeneratedId(properties);

      console.log(`-> Exporting post: ${title}`);

      // Add to search metadata
      searchMetadataList.push({
        title,
        slug: slugify(title, { lower: true, strict: true }),
        date: publishedDate,
        tags,
        section,
        id: generatedId,
      });

      // Convert page to markdown
      const markdown = await convertPageToMarkdown(post.id, imageDir);

      // Create front matter
      const frontMatter = getFrontMatter(
        title,
        section,
        generatedId,
        publishedDate,
        tags
      );

      // Write markdown file
      const fileName = slugify(title, { lower: true, strict: true });
      const filePath = path.join(contentDir, `${fileName}.md`);
      fs.writeFileSync(filePath, frontMatter + markdown, "utf-8");
    }

    // Write search metadata
    const searchMetadataPath = path.join(dataDir, "search.json");
    fs.writeFileSync(
      searchMetadataPath,
      JSON.stringify(searchMetadataList, null, 2),
      "utf-8"
    );

    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`-> Done exporting posts in ${executionTime}s`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Run the script
fetchAndExportPosts();
