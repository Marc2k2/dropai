import Anthropic from '@anthropic-ai/sdk';
import { buildCopyPrompt, buildAdScriptsPrompt, buildProductAnalyzerPrompt, buildCompetitorAnalyzerPrompt } from '@/lib/prompts';
import { createClient } from '@/lib/supabase/server';

const PLAN_LIMITS = { free: 10, starter: 100, pro: Infinity, agency: Infinity };

function parseClaudeJSON(text) {
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  return JSON.parse(cleaned);
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const period = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan ?? 'free';
  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  if (limit !== Infinity) {
    const { data: usageRow } = await supabase
      .from('usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('period', period)
      .maybeSingle();

    const currentCount = usageRow?.count ?? 0;

    if (currentCount >= limit) {
      return Response.json({
        error: `Monthly limit of ${limit} generations reached. Upgrade your plan to continue.`,
        limit_reached: true,
      }, { status: 429 });
    }
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { type, ...data } = body;

  let prompt;
  if (type === 'copy') {
    prompt = buildCopyPrompt(data);
  } else if (type === 'ad-scripts') {
    prompt = buildAdScriptsPrompt(data);
  } else if (type === 'product-analyzer') {
    prompt = buildProductAnalyzerPrompt(data);
  } else if (type === 'competitor-analyzer') {
    prompt = buildCompetitorAnalyzerPrompt(data);
  } else {
    return Response.json({ error: 'Unknown generation type' }, { status: 400 });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text;
    const parsed = parseClaudeJSON(text);

    // Increment usage after successful generation
    const { data: existing } = await supabase
      .from('usage')
      .select('id, count')
      .eq('user_id', user.id)
      .eq('period', period)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('usage')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('usage')
        .insert({ user_id: user.id, period, count: 1 });
    }

    return Response.json({ success: true, data: parsed });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return Response.json({ error: 'Failed to parse AI response. Try again.' }, { status: 500 });
    }
    return Response.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
