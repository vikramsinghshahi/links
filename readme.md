Review Booster (WhatsApp + Google Reviews) — Service Playbook
A productized n8n automation you can sell to clinics, restaurants, gyms, salons, home services, and retail. Goal: increase Google reviews volume & rating while diverting negative feedback to the manager.

1. Value Proposition (Use in your pitch)
   Promise: “Get 2–5× more Google reviews in 30 days. We auto‑request reviews on WhatsApp after each visit and route unhappy customers to you privately.”
   Outcomes to show: - More reviews, higher average rating - Reduced public negatives (private resolution channel) - CRM hygiene (all outreach logged)
   Starter pricing: ₹3,999 setup + ₹1,499/mo for up to 100 sends (add ₹500 per extra 100).

2. Prerequisites (Client Onboarding Checklist)
   • WhatsApp sending (choose one):
   • Preferred: WhatsApp Cloud API using client’s Facebook Business account (WABA). You will need:
   • WABA phone number (can be a fresh number)
   • Phone Number ID and WhatsApp Business Account ID
   • Permanent access token (System User token) with whatsapp_business_messaging scope
   • At least one approved message template (see section 7)
   • Alternate: BSP like Gupshup/Infobip/Interakt/Yellow.ai if client already uses them (you’ll hit their HTTP APIs from n8n).
   • Review link: Client’s Google Business Profile “Ask for Reviews” link (the short link from their GBP dashboard). Keep it in your sheet as review_link per location.
   • Data source: A Google Sheet (or CSV import) listing recent customers (name, phone, visit date). You can also pull from POS/CRM later.
   • Gmail/Email (optional): For manager notifications if you’re not using WhatsApp to the manager.
   • Domain & landing (optional): 1‑page landing to sell the service (copy in section 12).

3. Data Design (Google Sheet Schema)
   Create a Google Sheet named Review Booster Contacts with a tab customers and columns:
   name | phone_e164 | visit_date | order_id | amount | review_link | status | last_sent_at | reply_text | sentiment | manager_followup | notes
   • phone_e164: with country code (e.g., +9198XXXXXXXX)
   • status: pending | sent | failed | opted_out | replied
   • sentiment: positive | neutral | negative
   • Keep all timestamps in IST.
   Tip: Maintain a second tab config with business_name, manager_phone, send_time_window_start, send_time_window_end, daily_quota.

4. n8n Architecture (Two Workflows)
   Workflow A: “Send Review Requests (Daily)” - Trigger: Cron (e.g., daily 7:00 PM Asia/Kolkata) - Google Sheets → Read rows where status = pending and visit_date <= today - Split In Batches (e.g., 100) respecting provider rate limits - Function: Compose personalization variables (name, business name, visit date) - HTTP Request → WhatsApp Cloud API messages (template send) - If success → Google Sheets → Update status = sent, last_sent_at = now() - If failure → set status = failed + log notes - Limiter: daily_quota guard; reschedule remainder tomorrow
   Workflow B: “Inbound WhatsApp Replies (Real‑time)” - Trigger: Webhook (verify token + subscribe in Meta App) - IF message contains STOP → set status = opted_out, don’t message again - IF message contains rating intent / negative keywords → set sentiment = negative, alert manager - Else set sentiment = positive|neutral using AI node (OpenAI classifier; optional) - Router: - Positive/neutral: Send quick thank‑you + direct review link (session message) - Negative: WhatsApp handoff to manager_phone with context (name, order_id, transcript) - Log: Update the row with replied, reply_text, sentiment

5. WhatsApp Cloud API — n8n Node Setup (Template Send)
   HTTP Node: - Method: POST - URL: https://graph.facebook.com/v20.0/{{ $json.phone_number_id }}/messages - Headers: - Authorization: Bearer {{$json.permanent_token}} - Content-Type: application/json - Body (JSON):
   {  "messaging_product": "whatsapp",  "to": "{{$json.to}}",  "type": "template",  "template": {  "name": "review_request_v1",  "language": { "code": "en" },  "components": [  {  "type": "body",  "parameters": [  {"type": "text", "text": "{{$json.name}}"},  {"type": "text", "text": "{{$json.business_name}}"},  {"type": "text", "text": "{{$json.visit_date}}"},  {"type": "text", "text": "{{$json.review_link}}"}  ]  }  ]  } }
   Note: Put the full review_link in the body text variables. For the very first business‑initiated message, only template type is allowed. After the user replies (opens a 24‑hour session), you can send non‑template messages (e.g., reminders, images, etc.).
   Common Errors to Handle: - 131047 (Rate limit) → backoff & retry - 1006 (Unapproved template) → ensure template is approved before sending - 131026 (Recipient not opted-in) → use customer‑care context (post‑transaction) and ensure the client’s opt‑in language at checkout/sign‑in

6. Inbound Webhook (Replies) — n8n Webhook Node
   • URL: https://your-n8n-domain/webhook/whatsapp-inbound
   • Method: POST (also handle GET for verify challenge)
   • Parse: Body → find message text, from, and contacts
   • Keywords:
   • STOP → mark opted_out
   • Negative lexicon: bad, poor, not happy, refund, complaint → route to manager
   • Optional AI classification: n8n OpenAI node → label positive | neutral | negative
   • Manager alert: Send WhatsApp message or email with context

7. WhatsApp Template Copy (Submit for Approval)
   Template name: review_request_v1 Category: Marketing (or Utility if you tie it to a completed order/visit — safer) Language: English (you can add en_GB, hi, mr, bn later) Body (with variables):
   Hi {{1}}, thanks for visiting {{2}} on {{3}}. Could you spare 10 seconds to share your experience? Your feedback helps us serve you better.  Review link: {{4}}  If anything wasn’t right, just reply here and we’ll fix it immediately.
   Buttons (optional): Quick reply buttons like Share Feedback, Need Help (configurable per template). For URL buttons, pre‑configure a base link and only append suffix variables.
   Follow‑up session message (non‑template):
   Thanks, {{name}}! Here’s the direct review link again: {{review_link}}
   Opt‑out footer (optional): “Reply STOP to opt out.”

8. n8n Workflow A — Pseudograph (Nodes)
   • Cron (07:00 PM IST)
   • Google Sheets: Read customers (filter status=pending AND visit_date<=today)
   • Set → map each row to { to, name, business_name, visit_date, review_link, phone_number_id, permanent_token }
   • Split In Batches (size=100)
   • HTTP Request → WhatsApp (template send)
   • IF (status 200) → Google Sheets: Update status=sent, last_sent_at=now()
   • Else → status=failed, write error to notes
   • Loop next batch until empty
   Error Handling: Add a Catch node connected to a “Log to Sheet + Telegram alert” branch.

9. n8n Workflow B — Pseudograph (Nodes)
   • Webhook (WhatsApp inbound) (GET verify + POST messages)
   • Function parse payload → { from, text, name, timestamp }
   • IF text contains STOP → Google Sheets Update status=opted_out
   • Else AI Classify sentiment
   • IF negative → HTTP → WhatsApp to manager with context + Google Sheets Update
   • Else → HTTP → WhatsApp thank‑you + direct review link (session message)
   • Append all replies to customers row fields replied, reply_text, sentiment

10. Importable Starter Workflow (JSON Skeleton)
    Import into n8n (Settings → Import from file) and wire your credentials.
    {  "name": "Review Booster — Send Requests",  "nodes": [  {"parameters": {"triggerTimes": {"item": [{"mode": "everyDay", "hour": 19, "minute": 0, "weekday": "monday"}, {"mode": "everyDay", "hour": 19, "minute": 0, "weekday": "tuesday"}, {"mode": "everyDay", "hour": 19, "minute": 0, "weekday": "wednesday"}, {"mode": "everyDay", "hour": 19, "minute": 0, "weekday": "thursday"}, {"mode": "everyDay", "hour": 19, "minute": 0, "weekday": "friday"}, {"mode": "everyDay", "hour": 19, "minute": 0, "weekday": "saturday"}, {"mode": "everyDay", "hour": 19, "minute": 0, "weekday": "sunday"}]}, "timezone": "Asia/Kolkata"}, "id": "Cron", "name": "Cron", "type": "n8n-nodes-base.cron", "typeVersion": 2, "position": [200, 200]},  {"parameters": {"operation": "lookup", "sheetId": "<SHEET_ID>", "range": "customers!A:Z", "options": {"lookupColumn": "status", "lookupValue": "pending"}}, "id": "ReadSheet", "name": "Read Sheet", "type": "n8n-nodes-base.googleSheets", "typeVersion": 4, "position": [440, 200], "credentials": {"googleApi": "Google API"}},  {"parameters": {"batchSize": 100}, "id": "SplitInBatches", "name": "Split In Batches", "type": "n8n-nodes-base.splitInBatches", "typeVersion": 1, "position": [680, 200]},  {"parameters": {"functionCode": "items = items.map(i => ({json: {to: i.json.phone_e164, name: i.json.name, business_name: $item(0).$node['Config'].json.business_name, visit_date: i.json.visit_date, review_link: i.json.review_link, phone_number_id: $item(0).$node['Config'].json.phone_number_id, token: $item(0).$node['Config'].json.permanent_token, rowIndex: i.json.\_sheetRowIndex}}));\nreturn items;"}, "id": "MapVars", "name": "Map Vars", "type": "n8n-nodes-base.function", "typeVersion": 2, "position": [920, 200]},  {"parameters": {"requestMethod": "POST", "url": "={{'https://graph.facebook.com/v20.0/' + $json.phone_number_id + '/messages'}}", "jsonParameters": true, "options": {"batching": {"batchInterval": 200, "batchSize": 1}}, "sendBody": true, "bodyParametersJson": "={\n \"messaging_product\": \"whatsapp\",\n \"to\": \"\" + $json.to + \"\",\n  \"type\": \"template\",\n  \"template\": {\n    \"name\": \"review_request_v1\",\n    \"language\": { \"code\": \"en\" },\n    \"components\": [{\n      \"type\": \"body\",\n      \"parameters\": [\n        {\"type\": \"text\", \"text\": \"\" + $json.name + \"\"},\n        {\"type\": \"text\", \"text\": \"\" + $json.business_name + \"\"},\n        {\"type\": \"text\", \"text\": \"\" + $json.visit_date + \"\"},\n        {\"type\": \"text\", \"text\": \"\" + $json.review_link + \"\"}\n      ]\n    }]\n  }\n}"}, "id": "WhatsAppSend", "name": "WhatsApp Send", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4, "position": [1180, 200]},     {"parameters": {"conditions": {"number": [{"value1": "={{$json.statusCode}}", "operation": "equal", "value2": 200}]}}, "id": "IFSuccess", "name": "IF Success", "type": "n8n-nodes-base.if", "typeVersion": 2, "position": [1430, 200]},  {"parameters": {"operation": "update", "sheetId": "<SHEET_ID>", "range": "customers!A:Z", "key": "\_sheetRowIndex", "options": {"valueInputMode": "USER_ENTERED"}}, "id": "MarkSent", "name": "Mark Sent", "type": "n8n-nodes-base.googleSheets", "typeVersion": 4, "position": [1670, 120], "credentials": {"googleApi": "Google API"}},  {"parameters": {"operation": "append", "sheetId": "<SHEET_ID>", "range": "customers!A:Z"}, "id": "LogFail", "name": "Log Fail", "type": "n8n-nodes-base.googleSheets", "typeVersion": 4, "position": [1670, 300], "credentials": {"googleApi": "Google API"}},  {"parameters": {"workflow": "Config Variables", "reset": true}, "id": "Config", "name": "Config", "type": "n8n-nodes-base.executeWorkflowTrigger", "typeVersion": 1, "position": [440, 420]}  ],  "connections": {  "Cron": {"main": [[{"node": "Read Sheet", "type": "main", "index": 0}, {"node": "Config", "type": "main", "index": 0}]]},  "Read Sheet": {"main": [[{"node": "Split In Batches", "type": "main", "index": 0}]]},  "Split In Batches": {"main": [[{"node": "Map Vars", "type": "main", "index": 0}]]},  "Map Vars": {"main": [[{"node": "WhatsApp Send", "type": "main", "index": 0}]]},  "WhatsApp Send": {"main": [[{"node": "IF Success", "type": "main", "index": 0}]]},  "IF Success": {"main": [[{"node": "Mark Sent", "type": "main", "index": 0}, {"node": "Log Fail", "type": "main", "index": 1}]]}  } }
    Replace <SHEET_ID> and wire your Google credentials. Add a small Function before Mark Sent to set status = 'sent' and last_sent_at = now().

11. Compliance & Best Practices (India)
    • Use approved templates for the first outreach; keep it customer‑care oriented (“based on your recent visit/order”).
    • Add opt‑out (Reply STOP) and actually honor it in Workflow B.
    • Don’t store sensitive PII beyond what’s needed. Keep Sheets in the client’s Google Drive.
    • If using SMS fallback, ensure the client has DLT headers and templates; otherwise avoid SMS.

12. Landing Page Copy (Paste & Ship)
    H1: Get 2–5× More Google Reviews — Automatically Sub: WhatsApp review requests after every visit. Negative feedback goes to your manager, not the public. Bullets: - 10‑second setup with your review link - Works with your existing WhatsApp number - Sends at the perfect time (7 PM) in your customer’s language - Real‑time alerts for unhappy customers CTA: Start for ₹3,999 setup + ₹1,499/mo Proof: “Restaurants see 5–15% of customers leave a review within 48 hours.” (your experience may vary) FAQ: Privacy, opt‑out, languages, cancellation, quota.

13. Sales Script (DM or Cold Call)
    “Hi , quick idea to grow your Google rating. I set up a small automation that sends a polite WhatsApp review request to customers after their visit and routes negative feedback to you privately. Takes one day, costs ₹3,999 to set up and ₹1,499/mo. Can I show a 3‑minute demo?”

14. KPIs & Reporting
    • Send volume: sent vs failed
    • Reply rate and review conversions (ask client to share review counts weekly, or scrape public count)
    • Negative → resolved time (manager follow‑ups)
    • Opt‑out rate
    Create a second n8n workflow (weekly Cron) that: - Reads Sheet → aggregates metrics → writes to a metrics tab → emails/WhatsApps a summary to the client.

15. Ops Checklist (Go‑Live)
    • Template approved & tested to one number
    • Review link verified
    • First batch of contacts imported (CSV)
    • Cron time set to 19:00 Asia/Kolkata
    • Webhook subscribed & verified
    • STOP handling tested
    • Manager alert working
    • Quota & rate limits configured

16. Upsells
    • Multilingual templates (Hindi, Marathi, Bengali)
    • Post‑event drip: reminder at +48h if no reply
    • Analytics dashboard (Metabase/Supabase + Recharts)
    • Connect POS/Shopify/Zoho for auto‑ingest of customers

17. Troubleshooting
    • 200 OK but no message: Check WABA number is connected & quality rating; ensure recipient uses WhatsApp
    • 400 / Template not found: Exact template name & language mismatch
    • Rate limit errors: Add backoff + increase batch interval to 500–1000 ms
    • Delivery failed to many numbers: You might be hitting daily conversation caps—warm up volume over a week

18. Security Notes
    • Store tokens in n8n Credentials (not hard‑coded). Limit token scope.
    • Use a separate WABA phone per client (clean separation).
    • Keep audit logs (append sends to a logs sheet with timestamp & message id).

19. What You Deliver (Client‑Facing)
    • Working WhatsApp review automation (1 location)
    • Google Sheet with logs they can see
    • Weekly KPI summary on WhatsApp/email
    • 7‑day support for tweaks

20. Fast Start — Your To‑Do Today
    • Duplicate the sample CSV template (attached in chat) and import into the Sheet
    • Submit the review_request_v1 template for approval
    • Import Workflow A JSON and set cron + credentials
    • Configure inbound webhook (Workflow B) and STOP handling
    • Send a 10‑number test batch, verify links, then go live

Use Cursor/Windsurf to quickly edit n8n JSON, craft message copy variations, and generate small helper scripts (e.g., CSV → Sheets import).
