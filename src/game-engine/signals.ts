import { createSignal, createEffect } from "solid-js";
import GameEngine from ".";

const engineSignals = () => {
    const running = createSignal(false)
    return {
        running,
    }
}

const engineEffects = (engine: GameEngine) => {
    const signals = engineSignals()

    createEffect(() => {
        signals.running[0]() ?
            engine.start() :
            engine.stop();
    })
    return signals
}

export default engineEffects