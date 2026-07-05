# AI Database Designer

A Next.js application that generates database schemas using Claude AI. Describe your app idea and get instant ERD diagrams, SQL schemas, Prisma schemas, and relationship documentation.

## Features

- **ERD Generation**: Create Entity Relationship Diagrams using Mermaid
- **SQL Schema Generation**: Get complete PostgreSQL CREATE TABLE statements
- **Prisma Schema Generation**: Generate Prisma ORM schema files
- **Relationship Visualization**: Get detailed documentation of database relationships
- **Export Functionality**: Download generated SQL schemas
- **Copy to Clipboard**: Quick copy of any generated schema

## Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com/))

## Installation

1. Navigate to the project directory:
```bash
cd database-designer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_api_key_here
```

## Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. Enter your app idea in the textarea (e.g., "A social media platform with users, posts, comments, and likes")
2. Click one of the generation buttons:
   - **Generate ERD**: Creates a visual Entity Relationship Diagram
   - **Generate SQL Schema**: Creates PostgreSQL CREATE TABLE statements
   - **Generate Prisma Schema**: Creates a Prisma schema.prisma file
   - **Show Relationships**: Displays detailed relationship documentation
3. View the generated schema in the output panel
4. For SQL schemas, click "Export SQL" to download as a file
5. Click "Copy to Clipboard" to copy any schema code

## Project Structure

```
database-designer/
├── app/
│   ├── api/
│   │   └── generate-schema/
│   │       └── route.ts          # Claude API integration endpoint
│   ├── page.tsx                  # Main page component
│   └── layout.tsx                # Root layout
├── components/
│   └── CodeDisplay.tsx           # Code display and visualization component
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables (add API key here)
└── package.json
```

## API Endpoint

### POST `/api/generate-schema`

Generates database schema based on app idea and schema type.

**Request Body:**
```json
{
  "appIdea": "A social media platform with users, posts, and comments",
  "schemaType": "sql" | "erd" | "prisma" | "relationships"
}
```

**Response:**
```json
{
  "content": "... generated schema content ...",
  "schemaType": "sql"
}
```

## Schema Types

- **erd**: Entity Relationship Diagram in Mermaid syntax
- **sql**: PostgreSQL CREATE TABLE statements
- **prisma**: Prisma schema.prisma file
- **relationships**: Plain English description of database relationships

## Technologies Used

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Anthropic SDK**: Claude API integration
- **Mermaid**: ERD visualization

## Development

To make changes to the application:

1. Edit components in `components/` directory
2. Modify API logic in `app/api/` directory
3. Update styles in component files
4. Test changes with `npm run dev`

## Building for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### API Key not found
- Ensure `.env.local` exists and contains `ANTHROPIC_API_KEY=your_actual_key`
- Restart the development server after changing `.env.local`

### Generation fails
- Check that your API key is valid
- Ensure your account has sufficient credits
- Try with a simpler app idea first

### ERD not displaying
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

## License

MIT
