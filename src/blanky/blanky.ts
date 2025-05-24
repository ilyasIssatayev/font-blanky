const setupCanvas = (p) => {
    p.background('#262626')
    p.camera(0, 0, 800,    // eye position (x, y, z)
        0, 0, 0,      // center of scene (look at origin)
        0, 1, 0)      // up vector (positive Y is up)
    // p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0); // text color
}

const processHeightMap = (heightMap, step = 1): [number, number][] => {
    let vectors: [number, number][] = [[1, 0]]
    console.log("step ", step)

    for (let i = 1; i < heightMap.length; i++) {
        const left = heightMap[i - 1];
        const point = heightMap[i];
        const delta = point - left;
        console.log(left, " ", point, " d: ", delta, " ", Math.sign(delta))
        if (delta == 0) vectors.push([1, 0])
        else {
            const extraVectors = Math.abs(delta) / step;
            //TODO: add negative dispalcement by using delta's sign (Minus plus)
            for (let v = 0; v < extraVectors; v++) vectors.push([0, step * Math.sign(delta)])
        }

    }

    return vectors;
}

const drawLine = (p,textLine,spacing,VECTORS) => {
    p.push();
    p.translate(-((textLine.length - 1) * spacing) / 2, 0, 0); // Center horizontally

    let vector = [0, 0];

    for (let i = 0; i < textLine.length; i++) {
        const char = textLine[i];


        // Defensive fallback to 0 if undefined
        const newVector = VECTORS[i] ?? [1, 0];
        vector[0] += newVector[0]
        vector[1] += newVector[1]

        const x = vector[0] * spacing;
        const y = -vector[1] * 10;

        p.push();
        p.translate(x, y, 0);
        // console.log(i+" angle -"+angle)

        p.rotateX(0.8)
        p.text(char, 0, 0);
        p.pop();
    }

    p.pop();
}

export { setupCanvas, processHeightMap,drawLine }