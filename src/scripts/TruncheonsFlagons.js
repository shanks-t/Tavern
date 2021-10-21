import { PlayerForm } from "./player/PlayerForm.js"
import { TeamForm } from "./team/TeamForm.js"
import { Leaderboard } from "./scoretrackers/leaderboard/Leaderboard.js"
import { GamePlayersForm } from "./game/GamePlayersForm.js"
import { StartRound } from "./game/StartRound.js"
import { ScoreForm } from "./game/ScoreForm.js"
import { addScore } from "./scoretrackers/ScoreProvider.js"
import { GameScore } from "./scoretrackers/game/GameScores.js"
import { useTeams } from "./team/TeamProvider.js"
import { alert, applicationEventHub } from "./utils.js"


let currentRound = -1
let activeTeams = new Map()

const initializeTeams = () => {
    activeTeams.set("first", { teamId: 0, score: 0 })
    activeTeams.set("second", { teamId: 0, score: 0 })
    activeTeams.set("third", { teamId: 0, score: 0 })
}

applicationEventHub.on("gameStarted", e => {
    currentRound = 0
    render()
})

applicationEventHub.on("roundCompleted", e => {
    const scores = e.detail.scores

    for (const [team, score] of Object.entries(scores)) {
        const currentTeam = activeTeams.get(team)
        currentTeam.score += parseInt(score, 10)
    }

    currentRound++
    GameScore(activeTeams)
    render()
})

applicationEventHub.on("teamSelectedForGame", e => {
    const teamId = e.detail.teamId
    const cardinality = e.detail.cardinality

    const team = activeTeams.get(cardinality)
    team.teamId = teamId

    const f = activeTeams.get("first").teamId
    const s = activeTeams.get("second").teamId
    const t = activeTeams.get("third").teamId

    if (
        (f === s || f === t || s === t) ||
        (f === 0 || s === 0 || t === 0)
    ) {
        currentRound = 0
    } else {
        currentRound = 1
        render()
    }
    GameScore(activeTeams)
})

const calculateWinner = () => {
    const teams = useTeams();

    const winnerId = [...activeTeams.values()].sort((c,n) => n.score - c.score)[0].teamId
    const winner = teams.find(t => t.id === winnerId).moniker
    alert(`The winner is ${winner}`)
}

const saveScores = () => {
    const timestamp = Date.now()

    for (const [key, teamScore] of activeTeams) {
        teamScore.timestamp = timestamp
        addScore(teamScore)
    }
}

const render = () => {
    switch (currentRound) {
        case -1:
            StartRound()
            break;
        case 0:
            GamePlayersForm()
            break;
        case 1:
        case 2:
        case 3:
            const first = activeTeams.get("first").teamId
            const second = activeTeams.get("second").teamId
            const third = activeTeams.get("third").teamId
            ScoreForm({ first, second, third, currentRound })
            break;
        case 4:
            /*
                Game is over.
                    1. Reset game play
                    2. Display winner of current game
                    3. Post results to API
                    4. Empty out score Map()
                    5. Display start game button
            */
            currentRound = -1
            calculateWinner()
            saveScores()
            initializeTeams()
            StartRound()
            break;
    }
}

export const TruncheonsFlagons = () => {
    initializeTeams()
    PlayerForm()
    TeamForm()
    Leaderboard()
    render()
}
