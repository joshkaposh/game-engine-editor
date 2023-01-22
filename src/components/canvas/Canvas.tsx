import { Component, onMount } from 'solid-js'
import GameEngine from '../../game-engine/initialize';


const Canvas: Component<{
    engine: GameEngine;
    width?: number;
    height?: number;
}> = (props) => {
    let ref: HTMLCanvasElement;

    onMount(() => {
        ref.style.width = '100%';
        ref.style.height = '100%';
        
        const c = ref.getContext('2d')!
        c.fillStyle = 'lightgrey'
        c.fillRect(0, 0, ref.width, ref.height)
        window.addEventListener('resize', (e) => {
            console.log(e);
        })

        props.engine.init(ref);

    })
    return <canvas ref={ref!} id='canvas'></canvas>
}

export default Canvas