# Notion Integration Guide

## Overview

This project now supports fetching content from Notion using the official Notion JavaScript SDK. The integration allows you to:

- Fetch posts from a Notion database
- Convert Notion blocks to markdown
- Download and store images locally
- Generate front matter metadata
- Create search index data

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Give it a name (e.g., "Blog Exporter")
4. Select the workspace where your database is located
5. Copy the "Internal Integration Token"

### 3. Share Database with Integration

1. Open your Notion database
2. Click the "..." menu in the top right
3. Click "Add connections"
4. Find and select your integration

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your token:

```
NOTION_TOKEN=secret_your_token_here
```

### 5. Run the Exporter

```bash
npm run fetch-posts
```

This will:

- Fetch all posts where `public` checkbox is checked
- Export them to markdown in the `/content` directory
- Download images to `/public/files`
- Generate `/data/search.json` for search functionality

## Files Created

### JavaScript Implementation

- **`scripts/fetchNotionPosts.js`**: Main script using Notion JavaScript SDK
- **`scripts/fetchNotionPosts.ts`**: TypeScript version with type safety
- **`scripts/checkEnv.js`**: Environment validation script
- **`scripts/README.md`**: Detailed documentation

### Configuration

- **`.env.example`**: Template for environment variables
- **`package.json`**: Updated with new dependencies and scripts

## Database Schema

Your Notion database should have these properties:

| Property       | Type         | Required | Description        |
| -------------- | ------------ | -------- | ------------------ |
| title          | Title        | Yes      | Post title         |
| public         | Checkbox     | Yes      | Whether to publish |
| tags           | Multi-select | Yes      | Post tags          |
| published date | Date         | Yes      | Publication date   |
| section        | Select       | Yes      | Content section    |
| id             | Formula      | Yes      | Generated ID       |

## Supported Block Types

### Text Blocks

- Paragraph
- Heading 1, 2, 3
- Quote
- Callout

### List Blocks

- Bulleted list
- Numbered list
- To-do list
- Toggle

### Media Blocks

- Image (with download)
- Bookmark

### Other Blocks

- Code (with syntax highlighting)
- Divider
- Table

## Features

### Rich Text Formatting

The exporter preserves Notion's rich text formatting:

- **Bold** → `**bold**`
- _Italic_ → `*italic*`
- ~~Strikethrough~~ → `~~strikethrough~~`
- `Code` → `` `code` ``
- [Links](url) → `[text](url)`

### Image Handling

Images are automatically downloaded and saved locally:

```markdown
![Caption](/files/image-blockid.png)
```

### Front Matter

Each markdown file includes YAML front matter:

```yaml
---
title: "Post Title"
section: "Blog"
id: "generated-id"
date: "2025-10-31"
tags:
  - JavaScript
  - Notion
---
```

## Migration from Python

If you're migrating from the Python-based solution:

### Before (Python)

```bash
python bin/get_posts.py
```

### After (JavaScript)

```bash
npm run fetch-posts
```

### Benefits

1. **No Python dependency**: Runs in Node.js
2. **Better integration**: Uses official Notion SDK
3. **Type safety**: TypeScript support
4. **Easier deployment**: No virtual environment needed
5. **Faster execution**: Async/await with concurrent processing

### What's the Same

- Output format (markdown with front matter)
- Directory structure (`/content`, `/public/files`)
- Search metadata (`/data/search.json`)
- Front matter schema

## Troubleshooting

### "NOTION_TOKEN is not set"

**Solution**: Create a `.env` file with your Notion token:

```bash
echo "NOTION_TOKEN=your_token_here" > .env
```

### "Could not find database"

**Solution**:

1. Verify the database ID in `scripts/fetchNotionPosts.js`
2. Make sure you've shared the database with your integration

### Images not downloading

**Solution**:

1. Check write permissions on `/public/files`
2. Verify the image URLs are accessible
3. Check your internet connection

### Dependency conflicts

**Solution**: Use the `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
```

## Advanced Usage

### Custom Database ID

Set in `.env`:

```
NOTION_DATABASE_ID=your_database_id
```

Or pass as environment variable:

```bash
NOTION_DATABASE_ID=xyz npm run fetch-posts
```

### Running TypeScript Version

```bash
npx ts-node scripts/fetchNotionPosts.ts
```

### Programmatic Usage

```javascript
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Your custom logic here
```

## Development

### File Structure

```
scripts/
├── fetchNotionPosts.js    # Main JavaScript implementation
├── fetchNotionPosts.ts    # TypeScript version
├── checkEnv.js           # Environment checker
└── README.md             # Documentation
```

### Adding New Block Types

1. Add case to `convertBlockToMarkdown()` function
2. Implement converter logic
3. Test with sample Notion content

Example:

```javascript
case 'new_block_type':
  const content = convertRichText(block.new_block_type.rich_text);
  markdown = `Custom format: ${content}\n\n`;
  break;
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Fetch posts from Notion
  env:
    NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
  run: npm run fetch-posts
```

### Pre-build Hook

Add to `package.json`:

```json
"scripts": {
  "prebuild": "npm run fetch-posts",
  "build": "next build"
}
```

## Performance

- Fetches posts in parallel
- Downloads images concurrently
- Typical execution: 5-15 seconds for 10-20 posts
- Handles rate limiting automatically (via SDK)

## Security

- Never commit `.env` file (included in `.gitignore`)
- Keep integration token secret
- Use environment variables in production
- Limit integration permissions to required databases

## Support

For issues or questions:

1. Check the [Notion API documentation](https://developers.notion.com/)
2. Review `scripts/README.md`
3. Check existing GitHub issues
4. Create a new issue with reproduction steps

## License

Same as the main project.
