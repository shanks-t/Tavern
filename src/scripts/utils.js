const closeButton = document.querySelector(".button--close")
const messageBox = document.querySelector(".messageBox")
const message = document.querySelector(".message")

closeButton.addEventListener("click", e => messageBox.close())

export const applicationEventHub = document.querySelector(".container")

export const alert = msg => {
    message.innerHTML = msg
    messageBox.showModal()
}

const singularize = str => {
    const isPlural = str.split("").reverse()[0] === "s"
    return isPlural ? str.substring(0, str.length-1) : str
}

if (!("on" in EventTarget.prototype)) {
    Object.defineProperty(EventTarget.prototype, "on", {
        value: new Proxy(EventTarget.prototype.addEventListener, {
            apply: function (_target, _this, _args) {
                return _target.apply(_this, _args)
            }
        })
    })
}

export const StateChangeEvent = new Proxy(CustomEvent, {
    construct(target, args) {
        const eventName = args[0]
        args[0] = `${singularize(eventName)}StateChanged`
        args[1] = {
            detail: {
                [eventName]: args[1]
            }
        }
        console.log(`Application state was modified with the \`${args[0]}\` event`)
        return new target(...args);
    }
})
