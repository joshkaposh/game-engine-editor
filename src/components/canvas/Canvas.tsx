import { Component, onMount } from 'solid-js'
import GameEngine from '../../game-engine/initialize';


const Canvas: Component<{
    engine: GameEngine;
    width?: number;
    height?: number;
}> = (props) => {
    let ref: HTMLCanvasElement;
    let divRef: HTMLDivElement;


    onMount(() => {
        ref.width = divRef.clientWidth
        ref.height = divRef.clientHeight

        ref.style.width = '100%';
        ref.style.height = '100%';
        
        console.log(ref.width, ref.height);

        window.addEventListener('resize', (e) => {
            ref.width = divRef.clientWidth;
            ref.height = divRef.clientHeight;

        })

        props.engine.init(ref);

    })
    return <div class='canvas-container' ref={divRef!}><canvas ref={ref!} id='canvas' /></div>
}

export default Canvas