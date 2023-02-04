import type { Accessor, Component } from "solid-js";

const CreateObjectBtn: Component<{
    mode: Accessor<'Create' | 'Repeat' | 'Edit'>;
    edit: () => void;
    repeat: () => void;
    create: () => void;
}> = (props) => {
    const { mode, edit, repeat, create } = props;
    return <button type="submit" onclick={(e) => {
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
    }}>
        {mode() === 'Edit' ? 'Finish' : mode()}
    </button>
}

export default CreateObjectBtn
