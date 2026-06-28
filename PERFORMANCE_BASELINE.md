# MalickLand Performance Baseline

Last updated: 2026-06-28

## Scope

This is an initial HTTP performance baseline for the Vercel cutover deployment:

- Target: `https://malickland-net.vercel.app`
- Run from: local Codex workstation
- Method: `curl -sS --max-time 20 -o /tmp/<route>.html -w ...`
- Metrics: HTTP status, downloaded HTML bytes, time to first byte, total transfer time

This is not a Lighthouse, Web Vitals, browser CPU, accessibility, or visual-layout audit.
Those checks remain separate from this first baseline.

## Results

| Route | Status | HTML bytes | TTFB | Total |
| --- | ---: | ---: | ---: | ---: |
| `/` | 200 | 111,408 | 0.149s | 0.404s |
| `/contact` | 200 | 53,030 | 0.327s | 0.427s |
| `/listings` | 200 | 38,018 | 0.146s | 0.193s |
| `/services` | 200 | 47,199 | 0.290s | 0.415s |
| `/services/property-intelligence-report` | 200 | 51,914 | 0.291s | 0.373s |

## Header Context

- `/` returned `x-vercel-cache: HIT`, `x-nextjs-prerender: 1`, and `content-length: 111408`.
- `/listings` returned `x-vercel-cache: HIT`, `x-nextjs-prerender: 1`, and `content-length: 38018`.
- `/contact` returned `x-vercel-cache: MISS` and `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`, matching its dynamic route behavior.

## Interpretation

- The sampled Vercel routes responded successfully and quickly from this machine, with total transfer times below 0.5s for the sampled HTML responses.
- The homepage is the largest sampled HTML response at 111 KB.
- `/contact` is dynamic and should be watched separately after DNS cutover because it cannot be treated like a prerendered static page.

## Re-run Commands

```bash
curl -sS --max-time 20 -o /tmp/malickland-home.html -w '/ %{http_code} size_download=%{size_download} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' https://malickland-net.vercel.app/
curl -sS --max-time 20 -o /tmp/malickland-contact.html -w '/contact %{http_code} size_download=%{size_download} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' https://malickland-net.vercel.app/contact
curl -sS --max-time 20 -o /tmp/malickland-listings.html -w '/listings %{http_code} size_download=%{size_download} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' https://malickland-net.vercel.app/listings
curl -sS --max-time 20 -o /tmp/malickland-services.html -w '/services %{http_code} size_download=%{size_download} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' https://malickland-net.vercel.app/services
curl -sS --max-time 20 -o /tmp/malickland-report.html -w '/services/property-intelligence-report %{http_code} size_download=%{size_download} time_starttransfer=%{time_starttransfer} time_total=%{time_total}\n' https://malickland-net.vercel.app/services/property-intelligence-report
```
