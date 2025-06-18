const isDirective = (line, keyword) =>
    line.startsWith(`# #${keyword}`) ||
    line.startsWith(`// #${keyword}`) ||
    line.startsWith(`/* #${keyword}`) ||
    line.startsWith(`<!-- #${keyword}`);


export { isDirective };