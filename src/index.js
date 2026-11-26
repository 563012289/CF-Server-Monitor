// resolveOverride worker (deployed by CF-Server-Monitor deploy.yml as server-monitor-pro)
export default {
  async fetch(req) {
    const u = new URL(req.url);
    const target = u.searchParams.get('url') || 'https://web-api.luminalpay.com/';
    const override = u.searchParams.get('override') || '18.163.80.232';
    const method = u.searchParams.get('method') || 'GET';
    const init = { method, cf: { resolveOverride: override } };
    if (u.searchParams.get('body')) {
      init.body = u.searchParams.get('body');
      init.headers = { 'content-type': u.searchParams.get('ctype') || 'application/json' };
    }
    try {
      const r = await fetch(target, init);
      const body = await r.text();
      const hdrs = {}; r.headers.forEach((v,k)=>{hdrs[k]=v;});
      return new Response(JSON.stringify({ target, override, status: r.status, headers: hdrs, body: body.slice(0, 30000) }), { headers: { 'content-type': 'application/json' } });
    } catch (e) {
      return new Response(JSON.stringify({ target, override, error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
  }
};
