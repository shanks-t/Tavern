import { applicationEventHub, StateChangeEvent } from "../utils.js"
import { settings } from "../Settings.js"


let players = []

const setPlayers = newPlayers => {
    if (Array.isArray(newPlayers)) {
        players = newPlayers
    }

    applicationEventHub.dispatchEvent(
        new StateChangeEvent("players", usePlayers())
    )
}

export const usePlayers = () => [...players]

export const getPlayers = () => {
    return fetch(`${settings.apiUrl}/players`)
        .then(response => response.json())
        .then(setPlayers)
}

export const getPlayersByTeam = teamId => {
    return fetch(`${settings.apiUrl}/players?teamId=${teamId}`)
        .then(response => response.json())
        .then(setPlayers)
}

export const addPlayer = player => {
    return fetch(`${settings.apiUrl}/players`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
    })
        .then(response => response.json())
        .then(() => {
            applicationEventHub.dispatchEvent(
                new StateChangeEvent("players", usePlayers())
            )
        })
}