import type { Component, Accessor,Setter } from 'solid-js'
import { createSignal,Show,Switch,Match } from 'solid-js';
import { SelectRange } from './Input';

const ToggleMenu: Component<{
    text:string;
    toggle: () => void
}> = (props) => {
    return <button type='button' onclick={(e) => {
        e.preventDefault();
        props.toggle();
    }}> 
    {props.text}
</button>
}

const SelectFromArray: Component<{
    type: string;
    length: number;
    mode: Accessor<'Create' | 'Edit'>;
    setMode: Setter<'Create' | 'Edit'>
    index: Accessor<number | undefined>;
    setIndex: Setter<number | undefined>
}> = (props) => {
    const [clicked, setClicked] = createSignal(false);
    const toggle = () => setClicked(!clicked())
    
    return <>
        <Show when={clicked()} fallback={<ToggleMenu text='Edit' toggle={toggle} />}>
            <div class='select-object-menu'>
                <div class="select-object-menu-header">
                    <ToggleMenu text='Close' toggle={toggle} />
                </div>
                <p>{props.length}</p>
                <Switch>
                    <Match when={props.length === 1}>
                        <button type='button' onclick={e => {
                            e.preventDefault();
                            props.setIndex(0)
                            props.setMode('Edit')
                            setClicked(false)
                        }}>Select
                        </button>
                    </Match>
                    <Match when={props.length > 1}>
                        <SelectRange
                            min={0}
                            max={props.length - 1}
                            index={props.index}
                            setIndex={props.setIndex}
                            closeMenu={() => {
                                props.setMode('Edit')
                                setClicked(false)
                            }}
                            />
                    </Match>
                </Switch>
            </div>
        </Show>
    </>
}



export default SelectFromArray