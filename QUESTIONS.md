# Product questions and resolved ambiguities

The build does not block on these choices. Current v1 decisions are:

- **Doodle name:** No personal name was supplied, so UI copy uses “Doodle” and “Good boy!”.
- **Game title:** “Doodle Zoomies” is treated as final.
- **Touch controls:** Excluded from v1 because the hard requirements say keyboard only.
- **Hosting account:** The Pages URL uses the account that owns this repository.
- **Reduce motion:** The system `prefers-reduced-motion` setting disables hit shake. A separate in-game settings screen was not specified among the five required screens.
- **Scenery zones:** The four cached parallax layers provide suburban houses, trees/park, fences/backyards, and sidewalk/school-block visual language. Zone changes are represented by progression and time tint rather than abrupt level transitions.
- **Pattern fairness:** “Full jump length” is interpreted as horizontal travel during `2 × jumpVelocity / gravity`; required gap adds 350 ms of reaction travel at current speed.

Questions for the owner:

1. Should the doodle have a real name for the title and streak message?
2. Is “Doodle Zoomies” the final public title?
3. Which GitHub account should be named explicitly in the Pages URL?
4. Should a visible Reduce Motion toggle be added later, in addition to respecting the operating-system preference?
