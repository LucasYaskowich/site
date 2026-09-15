let inputValue = document.querySelector("input")
var inputLine = document.querySelector("#promptLabel")

const outputSpace = document.querySelector(".output")

const DIRECTORY = {
    "~": {
        "ABOUTME.md": "about me placeholder",
        "platforms": {
            "linkedIn": "link",
            "gitHub": "link",
            "other": ""
        },
        "resume": {
            "workExperience.md": "workExp placeholder",
            "skills.md": "skills placeholder",
            "CLAUDE.md": "claude placeholder",
        }
    }
}

let state = {
    "curPath": ["~"],
    "history": [],
    "historyIndex": 0,
}

function resolve(path) {
    return path.reduce((node, seg) => node[seg], DIRECTORY)
}

inputLine.textContent = "user@machine:" + pwd(state) + " $ "

inputValue.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        const commandText = inputValue.value 

        const p = document.createElement("p")
        p.textContent = inputLine.textContent + " " + commandText + "\n" + handleEnter(commandText)
        
        if (commandText !== "clear") {
            outputSpace.appendChild(p)
        }
        
        inputLine.textContent = "user@machine:" + pwd(state) + " $ "
        inputValue.value = ""
        inputValue.focus()
    }

    if (event.key === 'ArrowUp') {
        if (state.historyIndex !== 0) {
            state.historyIndex = state.historyIndex - 1
            inputValue.value = state.history[state.historyIndex]
            inputValue.focus()            
        }
    inputValue.setSelectionRange(inputValue.value.length, inputValue.value.length)
    event.preventDefault()
    }

    if (event.key === 'ArrowDown') {
        if (state.historyIndex !== (state.history.length)) {
            state.historyIndex = state.historyIndex + 1
            if (state.historyIndex === state.history.length) {
                inputValue.value = ""
            } else {
                inputValue.value = state.history[state.historyIndex]
            }
            
            inputValue.focus()

        }
    inputValue.setSelectionRange(inputValue.value.length, inputValue.value.length)
    event.preventDefault()
    }
    
    if (event.key === 'Tab') {
        let completed = inputValue.value
        let parsed = inputValue.value.split(" ")
        let last = parsed[parsed.length - 1]

        let value = ""
        let candidates = []
        for (value of Object.keys(resolve(state.curPath))) {
            if (value.startsWith(last)) {
                candidates.push(value)
            }    
        }

        if (candidates.length === 1) {
            completed = completeWord(candidates)
            parsed[parsed.length - 1] = completed
            inputValue.value = parsed.join(" ")
        }
        
        inputValue.focus()
        inputValue.setSelectionRange(inputValue.value.length, inputValue.value.length)
        event.preventDefault()
    }
    
});

function handleEnter(commandText) {
    if (commandText !== ""){
    state.history.push(commandText)
    }

    let parsed = commandText.split(" ")

    state.historyIndex = state.history.length

    switch (parsed[0]) {
        case "help":
            return help();
        case "pwd":
            return pwd(state);
        case "ls":
            return ls(parsed, state);
        case "cd":
            return cd(parsed, state);
        case "cat":
            return cat(parsed, state);
        case "clear":
            return clear();
        default: 
            return "command not recognized";
    }
}

function help() {
    return "output of help command";
}

function cd(args, state) {
    const target = args[1]

    if (target === undefined || target === "~") {
        state.curPath = ["~"]
        return "";
    }

    if (target === "..") {
        if (state.curPath.length > 1) state.curPath.pop()
        return "";
    }

    const newPath = [...state.curPath, target]
    let node
    try {
        node = resolve(newPath)
    } catch {
        return "not a valid directory";
    }

    if (node === undefined || typeof node !== "object") {
        return "not a valid directory";
    }

    state.curPath = newPath
    return "";
}

function ls(args, state) {
    return Object.keys(resolve(state.curPath)).join("  ");
}

function pwd(state) {
    return state.curPath.join("/");
}

function cat(args, state) {
    const fileName = args[1]
    const fileContents = resolve(state.curPath)[fileName]

    if (fileContents != undefined && typeof fileContents === "string") {
        return fileContents;
    } else {
        return "not a file";
    }
}

function clear() {
    outputSpace.innerHTML = ""
    return "";
}

function completeWord(candidates) {
    return candidates[0]
}