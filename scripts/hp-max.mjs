// set NPC/monster HP to their maximum rollable value
export async function maximizeHp(tokenDocument, options, userId) {
    const actor = tokenDocument.actor;
    if (!actor) return;

    if (actor.type != "npc") return;

    const formula = actor.system.attributes.hp.formula;
    if (!formula) {
        console.warn(`Max NPC HP | ${actor.name} has no HP formula`);
        return;
    }

    try {
        const roll = new Roll(formula, actor.getRollData());
        await roll.evaluate({ maximize: true, allowInteractive: false });

        await actor.update({
            "system.attributes.hp.value": roll.total,
            "system.attributes.hp.max": roll.total 
        });
    } catch (error)
    {
        console.error(`Max NPC HP | Could not evaluate HP for ${actor.name}`, error);
    }
}