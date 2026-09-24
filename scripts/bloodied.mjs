import { getMinMaxAvgHp } from "./hp.mjs";

export async function updateBloodiedDeathsDoor(actor) {
    try {
        const hpRange = await getMinMaxAvgHp(actor);
        const hp = actor.system.attributes.hp;
        const bloodiedBasis = game.settings.get("deaths-door-dnd", "bloodiedBasis");
        const selectedHp = {
            maximum: hpRange.maximumHp,
            minimum: hpRange.minimumHp,
            average: hpRange.averageHp
        }[bloodiedBasis];
        const bloodiedThreshold = hpRange.maximumHp - selectedHp / 2;
        const isBloodied = hp.value <= bloodiedThreshold;

        const effectId = "dnd5ebloodied000";
        const effect = actor.effects.get(effectId);
        if (!isBloodied) return effect?.delete();
        if (effect) return effect;

        return ActiveEffect.implementation.create({
            _id: effectId,
            img: CONFIG.DND5E.bloodied.img,
            flags: { dnd5e: { isTemporary: true } },
            name: game.i18n.localize(CONFIG.DND5E.bloodied.name),
            statuses: ["bloodied"],
            showIcon: CONST.ACTIVE_EFFECT_SHOW_ICON?.CONDITIONAL
        }, { parent: actor, keepId: true });
    } catch (error)
    {
        console.error(`Death's Door | Could not update Bloodied for ${actor.name}`, error);
    }
}
