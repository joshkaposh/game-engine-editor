import type { Accessor, Component } from "solid-js";

const CreateObjectBtn: Component<{
    mode: Accessor<'Create' | 'Repeat' | 'Edit'>;
    text: string;
    edit: () => void;
    repeat: () => void;
    create: () => void;

}> = (props) => {
    const { mode, edit, repeat, create } = props;
    return <button type="submit" textContent={props.text} onclick={(e) => {
        e.preventDefault();
        switch (mode()) {
            case 'Edit':
                edit()
                return;
            case 'Repeat':
                repeat();
                return;
            case 'Create':
                create();
                return;
            default:
                throw new Error('No mode was found : ' + mode())
        }
    }} />
}

export default CreateObjectBtn
