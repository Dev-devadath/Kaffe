# Orca — Main Orchestrator (Orchestrator.md)

This document describes the **Orca Orchestrator**: the main agent that receives a user brief (text) and a product image (file or URL), coordinates specialized sub-agents, and returns an aggregated, publish-ready content package. It is intentionally implementation-agnostic so Orca can call sub-agents via HTTP, gRPC, or local function calls.

---

# 1. Purpose

Orca is the single entrypoint for the Content Repurposing workflow. It:

- Accepts the user's text brief and a product image (file or URL).
- Validates & normalizes input.
- Calls downstream agents in parallel or sequence (Image Analysis, Branding, SEO, Channel Planner, Content Generators, Quality, Publisher, Feedback).
- Aggregates responses, applies QC, and returns the final deliverable JSON (and optionally schedules publishing).
- Persists job state for traceability and retries.

Orca does _not_ perform heavy generation itself — it orchestrates specialist agents and enforces message contracts.

---

# 2. Inputs (what Orca accepts)

- `text_prompt` (string) — the user's short product/service description and goals. May include target audience, product name, USPs, CTA.
- `image` (file upload or image_url string) — product or poster image to analyze. Accepts multipart file uploads or publicly reachable URL.
- `meta` (optional JSON) — metadata for the job. Example keys: `product_name`, `locale`, `target_platforms` (list), `auto_publish` (bool), `user_id`, `brand_guidelines_url`.

Example submit payload (JSON / multipart):

```json
{
  "job_id": "optional-uuid",
  "user_id": "user-123",
  "text_prompt": "EcoBottle — vacuum insulated bottle for commuters. Highlight sustainability and 12h hot retention.",
  "image_url": "https://cdn.example.com/uploads/ecobottle.jpg",
  "meta": {
    "product_name": "EcoBottle",
    "locale": "en-IN",
    "target_platforms": ["instagram", "linkedin"],
    "auto_publish": false
  }
}
```

If using multipart upload, Orca should store the file to object storage (S3/MinIO) and use the stored URL when calling agents.

---

# 3. Agents Orca can call

Orca assumes the existence of these sub-agents (each reachable via HTTP endpoint or local function):

1. **Image Analysis Agent** — deep vision analysis (objects, OCR, colors, mood, alt text, hooks, tags, confidence).
2. **Branding Agent** — audience personas, tone options, brand do/don't rules, seed keywords, value props.
3. **SEO & Keyword Agent** — SERP harvesting, intent classification, keyword clustering, priority scoring.
4. **Channel Planner (Sub-Orchestrator)** — maps brand + SEO to channel-specific briefs (formats, lengths, image crops, posting times).
5. **Content Generation Agents** — format-specific generators (Blog Agent, Social Agent, Newsletter Agent, Visual Prompt Agent). They produce JSON outputs for each format.
6. **Quality & Simulation Agent** — runs heuristic checks (readability, keyword coverage, CTR simulation), returns confidence and suggested fixes.
7. **Publisher Agent** — integrates with CMS and social schedulers to schedule/publish content and return publish IDs and tracking URLs.
8. **Feedback Agent** — ingests analytics later (GSC/GA/social) and sends reweighting signals.

Each agent should implement a stable JSON contract (see Section 5).

---

# 4. High-level Flow (Orchestration sequence)

1. **Receive & validate**: Orca accepts job, assigns `job_id` (UUID) if not provided, persists minimal job record.
2. **Store image** (if file uploaded): store in object storage and replace with `image_url`.
3. **Call Image Analysis** (if image provided): `image_analysis = image_agent.analyze(job_id, image_url, hints)`.
4. **Parallel Branding & SEO**: call Branding and SEO agents with `text_prompt` + `image_analysis`.
5. **Channel Planning**: call Channel Planner with `{branding, seo, image_analysis, meta}`; receive per-channel briefs.
6. **Parallel Content Generation**: for each channel brief, call the appropriate Content Agent(s) (blog, social, newsletter, visuals).
7. **Quality Check**: gather generated drafts and call Quality Agent. If confidence < threshold, either: re-run generation with adjusted prompts or escalate to human review.
8. **Aggregate & return**: collect finalized drafts, metadata, and suggested publish schedule and return to the user (or push to Publisher if `auto_publish`).
9. **Persist**: save job state, artifacts, and logs.
10. **Post-publish feedback (later)**: Feedback Agent ingests analytics and updates keyword/strategy for future runs.

Sequence diagram (simplified):

```
User -> Orca
Orca -> ImageAgent
Orca -> (BrandingAgent || SEOAgent)  (parallel)
Orca -> ChannelPlanner
ChannelPlanner -> (ContentAgents... parallel)
Orca -> QualityAgent
Orca -> Publisher (optional)
Publisher -> Social/CMS
FeedbackAgent (async, later) -> Orca
```

---
