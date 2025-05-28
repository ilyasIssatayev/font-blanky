<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import p5 from 'p5'
import { setupCanvas, processHeightMap, drawLine } from "../blanky/blanky"
import { plague } from '../blanky/book'

const sketchContainer = ref(null)
let p5Instance = null

let myFont = null;

const LENGTH = 200;
const DEPTH = 1;

const waveData = [0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0]; // Extend as needed
let VECTORS = []
const spacing = 40;

const sketch = (p) => {


    p.setup = () => {
        myFont = p.loadFont('/fonts/soyuz_grotesk.otf');
        myFont.then(font => {
            console.log("font ", font)
            myFont = font
        }).catch(no => console.log("no ", no))

        VECTORS = processHeightMap(waveData);
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
        setupCanvas(p)
    }

    p.windowResized = (_event) => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
        setupCanvas(p)
    }
    let angle = 0;
    p.draw = () => {
        if (!myFont.name) {
            console.log("nope")
            return
        };
        p.background('#262626')
        p.textFont(myFont);

        p.push();
        p.resetMatrix(); // Reset transform so text is not rotated/scaled
        p.camera();      // Reset camera to default so text isn't affected by previous transformations
        p.fill(255);     // White text
        p.textSize(22);
        p.text(`FPS: ${p.floor(p.frameRate())}`, -p.width / 2 + 10, -p.height / 2 + 20);
        p.pop();

        p.camera(0, -500, 1000,    // eye position (x, y, z)
        0, 0, 0,      // center of scene (look at origin)
        0, 1, 0)    // up vector (positive Y is up)

        p.fill(255)
        for (let i = 0; i < DEPTH; i++) drawLine(p, plague.slice(i * LENGTH, (i + 1) * LENGTH), spacing, VECTORS, 300 - i * 20)

    }


}

onMounted(() => {
    console.log("on mounted ", sketchContainer.value)
    p5Instance = new p5(sketch, sketchContainer.value)
})

onBeforeUnmount(() => {
    if (p5Instance) {
        p5Instance.remove()
    }
})
</script>

<template>
    <div ref="sketchContainer" />
</template>