# Critique de la v2 (8 octobre 2026) · 7,1/10

Quatre regards en parallèle (texte original en anglais), puis une synthèse. Résumé en français : notes.md.

## strategist · 7.4/10

v2 fixes 8 of the 10 issues from the v1 critique. The story now reads in three silent acts, the demo labelling is complete, the match cut from the drawn phone to the real phone at 9.6 s is the best moment, and "Bon. On exagère un peu." keeps the trust the exaggeration could cost. Five growth risks remain: the hook in the first 1.5 s is a still photo where you never see a queue form; 4.6 s of beige UI right after the gag (5.0–9.6 s) is the likely drop-off point; the tumbleweed, the main reason to share, is hard to see; the end card holds for only about 1.3 s; and the caption gives away the twist and reads like a real client case.

**Ce qui marche**

- Curiosity gap: "Pourquoi ?" arrives at 0.8 s and the answer (website) lands around 7.3 s. That is about 6.5 s of open loop, carried by the rewind and the empty-street gag.
- The demo label ("Maison Ardelle / Démo · lieu fictif") is on screen from t = 0, and the fixed DÉMO chip appears on every shop plate, with "Boulangerie · démo" in the search card and in both phones. It is stylish enough that it builds trust without killing curiosity. v1 issue #2 is fixed.
- The match cut at 9.6 s (drawn phone, then real phone at the same size, then a 0.6 s pull-back) with "En ligne." at 110 px and a chime is the clearest moment of the brief's "hybrid motion + real" idea. v1 issue #3 is fixed.
- The crowd tags at 11.25, 11.7 and 12.15 s ("a vu les horaires", "a trouvé la carte", "a écrit sur WhatsApp") show the benefits inside the scene without numbers or testimonials, and each one is a guaranteed service.
- "Bon." with a thump at 13.5 s, then "On exagère un peu." and "débordée": self-aware humour that turns the over-the-top premise into a point for honesty.
- The search scene: "Horaires ?" with a Klein pulse is readable from 6.05 to 7.16 s, and "Ouvert ? Fermé ? Mystère." is strong copy that speaks to shop owners. v1 issue #5 is fixed.
- The loop is clean: the paper slides down onto the exact t = 0 frame, which gives rewatch value.
- Owner rules hold on screen: no price, no counters or percentages, no booking or ordering, contact only through WhatsApp, the word "IA" never appears, French copy and spacing are correct.

**Corrections**

- [major] 5.0–9.6 s (and 16.0–17.85 s) — Retention valley: 4.6 s of flat paper UI (search, then site build) come right after the best gag. This is where a scroller swipes away. Meanwhile the end card is complete only at 16.55 s and held about 1.3 s before the loop, too short for the money frame ("On vous trouve ?" plus the CTA).  
  Correction : Take 0.7 s out of the paper scenes and give it to the end card, keeping 18.0 s total. New T: s4 5.0, s5 6.9, c 8.9, s6 10.3, s8 12.7, end 15.3, loop 17.85, dur 18.0. In the search scene: typing from +0.1 s at 50 characters/s, result card at +0.5, "Site web · aucun" at +0.6, "Horaires · ?" at +0.8, pulse from +0.9 to +1.15, exit at +1.76, so "Horaires ?" stays readable about 1.0 s. In the site scene: siteState step 0.22 from +0.1, so every block is in by +1.28 and holds 0.6 s. The end card is then complete at 15.85 and held 2.0 s. Shift every cue in cues.json after 6.9 s by −0.4 s (search and site cues) or −0.7 s (from the "c" swipe onward); move the chime to 9.0 and the thump on "Bon." to 12.8.
- [major] 0.0–1.5 s — The hook is a still frame with a statement. With camA1 on an inOut curve, the camera barely moves in the first 0.5 s. The picture shows a dense crowd facing the camera (it reads as a demonstration or event), not a queue, and the tram that proves "jusqu'au tram" is a small strip at the right edge (x 850–1080, y 740–820). "Pourquoi ?" is a 52 px chip, smaller than the statement it questions.  
  Correction : (a) Camera: switch camA1 to E.out and widen the lateral move from off .03 to −.03 (along the queue toward the tram), Z from 1.12 to 1.06. The t = 0 frame (and therefore the loop frame) does not change, but there is visible motion by 0.3 s. (b) Make the queue visible: draw a Klein tracking line just above the heads, from the bakery door (≈ x 520, y 870) to the tram (≈ x 960, y 800), between 0.15 and 0.7 s, ending on the usual tracking dot placed on the tram. (c) Make "Pourquoi ?" bigger: 64 px with the same chip style, still popping at 0.8 s with the existing pop sound.
- [major] 3.3–4.9 s — The tumbleweed gag, the most shareable beat, barely reads. When "seul passant du jour" enters at 3.3 s, its pin points at the right edge of the frame where the tumbleweed can hardly be seen (frame 3.4). At 4.0 s it is a pale grey bush about 180 px wide that blends into the grey street (u 1.0 to .70, scale .72 to .86).  
  Correction : Start it already inside the frame and bring it across the open street: u .95 to .50, v .54 to .57 (keep its centre at y ≤ 1100 px so the tag stays above the title card at y 1140), scale .95 to 1.3. Darken and warm the sprite (brightness .85, contrast 1.25, slight sepia), raise the contact shadow alpha from .35 to .5, and use 2 clear bounces (amplitude .02) with a small dust puff at each landing. Keep the tag from 3.3 to 4.86 s. Sound: a dry scrape or rattle on each bounce, plus a very short two-note whistle at 3.3 s (gain 0.35) under the wind.
- [major] caption (legende.md) — The first line ("Boulangerie à Genève : de la rue vide à la file jusqu'au tram. (Bon, on exagère un peu.)") gives away both the twist and the closing punchline in the feed preview. It also reads like a real client case: the "commerce fictif (démo)" line sits outside the paste block, so the caption never says it is a demo. The service zone (Genève à Montreux) is missing, and so are TikTok search keywords.  
  Correction : Paste instead: "Avant de passer, vos clients vérifient sur leur téléphone si vous êtes ouvert. Ils trouvent quoi ?\n\nSans site : un point d'interrogation… et ils vont ailleurs.\nUn site clair suffit : vos horaires, votre carte, un bouton WhatsApp.\n\nMaison Ardelle est une démo (lieu fictif). La file jusqu'au tram, on l'a un peu exagérée.\n\nCommerce de Genève à Montreux ? Maquette offerte : écrivez-nous sur WhatsApp (lien dans la bio).\nVous connaissez un commerçant sans site ? Envoyez-lui ce Reel.\n\n#genève #lausanne #montreux #commercelocal #siteweb"
- [minor] 15.3–17.85 s (end card, after the retiming) — The CTA is clear ("Maquette offerte sur WhatsApp"), but it does not say where to tap and does not say who the offer is for. @oonde_studio repeats the account name that Instagram and TikTok already show over the video, while the zone "de Genève à Montreux" appears nowhere in the video. Every on-screen signal says "Genève", so a shop owner in Lausanne, Vevey or Montreux may think the offer is not for them.  
  Correction : Replace "@oonde_studio" with the mono line "GENÈVE → MONTREUX" (30 px, right-aligned at x 940, y 1308). Keep "On vous trouve ?" (a yes/no question, which drives comments). That makes 9 words, one over the 8-word house rule; the trade is worth it. Off-video: put a wa.me link in both bios with a prefilled message "Bonjour OONDE, je voudrais ma maquette (Reel boulangerie)" so leads can be traced to this Reel, and pin a comment: "Maquette offerte : le lien WhatsApp est dans la bio." Never reply to comments with any promise of a Google position.
- [minor] legende.md · alternative hooks — Alt 1 ("Pourquoi cette file jusqu'au tram ?") is the same opening reworded into the caption, so a Trial Reel would learn nothing from it. Alt 2 ("Même boulangerie, 3 semaines plus tôt : personne.") gives the reveal away first and asks no question.  
  Correction : Test one real variable per Trial Reel. Test A, absurd hook: same edit, with the card at t = 0 reading "Une file / jusqu'au tram. / Pour du pain." (the third line pops at 0.6 s, replacing the "Pourquoi ?" chip). Test B, pain-first cold open built only from existing scenes: B (empty street, tumbleweed already rolling at t = 0, "seul passant du jour" at 0.3 s, card "7 h 42. Personne.") from 0 to 2.2 s, then search 2.2–4.1, site 4.1–6.1, C "En ligne." 6.1–7.5, crowd with "Une file jusqu'au tram." then the 3 tags 7.5–10.2, baker 10.2–12.8, end card 12.8–15.1, looping back to B. This tests whether shop owners stop more for their own pain (an empty shop) or for the spectacle (a crowd).
- [minor] 2.95–3.5 s and 13.5–13.95 s — Two-beat punchlines show a layout glitch. At 2.95 s, "Même boulangerie." sits in a card already sized for two lines, so for 0.55 s it is a half-empty white box that looks like a loading bug. At 13.95 s, the "Bon." card jumps in width and height when line 2 appears, pulling the eye off the baker's laugh right on the joke.  
  Correction : Use two stacked cards instead of one card that grows. "Même boulangerie." goes in a card at y 1140; "Personne." goes in its own card at y 1262 (same 88 px, same x 80), rising at 3.5 s. Likewise "Bon." goes in a card at y 330 at 13.5 s (12.8 s after the retiming), and "On exagère un peu." in a second card at y 452, rising 0.45 s later. Each card keeps a fixed size.
- [minor] 2.8–5.0 s — "Même boulangerie." is true only because of the painted sign. B is a different building: the door is at the left (at the right in A), the upper floors have balconies instead of shutters, and the street curves with tram rails. People who rewatch, and the comments, can call it out ("c'est pas la même"). That hurts credibility for an agency selling "pro".  
  Correction : Pipeline workaround: add 5 % warmth to plate B to match A's grade, and in camB keep the sign and doorway as the visual anchor (cp x .45, Z 1.10 to 1.16) so the eye locks on what matches. Real fix (needs new AI imagery): make B from A by removing the people with an AI retouch of the same image (same camera, same façade), with the baker in the doorway.  
  (demande de nouvelles images)
- [minor] 0.0–2.2 s, 11.0–16.0 s, loop seam at 17.85 s — The crowd ambience still comes from synthetic voices (v1 issue #10 was only partly addressed: the rewind is −3 dB). On AI still images, a fake-sounding crowd is the second thing that gives the image away. The loop also restarts the crowd at full gain at 0.0 s with a 0.04 s fade, after the end-card music, which makes an audible seam.  
  Correction : Record 20 s of real morning street sound on an iPhone (for example Rue du Marché or the Plainpalais market around 7–8 am; free, no AI needed) and replace the 'crowd' events with it, music at −6 dB underneath. For the loop, start a 'crowd' event at 17.85 s (span 0.15, fade 0.12, gain 0.8) so the sound is already present when the t = 0 frame returns.

## art-director · 7.1/10

This is a clear step up from v1, which scored 6.0 on this lens. The painted MAISON ARDELLE sign on both plates, the tight drawn-to-real phone match cut at 9.6 s and the drop back onto frame 0 make it read as one designed system rather than a template. Four things still give it away as Ken Burns on AI stills: the oversized, floating tumbleweed, the CapCut-style rewind, the same slow push on every frozen plate, and plates A and B being two different photos. Fix those and pull the search card out of the action-button column, and it reaches about 8.

**Ce qui marche**

- Match cut at 9.6 s is the best moment in the piece. The real screen's top edge lands exactly on the drawn one (x 204-876, y 574; 7:42 status bar on both). Then a 0.6 s ease-out pull-back reveals the hand and the queue, with no flash. That is the 'jeune génie' gesture.
- Plate B now carries the same painted 'MAISON ARDELLE' (Cormorant, same rule underneath, sign roughly in the same spot as on A). 'Même boulangerie.' is believable at Reel speed.
- One tracking language joins photo and UI: white corner brackets, white leader lines, Klein dots that echo the dot in the OONDE logo, mono chips. It reads like a product, not Canva.
- Type hierarchy holds on a phone: 132/110 px titles on paper, 88 px cards on photos, 46 px tags, 30 px mono chips. Cormorant for the fictional client against Instrument Sans for OONDE separates the two voices.
- 'DÉMO · LIEU FICTIF' is on screen from t = 0 and pinned at right 940 / top 250 on every plate showing the shop, clear of the top UI.
- Exits are clean on all 9 cuts: overlays leave 0.14 s before each cut and there are no hybrid frames.
- Search beat is fixed. Typing runs at 40 chars/s, and 'Horaires ?' with its Klein pulse is readable for about 1.1 s.
- Site build is fixed: header already in place, 0.28 s cadence, 'Nos pains' row instead of the empty block.
- Plate D works. The crowd is visible through the shop window, which links it to A. 'Bon.' / 'On exagère un peu.' / 'débordée' land as three comic beats.
- End card is clean: left-aligned Swiss layout, 8 words, a single WhatsApp pill, and the paper drops onto the exact first frame (mean difference 4/255).

**Corrections**

- [major] 2.80-5.00 s — The tumbleweed composite is still the most visible fake.
- At 4.9 s the sprite is about 200 px wide (x 745-950, y 965-1170). It sits at the tram's depth (v .53-.55) but keeps 72-86 % of its original foreground scale, so it is about 2x too big and looks bigger than the tram.
- Its bottom floats above the curb, and the contact shadow (alpha .35, blur 10) can't be seen.
- The hue-key leaves grey cobble halos around the twigs.
- It only moves u 1.0 to .70 (about 150 px in 2.2 s), so it drifts instead of rolling.
- For its first ~0.8 s it sits in the right-side button column (x > 940).  
  Correction : Move it into the free foreground lane between the caption card (bottom y 1375) and the bottom UI. At that depth its original plate scale is correct.
- Size and path: diameter about 140-150 px, contact line y ≈ 1500. Enter from x 1150 at 3.55 s (just after 'Personne.' lands, for comic timing) and roll to x ≈ 380 by 4.85 s, decelerating, with 2 hops (amplitude .02, 0.92 squash at each contact).
- Shadow: ellipse alpha .55, ry = rad × .12, shrinking with hop height.
- Edge: choke the matte from ss(.9,1.04) to ss(.82,.96) and erode 1 px to remove the grey fringe.
- Motion blur: draw 2 ghosts at -6/-12 px along the travel direction, at 30/15 % opacity.
- Tag: 'seul passant du jour' leads it in the same lane (x ≥ 80, y 1395-1475) with a short horizontal leader line.
- Sound: add a dry scrape cue on each hop.
- [major] 5.00-7.30 s — #srch and #res are 920 px wide from x 80, so their right edge is at x 1000. 'aucun' (y ≈ 1190) and the Klein '?' of 'Horaires' (y ≈ 1320) are right-aligned at x ≈ 968. The punchline of the problem beat sits under the Instagram/TikTok like/comment icons, which breaks the project's own x 60-940 safe area.  
  Correction : Set #srch and #res width to 860 px (right edge x 940) so values end at x ≈ 908. Shrink #res canvas from 260 to 210 px so 'Maison Ardelle' at 80 px still fits on one line.
- [major] 2.20-2.80 s — The rewind is still a radial zoom-blur crossfade with a 300×200 white ◀◀ glyph at (390, 780) and a floating 64 px white mono counter at y 1010. It is the only text in the film outside the card/chip system, and it reads as a CapCut preset.  
  Correction : Without video:
- Delete #rwIcon.
- Put the counter in the existing chip slot (x 80, y 1060). The 'GENÈVE · 7 H 42' chip rolls like an odometer '− 1 JOUR' → '− 21 JOURS', one step every 2 frames. At 2.80 it becomes '3 SEMAINES PLUS TÔT': same chip, same position.
- Replace the radial blur with a depth-sweep dissolve in the shader. Bind B as a second texture and pick A or B per pixel by depthA against a threshold that sweeps from far (0) to near (1) between 2.25 and 2.75 s, with a 0.08 soft band. The queue empties from the tram back toward the door.
- Step the sweep at 12 fps (floor(t×12)/12) so it feels like a scrub. Cap blur at .03.
- [major] 0-2.20, 2.80-5.00, 11.00-13.40, 13.40-16.00 s — Every plate gets the same grammar: a frozen still with a slow 5-8 % push-in plus the same lateral parallax sway (camA1 1.06→1.11, camB 1.04→1.10, camA2 1.28→1.34, camD 1.04→1.12). Nobody moves. This is the strongest template / AI-stills tell, and C is perfectly steady for a phone held in a hand.  
  Correction : Give each shot its own camera intent:
- B (2.80-5.00): locked off (Z 1.06 constant, off 0). Stillness sells 'Personne.' and leaves the tumbleweed as the only motion.
- C (10.2-11.0): handheld noise of ±0.0025 cp at 1.3 Hz plus ±0.0015 at 3.1 Hz. The screen quad already follows the camera.
- A2: lateral move instead of a push (cp x .47→.41, Z fixed at 1.32) so the tags slide with parallax.
- D: snap zoom on 'Bon.' (Z 1.04→1.09 in 0.12 s, ease-out, at 13.50 on the thump), then a slow drift.

Add cinemagraph life to A and B:
- 6-10 falling leaves cut from B's yellow tree, drifting at 40-80 px/s.
- 3-4 breath-vapour puffs in A (soft white radial gradients, 6-10 % opacity, 0.8 s life) to sell 7 h 42 in autumn.
- [major] 0-5.00 s — A and B are still two different photos.
- A is shot from low, steeply down the street; B is near-frontal.
- The background spire is slate grey in A and verdigris in B.
- B adds an open door left of the window and a curving street with a big tree.

The painted sign rescues a first viewing, but a Genevan rewatching will see the mismatch.  
  Correction : Pipeline mitigation:
- Hue-shift A's far spire toward B's verdigris (mask: depthA < .12 and the sky region x > 840, y < 520).
- Use the depth-sweep rewind above, with the sign as the pivot: lerp camB's cp so the SIGN_B quad lands on SIGN_A's screen position at 2.80.

The real fix is plate B made as an inpaint of A (same camera, people removed).  
  (demande de nouvelles images)
- [major] whole Reel (crowd 0-2.3, 9.6-16.0; wind 2.75-5.1) — Crowd ambience is still the 16 synthetic sawtooth voices from _kit/make_audio.py crowd_voices, and the wind is synthetic too. Fix 10 from the v1 critique was not done. On 'real' plates, sound is half the illusion.  
  Correction : Replace the crowd with a real street/crowd ambience: a CC0 recording, or 20 s recorded on an iPhone in a Geneva shopping street. Use a real wind loop for B. Keep music ducked about 6 dB under the crowd on A1 and A2.
- [minor] 11.25-13.30 s — The tracking dots sit on faces: 'a vu les horaires' on the older woman's mouth (≈585, 820), 'a trouvé la carte' on the young woman's cheek (≈200, 935), 'a écrit sur WhatsApp' at the man's ear (≈740, 850). It reads like face recognition or surveillance and hides the expressions.  
  Correction : Move the PEOPLE anchors to chest or hands:
- mamie to her scarf (≈585, 910)
- femme to her shoulder (≈215, 1030)
- homme to the phone in his hand (≈770, 905), so 'a écrit sur WhatsApp' literally points at his phone.

Shorten the leader lines to match.
- [minor] 9.35-9.70 s — The match cut is tight but still shows three tells:
- The C quad has a 9 % keystone, so the bottom blocks (the WhatsApp button) jump about 20 px wider at the cut.
- The drawn phone shows a Dynamic Island, but the composited C screen shows a notch.
- C at Z 2.24 is a 1.9x upscale, so the hand and scarf are soft next to a razor-sharp vector screen.  
  Correction : - From 9.35 to 9.60, pre-tilt the drawn phone toward the C quad: matrix3d from quadMatrix, lerped 0→1 with ease-in-out. The geometry then already matches at the cut.
- Use the same notch in both phones: hide .isl in SITE_A and add .notch.
- Give the composited screen 0.4 px blur and lift #glare from 10 % to 14 % for 9.6-10.0 so its sharpness matches the plate.
- [minor] 4.85-5.15 and 15.85-16.20 s — Both paper transitions are plain hard-edged wipes: 1920 px in 0.20-0.22 s with no shadow or blur, so they strobe 700-1000 px per frame. They are the most generic transitions in the cut, while 9.6 shows what this team can do.  
  Correction : Make both object-driven:
- 4.85-5.15 (real → UI, the mirror of 9.6): shrink plate B into the result thumbnail (#resImg is already a crop of B, at x 110, y 840) while the paper fades in around it.
- 15.85-16.20: grow the white 'Bon. On exagère un peu.' card to full frame (radius 22→0, white → paper colour) so it becomes the end card. Keep the 'débordée' Klein dot alive and fly it into the dot of the OONDE logo's O (≈109, 1323).
- If you keep the wipes, add a 40 px soft shadow on the leading edge and extend them to 0.28 s.
- [minor] 7.10-7.50 s — Search → site is a fade-out/fade-in on the same paper, with an almost empty frame around 7.3 s. It's the one PowerPoint-style moment.  
  Correction : Let the Klein '?' of 'Horaires' travel (0.3 s, ease-out) to the dot position of the hours pill in the rising phone and open into 'Ouvert de 7 h à 19 h': the problem becomes the answer. The rest of the card fades at 7.16 as now.
- [minor] 7.30-9.60 and 11.0 / 13.4 / 16.0 s — Picture is off the music grid. At 100 bpm, kicks land on multiples of 0.6 s and hi-hats on the off-beats.
- Site blocks pop at 7.45 / 7.73 / 8.01 / 8.29 / 8.57 and drift against the 8th notes (7.5 / 7.8 / 8.1 / 8.4 / 8.7).
- Cuts at 11.0, 13.4 and 16.0 each land 0.2 s off a kick (only 9.6 is on one).  
  Correction : - Site build: siteState step 0.30 starting at 7.50.
- Retime cuts: s6 10.80, s8 13.20, end 16.20. D gains 0.4 s, so 'On exagère un peu.' reads for about 2.4 s.
- Tags at 11.10 / 11.40 / 12.00, 'Bon.' at 13.30, 'On exagère un peu.' at 13.80, 'débordée' at 14.40 (kick plus chord change).
- [minor] 7.30-9.60 s — The last block, 'Nos pains' (thumbnails y ≈ 1560-1818, about 8.7 s), lands in the bottom caption zone. Its pop is spent on something viewers won't see, and the build doesn't end on the CTA.  
  Correction : Reorder the build: 'Nos pains' arrives with the hero image, and 'Écrire sur WhatsApp' (y 1384-1491) is the last block at 8.7 s, with a 0.97→1 press scale. The build then ends on the only contact channel.
- [minor] 0.30-1.00 s — The hook promises 'jusqu'au tram', but the tram is a tiny unmarked strip at x 853-1080, y 745-820, half inside the action-button column. The first second barely moves.  
  Correction : Draw the queue: a 3 px white dashed path (8/8 dash) from the window bracket along the heads of the queue, ending on a Klein tracking dot on the tram at about (900, 785). Draw it on from 0.35 to 0.95 s, between the 0.30 tick and the 0.80 pop. It's a line, not a counter.
- [minor] 17.85-18.00 s — The loop is not frame-exact. The paper slide finishes at T.dur, so the last frame (17.967 s) still shows a 21 px paper strip at y 1899-1920. Frame 539 does not equal frame 0.  
  Correction : Use seg(t, T.loop, T.dur - 1/30), or set T.loop to 17.80, so the last frame is clean. Add the leading-edge shadow and blur to this 4-frame slide.
- [minor] 11.00-11.60 s — The bottom ~45 px (y ≈ 1875-1920) of A2 shows vertical clamp-to-edge streaks on the cobbles. camA2 samples past the plate: cp y .62 at Z 1.28 gives v max 1.01.  
  Correction : Set camA2 cp y to lerp(.60, .59), or raise Z to at least 1.32 at the start.
- [minor] 2.80-5.00 and 0-2.20 / 11.00-13.40 s — Two small continuity slips:
- B's apron reads lilac, while the same baker's apron in D is cream.
- The helmeted cyclist with a rack bag at A's right edge still reads as a delivery rider, which implies a service OONDE doesn't offer.  
  Correction : - Desaturate magenta by 70 % in B's apron region (screen ≈ x 60-200, y 1030-1240, mapped to plate coordinates).
- Reframe camA1 (cp x .48→.45, Z 1.10) and camA2 so the cyclist leaves frame right.

## rules · 6.5/10

The on-screen copy is mostly clean. There are no prices, numbers, testimonials or "IA" anywhere, WhatsApp is the only contact, and the site shows only services listed in the conditions. v2 fixed the v1 demo-label problem on the photographic shots. It is not publishable as is, for three reasons. The four photoreal AI plates, plus a signed C2PA "Claude" manifest found in the delivered MP4 and cover, trigger the Instagram and TikTok AI-disclosure rules, which the owner's "never imply AI" rule clashes with, so he has to decide. The caption calls it "Boulangerie à Genève" with no demo mark. And the generic search "boulangerie genève" together with "− 21 jours" adds up to an implied ranking and time-to-result claim that conditions art. 11 says OONDE does not guarantee.

**Ce qui marche**

- No prices, percentages, crowd counters, client numbers or quotes anywhere on screen, in legende.md or in cues.json. The three crowd tags describe fictional demo actions with no figure, so they are not testimonials.
- No on-screen text, caption, alt text or sound cue says or hints "IA".
- Contact is WhatsApp only: the site button "Écrire sur WhatsApp" and the end pill "Maquette offerte sur WhatsApp". "Maquette offerte" matches conditions art. 2 (free, no obligation). The end card has 7 words.
- The demo mark is on the t = 0 autoplay frame ("Maison Ardelle / DÉMO · LIEU FICTIF"), on couverture.jpg and its 3:4 grid crop, on the loop frame, and as an ink pill on all four photo shots (B 2.8–4.86 s, C 9.6–10.86 s, A2 11.0–13.26 s, D 13.4–15.86 s). Both phones and the search card say "Boulangerie · démo".
- Every service shown (hours, menu, WhatsApp button, photos, a Google-style listing) is in the "Site vitrine et fiche Google" offer. No booking, ordering, prices or delivery times.
- "Bon. On exagère un peu." (readable 13.95–15.86 s, about 1.9 s) works as an explicit hyperbole disclaimer, and a queue reaching the tram is obvious exaggeration, which Swiss unfair-competition law (UWG/LCD) allows.
- On-screen French is correct: É and Ô accented in capitals, curly apostrophes, non-breaking spaces in "Pourquoi ?" and "On vous trouve ?", Swiss time format "7 h 42" and "de 7 h à 19 h", vouvoiement, "débordée" agrees with the baker.
- The sound is all original synthesis (crowd, wind, rewind, pops, chime, thumps, a generic droplet sweep). There is no voice, no licensed music and no WhatsApp or Apple signature sound.
- The name "Maison Ardelle" was checked in script.md, and a fresh web search found no business of that name.
- The search UI has no logo, so it does not imitate Google's trade dress.

**Corrections**

- [critical] Whole Reel: plates A 0–2.8 s and 11.0–13.4 s, B 2.8–5.0 s, C 9.6–11.0 s, D 13.4–16.0 s, plus file metadata — The Reel is built on photorealistic AI images of people in a recognisable Geneva street. Meta requires the AI disclosure on organic posts with photorealistic video that was digitally created or altered, and TikTok requires its AI-generated-content label on realistic AI images or video. The deliverables 09-foule-geneve.mp4, video.mp4 and couverture.jpg (and gen/plan-*.jpg) also carry a signed C2PA Content Credentials manifest ("Anthropic Claude Content Signing": "Claude provided this file … may have created or modified the file contents"), which both platforms read and can use to label automatically. If posted unlabeled, it risks removal, a forced label or reduced reach. If labeled, it sits against the owner's rule "never imply AI". Visual giveaways make this worse: melted, ghostly faces in the background crowd of A (cover x 660–1080, y 820–1100).  
  Correction : This needs the owner's explicit decision before posting. Recommended: turn the disclosure on (TikTok "Contenu généré par l'IA", Instagram "Étiquette IA" in advanced settings). It describes the footage, not OONDE's websites, and every on-screen and caption word stays free of "IA" as it is now. Do not strip the Content Credentials to avoid the label: that would itself break platform rules. If the owner refuses any AI label, the only compliant route is replacing A–D with real photos shot in Geneva (no AI). Separately, reduce the giveaways in the shader: on plate A, add a defocus of about 4 px where depth is below 0.45 (focus f = 0.55) so the far crowd reads as background blur rather than distorted faces. Then re-export the cover.
- [major] Caption (legende.md), first line and hashtags — The text to paste opens with "Boulangerie à Genève : de la rue vide à la file jusqu'au tram." It presents a fictional shop as a real Geneva case study. The note "Maison Ardelle est un commerce fictif" sits outside the paste block, so it never gets published. Other issues: "Un site clair suffit" and "Sans site, ils tombent sur un point d'interrogation… et vont ailleurs" are absolute result claims (conditions art. 11 rules out guaranteeing a number of clients). The service zone (Genève to Montreux) is missing, and #suisseromande suggests a wider area. Typography: straight apostrophes and ordinary spaces before ":", so Instagram can push ":" to the start of a line.  
  Correction : Replace the block with this text, using ’ apostrophes and a no-break space (U+00A0) before each ":":

Démo · boulangerie fictive à Genève : de la rue vide à la file jusqu’au tram. (Bon, on exagère un peu.)

Avant de passer, beaucoup de clients regardent sur leur téléphone si vous êtes ouvert.
Sans site, ils tombent souvent sur un point d’interrogation… et vont ailleurs.
Un site clair, c’est vos horaires, votre carte et un bouton WhatsApp.

Pour les commerces de Genève à Montreux.
Envoyez ce Reel à un commerçant qui n’a pas encore de site.
Maquette offerte : écrivez-nous sur WhatsApp, lien dans la bio.

#genève #lausanne #montreux #boulangerie #commercelocal #siteweb

Alternative hook 1 must still start with "Démo · ".
- [major] 5.0–7.3 s (search) together with 16.0–17.85 s ("On vous trouve ?") — The search is the generic category query "boulangerie genève", and it returns Maison Ardelle as the single result card. The end card then asks "On vous trouve ?". Together they suggest that with OONDE you get found when people search "boulangerie genève", which is an implied ranking promise. That breaks the owner's "no Google ranking promise" rule and conditions art. 11 ("Nous ne garantissons pas de position dans Google"). It is also unrealistic: a generic query shows a list or map of several bakeries, not one card.  
  Correction : Make it a name search. In S4, set q = 'maison ardelle': 14 characters at 40 characters/s types from 5.20 to 5.55 s. Keep the card at 5.70 s, "Site web · aucun" at 5.85 s and "Horaires · ?" at 6.05 s. In cues.json, change the "type" event to n 14, span 0.35. The story then becomes "people who look you up by name get no hours", and "On vous trouve ?" stays honest.
- [major] 2.2–2.8 s ("− 21 jours"), 2.85–4.86 s ("3 SEMAINES PLUS TÔT"), legende.md alternative hook 2 and alt text — A specific delay is tied to a result. Empty street, then a site, then a queue to the tram within 21 days reads as "results in 3 weeks". "On exagère un peu" only admits the size of the crowd, not the timing. This risks the rule "no promised delays" and the art. 11 disclaimer about the number of clients, and it is the most concrete number in the Reel.  
  Correction : Remove the number and keep the rewind. Set #rwTc to a fixed "Avant" (64 px mono), fading in with the ◀◀ at 2.31 s, and drop the day counter. Change #s3chip to "Avant · 7 h 42" (mono 30 px, x 80, y 1060), which mirrors "Aujourd’hui · 7 h 42" at 11.05 s. In legende.md, change alternative hook 2 to « Même boulangerie, avant : personne. » and the alt text "Retour trois semaines en arrière" to "Retour en arrière".
- [major] 2.06–2.80 s, 4.86–5.00 s, 5.00–9.60 s (worst at 7.3–9.6 s), 10.86–11.00 s, 13.26–13.40 s, 15.86–16.00 s — The demo mark has gaps. During the rewind the painted sign "MAISON ARDELLE" is readable on A, then B, with no mark. In the drawn site (7.3–9.6 s), "Maison Ardelle" shows at about 65 px while "BOULANGERIE · DÉMO" is only 19 px, under the 44 px legibility floor. The pill also blinks off for 0.14 s before every cut, which leaves bare frames of the fictional shop (any frame can become a thumbnail or screenshot) and makes it read as part of the scene rather than a standing label.  
  Correction : Make #demo one persistent layer from 2.06 s to 16.0 s at the same place (right edge x 940, top y 250). Call demo() in the rewind branch and in S4 and S5 (the ink pill reads on the paper background). Remove its out() at 4.86, 10.86, 13.26 and 15.86 s, and fade it only from 16.00 to 16.12 s under the end-card wipe. Optionally raise it to 34 px mono (pill about 62 px tall), still ending at x 940.
- [minor] 0–2.2 s, couverture.jpg, loop frame 17.85–18.0 s — The cyclist at the right edge of plate A, already flagged in v1, is still there: helmet, bike, and the edge of a black cube delivery backpack. It hints at delivery or online ordering, which OONDE neither offers nor guarantees, and it is on the cover.  
  Correction : Clone the cube bag out in loadPlate('A') with the same stamp as cleanTumbleweed (soft radial mask, offset patch taken from the dark coats to the left). Apply it to the colour plate and the depth map. Region: about x 790–864, y 870–1060 in the 864×1536 plate. Then re-export couverture.jpg. Cropping is not an option, because the tram on the same right edge carries the hook.
- [minor] 7.9–11.0 s (site in both phones) — The "›" chevrons on "Croissant au beurre" and "Pain au levain" suggest product sub-pages or ordering. The offer is "un site d'une page" that sends visitors to WhatsApp.  
  Correction : Delete the <u>›</u> elements from .r1 and .r2 in #siteTpl, so the menu reads as a plain list.
- [minor] 5.3–7.16 s, and 2.2–2.8 s if the counter is kept — "Ouvert ? Fermé ? Mystère." uses ordinary spaces before "?", unlike "Pourquoi&nbsp;?" and "trouve&nbsp;?" elsewhere. The counter "− 21 jours" has a space after the minus sign, which is not standard French typography.  
  Correction : Write "Ouvert&nbsp;? Fermé&nbsp;? Mystère." in #s4s. If the counter survives, use `−${days} jour…` with no space ("−21 jours").
- [minor] Publishing settings (both platforms) — TikTok expects promotion of your own business to be declared. The bio link is the only link: if it goes to a page with email or a form, it breaks the WhatsApp-only rule. Business accounts can only use cleared commercial music.  
  Correction : TikTok: turn on content disclosure > "Votre marque" (label "Contenu promotionnel"). Instagram, own account: no paid-partnership label needed. Point both bio links straight to the wa.me link (TikTok needs a business account to show one). Keep the generated soundtrack. If a platform track is ever added, use only the Meta Sound Collection or the TikTok Commercial Music Library.

## merchant · 7/10

Speaking as a baker in Eaux-Vives: the queue in front of a bakery stops my scroll, the empty street with the baker waiting in her doorway is my real fear shown with dignity, and "Bon. On exagère un peu." makes me trust them. I understand the offer: hours, menu, a WhatsApp button and a free mockup. I'd be tempted to swipe at 5.0 s, when the street gives way to a blank cream "ad" screen. The end card is readable for only about 1.3 s, never says "de Genève à Montreux" and doesn't tell me what to write, so I'd save the Reel but not message yet. v2 fixed v1 items 2 to 9. Item 1 (same camera for the before shot) and item 10 (synthetic crowd sound) are only partly fixed.

**Ce qui marche**

- 0–2.2 s hook: a bakery queue and 'Une file jusqu'au tram.' is my trade, so I stop. 'Démo · lieu fictif' from t=0 doesn't kill the curiosity.
- 2.8–5.0 s: the baker with arms crossed and 'Même boulangerie. Personne.' feels understood, not mocked. The 'seul passant du jour' tumbleweed makes me smile.
- 'Ouvert ? Fermé ? Mystère.' and 'Horaires ?' are exactly the phone calls I get every morning.
- 7.3–9.6 s drawn site: hours, menu and WhatsApp, nothing to manage, no ordering system. I understand what I'd get in 2 seconds.
- 9.6 s match cut from drawn phone to real hand, 'En ligne.' at 110 px with no white flash: v1 issue 3 fixed, and it looks clean and pro.
- 13.4–16.0 s: the laughing baker, 'Bon. On exagère un peu.' and 'débordée' is the best moment. The honesty buys trust.
- The 'DÉMO · LIEU FICTIF' chip stays on every shop shot, and 'Boulangerie · démo' appears in the site and the search card (v1 issue 2 fixed).
- The search proof now reads for about 1.1 s with the '?' pulse; the tumbleweed tag and 'Pourquoi ?' have enough time (v1 issues 5 and 9 fixed).
- The loop from the end card back to the t=0 frame is seamless (v1 issue 4 fixed).
- Compliant: no price, no delay, no Google promise, no AI mention, WhatsApp as the only contact, nothing to order online.

**Corrections**

- [major] 5.00–5.70 — The paper wipe replaces the street with a near-blank cream screen. For 0.7 s all I see is 'Aucun site.' and a half-typed search bar, with nothing from my world. This is where I realise it's an ad for websites and where I'd swipe (about 5.2 s). The search also has no subject: I don't see that it's a CUSTOMER checking before coming, which is the one argument I actually believe (it's only in the caption).  
  Correction : Keep plate B behind the search. Render B frozen at camB(T.s4) with blur 0.06 and gain 0.85, and set #s4 background to rgba(246,245,240,.84) so the baker in her doorway shows through. Card first: #res at +0.15 s (was +0.70), rows at +0.35 and +0.55, '?' pulse at +0.65; type the query in parallel from +0.05 to +0.35 (60 char/s). Add a mono ink chip 'UN CLIENT · 7 H 40' (30 px) at left 80, top 572, and move #srch and #res down 40 px. S4 becomes 2.1 s (T.s5 = 7.10).
- [major] 16.00–17.85 — The end card is complete at about 16.55 and gone at 17.85, so it's readable for about 1.3 s. At 45, at 21 h, I catch 'On vous trouve ?' and a green button, not 'Maquette offerte'. The video never says where you work (only 'Genève'), so a Lausanne or Montreux baker thinks it's not for them. I also don't know what to write if I do message.  
  Correction : Retime T = {s1 0, rw 2.2, s3 2.8, s4 5.0, s5 7.1, c 9.2, s6 10.5, s8 12.8, end 15.4, loop 17.85, dur 18.0}: the end card is built by 15.95 and readable for about 1.9 s. Shift cues.json by the same offsets (chime 9.30, thumps 10.50 and 12.90, end swipe 15.40). Replace '@oonde_studio' (already in the post header) with 'De Genève à Montreux' in the same slot (mono 30 px, right edge x 940, y 1308). Keep 'On vous trouve ?' and the pill. Caption: add 'Des sites simples pour les commerces, de Genève à Montreux.' and 'Envoyez-nous juste le nom de votre commerce sur WhatsApp : on vous prépare la maquette.' Prefill the bio wa.me link with 'Bonjour, je voudrais une maquette pour : …'.
- [major] 10.50–12.80 (now 11.00–13.40) — I don't believe the queue (fine, you admit it), and the labels don't convince me either. 'a écrit sur WhatsApp' is abstract, and 'a vu les horaires' makes me think 'j'ai déjà mes horaires sur Google'. Nothing shows the real gain for a baker: customers asking on WhatsApp instead of calling me during the rush.  
  Correction : Replace tag #t3 with a WhatsApp message bubble next to the man holding the phone: « Il vous reste des tresses ? » (46 px, white bubble with the green WhatsApp icon, left 190, top 1300, right edge at most 940), popping at s6 + 0.80 on the existing droplet cue. It's a question, not an order, so it stays within the WhatsApp-only rule, and 'tresse' is a Swiss detail every Romandie baker recognises. Change #t1 to 'a vu que c'était ouvert' (left 330). Labels at s6 + 0.20, +0.50 and +0.80, so the bubble is readable for about 1.1 s.
- [major] 0.00–2.20 and 10.50–12.80 — It doesn't look like a queue; it looks like extras. Everyone faces the camera and smiles. At t=0 there's a pale, waxy grey face between the woman in the beige coat and the man in the tie (about x 860, y 950), and on a hook frame that also serves as the feed thumbnail, it says 'image IA'. The cyclist at the right edge (x 940–1080, y 1000–1830) carries an insulated delivery box, which suggests delivery.  
  Correction : At plate load (like cleanTumbleweed), clone-patch the ghost face in plate A (about 655, 760 in the 864×1536 plate) with a dark-coat patch from the crowd 60 px to its left. Change camA1 to cp [.46, .5] and Z 1.16→1.20: the right edge falls at u≈0.89, which removes the delivery box and keeps the tram's left half and the whole shop. In S6 add a depth-of-field pass: a new shader uniform that blurs samples where |depth − f| > 0.15, so only the 3 tagged people are sharp. That reads like a real lens and hides the repeated grinning faces. The real cure is a side-on queue along the façade, facing the door, built from plate A (flagged separately).
- [minor] 3.30–4.90 — The 'seul passant du jour' tag arrives at 3.3 s, when the tumbleweed is still half off-frame at x≈1040, so it points at the edge. Once in frame, the ball is see-through, too big for its mid-street depth (about 200 px at tram level) and seems to float past the tram, so it looks pasted on.  
  Correction : Start the path at u 0.92 instead of 1.0 so it's fully in frame by 3.30. Scale sc 0.45→0.55 (was 0.72→0.86) to match that depth. Draw a dark-brown disc under the sprite (radius × 0.8, #4A3A28, 55 % opacity) to fill the hue-key holes. Raise the ground shadow to alpha 0.5 and double the bounce amplitude (.008 → .016).
- [minor] 0.80–2.20 — 'Pourquoi ?', the question that keeps me watching, is a 30 px chip. On my phone, without glasses, it's the smallest thing on screen.  
  Correction : Render 'Pourquoi ?' as a white .cap card at 64 px, left 80, top 1392 (bottom ≤ 1490), still popping at 0.80 s with the pop cue.
- [minor] 2.80–5.00 — 'Même boulangerie.' is still only half true. The painted sign matches, but in B the street curves with tram rails and has a green spire, while A is straight with a grey spire. B's baker wears a lavender apron, but in D it's cream. A shopkeeper who rewatches will notice.  
  Correction : Needs new AI imagery (a still edit, not video): plate A with the crowd erased and the baker in the doorway, same camera, which is the planned B'. Until then, tint B's apron to cream with a hue mask (lilac ≈ #C9B8D8 → #EDE6DA) so B and D read as the same woman.  
  (demande de nouvelles images)
- [minor] 7.30–11.00 — The '›' chevrons on 'Croissant au beurre' and 'Pain au levain' look like product pages or a shop. A baker might think online ordering is included, and that's not a guaranteed service.  
  Correction : Remove the <u>›</u> elements from .row in #siteTpl (affects both the drawn and the real phone). Keep the rows as plain text with hairline separators.
- [minor] 10.50–12.80 (now 11.00–13.40) — Two dark mono chips are stacked and staggered at the top ('DÉMO · LIEU FICTIF' at y 250 on the right, 'AUJOURD'HUI · 7 H 42' at y 330 on the left), so it looks busy right where my eye lands.  
  Correction : Put both chips on one row at top 250: 'AUJOURD'HUI · 7 H 42' at left 80 (≈ 80–440) and 'DÉMO · LIEU FICTIF' with its right edge at x 940 (≈ 500–940). The tags keep their positions.
- [minor] 0.00–2.32, 10.50–15.40 — The crowd bed is still synthetic: cues.json uses generated 'crowd' events, and notes.md does not mention the real ambience the v1 critique asked for. I haven't listened to it, but if the crowd sounds fake on the hook, sound-on viewers swipe sooner.  
  Correction : Replace the 'crowd' events with a real morning street ambience: a 20 s iPhone recording in a Geneva shopping street, or a CC0 recording. Keep the music at −6 dB under it from 0 to 2.2 s and from 10.5 to 15.4 s, and keep the chime on 'En ligne.' and the thump on 'Bon.'.

## Synthèse · 7.1/10

v2 scores 7.1/10, up from 6.4 for v1. The weighted average is 7.4×.30 + 7.1×.30 + 7.0×.25 + 6.5×.15 = 7.08. v2 fixes v1 issues 2 to 9. Issue 1 (same camera for the before shot) and issue 10 (real crowd sound) are only partly fixed.

No cap applies. Nothing on screen breaks an owner hard rule: the demo is marked from t = 0, there are no prices, counters, testimonials, the word "IA", booking or ordering, and WhatsApp is the only contact. The rules lens's issues are real risks rather than breaches, and fixes 2, 5, 8 and 11 close them. Those risks are: a caption with no demo line, "− 21 jours" read as time-to-result, and a generic "boulangerie genève" search next to "On vous trouve ?".

One thing blocks publishing whatever v3 contains: Alexandre has to decide on the platform AI label (fix 11a), because the plates are photoreal AI images and the files carry C2PA Content Credentials.

I checked the disputed points in the sheets myself:
- When "seul passant du jour" appears at 3.3–3.4 s, the tumbleweed is half inside the right button column. At 4.0–4.6 s it is pale, see-through and too big for the tram's depth.
- "aucun" and the Klein "?" sit at x ≈ 968, under the like and comment icons.
- At 12.6 s the tag dots sit on mouths and cheeks.
- The hook barely moves in the first 0.5 s.
- The end card is complete at about 16.55 s and gone at 17.85 s, so it is held about 1.3 s.

The match cut at 9.6 s, the demo labelling and "Bon. On exagère un peu." work as the reviewers said. With fixes 1 to 10, v3 should reach about 8.0. Fix 12 (an AI retouch to make plate B from plate A) is the remaining step to about 8.5, once image-edit credits work.

Files: /mnt/project-files/reels/09-foule-geneve/src/index.html, src/cues.json, legende.md.

1. **5.00–18.00 s (second half)** (strategist, merchant, art-director; effort medium)  
   New timing T = { s1 0, rw 2.20, s3 2.80, s4 5.00, s5 6.90, c 9.00, s6 10.20, s8 12.60, end 15.30, loop 17.85, dur 18.00 }.

What changes: the paper scenes go from 4.6 s to 4.0 s. The cuts at 9.0, 10.2 and 12.6 land on kicks; in make_audio.py the kicks fall on multiples of 0.6 s at 100 bpm. The cuts at 6.9 and 15.3 land on 8th notes. The pull-back in C (9.0–9.6) now ends on the chord change at 9.6.

Inner timings:
- S5: the phone rises 6.90–7.20 with the header already in place, title at 6.92. siteState step 0.30 from 7.20, in this order:
  - hero photo and the "Nos pains" row at 7.20
  - "Ouvert de 7 h à 19 h" at 7.50
  - menu rows at 7.80
  - "Écrire sur WhatsApp" last at 8.10, press scale 0.97→1. The only contact channel then holds 0.9 s and carries over into C.
- C: "En ligne." at 9.10.
- A2: chip at 10.25, tags at 10.50, 10.80 and 11.10.
- D: "Bon." at 12.60, "On exagère un peu." at 13.20, "débordée" at 13.80.
- End card complete by 15.85 and held 2.0 s.
- Loop: use seg(t, T.loop, T.dur − 1/30) so that frame 539 equals frame 0. Today the last frame still shows a 21 px paper strip.

cues.json:
- beat_from 6.9, beat_until 15.3
- music_duck [9.0, 10.2, .6]
- whoosh 6.9; pops 7.2, 7.5, 7.8 and 8.1
- swipe 9.0 with chime 9.05
- crowd 9.0 (span 1.3), 10.2 (span 2.45) and 12.6 (span 2.75)
- thumps 10.2 and 12.6; pops 10.5 and 10.8; droplet 11.1; pops 13.2 and 13.8
- swipe 15.3; end 15.35  
   Pourquoi : Strategist and merchant both put the swipe-away point at 5.0–9.6 s, and the money frame (end card) is readable for only about 1.3 s. The art director measured that the site pops and three of the four cuts drift 0.2 s off the beat. One change to T fixes all three and keeps the length at 18.0 s.

2. **5.00–6.90 s (search)** (merchant, rules, art-director, strategist; effort medium)  
   (a) Name search. Set q = 'maison ardelle horaires', which is what a customer actually types. Typing runs 5.05–5.35 s at about 75 characters/s; the cue becomes type n 23, span .30.

(b) Object transition instead of the flat paper wipe. From 5.00 to 5.30 s, the last B frame (camB frozen) shrinks with E.out into the result thumbnail while the paper fades in around it, so the bakery never leaves the screen. Then:
- 5.30: the card "Maison Ardelle / Boulangerie · démo" resolves (pop)
- 5.45: "Site web · aucun" (tick)
- 5.65: "Horaires · ?" (tick)
- 5.70–5.95: Klein "?" pulse (droplet at 5.70)
- 6.76: everything exits, so "Horaires ?" is readable for 1.1 s.

(c) Give the search a subject. Add the mono ink chip "UN CLIENT · 7 H 40" (30 px) at left 80, top 572, rising at 5.05. Move #srch and #res down 40 px.

(d) Safe area. Set #srch and #res width from 920 to 860 px (right edge x 940), so the values end at about x 908. Shrink the #res canvas from 260 to 210 px so "Maison Ardelle" at 80 px stays on one line.

(e) "Aucun site." rises at 5.10 and "Ouvert ? Fermé ? Mystère." at 5.25.  
   Pourquoi : The merchant would swipe at about 5.2 s: a near-blank cream screen with no customer in it. The rules lens points out that a generic "boulangerie genève" query returning one card, followed by "On vous trouve ?", implies a Google ranking promise; a name search makes a single card realistic and keeps the question honest. The art director found the punchline sitting under the platform icons, and I confirmed it at x ≈ 968 in sheet_6s.

3. **2.80–5.00 s (empty street)** (strategist, art-director, merchant; effort large)  
   Comic order and layout:
- "Même boulangerie." in its own card at y 1140, at 2.95 s.
- "Personne." in a separate fixed-size card at y 1262 (88 px, x 80), at 3.35 s (was 3.50).
- The tumbleweed and its tag come after, as the punchline. Today the tag at 3.30 arrives before "Personne."

Camera: lock camB (Z 1.06 constant, off 0, dz 0). The tumbleweed is then the only thing that moves.

Tumbleweed path: put it back at the foreground depth it was generated at. Its plate position N(697,1187) is screen y ≈ 1505 and about 250 px wide.
- Contact line y ≈ 1560, diameter about 210 px to match the ground depth.
- Enters from x 1180 at 3.40 and rolls, slowing down, to x ≈ 660 by 4.85. Rotation = distance / radius.
- Two hops at about 3.9 and 4.4 s: amplitude about 25 px, squash 0.92 on contact, a small dust puff each time.
- Its top may tuck under the edge of the "Personne." card; that layering is fine.

Sprite clean-up:
- Choke the matte from ss(.9,1.04) to ss(.82,.96) and erode 1 px to remove the grey cobble halos.
- Draw a dark-brown disc under the sprite (#4A3A28, radius r × .8, 55 %) to close the see-through holes.
- Grade: brightness .85, contrast 1.25, sepia .15.
- Contact shadow alpha from .35 to .55, ry = r × .12, shrinking with hop height.
- Two motion ghosts at −6 and −12 px, at 30 % and 15 %.

Tag: "seul passant du jour" pops at 3.65 in the same lane, left of the ball (y ≈ 1420–1500, x ≥ 80). Horizontal leader with a Klein dot on the ball; the tag moves with it. Out at 4.86, so about 1.2 s on screen.

Apron: B's lilac apron goes to cream (hue mask ≈ #C9B8D8 → #EDE6DA, screen region about x 60–200, y 1030–1240, mapped to the plate) so B and D read as the same woman.

Sound: a dry scrape at 3.9 and 4.4 s (gain ≈ .5) under the wind.  
   Pourquoi : Three lenses flag the most shareable gag, two of them as major. In frames 3.4, 4.0 and 4.6 the tag points at the frame edge, and the ball is pale, see-through, drifts only about 150 px, and is about 2× too big for the tram's depth. At its native foreground depth it is both bigger on screen and in correct perspective, which settles the strategist's "make it bigger" against the art director's and merchant's "it's too big".

4. **0.00–2.20 s (hook)** (strategist, art-director, merchant; effort small)  
   Camera (camA1): keep the t = 0 values (cp .48,.5; Z 1.06; off .018), so frame 0, the cover and the loop seam do not change. Switch the curve from E.inOut to E.out, and change the end values to Z 1.13 (was 1.11) and off −.025 (was −.012), a drift along the queue toward the tram. Motion is then visible from 0.2 s.

Queue line: draw a 3 px white dashed line (8/8 dash).
- From the lower-right corner of the window bracket (≈ x 356, y 996).
- Along the heads, y ≈ 900 → 800, passing under the "Maison Ardelle" label.
- Ending on a Klein tracking dot on the tram at ≈ (930, 790).
- It draws on 0.30–0.75 s, starting on the existing 0.30 tick; the dot pops at 0.75. It is a line, not a counter.

"Pourquoi ?": same ink chip, text at 64 px (chip about 100 px tall), left 80, top 1392 (bottom ≤ 1496). It still pops at 0.80 with the existing pop.  
   Pourquoi : The first 0.5 s is a still frame with a statement. The tram that proves "jusqu'au tram" is an unmarked strip at the right edge, and "Pourquoi ?" is smaller than the statement it questions; I confirmed all three on the 0–0.5 s frames. A drawn path turns the crowd into a queue without a number.

5. **2.20–2.80 s (rewind) and the chip at 2.80–5.00 s** (art-director, rules; effort large)  
   Remove: delete #rwIcon (◀◀) and #rwTc (the floating counter), and drop the number completely: no "− 21 jours" and no "3 SEMAINES PLUS TÔT".

Chip: the "GENÈVE · 7 H 42" chip stays in its slot (x 80, y 1060) across the cut. Between 2.25 and 2.75 s its first word rolls odometer-style to "AVANT" (vertical roll, one step every 2 frames). B opens on "AVANT · 7 H 42", which A2 later mirrors with "AUJOURD'HUI · 7 H 42".

Transition: replace the radial zoom-blur crossfade with a depth-sweep dissolve in the shader.
- Bind B as a second texture.
- For each pixel, pick A or B by comparing depthA with a threshold that sweeps from far (0) to near (1) between 2.25 and 2.75 s, with a .08 soft band.
- Step the sweep at 12 fps (floor(t×12)/12). Cap blur at .03.
- Set camB's cp so that SIGN_B lands on SIGN_A's screen position at 2.80; the sign is the pivot.
- If the mismatched geometry shows through in tests, fall back to a hard cut at 2.80 on the thump, with the chip roll as the only rewind signal.

Keep the rewind sound. In legende.md, change the alt text "Retour trois semaines en arrière" to "Retour en arrière".  
   Pourquoi : Art director: the ◀◀ and floating counter are the only text outside the card and chip system, and the effect reads as a CapCut preset. Rules lens: "21 jours" from empty street to a queue reaching the tram reads as "results in 3 weeks". It is the most concrete number in the Reel and goes against the owner's no-promised-delays rule and conditions art. 11. The story does not need the number.

6. **0.00–2.20 s, 10.20–12.60 s, couverture.jpg** (merchant, rules, art-director; effort medium)  
   Clone patches in loadPlate('A'), using the same soft radial stamp as cleanTumbleweed, applied to both the colour plate and the depth map:
- The pale waxy face between the woman in the beige coat and the man in the tie (plate ≈ 655, 760). Take the patch from the dark coats 60 px to its left.
- The black cube bag on the cyclist (plate ≈ x 790–864, y 870–1060).

Depth of field: add a uniform to the shader.
- In A1, blur about 4 px where depth < .45, so the far crowd reads as lens blur rather than melted faces.
- In A2, blur where |depth − .7| > .15, so only the three tagged people are sharp.

Then re-export couverture.jpg and its 3:4 crop.  
   Pourquoi : Frame 0 is both the autoplay frame and the thumbnail. A ghost face and melted background faces are the strongest "AI image" giveaway (merchant: major; rules: part of its critical finding). The cube bag hints at delivery, which OONDE does not offer. Cloning keeps the tram that the hook depends on.

7. **10.20–12.60 s (crowd tags) and 9.60–10.20 s (C)** (art-director, merchant; effort medium)  
   Dots off faces: move the PEOPLE anchors to chest or hands and shorten the leader lines.
- mamie to her scarf (screen ≈ 585, 910)
- femme to her shoulder (≈ 215, 1030)
- homme to the phone in his hand (≈ 770, 905)

Copy:
- #t1 becomes "a vu que c'était ouvert" (left 330, right edge ≤ 940). It calls back to "Ouvert ? Fermé ? Mystère."
- #t2 stays "a trouvé la carte".
- #t3 becomes a WhatsApp chat bubble « Il vous reste des tresses ? »: 46 px, white bubble, green WhatsApp glyph, tail pointing at his phone, left ≥ 190, right ≤ 940, top ≈ 1300. It pops at 11.10 on the droplet. It is a question, not an order.

Camera (camA2): a lateral move instead of a push. cp x goes from .47 to .42, cp y stays at .595, Z stays at 1.32. This also removes the clamp-to-edge streaks on the bottom 45 px (v max becomes .974).

Chips: put both on one row at top 250, "AUJOURD'HUI · 7 H 42" at left 80 and the DÉMO pill with its right edge at x 940.

C: after the pull-back, add handheld noise of ±.0025 cp at 1.3 Hz plus ±.0015 at 3.1 Hz. The frame at the match cut (9.0) stays exact.  
   Pourquoi : With the dots on mouths and cheeks, the tags read like face recognition; I confirmed this in f_12.6 (art director). For a baker, "a écrit sur WhatsApp" is abstract; the real gain is customers asking on WhatsApp instead of phoning during the rush (merchant). The same slow push on every frozen plate is the main template tell (art director).

8. **2.06–15.30 s** (rules, merchant; effort small)  
   Persistent demo pill: make #demo one layer that stays from 2.06 s to T.end (15.30). Call demo() in the rewind branch and in S4 and S5 (the ink pill reads on paper too). Remove its out() 0.14 s before each cut. Fade it only from 15.30 to 15.42, under the end-card transition. Position unchanged: right edge x 940, top 250, 30 px mono.

Chevrons: delete the <u>›</u> elements from the menu rows in #siteTpl. This affects both the drawn and the real phone.

Typography: write "Ouvert&nbsp;? Fermé&nbsp;? Mystère." in #s4s.  
   Pourquoi : Rules lens: the fictional shop is visible without its demo mark during the 0.6 s rewind, through 4.6 s of paper where "Boulangerie · démo" is only 19 px, and for 0.14 s before every cut. Any of those frames can become a screenshot. The chevrons suggest product pages or ordering, which are not guaranteed services.

9. **12.60–15.30 s (baker) and 15.30–18.00 s (end card)** (strategist, merchant, art-director; effort medium)  
   Cards: replace the one growing card with two fixed-size stacked cards. "Bon." at y 330 (12.60) and "On exagère un peu." at y 452 (13.20). "débordée" at 13.80.

Camera (camD): a snap zoom on "Bon.": Z from 1.04 to 1.09 in 0.12 s (E.out) at 12.60, on the thump. Then a slow drift to 1.12 by 15.30.

End transition, replacing the hard 0.2 s paper wipe:
- The "On exagère un peu." card has no out(). Between 15.30 and 15.55 it grows to full frame (radius 22 → 0, white → paper colour) and becomes the end card.
- The "débordée" Klein dot flies (0.3 s, ease-in-out) into the dot of the OONDE logo's O (≈ 109, 1323).

End card copy: replace "@oonde_studio" (the app already shows the account name over the video) with the mono line "GENÈVE → MONTREUX" (30 px, right-aligned at x 940, y 1308). Keep "On vous trouve ?" and the pill. That makes 9 words.  
   Pourquoi : At 13.95 s the card jumps in size right on the joke (strategist). The service zone never appears in the video, so shops in Lausanne, Vevey or Montreux may think the offer is not for them (merchant, owner's zone rule). The end wipe is the most generic transition in the cut (art director).

10. **Whole Reel, plus the loop seam at 17.85 s** (art-director, strategist, merchant; effort medium)  
   Real ambience: replace the synthetic "crowd" events (16 sawtooth voices from make_audio.py) with a real morning street ambience. Either Alexandre records 20 s on an iPhone (Rue du Marché or the Plainpalais market, 7–8 am), or use a CC0 recording. Use a real wind loop for B. Keep the music about −6 dB under the crowd on A1, A2 and D.

Loop seam: add a "crowd" pre-roll at 17.85 (span .15, fade .12, gain .8), so the sound is already there when frame 0 returns. Today it restarts at full gain with a 0.04 s fade, which makes an audible seam.

Keep the hop scrapes (fix 3), the chime on "En ligne." and the thump on "Bon.".  
   Pourquoi : Three lenses flag it, and v1 issue #10 is still open. On AI still images, a synthetic crowd is the second giveaway after the faces. It needs no AI and no budget.

11. **Before posting: platform settings, legende.md, bios** (rules, strategist, merchant; effort small)  
   BLOCKER before posting.

(a) AI disclosure. This is Alexandre's decision. Plates A–D are photoreal AI images, and the MP4 and cover carry a signed C2PA manifest that Meta and TikTok read and can use to label the post automatically. Both platforms require a label on realistic AI imagery, and that collides with his "never imply AI" rule. His options:
1. Post with the platform label. It describes the footage only; nothing on screen or in the caption mentions AI.
2. Replace A–D with OONDE's own photos.
Never strip the Content Credentials to avoid the label.

(b) Caption to paste. Use curly ’ apostrophes and a no-break space (U+00A0) before every ':' and '?':
"Avant de passer, beaucoup de clients vérifient sur leur téléphone si vous êtes ouvert. Ils trouvent quoi ?\n\nSans site, ils tombent souvent sur un point d’interrogation… et vont ailleurs.\nUn site clair : vos horaires, votre carte, un bouton WhatsApp.\n\nMaison Ardelle est une démo (lieu fictif). Et la file jusqu’au tram, on l’a un peu exagérée.\n\nCommerce de Genève à Montreux ? Envoyez-nous le nom de votre commerce sur WhatsApp (lien dans la bio) : on vous prépare une maquette offerte.\nVous connaissez un commerçant sans site ? Envoyez-lui ce Reel.\n\n#genève #lausanne #montreux #boulangerie #commercelocal #siteweb"

(c) Trial Reels: replace both alternative hooks with one real variable. The on-screen card reads "Une file / jusqu’au tram. / Pour du pain.", with the third line popping at 0.6 s in place of "Pourquoi ?".

(d) Settings:
- TikTok: content disclosure > "Votre marque".
- Both bios link to wa.me with the prefilled message "Bonjour OONDE, je voudrais ma maquette (Reel boulangerie)".
- Pinned comment: "Maquette offerte : le lien WhatsApp est dans la bio."
- Never answer comments with a Google position promise.  
   Pourquoi : Rules lens (critical): an unlabelled post risks removal, a forced label or reduced reach. Today's caption opens with "Boulangerie à Genève" and the demo line sits outside the paste block, so it reads like a real client case and gives away the twist (strategist, rules). It also lacks the service zone and uses absolute claims ("suffit").

12. **2.80–5.00 s (and the rewind)** (strategist, art-director, merchant; effort large; nouvelles images)  
   NEEDS NEW AI IMAGERY (blocked until image-edit or video credits work): make B′ from A with an AI retouch. Same camera, same façade and painted sign; the people removed; the baker in the doorway in a cream apron. Optional in the same session: a side-on queue along the façade, facing the door, to use for A2. Until then, fix 3 (apron tint) and fix 5 (sign-aligned rewind) are the mitigations.  
   Pourquoi : A and B are still two different photos: different camera angle, door position, spire colour and street curve. Three lenses expect rewatchers to notice ("c'est pas la même"). B′ makes "Même boulangerie." literally true and lets the depth-sweep rewind run on identical geometry.

**Écarté**

- Strategist: scale the tumbleweed up (.95→1.3) in the middle of the street. Rejected: at the tram's depth it is already about 2× too big (art director, merchant; I confirmed it in f_4.6), so making it bigger there looks more pasted on. Moving it to its native foreground depth (fix 3) makes it bigger on screen and correct in perspective.
- Strategist: "Z 1.12→1.06 keeps the t = 0 frame unchanged". That is wrong, because changing the start Z changes frame 0 and the cover. Fix 4 keeps the start values and changes only the curve and the end values.
- Strategist: a solid Klein tracking line for the queue. Replaced by the art director's 3 px white dashed line ending on a Klein dot, which matches the existing tracking language (white leaders, Klein dots).
- Merchant: keep plate B frosted at 84 % paper behind the search. Text over a busy photo hurts legibility. The art director's B-shrinks-into-the-thumbnail transition keeps the bakery on screen without that cost.
- Merchant: camA1 crop (cp .46, Z 1.16→1.20). Art director: reframe (cp .45, Z 1.10) to lose the cyclist. Both cut into the tram that proves the hook, and the art director's reframe still leaves about half of the cyclist in frame. Clone out the bag instead (fix 6).
- Art director: odometer "− 1 JOUR → − 21 JOURS" / "3 SEMAINES PLUS TÔT". It keeps the time-to-result number the rules lens flagged. The rules lens's floating 64 px "Avant" counter keeps text outside the chip system. Fix 5 merges the two: a word roll inside the chip, with no number.
- Rules lens: defaulting to "turn the AI label on". This touches an owner hard rule ("never imply AI"), so it is escalated to Alexandre as a decision (fix 11a), not decided here. Stripping the C2PA credentials is rejected outright.
- Strategist: a two-note whistle on the tumbleweed. Too cartoonish for "pro, ingénieux, jeune génie"; dry scrapes on the hops instead.
- Art director: falling leaves on B. B must stay still so the tumbleweed is the only passer-by. Breath vapour on A: low return for the effort.
- Art director: hue-shift A's spire toward verdigris. Low return; the real fix is B′ (fix 12).
- Art director: match-cut polish (pre-tilt the drawn phone to the C quad, same notch on both phones, 0.4 px screen blur) and the Klein "?" travelling into the hours pill. Deferred to v4: small gains on the moment that already works best.
- Strategist: Test B, a pain-first cold open. It is a full re-edit; run Test A first, which changes one variable.
- Merchant: "De Genève à Montreux" spelled out on the end card. That makes 11 words; "GENÈVE → MONTREUX" keeps 9 words and matches the mono chip style. The full wording goes in the caption.
- Strategist: search inner timings (typing at 50 characters/s, card at +0.5 s). Replaced by card-first timing that starts from the B thumbnail (fix 2).
- Score cap at 6: not applied. Nothing on screen breaks an owner hard rule. The caption's missing demo line, the "21 jours" timing and the generic search are risks, fixed in 2, 5, 8 and 11. The AI label is a platform-policy decision, not a breach in the video.
