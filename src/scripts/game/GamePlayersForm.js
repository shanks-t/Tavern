import { useTeams } from "../team/TeamProvider.js"
import { applicationEventHub } from "../utils.js"

const componentContainer = document.querySelector(".gamePlay")

componentContainer.on("change", e => {
    const elementId = e.target.id

    if (elementId === "firstTeamSelect"
            || elementId === "secondTeamSelect"
            || elementId === "thirdTeamSelect") {
        applicationEventHub.dispatchEvent(
            new CustomEvent("teamSelectedForGame", {
                detail: {
                    cardinality: e.target.name,
                    teamId: parseInt(e.target.value, 10)
                }
            })
        )
    }
})

const render = () => {
    let teams = useTeams()
    teams = teams.filter(team => team.players.length === 3)

    componentContainer.innerHTML = `
        <div class="entryForm">
            <select class="entryForm__dropdown" id="firstTeamSelect" name="first">
                <option value="0">Select first team...</option>
                ${
                    teams.map(t => `<option value="${t.id}">${t.moniker}</option>`).join("")
                }
            </select>
            <select class="entryForm__dropdown" id="secondTeamSelect" name="second">
                <option value="0">Select second team...</option>
                ${
                    teams.map(t => `<option value="${t.id}">${t.moniker}</option>`).join("")
                }
            </select>
            <select class="entryForm__dropdown" id="thirdTeamSelect" name="third">
                <option value="0">Select third team...</option>
                ${
                    teams.map(t => `<option value="${t.id}">${t.moniker}</option>`).join("")
                }
            </select>
        </div>
    `
}

export const GamePlayersForm = () => {
    render()
}