export async function getMaximumHp(actor) {
    const formula = actor.system.attributes.hp.formula;
    if (!formula) return null;

    const roll = new Roll(formula, actor.getRollData());
    await roll.evaluate({ maximize: true, allowInteractive: false });

    return roll.total;
}

export async function getMinimumHp(actor) {
    const formula = actor.system.attributes.hp.formula;
    if (!formula) return null;

    const roll = new Roll(formula, actor.getRollData());
    await roll.evaluate({ minimize: true, allowInteractive: false });

    return roll.total;
}

export async function getMinMaxAvgHp(actor) {
    const [minHp, maxHp] = await Promise.all([ getMinimumHp(actor), getMaximumHp(actor) ]);
    const avgHp = Math.ceil((minHp + maxHp) / 2);
    return {
        minimumHp: minHp,
        maximumHp: maxHp,
        averageHp: avgHp
    };
}