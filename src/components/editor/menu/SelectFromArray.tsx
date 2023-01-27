import { Component, Accessor,Setter, Show } from 'solid-js'
import { createSignal } from 'solid-js';
import { Range } from '../form/input/Input';
import {CollapseableMenu} from './Menu';

    
const SelectFromArray: Component<{
    type: string;
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
            props.setMode('Edit')

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



export default SelectFromArray