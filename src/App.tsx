import type { Component } from 'solid-js'
import Editor from './components/editor/Editor'
import GE from './game-engine/initialize'

const App: Component = () => {

    const engine = new GE()

    return <div class='container'>
        <Editor engine={engine} />
    </div>
}

export default App;