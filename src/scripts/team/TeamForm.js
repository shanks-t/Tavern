import { addTeam } from "./TeamProvider.js"

const componentContainer = document.querySelector(".teamForm")

componentContainer.on("submit", submitEvent => {
    submitEvent.preventDefault()

    if (submitEvent.target.id === "teamForm") {
        const moniker = componentContainer.querySelector("input[name='moniker']")

        if (moniker.value !== "") {
            addTeam({
                moniker: moniker.value
            })
                .then(() => {
                    moniker.value = ""
                    moniker.focus()
                })
        }
    }
})

export const TeamForm = () => {
    componentContainer.innerHTML = `
        <h3>New Team</h3>
        <form id="teamForm">
            <fieldset>
                <input name="moniker" autofocus required type="text" placeholder="Team name" />
            </fieldset>
            <button class="btn btn--success btn--small" id="addTeam">Create Team</button>
        </form>
    `
}
