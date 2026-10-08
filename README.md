# Page Agent Demo

A reference implementation demonstrating **[page-agent](https://github.com/alibaba/page-agent)** integration with a React application. This showcase illustrates how page-agent's LLM-driven automation can navigate multi-step forms, understand page context, and assist users through complex workflows.

## What is Page Agent?

[page-agent](https://github.com/alibaba/page-agent) is an AI-powered browser automation library that uses LLM-driven decision making to:

- **Understand page context** through semantic analysis
- **Autonomously navigate** complex multi-step workflows
- **Interact with forms** using natural language instructions
- **Handle dynamic content** and edge cases intelligently

Unlike traditional automation tools that rely on brittle selectors, page-agent uses AI to interpret page structure and user intent.

## Implementation Overview

This demo showcases a complete page-agent integration with:

| Feature | Implementation |
|---------|----------------|
| **PageController** | Visual masking enabled for element highlighting |
| **Page-Specific Instructions** | Route-aware guidance via `getPageInstructions` |
| **System Prompt** | Comprehensive agent behavior guidelines |
| **Multi-Language Support** | Configured for `en-US` |
| **Floating UI** | React component for agent activation |
| **Route Awareness** | Dynamic instructions based on current path |

## Quick Start

```bash
# Clone and install
git clone https://github.com/khawjaahmad/page-agent-demo.git
cd page-agent-demo
npm install

# Configure LLM (required)
cp .env.example .env.local
# Edit .env with your LLM credentials

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

Open http://localhost:5173 and click the floating AI button to interact with the agent.

## LLM Configuration

Page Agent requires an OpenAI-compatible LLM endpoint. Configure via environment variables:

```bash
VITE_LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
VITE_LLM_API_KEY=your-api-key
VITE_LLM_MODEL=qwen3.5-plus
```

### Supported Providers

| Provider | Base URL |
|----------|-----------|
| Alibaba DashScope | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| OpenAI | `https://api.openai.com/v1` |
| Ollama (local) | `http://localhost:11434/v1` |
| LM Studio (local) | `http://localhost:1234/v1` |

## Integration Details

### 1. Initialization

```typescript
import { PageAgent } from 'page-agent';

const agent = new PageAgent({
  baseURL: config.llm.baseURL,
  apiKey: config.llm.apiKey,
  model: config.llm.model,
  language: 'en-US',
  enableMask: true,
  viewportExpansion: 0,
});
```

### 2. System Instructions

Define agent behavior through system prompts:

```typescript
instructions: {
  system: `
    You are an AI assistant helping users navigate a registration flow.
    - Always confirm actions before executing
    - Be clear and concise
    - Report errors and suggest next steps
  `,
}
```

### 3. Page-Specific Instructions

Provide route-aware guidance:

```typescript
instructions: {
  getPageInstructions: (url: string) => {
    const path = new URL(url).pathname;
    return PAGE_INSTRUCTIONS[path] || undefined;
  },
}
```

Example page instruction:

```typescript
'/tickets': `
This is the ticket selection page with three ticket tiers.
Available actions:
- Click on any ticket card to select it
- View ticket benefits on each card
- After selection, click "Continue to Workshops" button
`,
```

### 4. React Integration

The `AIAgentButton` component toggles the built-in panel. The agent is created lazily, and recreated if the panel's close button disposed it:

```tsx
const { panel } = getOrCreatePageAgent(() => setIsPanelOpen(false));
panel.show();
```

To run a task programmatically instead of through the panel, call `await agent.execute('Buy a student ticket')`.

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseURL` | `string` | *(required)* | LLM API endpoint |
| `apiKey` | `string` | — | API key for LLM provider (optional for local/keyless endpoints) |
| `model` | `string` | *(required)* | Model name |
| `language` | `string` | `'en-US'` | Locale for responses |
| `enableMask` | `boolean` | `true` | Block user input with an overlay while the agent acts |
| `viewportExpansion` | `number` | `0` | Padding around viewport |
| `maxSteps` | `number` | `40` | Maximum agent steps per task |
| `stepDelay` | `number` | `0.4` | Delay between steps, in seconds |
| `customTools` | `Record<string, PageAgentTool \| null>` | — | Add, override, or remove (`null`) agent tools |
| `transformPageContent` | `(content) => string` | — | Inspect or mask page content before it is sent to the LLM |
| `transformRequestBody` | `(body) => object` | — | Provider-specific request tweaks (replaces the deprecated `temperature`) |

See the [page-agent docs](https://alibaba.github.io/page-agent/docs/introduction/overview) for the full list.

## Project Structure

```
src/
├── components/
│   └── AIAgentButton.tsx    # Floating agent activation button
├── services/
│   └── pageAgent.ts          # PageAgent initialization & config
├── config/
│   └── env.ts                # LLM configuration
└── pages/                    # Demo pages with interactive forms
```

## Tech Stack

| Technology | Version |
|------------|---------|
| page-agent | 1.12.x |
| React | 19.3.x |
| TypeScript | 6.0.x |
| Tailwind CSS | 4.3.x |
| Vite | 8.x |

## Example Agent Interactions

Once activated, try these prompts to see page-agent in action:

- "Click the Register button"
- "Fill out the sign-up form with my name and email"
- "Navigate to the next page"
- "What actions are available on this page?"
- "Scroll down and read the content"

## License

MIT

## Links

- [page-agent Documentation](https://alibaba.github.io/page-agent/)
- [page-agent GitHub](https://github.com/alibaba/page-agent)
