import type { Accessor, Component,Signal } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store';
import { Show } from 'solid-js';
import {  Number } from '../input/Input';


const RepeatMode: Component<{
    toggle: () => void;
    toggled: Accessor<boolean>
    setGap: SetStoreFunction<{ x: number; y: number }>
    count: Signal<number>
}> = (props) => {
    const toggle = (e: MouseEvent & {
        currentTarget: HTMLButtonElement;
        target: Element;
    }) => {
        e.preventDefault();
        props.toggle()
    }

    return <>
        <Show when={props.toggled()}
            fallback={
                <button type='button'
                    onclick={toggle}
                >
                    Repeat
                </button>}
        >
            <form id='repeat-form'>
                <div class='form-exit'>
                    <button type='button'
                        onclick={toggle}
                    >
                        X
                    </button>
                </div>
                <div class='repeat-form-count'>
                    <label>Count:</label>
                    <Number initialValue={props.count[0]()} signal={props.count} />
                </div>
                <div class='repeat-form-gap'>
                    <div>
                        <label>x:</label>
                        <Number relay={(x) => props.setGap('x',x)} />
                    </div>
                    <div>
                        <label>y:</label>
                        <Number relay={(y) => props.setGap('y',y)} />
                    </div>
                </div>
            </form>
        </Show>
    </>
}

export default RepeatMode