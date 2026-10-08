# Security review

Threats considered: executable pasted content; dangerous links; message leakage; misleading results; malformed text and Unicode; unbounded input; stale results.

- Input is treated as data. No HTML parser, eval, or LLM instruction channel. Evidence inserted with textContent. A browser test pasted an onerror payload and verified it did not execute or create an image.
- URLs are parsed locally and displayed as plain text, never fetched or rendered as links. Documentation links have noopener and noreferrer.
- No backend, storage, analytics or message transmission. Ordinary host access logs still see asset requests. Input cap: 6,000 characters; at most 12 URL observations.
- No “safe” output. Probability is explicitly historical spam-pattern score, not fraud probability. Scope-limited inputs suppress the ML score. Request cues can flag benign mentions; evidence is observational, not an accusation.
- Input changes invalidate the result. Clear removes current text and visible result. Reload does not restore text.
- Deployment headers: self-only CSP; nosniff; no-referrer; frame-ancestors none; restrictive permissions policy. Verify live headers after publication.
- Runtime has no npm dependencies or embedded credentials. Training/development dependencies are separate. Automated security checks are targeted tests, not an independent penetration-test certification.

Residual risks: false negatives, false positives, near-duplicate evaluation leakage, domain shift, unsupported languages, deceptive familiar wording, fake/missing URLs, compromised devices or extensions. Link structure alone cannot establish maliciousness. Rule cues do not understand negation or quotation.
