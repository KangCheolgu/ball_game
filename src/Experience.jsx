import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import Lights from './Lights.jsx'
import Player from './Player.jsx'
import Level from "./level.jsx"

const socket = io();
console.log("socket");
console.log(socket);

socket.on('updatePlayers', (backEndPlayers) => {
    console.log(backEndPlayers.id);
})

export default function Experience()
{
    return <>
        <OrbitControls makeDefault />
        <Physics debug={ false }>
            <Lights />
            <Level />
            <Player />
        </Physics>
    </>
}