import type { Component } from 'solid-js'
import Editor from './components/editor'
import GameEngine from './game-engine'

const App: Component = () => {

    const engine = new GameEngine()

    return <div class='container'>
        <Editor engine={engine} />
    </div>
}

export default App;