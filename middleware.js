// GO LIVE — Vercel Routing Middleware: /api/live?c=kick:xqc,twitch:kaicenat
// Kick: public channel endpoint. Twitch: set TWITCH_CLIENT_ID + TWITCH_CLIENT_SECRET in Vercel env.
export const config = { matcher: '/api/:path*' };

let twitchToken = null, twitchExp = 0;
async function twitchAuth() {
  const id = process.env.TWITCH_CLIENT_ID, secret = process.env.TWITCH_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (twitchToken && Date.now() < twitchExp) return { id, token: twitchToken };
  const r = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`, { method: 'POST' });
  if (!r.ok) return null;
  const j = await r.json();
  twitchToken = j.access_token; twitchExp = Date.now() + (j.expires_in - 120) * 1000;
  return { id, token: twitchToken };
}

async function kick(slug) {
  try {
    const r = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(slug)}`, {
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129 Safari/537.36', accept: 'application/json' },
    });
    if (!r.ok) return { live: null };
    const j = await r.json();
    const ls = j.livestream;
    return ls ? { live: true, viewers: ls.viewer_count || 0, title: ls.session_title || '' } : { live: false };
  } catch (e) { return { live: null }; }
}

async function twitch(logins) {
  const out = {};
  logins.forEach((l) => (out[l] = { live: null }));
  const auth = await twitchAuth().catch(() => null);
  if (!auth || !logins.length) return out;
  const q = logins.map((l) => 'user_login=' + encodeURIComponent(l)).join('&');
  const r = await fetch('https://api.twitch.tv/helix/streams?' + q, { headers: { 'Client-Id': auth.id, Authorization: 'Bearer ' + auth.token } });
  if (!r.ok) return out;
  const j = await r.json();
  logins.forEach((l) => (out[l] = { live: false }));
  (j.data || []).forEach((s) => { out[s.user_login.toLowerCase()] = { live: true, viewers: s.viewer_count, title: s.title }; });
  return out;
}

export default async function middleware(req) {
  const url = new URL(req.url);
  if (url.pathname !== '/api/live') return new Response('Not found', { status: 404 });
  const list = (url.searchParams.get('c') || '').split(',').map((s) => s.trim().toLowerCase()).filter((s) => /^(kick|twitch):[a-z0-9_]{2,40}$/.test(s)).slice(0, 24);
  const kicks = list.filter((s) => s.startsWith('kick:')).map((s) => s.slice(5));
  const twitches = list.filter((s) => s.startsWith('twitch:')).map((s) => s.slice(7));
  const [k, t] = await Promise.all([Promise.all(kicks.map(kick)), twitch(twitches)]);
  const out = {};
  kicks.forEach((s, i) => (out['kick:' + s] = k[i]));
  twitches.forEach((s) => (out['twitch:' + s] = t[s]));
  return new Response(JSON.stringify({ at: Date.now(), channels: out }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, s-maxage=45, stale-while-revalidate=60', 'access-control-allow-origin': '*' },
  });
}
