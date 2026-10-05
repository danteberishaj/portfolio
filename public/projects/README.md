# Project screenshots

Drop project screenshots in this folder, then reference them in
`components/ProjectGallery.tsx`.

Current files:

- `geoguesser-1.jpg` … `geoguesser-4.jpg`: Geo Guesser (https://geo-guesser-rouge.vercel.app/),
  captured at 1600×1000 from the live site: start screen, street view, expanded guess map, round result.
- `vocis-1.jpg` … `vocis-5.jpg`: vocisXultra Foundation (https://vocis-xultra.vercel.app/),
  captured at 1600×1000: English hero, singers grid, repertoire, past events with booking form, Albanian hero.
- `fjale-1.jpg` … `fjale-5.jpg`: FJALË (https://www.xn--fjal-opa.com/, i.e. fjalë.com),
  captured at 1600×1000: mid-game board, how-to-play dialog, alphabet passport, stats and archive, light theme.
- `offday-1.jpg` … `offday-14.jpg`: Offday (in development, captured from a local build at localhost:3210, no public
  link): landing hero, problem, how it works, features, security, pricing, then the app's team calendar, request
  modal, requests, shifts, employees, assistant, profile, and light theme.

Recommended aspect ratio: **16:10** (e.g. 1600×1000). The gallery crops with
`object-fit: cover` anchored to the top edge.
- `geoapp-1.jpg` … `geoapp-3.jpg`: Geo Guesser World 3D! (Google Play, com.snaxxtech.geoguesser). Composed at
  1600×1000 from the store listing's icon and screenshots: icon with start screen, three phone shots, two tablet shots.
- `canna-1.jpg` … `canna-5.jpg`: GoodCannaNow patient booking (https://app.goodcannanow.com/goodcannanow/),
  captured at 1600×1000 with the form empty: welcome, personal information, address, medical intake, review and consent.
- `chrx-1.jpg` … `chrx-6.jpg`: CannaHealRx booking (https://app.cannahealrx.com/cannahealrx/book/), captured at
  1600×1000 with no patient data: step one, state dropdown, date and time picker, patient info, questionnaire, uploads.
- `incentiv-1.jpg` … `incentiv-8.jpg`: Incentiv Portal (https://portal.incentiv.io/) public screens at 1600×1000:
  sign-in, returning sign-in, wallet recovery, then five sections of the public site incentiv.io. Nothing behind sign-in.
- `bayyinah-1.jpg` … `bayyinah-6.jpg`: Bayyinah TV marketing site (local Nuxt build at localhost:3000, no public link), captured at
  1600×1000: hero, courses, why Bayyinah, popular videos, pricing, community.
- `ds-1.jpg` … `ds-7.jpg`: Vianova Design System (private package `@vianovaai/design-system`, v1.1.6, no link by the
  owner's request). These are not screenshots of a site: they are 1600×1000 boards composed for this page and rendered
  in headless Chromium from the package's real components on its `main` branch, with synthetic data: cover, tokens,
  measured contrast, a product screen, forms and pickers, overlay layers, and the release pipeline. Every figure on them
  was read from the repository on 2026-10-03 (41 components, 868 tokens, 1,530 contrast probes in 6,120 state series,
  2,591 unit and accessibility tests, 44 decision records, 506 commits), and the contrast ratios on the third board
  are computed in the render itself. Key content sits in the middle 64% of each board and above the bottom 7%, so the
  gallery's cover crop keeps it on phones and wide screens. Where the frame is narrower than that (tablet portrait and
  some small laptop widths), `.case-ds` in `app/globals.css` shows the whole board with `object-fit: contain` instead;
  the boards fade to the frame colour at the top and bottom so the letterboxing has no seam.
- `connect-1.jpg` … `connect-6.jpg`: Vianova Connect, the clinician dashboard of Vianova's remote care platform (a
  Nuxt 2 application, v3.5.10, behind sign-in, no link by the owner's request). Captured on 2026-10-05 from its
  development environment with the owner signed in, re-rendered at 1600×1000, and composed for this page: cover,
  the overview screen, billing thresholds, alerts, a test patient's chart, and the phone layout. Slides 2 and 5 are
  the real screens at full size; the others are zoomed crops of the overview on a stage. All figures are test data,
  the patient is a test patient, and every person's name was replaced with a made-up one before the capture left the
  page. `.case-connect` shares the narrow-frame rule described above.
- `connect-7.jpg`: Vianova Connect's appointments calendar with the Add Event panel, composed at 1600×1000 from two
  screenshots the owner took of the same development environment. It sits between the patient chart and the phone
  layout in the slideshow. The attendee's name and the truncated patient name in the calendar events were redrawn
  with the same made-up names as the other slides.
- `connect-8.jpg`, `connect-9.jpg`: Vianova Connect's chat, composed at 1600×1000 from four more of the owner's
  screenshots: the Chats page with the members dialog, then the docked inbox and chat windows over the overview with
  the minimised chat bubbles. They follow the appointments slide. Every colleague's name in the thread list, the
  members list and the "joined the group" notices was redrawn with a made-up name, or dropped where the account
  name carried a role after it; obvious test labels such as "QA RTM Test" were left as they are.
