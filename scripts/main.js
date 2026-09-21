const MODULE_ID = "deaths-door-dnd";
const COMBATANT_SELECTOR = ".combatant[data-combatant-id]";

async function getHpRangeData(actor) {
    const RollClass = globalThis.Roll;
    const hp = actor?.system?.attributes?.hp;
    const formula = hp?.formula?.trim();
    const currentHp = Number(hp?.value);
    const maximumHp = Number(hp?.max);

    if (!formula || !Number.isFinite(currentHp) || !Number.isFinite(maximumHp)
        || typeof RollClass !== "function") return null;

    try {
        const rollData = actor.getRollData?.() ?? {};
        const minRoll = new RollClass(formula, rollData);
        const maxRoll = new RollClass(formula, rollData);
        const [minRollableHp, maxRollableHp] = await Promise.all([
            minRoll.evaluate({ minimize: true }),
            maxRoll.evaluate({ maximize: true})
        ]);
        const avgRollableHp = Math.ceil((maxRollableHp.total + minRollableHp.total) / 2);

        // Actor becomes eligible to be defeated (purple) once it has taken as much or more damage than its minimum rollable HP.
        const damageTaken = maximumHp-currentHp;
        const purple = damageTaken >= minRollableHp.total;

        // Once the damage exceeds the average rollable HP, the hint for it to be defeated becomes stronger (amber).
        const amber = damageTaken >= avgRollableHp;

        return {
            currentHp: currentHp,
            maxHp: maximumHp,
            minimumRollableHp: minRollableHp.total,
            maximumRollableHp: maxRollableHp.total,
            purpleThreshold: purple,
            amberThreshold: amber
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

async function addHpRangeToCombatTracker(app, element) {
    const root = getCombatTrackerRoot(app, element);
    if (!root || !game.user.isGM) return;

    // Only do something when there's active combat. 
    const combat = app.viewed ?? game.combat;
    if (!combat) return;

    const rows = root.querySelectorAll(COMBATANT_SELECTOR);
    await Promise.all(Array.from(rows, async (row) => {
        const combatant = combat.combatants.get(row.dataset.combatantId);
        const hpRange = await getHpRangeData(combatant?.actor);

        row.classList.toggle("deaths-door-purple", hpRange.purpleThreshold);
        row.classList.toggle("deaths-door-amber", hpRange.amberThreshold);
    }));


}

Hooks.on("renderCombatTracker", (app, element) => {
    void addHpRangeToCombatTracker(app, element);
});
//Hooks.on("updateActor", refreshHpRangeOnCombatTracker);