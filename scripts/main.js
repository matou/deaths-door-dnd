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

Hooks.once("init", () => {
    game.settings.register("deaths-door-dnd", "bloodiedBasis", {
        name: "Bloodied HP basis",
        hint: "Choose which HP value determines how much damage makes an NPC bloodied. This module maximizes HP for NPCs: a monster with 2d8+2 will always get 18 maximum HP. But for the bloodied status, the default is to make it bloodied, once it takes enough damage, so it would be bloodied if it had the average maximum HP (as typically stated on the stat block). You can choose to take the maximum or minimum HP as a basis, instead.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            maximum: "Maximum HP",
            minimum: "Minimum HP",
            average: "Average HP"
        },
        default: "average"
    });

    game.settings.register("deaths-door-dnd", "trackDamage", {
        name: "Track damage instead of HP",
        hint: "By default, the combatant cards in the combat tracker get information added, that shows the damage taken and the range of the minimum to maximum rollable HP for an NPC/monster. Disable this to track HP rather than damage.",
        scope: "world", 
        config: true,
        type: Boolean,
        default: true
    });
});
