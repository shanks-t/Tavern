import { useTeams } from "../../team/TeamProvider.js"

const componentContainer = document.querySelector(".gameScores")

const render = (activeTeams, teams) => {
    componentContainer.innerHTML = `
        <h3>Current Game</h3>
        <div className="teams">
            <div class="team team__header">
                <div class="team__columnHeader team__name">Name</div>
                <div class="team__columnHeader team__score">Score</div>
            </div>

            ${
                [...activeTeams].map(([key, teamScore]) => {
                    const team = teams.find(t => t.id === teamScore.teamId) || null

                    if (team !== null) {
                        return `
                                <div class="team">
                                    <div class="team__column team__name">${team.moniker}</div>
                                    <div class="team__column team__score">${teamScore.score}</div>
                                </div>
                            `
                    }
                }).join("")
            }
        </div>
    `
}

export const GameScore = (activeTeams) => {
    const teams = useTeams()
    render(activeTeams, teams)
}