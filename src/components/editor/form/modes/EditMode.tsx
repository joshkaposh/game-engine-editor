import { Component, Accessor,Setter, Show } from 'solid-js'
import { createSignal } from 'solid-js';
import { Range } from '../input/Input';
import {CollapseableMenu} from '../menu/Menu';

    
const EditMode: Component<{
    length: number;
    setMode: (m: "Create" | 'Repeat' | 'Edit') => void;
    index: Accessor<number | undefined>;
    setIndex: Setter<number | undefined>
}> = (props) => {
    const [selectedIndex,setSelectedIndex] = createSignal(0)

    return <CollapseableMenu open='Edit' close='Cancel' select={() => {
        props.length === 1 ?
            props.setIndex(0) :
            props.setIndex(selectedIndex())
    }} >
        <div>
            <p>count: {props.length}</p>
        <p>selected:{selectedIndex()}</p>
        </div>
        <Show when={props.length > 1}>
            <Range
                min={0}
                max={props.length - 1}
                initialValue={selectedIndex()}
                relay={num => setSelectedIndex(num)}
            />
        </Show>
    </CollapseableMenu>
}



export default EditMode;