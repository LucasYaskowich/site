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
}

function resolve(path) {
    return path.reduce((node, seg) => node[seg], DIRECTORY)
}

inputLine.textContent = "user@machine:" + pwd(state)

inputValue.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        const commandText = inputValue.value 

        const p = document.createElement("p")
        p.textContent = inputLine.textContent + " " + commandText + "\n" + handleEnter(commandText)
        
        if (commandText !== "clear") {
            outputSpace.appendChild(p)
        }
        
        inputLine.textContent = "user@machine:" + pwd(state) + "# "
        inputValue.value = ""
        inputValue.focus()
    }
});

function handleEnter(commandText) {
    let parsed = commandText.split(" ")
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
