import { addHpRangeToCombatTracker } from "./tracker.mjs"
import { maximizeHp } from "./hp-max.mjs"
import { updateBloodiedDeathsDoor } from "./bloodied.mjs"

Hooks.on("renderCombatTracker", (app, element) => {
    void addHpRangeToCombatTracker(app, element);
});

Hooks.on("createToken", (tokenDocument, options, userId) => {
    void maximizeHp(tokenDocument, options, userId);
});

Hooks.once("ready", () => {
    const actorPrototype = CONFIG.Actor.documentClass.prototype;
    const updateBloodied = actorPrototype.updateBloodied;

    actorPrototype.updateBloodied = async function(options = {}) {
        if (this.type === "npc" && this.system.attributes.hp.formula) {
            return updateBloodiedDeathsDoor(this);
        }
        return updateBloodied.call(this, options);
    };
});
