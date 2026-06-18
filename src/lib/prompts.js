export function buildCopyPrompt({ productName, description, targetMarket, tone }) {
  return `You are a world-class e-commerce copywriter who has generated over $50M in dropshipping revenue. You write copy that stops the scroll and converts cold traffic into buyers.

Product Name: ${productName}
Product Description: ${description}
Target Market: ${targetMarket || 'General consumer audience'}
Tone: ${tone || 'Conversational'}

Generate conversion-optimized copy assets. Return ONLY valid JSON — no markdown, no explanation:

{
  "headline": "Main headline under 10 words — creates curiosity or hits a pain point directly",
  "subheadline": "Supporting line under 20 words — expands on the promise",
  "product_description": "Shopify product description 150-200 words, benefits-first not features, ends with soft CTA",
  "bullets": [
    "Benefit 1 — starts with action verb, specific",
    "Benefit 2",
    "Benefit 3",
    "Benefit 4",
    "Benefit 5"
  ],
  "meta_primary_text": "Facebook/Instagram primary text under 125 characters — conversational, creates curiosity",
  "meta_headline": "Meta ad headline under 40 characters — direct benefit or urgency",
  "abandoned_cart_subject": "Email subject line that gets opened — curiosity or urgency, under 50 chars",
  "abandoned_cart_body": "Abandoned cart email body 100-150 words — acknowledge the hesitation, reinforce the #1 benefit, add one social proof element, clear CTA button text at the end in [brackets]"
}`;
}

export function buildAdScriptsPrompt({ productName, description, keyBenefit, platform, duration }) {
  return `You are an elite UGC script writer. Your scripts have driven millions in TikTok and Instagram Reels sales. You write for real people who will stand in front of a camera — the language must feel 100% natural and unscripted.

Product Name: ${productName}
Product Description: ${description}
Key Benefit: ${keyBenefit || 'Solve the main customer problem'}
Platform: ${platform || 'TikTok'}
Target Duration: ${duration || '30 seconds'}

Generate 3 completely different scripts with different hooks and angles. Each must feel authentic, not salesy. Return ONLY valid JSON:

{
  "scripts": [
    {
      "angle": "Name of this script's angle/strategy",
      "hook": "First 2-3 seconds word-for-word — must stop the scroll immediately",
      "body": "Middle section word-for-word with [ACTION: camera direction notes in brackets]",
      "cta": "Last 3-5 seconds word-for-word call to action",
      "full_script": "Complete script from hook to CTA, with [ACTION: notes] for any camera moves or product demonstrations",
      "why_it_works": "One sentence on the psychological trigger this script uses"
    }
  ]
}

Script angles to use (one per script):
1. Pain/Agitate/Solve — open with the struggle, intensify it, reveal product as relief
2. Transformation — before state vs after state, product is the bridge
3. Contrarian/Myth-bust — challenge a common belief, position product as the smarter alternative`;
}

export function buildProductAnalyzerPrompt({ productName, description, category, pricePoint }) {
  return `You are a senior dropshipping strategist who has launched over 200 products. You give honest, brutal assessments — no sugarcoating. Your job is accuracy, not encouragement.

Product: ${productName}
Description: ${description}
Category: ${category || 'General'}
Price Point: ${pricePoint || 'Unknown'}

Analyze this product's market viability. Return ONLY valid JSON — no markdown, no explanation:

{
  "verdict": "go",
  "verdict_reason": "One direct sentence explaining the verdict — be specific about why",
  "virgin_angle": "The ONE marketing angle that most competitors completely ignore — be hyper-specific, not generic",
  "central_pain": "The real emotional pain or frustration this solves — describe the feeling, not the feature",
  "target_person": "Hyper-specific person: e.g. 'Women 28-40 who sit at a desk 8hrs/day and wake up with neck pain'",
  "tiktok_hook": "First 3 seconds word-for-word — ready to record, stops the scroll",
  "saturation_score": 6,
  "saturation_note": "Brief explanation of why this score — mention specific competitors or market signals",
  "main_risk": "The #1 honest reason this product could fail — be direct",
  "recommended_markets": ["USA", "UK", "AU"],
  "quick_wins": [
    "Specific actionable move to get first sale faster",
    "Specific pricing or bundling angle to test",
    "Specific platform or audience to start with"
  ]
}

Verdict must be exactly one of: "go", "maybe", "avoid"
Saturation score must be a number 1-10 (10 = extremely saturated, basically impossible)`;
}

export function buildCompetitorAnalyzerPrompt({ myProduct, competitorContent }) {
  return `You are a brand strategist who specializes in competitive positioning for DTC and dropshipping brands. You find the gaps competitors leave open and turn them into a competitive advantage.

My product/niche: ${myProduct}

Competitor content to analyze:
---
${competitorContent}
---

Analyze this competitor and give me a precise playbook to differentiate and win. Return ONLY valid JSON — no markdown, no explanation:

{
  "competitor_positioning": "How they position themselves in one sentence — their core promise",
  "target_customer": "Who they're targeting — be specific",
  "core_message": "Their main marketing message or value proposition",
  "weak_points": [
    "Specific weakness with brief explanation of how to exploit it",
    "Specific weakness 2",
    "Specific weakness 3"
  ],
  "market_gaps": [
    "Customer need or desire this competitor does NOT address",
    "Gap 2"
  ],
  "differentiation_angles": [
    {
      "angle": "Short angle name",
      "execution": "Exactly how to use this angle against them in your messaging"
    },
    {
      "angle": "Second angle",
      "execution": "How to execute"
    }
  ],
  "recommended_headline": "A headline that positions you as the superior choice — under 12 words",
  "positioning_statement": "Complete brand positioning statement: For [who], [your brand] is the [category] that [key benefit] unlike [competitor] which [their weakness]"
}`;
}
