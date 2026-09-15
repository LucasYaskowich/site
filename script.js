let inputValue = document.querySelector("input")
var inputLine = document.querySelector("#promptLabel")

const outputSpace = document.querySelector(".output")

const DIRECTORY = {
    "~": {
        "ABOUTME.md": "Lucas Yaskowich\n\nI’m a Computing and Mathematics student at Queen’s University, specializing in security. I build practical software across DevOps, computer vision, mobile development, and data analysis.\n\nCurrently: contributing to computer-vision work with Queen’s Aerospace Design Team and sports analytics with QSAO.",
        "platforms": {
            "linkedin.txt": "https://www.linkedin.com/in/lucas-yaskowich",
            "github.txt": "https://github.com/LucasYaskowich",
            "email.txt": "lyaskowich@gmail.com"
        },
        "resume": {
            "education.md": "Queen’s University\nBachelor of Computing (Honours)\nDouble Major: Computing (Security specialization) and Mathematics\nExpected graduation: 2029",
            "workExperience.md": "PokerLab — DevOps Intern | May 2026–August 2026\n\n• Implemented telemetry across web-application services and configured monitors and alerts.\n• Built and maintained Datadog dashboards for troubleshooting and performance monitoring.\n• Supported collaborative Git-based CI/CD workflows.",
            "skills.md": "LANGUAGES\nPython, Go, JavaScript, TypeScript, HTML/CSS, SQL\n\nTOOLS\nDatadog, GitHub, GitLab, Jira, Slack, CI/CD\n\nFOCUS AREAS\nComputer vision, object detection, machine learning, data analysis, security\n\nOTHER\nLinux, macOS, Windows · Fluent English and French",
            "activities.md": "Queen’s Aerospace Design Team — Computer Vision Sub-team | 2025–present\nObject detection, machine-learning workflows, and deployment.\n\nQueen’s Sports Analytics Organization — Football Analyst | 2025–present\nPython, data analysis, and machine learning on large datasets. Second place, 2026 Case Competition.\n\nNorth Vancouver Spring Flag Football League — Referee & Field General | 2022–2026\nManaged field operations and referee coordination. Referee of the Year, 2026."
        },
        "projects": {
            "darts.md": "Darts Computer-Vision Scoring Prototype\nPython · OpenCV · YOLOv8\n\nDetects dartboard keypoints, corrects perspective using homography, and maps dart locations to standard scores. Includes standalone 501 logic: double-out rules, busts, turn management, and checkout hints.\n\nGitHub: https://github.com/LucasYaskowich/Darts",
            "yourrecipe.md": "YourRecipe — Mobile Recipe Library Prototype\nReact Native · Expo · TypeScript · FastAPI · Supabase\n\nA recipe-library prototype with photo uploads, structured recipe storage, dietary profiles, and AI-assisted recipe adaptation.\n\nGitHub: https://github.com/LucasYaskowich/YourRecipe",
            "site.md": "Personal Portfolio Website\nHTML · CSS · JavaScript\n\nA hand-coded portfolio that offers both this terminal emulator and a friendly browsing view."
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

const welcomeMessage = document.createElement("p")
welcomeMessage.textContent = "Welcome to Lucas Yaskowich’s portfolio terminal. Type 'help' to get started."
outputSpace.appendChild(welcomeMessage)

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
        inputValue.scrollIntoView({ block: "end" })
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
    return "Available commands:\n  ls             list files and directories\n  cd <directory> move into a directory\n  cd ..          move up one directory\n  cd ~           return home\n  cat <file>     read a file\n  pwd            show current path\n  clear          clear the terminal\n\nTip: press Tab to autocomplete directory and file names.";
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
