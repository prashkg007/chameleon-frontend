# Chameleon-Frontend TASKS

Scope: Lean SPA for landing, pricing, login, and subscription. No backend code. Talks to API Gateway.

## Routes
- /  Home (hero, value prop, features, supported platforms, CTAs)
- /pricing  Plans, FAQ, subscribe CTA
- /login  Start auth redirect via API Gateway
- /subscribe  Start checkout via API Gateway
- /success  Post-checkout success
- /cancel  Post-checkout cancel

## Tasks
1. Initialize Chameleon-Frontend with React + Vite + TypeScript
2. Add routing for /, /pricing, /login, /subscribe, /success, /cancel
3. Create global layout (header, footer, container, dark theme)
4. Implement Home page with hero, features, platforms, CTA
5. Implement Pricing page with plans and FAQ
6. Auth client: start login redirect via API Gateway
7. Subscription flow: checkout start via API Gateway
8. Configure env: VITE_API_BASE_URL and production guards
9. Add minimal tests for API service and a core component
10. Build + S3 hosting docs and SPA fallback rules
11. Optional CI: PR build+test; main publish to S3

Status tracking will be updated here as tasks complete.


