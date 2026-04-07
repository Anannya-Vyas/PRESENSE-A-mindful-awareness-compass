const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const API_KEY = process.env.REACT_APP_NVIDIA_API_KEY || '';

export interface NudgeResponse {
  nudge: string;
  reflection: string;
}

// Large non-repeating fallback pool — 12 per quadrant
const NUDGE_POOL: Record<string, NudgeResponse[]> = {
  past: [
    { nudge: "The past has shaped you, but your breath is happening now.", reflection: "Memories are visitors. You don't have to live inside them." },
    { nudge: "What's done is woven into you — now let it rest.", reflection: "The story of yesterday doesn't need to be retold today." },
    { nudge: "You can honor the past without being held by it.", reflection: "Grief and nostalgia are natural. So is returning to now." },
    { nudge: "That chapter is written. This moment is still blank.", reflection: "The pen is in your hand right now, not back then." },
    { nudge: "Old wounds don't need to be reopened to be healed.", reflection: "Awareness of the past is wisdom. Dwelling is a different thing." },
    { nudge: "The river doesn't flow backward. Neither do you.", reflection: "What happened made you. What happens next is still open." },
    { nudge: "Let the memory be a visitor, not a resident.", reflection: "You can acknowledge what was without making it what is." },
    { nudge: "Your regrets are not your identity.", reflection: "Every moment is a chance to begin again, cleanly." },
    { nudge: "The past is a place you've already been. You live here now.", reflection: "Nostalgia softens with presence. Try noticing one thing around you." },
    { nudge: "What you carry from the past, you chose to pick up.", reflection: "You can set it down, even briefly, and feel the difference." },
    { nudge: "Yesterday's weight doesn't have to travel with you today.", reflection: "Lightness is available. It starts with one conscious breath." },
    { nudge: "The past is real, but it is not now.", reflection: "Right now, in this moment, you are safe and whole." },
  ],
  future: [
    { nudge: "Tomorrow's plans can wait. Feel the weight of your feet on the ground.", reflection: "Planning is useful. But the future only ever arrives as now." },
    { nudge: "Anxiety is imagination pointed in one direction. Redirect it here.", reflection: "The present moment has never once failed to arrive." },
    { nudge: "The future is not a place you can go to right now.", reflection: "All your power lives in this breath, this second." },
    { nudge: "Worry is rehearsing a play that may never be performed.", reflection: "What if things go well? That future is equally possible." },
    { nudge: "You are preparing for a moment that isn't here yet.", reflection: "The best preparation for tomorrow is full presence today." },
    { nudge: "Let the future be uncertain. Uncertainty is not danger.", reflection: "You have navigated every moment so far. Trust that." },
    { nudge: "The 'what ifs' are loud. The now is quieter but realer.", reflection: "Come back to your senses — what do you hear right now?" },
    { nudge: "Your mind is time-traveling. Gently come back.", reflection: "The present is the only place where anything actually happens." },
    { nudge: "Plans are useful. Obsession with them is not.", reflection: "You can hold the future lightly and still move toward it." },
    { nudge: "The next moment will take care of itself. This one needs you.", reflection: "Presence is not passive — it's the most active thing you can do." },
    { nudge: "Stop rehearsing. Start noticing.", reflection: "What is actually happening right now, not what might happen?" },
    { nudge: "The horizon is beautiful, but you walk on the ground beneath your feet.", reflection: "Look down. Feel the earth. You are here, not there." },
  ],
  internal: [
    { nudge: "Your thoughts are valid, but so is this exact moment.", reflection: "Like clouds passing in the sky, thoughts come and go. You are the sky." },
    { nudge: "The mind is a busy place. You don't have to live in every room.", reflection: "Step outside the chatter for just one breath." },
    { nudge: "You are not your thoughts. You are the one noticing them.", reflection: "That gap between thought and awareness — that's where you actually live." },
    { nudge: "The inner critic is loud today. You don't have to agree.", reflection: "Observe the voice without becoming it." },
    { nudge: "Analysis has its place. Right now, sensing does too.", reflection: "What does your body feel? That's real data too." },
    { nudge: "The story in your head is one version. Reality is richer.", reflection: "Look up from the internal narrative and see what's actually here." },
    { nudge: "Thinking about life and living it are different things.", reflection: "You can think less and feel more, even for a moment." },
    { nudge: "Your inner world is vast. Don't get lost in just one corner.", reflection: "Curiosity about your own mind is healthy. Obsession is different." },
    { nudge: "The loop playing in your head can be paused.", reflection: "One breath. One sensation. That's enough to interrupt the cycle." },
    { nudge: "You are more than the sum of your thoughts today.", reflection: "Beneath the mental noise is a quieter, steadier you." },
    { nudge: "Daydreaming is human. Returning is the practice.", reflection: "There's no failure in drifting — only in not noticing." },
    { nudge: "The mind wanders because it's alive. Gently bring it home.", reflection: "Home is here. Home is now. Home is this breath." },
  ],
  external: [
    { nudge: "The world can wait. What do you notice right here, right now?", reflection: "External distractions lose their power when you return to your senses." },
    { nudge: "You've been pulled outward. There's something worth finding inward.", reflection: "The noise outside is real. So is the quiet inside." },
    { nudge: "Notifications, people, demands — they'll still be there. You need a moment.", reflection: "Reclaiming your attention is not selfish. It's necessary." },
    { nudge: "The world is loud. Your inner stillness is louder, if you listen.", reflection: "You don't have to respond to everything that calls for you." },
    { nudge: "You've been giving your attention away. Take some back.", reflection: "Attention is your most valuable resource. Spend it wisely." },
    { nudge: "Step back from the noise. Even one breath of distance helps.", reflection: "You can be in the world without being consumed by it." },
    { nudge: "Other people's urgency doesn't have to become yours.", reflection: "You get to choose what deserves your full presence." },
    { nudge: "The screen, the sound, the rush — none of it is you.", reflection: "Beneath the external pull is a self that doesn't need any of it." },
    { nudge: "You've been scattered. Gather yourself back.", reflection: "Presence is not about shutting the world out. It's about choosing what you let in." },
    { nudge: "The outside world is endlessly demanding. Your inside world is endlessly available.", reflection: "Turn toward it, even briefly." },
    { nudge: "Distraction is not a flaw. Noticing it is the practice.", reflection: "You noticed. That's the whole point." },
    { nudge: "Come back from the edges. The center is always here.", reflection: "No matter how far you drift, returning is always possible." },
  ],
  center: [
    { nudge: "You are present. Notice the stillness within.", reflection: "This moment of presence is a gift you've given yourself." },
    { nudge: "Right here. Right now. This is it.", reflection: "Presence doesn't need to be earned or achieved. It's already here." },
    { nudge: "You've arrived. There's nowhere else to be.", reflection: "The present moment is the only place where life actually happens." },
    { nudge: "This is the center. Feel how steady it is.", reflection: "From here, everything else becomes clearer." },
    { nudge: "You are not drifting. You are here.", reflection: "Savor this. Presence is the rarest thing in a distracted world." },
    { nudge: "The compass points to now. You're already there.", reflection: "This is what mindfulness feels like — simple, quiet, real." },
    { nudge: "Stillness found. Stay as long as you like.", reflection: "You don't have to do anything with this moment. Just be in it." },
    { nudge: "Fully here. Fully alive. Fully enough.", reflection: "Nothing is missing from this moment." },
    { nudge: "The present moment is not a destination. It's where you already are.", reflection: "You just remembered. That's the whole practice." },
    { nudge: "Breathe. You're home.", reflection: "Home is not a place. It's this awareness, right now." },
    { nudge: "No past pulling. No future calling. Just this.", reflection: "This is the peace that doesn't require anything to change." },
    { nudge: "You found the eye of the storm. Rest here.", reflection: "The world can spin. You don't have to spin with it." },
  ],
};

// Track used indices per quadrant to avoid repeats within a session
const usedIndices: Record<string, Set<number>> = {
  past: new Set(), future: new Set(), internal: new Set(), external: new Set(), center: new Set(),
};

const getUnusedFallback = (quadrant: string): NudgeResponse => {
  const pool = NUDGE_POOL[quadrant] ?? NUDGE_POOL.center;
  const used = usedIndices[quadrant] ?? new Set();

  // Reset if all used
  if (used.size >= pool.length) used.clear();

  let idx: number;
  do { idx = Math.floor(Math.random() * pool.length); } while (used.has(idx));
  used.add(idx);
  return pool[idx];
};

// Track last N AI responses to detect repeats
const recentAIResponses: string[] = [];
const MAX_RECENT = 20;

const isDuplicate = (nudge: string): boolean => {
  const normalized = nudge.toLowerCase().trim();
  return recentAIResponses.some(r => r.toLowerCase().trim() === normalized);
};

const recordResponse = (nudge: string) => {
  recentAIResponses.push(nudge);
  if (recentAIResponses.length > MAX_RECENT) recentAIResponses.shift();
};

const getTimeOfDay = (): string => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
};

const callNvidiaAPI = async (
  quadrant: string,
  distance: number,
  previousQuadrants: string[]
): Promise<NudgeResponse> => {
  const recentList = recentAIResponses.slice(-8).map(r => `"${r}"`).join(', ');
  const patternNote = previousQuadrants.length > 0
    ? `\nRecent pattern: user has visited [${previousQuadrants.slice(-4).join(', ')}] territories.`
    : '';

  const prompt = `You are a gentle mindfulness guide for an app called "Presense".

The user just checked in. Their attention is in the "${quadrant}" territory.
Distance from center: ${Math.round(distance)}/150 (higher = further from presence)
Time of day: ${getTimeOfDay()}${patternNote}

Quadrant meanings:
- past: ruminating on memories, regret, nostalgia
- future: anxiety, planning, "what if" thinking
- internal: daydreaming, self-talk, overthinking
- external: distracted by world, notifications, other people
- center: fully present, mindful, aware

IMPORTANT — do NOT repeat or closely paraphrase any of these recently used nudges:
${recentList || 'none yet'}

Generate a UNIQUE response with:
1. nudge: one gentle, poetic sentence (max 15 words) to help them return to presence
2. reflection: 2 sentences of compassionate insight about this mental territory

Respond ONLY with valid JSON, no other text:
{"nudge": "...", "reflection": "..."}`;

  const response = await fetch(INVOKE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "google/gemma-4-31b-it",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 1.1,
      top_p: 0.95,
      stream: false,
    }),
  });

  if (!response.ok) throw new Error(`API ${response.status}`);

  const data = await response.json();
  const content: string = data.choices[0].message.content ?? '';

  // Extract JSON from response
  const match = content.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error('No JSON in response');
  const parsed: NudgeResponse = JSON.parse(match[0]);

  if (!parsed.nudge || !parsed.reflection) throw new Error('Invalid response shape');

  // If AI returned a duplicate, fall back to local pool
  if (isDuplicate(parsed.nudge)) return getUnusedFallback(quadrant);

  recordResponse(parsed.nudge);
  return parsed;
};

export const generateMindfulNudge = async (
  quadrant: 'past' | 'future' | 'internal' | 'external' | 'center',
  distance: number,
  previousCheckIns?: Array<{ quadrant: string; timestamp: Date }>
): Promise<NudgeResponse> => {
  const previousQuadrants = (previousCheckIns ?? []).map(c => c.quadrant);

  try {
    if (!API_KEY) return getUnusedFallback(quadrant);
    const result = await callNvidiaAPI(quadrant, distance, previousQuadrants);
    return result;
  } catch (err) {
    console.warn('AI service error, using local pool:', err);
    return getUnusedFallback(quadrant);
  }
};

export const generateReflectionPrompt = async (
  checkIns: Array<{ quadrant: string; timestamp: Date }>
): Promise<string> => {
  if (checkIns.length < 3) return "Continue checking in to discover patterns in your attention.";
  return "Your awareness is growing. Each check-in is a step toward greater presence.";
};
