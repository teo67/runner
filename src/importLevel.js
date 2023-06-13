export default async (cache, levelName, player) => {
    const cached = cache[levelName];
    if(cached !== undefined) {
        return cached;
    }
    const level = (await import(`../levels/${levelName}.js`)).default;
    level.setPlayer(player);
    cache[levelName] = level;
    return level;
};