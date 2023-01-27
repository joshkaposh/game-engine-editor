import type { Accessor, Component,Signal } from 'solid-js'
import { Show } from 'solid-js';
import { Button, Number } from '../form/input/Input';

const Repeat: Component<{
    toggle: () => void;
    toggled: Accessor<boolean>
    countSignal:Signal<number>
}> = (props) => {
    
    return <>
        <Show when={props.toggled()}>
            <Number initialValue={props.countSignal[0]()} signal={props.countSignal} />
        </Show>
        <Button handleClick={(e) => {
            e.preventDefault();
            props.toggle();
        }}>
            {props.toggled() ? 'Cancel' : 'Repeat'}
        </Button>
        
    </>
}

export default Repeat