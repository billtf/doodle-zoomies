# Product questions and resolved ambiguities

The build does not block on these choices. Current v1 decisions are:

- **Doodle name and coat:** The player chooses both before the first run and can reopen customization with C. “Doodle” and apricot are safe defaults.
- **Customization input:** Arrow keys cycle eight fixed coat presets; typing is captured in a dedicated text-input mode. Enter saves, while Escape restores the prior profile.
- **Coat rendering:** Six animation states with six frames each are regenerated into offscreen canvases only when the selected preset changes.
- **Game title:** “Doodle Zoomies” is treated as final.
- **Touch controls:** Excluded from v1 because the hard requirements say keyboard only.
- **Hosting account:** The Pages URL uses the account that owns this repository.
- **Reduce motion:** The system `prefers-reduced-motion` setting disables hit shake. A separate in-game settings screen was not specified among the five required screens.
- **Scenery zones:** The four cached parallax layers provide suburban houses, trees/park, fences/backyards, and sidewalk/school-block visual language. Zone changes are represented by progression and time tint rather than abrupt level transitions.
- **Pattern fairness:** “Full jump length” is interpreted as horizontal travel during `2 × jumpVelocity / gravity`; required gap adds 350 ms of reaction travel at current speed.

Questions for the owner:

1. Is “Doodle Zoomies” the final public title?
2. Which GitHub account should be named explicitly in the Pages URL?
3. Should a visible Reduce Motion toggle be added later, in addition to respecting the operating-system preference?
