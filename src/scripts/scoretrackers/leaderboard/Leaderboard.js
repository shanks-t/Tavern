import { useScores } from "../ScoreProvider.js"
import { useTeams } from "../../team/TeamProvider.js"
import { alert, applicationEventHub } from "../../utils.js"

const componentContainer = document.querySelector(".leaderboard")

applicationEventHub.on("teamSelectedForGame", event => {
    const teamEl = document.querySelector(`.team--${event.detail.teamId}`)
    teamEl.classList.add("highlight")
})

applicationEventHub.on("teamStateChanged", event => {
    const scores = useScores()
    render(event.detail.teams, scores)
})

applicationEventHub.on("scoreStateChanged", event => {
    const teams = useTeams()
    render(teams, event.detail.scores)
})

applicationEventHub.on("playerStateChanged", event => {
    const scores = useScores()
    const teams = useTeams()
    render(teams, scores)
})

applicationEventHub.on("click", event => {
    if (event.target.id.startsWith("team__button--")) {
        const [junk, id] = event.target.id.split("--")
        const team = useTeams().find(t => t.id === parseInt(id))

        alert(`
            <h2>Players on Team</h2>
            ${
                team.players.map(player => `<div>${player.firstName} ${player.lastName}</div>`).join("")
            }
        `)
    }
})

const render = (teamArray, teamScoreArray) => {
    componentContainer.innerHTML = `
        <h3 style="margin-block-end: 0.5rem; margin-block-start: 0;">Leaderboard</h3>
        <div class="teams">
            <div class="team teams__header">
                <div class="team__columnHeader team__name">Name</div>
                <div class="team__columnHeader team__playerCount">Players</div>
                <div class="team__columnHeader team__score">Score</div>
            </div>
            <div class="teams__list">
                ${
                    teamArray.map(team => {
                        team.cumulativeScore = team.scores
                            .reduce((c, n) => c + n.score, 0)
                        return team
                    })
                    .sort((c, n) => n.cumulativeScore - c.cumulativeScore)
                    .map(team => {
                        return `
                            <div class="team team--${team.id} ${team.players.length < 3 ? "inactive" : "active" }">
                                <div class="team__column team__name">
                                    <button class="fakeLink" id="team__button--${team.id}">${team.name}</button>
                                </div>
                                <div class="team__column team__playerCount">${team.players.length || 0}</div>
                                <div class="team__column team__score">${team.cumulativeScore || 0}</div>
                            </div>
                        `
                    })
                    .join("")
                }
            </div>
        </div>
    `
}

export const Leaderboard = () => {
    const scores = useScores()
    const teams = useTeams()
    render(teams, scores)
}