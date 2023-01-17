import {Component,Accessor, createEffect} from 'solid-js'
import { createSignal,Show,For, Switch,Match } from "solid-js";
import objects,{EditorKeys, editors} from "../../objects";
import SelectObject from "./SelectObject";
import EditObjectForm from './EditObject';
import type { ClassKeys,Configs } from '../../objects';

// type 

const DisplayConfig: Component<{
    config: object;
}> = (props) => {
    return <p>Config: 
            {JSON.stringify(props.config)}
    </p>
}

const Editor: Component = () => {
    const [selected, setSelected] = createSignal<ClassKeys>()
    
    const selectObject = (type: ClassKeys) => {
        if (type === selected()) {
            setSelected(undefined);
            return;
        }
        setSelected(type)
        return;
    }
    const getConfig = (type:ReturnType<typeof selected>) => {
        if (typeof type === 'string') {
            return editors[type].config()
        }
    }
    const config = () => getConfig(selected()) as object

    createEffect(() => {
        console.log('Selected::',selected());
    })

    return <div class='editor'>
        <h2>Selected: {selected()}</h2>
        <Show when={selected()} fallback={<SelectObject objects={objects} select={selectObject} />}>
            <DisplayConfig config={config()} />
            <SelectObject objects={objects} select={selectObject} />
            <EditObjectForm
                type={selected()!}
                root={config()}
                handleCreate={(config) => {
                    console.log('CREATE::',config);
                    console.log(editors[`${selected() as EditorKeys}`].create(config as any))
                }}
            />
        </Show>
    </div>
}

export default Editor;