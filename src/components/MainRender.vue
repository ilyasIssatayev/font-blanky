<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import p5 from 'p5'
import { setupCanvas,processHeightMap,drawLine } from "../blanky/blanky"
import { plague } from '../blanky/book'

const sketchContainer = ref(null)
let p5Instance = null

let myFont = null;

const waveData = [0,0,0,0,0,0,5,5,5,5,5,5,10,10,10,10,10,10,0,0,0,0,0]; // Extend as needed
let VECTORS = []
const spacing = 10;

const sketch = (p) => {


    p.setup = () => {
        myFont = p.loadFont('/fonts/soyuz_grotesk.otf');
        myFont.then(font => {
            console.log("font ", font)
            myFont = font
        }).catch(no => console.log("no ", no))
        console.log("myFont ", myFont)

        VECTORS = processHeightMap(waveData);
        console.log("vectors ",VECTORS)

        console.log('setup')
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
        // p.textFont(myFont); 
        setupCanvas(p)
    }

    p.windowResized = (_event) => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
        // p.textFont(myFont); 
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

        // Draw axis lines
        p.push();

        // X-axis (red)
        p.stroke(255, 0, 0);
        p.line(0, 0, 0, 200, 0, 0);

        // Y-axis (green)
        p.stroke(0, 255, 0);
        p.line(0, 0, 0, 0, 200, 0);

        // Z-axis (blue)
        p.stroke(0, 0, 255);
        p.line(0, 0, 0, 0, 0, 200);

        p.pop();

        p.fill(255)
        drawLine(p,plague.slice(0, 100), spacing,VECTORS)

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