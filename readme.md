# Personal Website & Blog

A Next.js-based personal website with Notion integration for content management.

## Features

- 📝 Content managed in Notion
- 🔄 Automatic export to Markdown
- 🎨 Modern design with Tailwind CSS
- 🔍 Full-text search functionality
- 🏷️ Tag-based organization
- 💬 Disqus comments integration
- 📱 Responsive design

## Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Notion Integration

Run the interactive setup:

```bash
npm run setup-notion
```

Or manually create a `.env` file:

```bash
cp .env.example .env
# Edit .env and add your NOTION_TOKEN
```

See [NOTION_INTEGRATION.md](./NOTION_INTEGRATION.md) for detailed setup instructions.

### 3. Fetch Content from Notion

```bash
npm run fetch-posts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your site.

## Project Structure

```
├── scripts/              # Notion integration scripts
│   ├── fetchNotionPosts.js   # Main export script (JavaScript)
│   ├── fetchNotionPosts.ts   # TypeScript version
│   ├── setup.js              # Interactive setup
│   └── checkEnv.js           # Environment checker
├── content/              # Exported markdown files
├── public/
│   └── files/           # Downloaded images
├── data/
│   └── search.json      # Search index
├── pages/               # Next.js pages
├── components/          # React components
└── lib/                 # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run fetch-posts` - Fetch and export posts from Notion
- `npm run setup-notion` - Interactive Notion setup
- `npm run check-env` - Validate environment variables

## Content Management

### Notion Database Schema

Your Notion database should include:

| Property       | Type         | Description                     |
| -------------- | ------------ | ------------------------------- |
| title          | Title        | Post title                      |
| public         | Checkbox     | Publish status                  |
| tags           | Multi-select | Post tags                       |
| published date | Date         | Publication date                |
| section        | Select       | Content section (Blog/Projects) |
| id             | Formula      | Generated unique ID             |

### Workflow

1. Write content in Notion
2. Check the "public" checkbox when ready
3. Run `npm run fetch-posts`
4. Content is exported to `/content` as markdown
5. Images are downloaded to `/public/files`
6. Site automatically picks up new content

## Supported Notion Blocks

- Text formatting (bold, italic, code, links)
- Headings (H1, H2, H3)
- Lists (bulleted, numbered, to-do)
- Code blocks with syntax highlighting
- Images (automatically downloaded)
- Tables
- Quotes & Callouts
- Dividers
- Bookmarks

## Technologies

- **Framework**: Next.js 12
- **Styling**: Tailwind CSS
- **Content**: Notion API → Markdown
- **Comments**: Disqus
- **Search**: Custom JSON index
- **Deployment**: Vercel (recommended)

## Migration from Python

This project previously used a Python-based Notion exporter. The JavaScript version offers:

- ✅ No Python dependency
- ✅ Official Notion SDK
- ✅ Better Next.js integration
- ✅ TypeScript support
- ✅ Easier deployment

The Python code is still available in `/bin` for reference.

## Environment Variables

Create a `.env` file:

```bash
# Required
NOTION_TOKEN=your_notion_integration_token

# Optional (has default)
NOTION_DATABASE_ID=your_database_id
```

Never commit `.env` - it's in `.gitignore`.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add `NOTION_TOKEN` to environment variables
4. Deploy!

Optional: Set up a cron job to run `fetch-posts` periodically.

### Other Platforms

1. Build: `npm run build`
2. Start: `npm run start`
3. Set environment variables
4. Schedule `npm run fetch-posts` as needed

## Documentation

- [Notion Integration Guide](./NOTION_INTEGRATION.md) - Detailed setup and usage
- [Scripts README](./scripts/README.md) - Technical details about export scripts

## Troubleshooting

See [NOTION_INTEGRATION.md](./NOTION_INTEGRATION.md#troubleshooting) for common issues and solutions.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
