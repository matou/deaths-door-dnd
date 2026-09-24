# Death's Door D&D

A FoundryVTT (D&amp;D 5e) module to track monster's HP as ranges rather than fixed HP.

## Hit Point Ranges

To determine, how many Hit Points (HP) a monster has in Dungeons & Dragons (5th edition), the stat blocks generally provide a Hit Point dice formula, as well as an average HP value. If the stat block states HP as 2d8+8, then its HP can be determined by rolling two 8-sided dice, adding the results and then adding the fixed value 8 to that. 

To making using monsters simpler and quicker, usually also the average of that is supplied. The average roll of a D8 is 4.5, so the average HP of 2d8+8 would be 4.5+4.5+8 = 17. 

However, some Dungeon Masters (DM) do not like using a fixed HP value for a given monster (even if it is determined randomly by dice). That's because, a combat encounter often has an intended difficulty. But it is notoriously difficult to get the difficulty feeling just right with fixed monster statistics. 

Another way to play is to use HP ranges: the minimum rollable HP for the above formula is 1+1+8=10, while the maximum is 8+8+8=24. So the monster's HP could be in a *range* of 10-24. The DM could now decide that once the monster takes 10 or more damage, it is *eligible* to be defeated. I.e., if the monster has taken 10 or more damage, the DM can declare it defeated; they can also keep it alive for longer, but only until it has taken 24 or more damage. 

This way, the encounters can be more dynamically adapted to how the fight should *feel*. 

## The Death's Door D&D Module for FoundryVTT

To facilitate *Hit Point Ranges* in FoundryVTT, I've come up with this module. It does these things: 

- Set the monster's HP to their maximum rollable value when they're added to the scene. 
- Add the HP range information and current HP to the combatant's card in the combat tracker. 
- Once the combatant takes damage of at least its minimum rollable HP, the card in the combat tracker is highlighted purple to show its eligibility to be defeated. 
- Once the combatant takes damage of the average rollable HP, the card is highlighted amber to show that the monster with average HP would be defeated by now. 
- The bloodied status can be configured to be set on half maximum rollable HP, half minimum rollable HP, or half average rollable HP. 
