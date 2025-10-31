# Notion to Markdown Exporter

This directory contains scripts to fetch posts from Notion and export them to markdown format for the website.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your Notion integration token:

   - Create a new integration at https://www.notion.so/my-integrations
   - Copy the integration token
   - Add it to your environment variables:

   ```bash
   export NOTION_TOKEN=your_token_here
   ```

   - Or create a `.env` file in the root directory

3. Share your Notion database with the integration

## Usage

### Using JavaScript (recommended for production):

```bash
npm run fetch-posts
```

Or directly:

```bash
node scripts/fetchNotionPosts.js
```

### Using TypeScript (requires ts-node):

```bash
npx ts-node scripts/fetchNotionPosts.ts
```

## What it does

1. Fetches all posts from the Notion database where `public` is checked
2. Converts Notion blocks to markdown format
3. Downloads images and saves them to `/public/files`
4. Generates front matter with metadata (title, section, id, date, tags)
5. Saves markdown files to `/content` directory
6. Creates a search metadata JSON file in `/data/search.json`

## Supported Notion Blocks

- Paragraphs
- Headings (H1, H2, H3)
- Bulleted lists
- Numbered lists
- To-do lists
- Toggle blocks
- Code blocks
- Quotes
- Callouts
- Dividers
- Images (with download support)
- Bookmarks
- Tables

## Comparison with Python version

This JavaScript/TypeScript implementation replaces the Python-based solution (`bin/get_posts.py`) with the following benefits:

- **Native integration**: Uses the official Notion JavaScript SDK
- **Better Next.js integration**: Written in JavaScript/TypeScript like the rest of the project
- **No Python dependency**: Eliminates the need for a Python environment
- **Type safety**: TypeScript version provides better IDE support and type checking
- **Easier deployment**: Can be run in Node.js environments without Python setup

## Migration from Python

If you were previously using the Python script (`bin/get_posts.py`), you can safely switch to this JavaScript version:

1. Ensure you have the same `NOTION_TOKEN` environment variable
2. The output format is identical (markdown files with front matter)
3. The directory structure is the same
4. Run `npm run fetch-posts` instead of `python bin/get_posts.py`

## Troubleshooting

### "Cannot find module '@notionhq/client'"

Run `npm install` to install dependencies.

### "NOTION_TOKEN is not defined"

Make sure you've set the `NOTION_TOKEN` environment variable.

### Images not downloading

Check that you have write permissions to `/public/files` directory.

## Future Enhancements

- Add support for more Notion block types (e.g., embed, file, video)
- Implement incremental updates (only fetch changed posts)
- Add progress indicators
- Support for custom database filters
