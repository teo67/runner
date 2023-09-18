export default (x, y, width, height, block) => {
    return block.x.position + block.x.size > x
        && block.x.position < x + width
        && block.y.position + block.y.size > y
        && block.y.position < y + height
}