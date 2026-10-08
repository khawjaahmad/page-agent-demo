import { PageAgent } from 'page-agent';
import { config } from '../config/env';

let agentInstance: PageAgent | null = null;

/**
 * Page-level instructions for each route
 * These help the AI understand what actions are available on each page
 */
const PAGE_INSTRUCTIONS: Record<string, string> = {
  '/': `
Click "Register Now" to go to /auth
Scroll down to view conference info
`,
  '/auth': `
Ask the user for their email and password if not provided
Click "Sign In" button

`,
  '/tickets': `
Click a ticket card to select it (Early Bird $199, Student $99, VIP $499); if the user hasn't named one, ask first
Then click "Continue to Workshops"
`,
  '/workshops': `
Click workshop cards to select or deselect them; at least one is required ("Add to Cart" is disabled until then)
VIP tickets include all workshops automatically, so the cards can't be clicked
If the user hasn't said which workshops, ask first
Then click "Add to Cart"
`,
  '/cart': `
Review selected ticket and workshops
Only apply a discount code if the user gives one or agrees to one (EARLY10 = 10%, SPEAKER25 = 25%, FREEPASS = 100%): type it, then click "Apply"
If the total is FREE, click "Complete Free Registration" (this skips payment and goes straight to confirmation)
Otherwise click "Proceed to Checkout"
`,
  '/checkout': `
If total is $0: click "Complete Registration"
Otherwise: fill card number (16 digits, not starting with 0000), expiry (MM/YY), CVV, cardholder name
Ask the user to confirm the payment details and click "Pay Now" button
`,
  '/confirmation': `
View ticket details
Click "Register Another" to start over
`,
};

/**
 * Get the page-agent instance, creating it on first use.
 * The panel's close button disposes the agent, so a fresh one is created after that.
 * @param onDispose - Called when this instance is disposed
 */
export function getOrCreatePageAgent(onDispose?: () => void): PageAgent {
  if (agentInstance && !agentInstance.disposed) {
    return agentInstance;
  }

  agentInstance = new PageAgent({
    baseURL: config.llm.baseURL,
    apiKey: config.llm.apiKey,
    model: config.llm.model,
    language: 'en-US',

    // PageController options
    enableMask: true,
    viewportExpansion: 0,

    // Instructions to guide agent behavior
    instructions: {
      system: `
You are an AI assistant for the Innovate AI 2026 Conference registration website.

Guidelines:
- Follow the user's instructions carefully and precisely
- Double-check prices; only apply a discount code if the user gives one or agrees to one
- Report errors immediately instead of retrying blindly
`,
      getPageInstructions: (url: string) => {
        // React Router treats "/tickets/" as "/tickets", so strip trailing slashes to match
        const path = new URL(url).pathname.replace(/\/+$/, '') || '/';
        return PAGE_INSTRUCTIONS[path];
      },
    },
  });

  if (onDispose) {
    agentInstance.addEventListener('dispose', onDispose);
  }

  return agentInstance;
}

