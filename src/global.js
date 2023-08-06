const keysDown = {};
document.addEventListener("keydown", event => {
    keysDown[event.key] = true;
});
document.addEventListener("keyup", event => {
    keysDown[event.key] = false;
});
export default {
    keysDown: keysDown,
    building: false
};