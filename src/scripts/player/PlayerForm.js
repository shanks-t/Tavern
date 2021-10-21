import { addPlayer } from "./PlayerProvider.js"
import { useTeams } from "../team/TeamProvider.js"
import { alert, applicationEventHub } from "../utils.js"

const componentContainer = document.querySelector(".playerForm")

applicationEventHub.on("teamStateChanged", event => {
    render(event.detail.teams)
})

componentContainer.on("submit", submitEvent => {
    if (submitEvent.target.id === "playerForm") {
        submitEvent.preventDefault()

        const chosenTeam = componentContainer.querySelector("select[name='team']")
        const firstName = componentContainer.querySelector("input[name='firstName']")
        const lastName = componentContainer.querySelector("input[name='lastName']")

        if (chosenTeam.value === "0") {
            alert("Please assign the player to a team")
        }

        if (chosenTeam.value !== "0" && firstName.value !== "" && lastName.value !== "") {
            addPlayer({
                firstName: firstName.value,
                lastName: lastName.value,
                teamId: parseInt(chosenTeam.value, 10)
            })
                .then(() => {
                    firstName.value = ""
                    lastName.value = ""
                    chosenTeam.value = 0
                })
        }
    }
})

const render = teamArray => {
    componentContainer.innerHTML = `
        <h3>New Player</h3>
        <form id="playerForm">
            <fieldset>
                <input name="firstName" type="text" required placeholder="First name" />
            </fieldset>
            <fieldset>
                <input name="lastName" type="text" required placeholder="Last name" />
            </fieldset>
            <fieldset>
                <select name="team" required>
                    <option value="0">Please select a team...</option>
                    ${
                        teamArray.map(team => `<option value="${team.id}">${team.name}</option>`)
                    }
                </select>
            </fieldset>

            <button class="btn btn--success btn--small" id="addPlayer">Add Player to Team</button>
        </form>
    `
}

export const PlayerForm = () => {
    const teams = useTeams()
    render(teams)

}