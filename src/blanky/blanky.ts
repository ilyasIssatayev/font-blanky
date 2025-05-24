const setupCanvas = (p) => {
    p.background('#262626')
    p.camera(400, 400, 400,    // eye position (x, y, z)
        0, 0, 0,      // center of scene (look at origin)
        0, 1, 0)      // up vector (positive Y is up)
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0); // text color
}

export { setupCanvas }