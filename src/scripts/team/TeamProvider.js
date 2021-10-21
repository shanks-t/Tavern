import { applicationEventHub, StateChangeEvent } from "../utils.js"
import { settings } from "../Settings.js"

let teams = []

export const useTeams = () => [...teams]

export const getTeams = () => {
    return fetch(`${settings.apiUrl}/teams?_embed=players&_embed=teamScores`)
    .then(response => response.json())
    .then(changeApplicationTeamState)
}

export const addTeam = team => {
    return fetch(`${settings.apiUrl}/teams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(team)
    })
        .then(response => response.json())
        .then(getTeams)
}

const changeApplicationTeamState = newTeams => {
    if (Array.isArray(newTeams)) {
        teams = newTeams
    }

    applicationEventHub.dispatchEvent(
        new StateChangeEvent("teams", useTeams())
    )
}

applicationEventHub.on("playerStateChanged", getTeams)
