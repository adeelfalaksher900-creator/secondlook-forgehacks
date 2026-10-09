# ForgeHacks requirement and judging review

Track: AI + Cybersecurity. The official prompt asks for AI that helps people recognize, prevent, verify, or respond to scams, impersonation, and modern fraud.

| Requirement or criterion | Shipped evidence | Remaining limitation |
| --- | --- | --- |
| Real-world problem and target users | Suspicious scholarship, delivery, and account requests; student and everyday-reader verification workflow | No user study or measured fraud reduction |
| Working AI implementation | Trained TF-IDF/logistic regression model; 9,819 learned features; inference in browser | Historical SMS spam domain, not a modern fraud benchmark |
| Correctness and technical depth | Deduplication before split; 1,026 held-out probabilities matching Python; measured precision, recall, confusion matrix | Near-duplicate templates may remain; domain shift |
| Original product approach | Local inference, separate observational cues, transparent contributions, independent verification plan | Similar triage tools exist; no novelty claim about the classifier |
| Execution | Public working static app, synthetic interactive examples, guide, model page, mobile layout | Unsupported languages and short/unfamiliar text suppress score |
| Public source and README | Public GitHub; training, runtime, tests, attribution, MIT license, architecture | Development requires Python/Node; model is included |
| Screenshots and architecture | 15 1920×1080 gallery PNGs, including real app states and architecture | Mobile gallery panel is a presentation of an actual mobile capture |
| Public 2–4 minute video | 160-second continuous actual workflow; deterministic HyperFrames composition, captions | Liam narration completed through vidIQ Free-plan credits; English captions included; YouTube/Vimeo upload pending Google account verification |
| Security and accessibility | XSS test, no URL fetches, no storage/inference backend; CSP; four axe-tested states | Targeted checks, not independent security or accessibility certification |
| Presentation | Problem, explanation, limitations, impact and next steps in Devpost story | No claim of guaranteed award or real-world safety |

Submission remains a draft. The user retains the final Submit action. Both Adeel Falak Sher and Raouf Khalid are visible as team members in Devpost.

Official prompt: https://www.forgehacks.dev/
Event rules: https://forgehacks-2026.devpost.com/rules
Dataset: https://archive.ics.uci.edu/dataset/228/sms%2Bspam%2Bcollection
