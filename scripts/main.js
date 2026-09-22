import { addHpRangeToCombatTracker } from "./tracker.mjs"
import { maximizeHp } from "./hp-max.mjs"

Hooks.on("renderCombatTracker", (app, element) => {
    void addHpRangeToCombatTracker(app, element);
});

Hooks.on("createToken", (tokenDocument, options, userId) => {
    void maximizeHp(tokenDocument, options, userId);
});