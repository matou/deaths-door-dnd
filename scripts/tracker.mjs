import { getMinMaxAvgHp } from "./hp.mjs";

const COMBATANT_SELECTOR = ".combatant[data-combatant-id]";

async function getHpRangeData(actor) {
    try {
        const hp = actor.system.attributes.hp;
        const currentHp = Number(hp.value);
        const hpRange = await getMinMaxAvgHp(actor);
        const currentDamage = hpRange.maximumHp - currentHp;

        // Actor becomes eligible to be defeated (purple) once it has taken as much or more damage than its minimum rollable HP.
        const purpleThreshold = hpRange.maximumHp - hpRange.minimumHp;
        const purple = currentHp <= purpleThreshold;

        // Once the damage exceeds the average rollable HP, the hint for it to be defeated becomes stronger (amber).
        const amberThreshold = hpRange.maximumHp - hpRange.averageHp;
        const amber = currentHp <= amberThreshold;

        const cardText = game.settings.get("deaths-door-dnd", "trackDamage") 
            ? `Damage: ${currentDamage} (${hpRange.minimumHp}\u200A–\u200A${hpRange.maximumHp})`
            : `HP: ${currentHp} (min ≤ ${purpleThreshold}, avg ≤ ${amberThreshold})`;

        return {
            purpleThreshold: purple,
            amberThreshold: amber,
            text: cardText
        }
    } catch (error) {
        console.error("Failed to calculate HP range: ", error);
        return null;
    }
}

function getCombatTrackerRoot(app, element) {
    if (element instanceof HTMLElement) return element;
    if (element?.[0] instanceof HTMLElement) return element[0];
    return app?.element instanceof HTMLElement ? app.element : null;
}

export async function addHpRangeToCombatTracker(app, element) {
    const root = getCombatTrackerRoot(app, element);
    if (!root) return;

    // Only do something when there's active combat. 
    const combat = app.viewed ?? game.combat;
    if (!combat) return;

    const rows = root.querySelectorAll(COMBATANT_SELECTOR);
    await Promise.all(Array.from(rows, async (row) => {
        const combatant = combat.combatants.get(row.dataset.combatantId);
        const hpRange = await getHpRangeData(combatant?.actor);

        // Highlight the card when thresholds are reached.
        row.classList.toggle("deaths-door-purple", hpRange.purpleThreshold);
        row.classList.toggle("deaths-door-amber", hpRange.amberThreshold);

        // Add the HP range information
        const hpRangeAdded = row.querySelector(".deaths-door-hp-range");
        const name = row.querySelector(".token-name, .combatant-name");
        if (!name) return;

        const hp = hpRangeAdded ?? document.createElement("span");
        hp.classList.add("deaths-door-hp-range");
        hp.title = "current HP (defeated range)";
        hp.textContent = hpRange.text;
        if (!hpRangeAdded) name.append(hp);
    }));
}