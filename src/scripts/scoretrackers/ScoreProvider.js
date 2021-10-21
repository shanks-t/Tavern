import { applicationEventHub, StateChangeEvent } from "../utils.js"
import { settings } from "../Settings.js"

let scores = []

const changeScoreState = newScores => {
    if (Array.isArray(newScores)) {
        scores = newScores
    }

    applicationEventHub.dispatchEvent(
        new StateChangeEvent("scores", useScores())
    )
}

export const useScores = () => [...scores]

export const getScores = () => {
    return fetch(`${settings.apiUrl}/teamscores`)
        .then(_ => _.json())
        .then(changeScoreState)
}

export const addScore = teamScore => {
    return fetch(`${settings.apiUrl}/teamscores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(teamScore)
    })
        .then(_ => _.json())
        .then(getScores)
}