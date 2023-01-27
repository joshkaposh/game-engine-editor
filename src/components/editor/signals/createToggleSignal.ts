import type {Accessor, Setter} from 'solid-js'
import { createSignal } from "solid-js";

export default function createToggleSignal(initialValue = false): [get: Accessor<boolean>, set: Setter<boolean>, toggle: () => boolean] {
    const signal = createSignal(initialValue);
    
    return [
        signal[0],
        signal[1],
        () => signal[1](!signal[0]())
    ]
}