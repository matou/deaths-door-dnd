import { getMaximumHp } from "./hp.mjs";

// set NPC/monster HP to their maximum rollable value
export async function maximizeHp(tokenDocument, options, userId) {
    const actor = tokenDocument.actor;
    if (!actor) return;
    if (actor.type != "npc") return;

    try {
        const maxHp = await getMaximumHp(actor);
        await actor.update({
            "system.attributes.hp.value": maxHp,
            "system.attributes.hp.max": maxHp
        });
    } catch (error)
    {
        console.error(`Max NPC HP | Could not evaluate HP for ${actor.name}`, error);
    }
}