<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import p5 from 'p5'
import { setupCanvas } from "../blanky/blanky"

const sketchContainer = ref(null)
let p5Instance = null
let angle = 0;

const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
        setupCanvas(p)
    }

    p.windowResized = (_event) => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
        setupCanvas(p)
    }

    p.draw = () => {
        // draw something
        for (let i = 0; i < 5; i++) {
            p.push(); // Save current coordinate state

            // Move each box along the X-axis, spaced by 150 units
            p.translate((i - 2) * 150 * angle * 0.1, 0, 0);

            // Rotate each box differently based on i and frame count
            p.rotateX(angle + i * 0.1);
            p.rotateY(angle * 0.7 + i * 0.1);

            p.normalMaterial();
            p.box(100);

            p.pop(); // Restore coordinate state to before this box’s transforms
        }

        angle += 0.01;

    }
}

onMounted(() => {
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