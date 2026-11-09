let inputValue = document.querySelector("input")
var inputLine = document.querySelector("#promptLabel")

const outputSpace = document.querySelector(".output")

const DIRECTORY = {
    "~": {
        "ABOUTME.md": "I’m a Computing and Mathematics student (BCmpH) at Queen’s University, specializing in security. I build practical software across DevOps, computer vision, mobile development, and data analysis.\n\nCurrently: contributing to computer-vision work with Queen’s Aerospace Design Team and sports analytics with QSAO.",
        "platforms": {
            "linkedin.txt": "https://www.linkedin.com/in/lucas-yaskowich",
            "github.txt": "https://github.com/LucasYaskowich",
            "email.txt": "lyaskowich@gmail.com"
        },
        "resume": {
            "education.md": "Queen’s University\nBachelor of Computing (Honours)\nDouble Major: Computing (Security specialization) and Mathematics\nGPA: 4.6\nExpected graduation: 2029",
            "workExperience.md": "Queen’s High-Performance Computing Club — Director of Curriculum & Education | Oct 2026–Present\n\n• Design and deliver weekly HPC lectures for members ranging from beginners to competitive students.\n• Helping run DOOMATHON, a Doom-optimization hackathon on the Frontenac cluster.\n\nPokerLab — DevOps Intern | May 2026–August 2026\n\n• Implemented telemetry across web-application services and configured monitors and alerts.\n• Built and maintained Datadog dashboards for troubleshooting and performance monitoring.\n• Supported CI/CD workflows using Go, GitLab, and Jira.",
            "skills.md": "LANGUAGES\nPython, Go, Java, JavaScript, TypeScript, HTML/CSS\n\nTOOLS\nDocker, Datadog, Git, GitHub, GitLab, Jira, CI/CD, Linux\n\nFOCUS AREAS\nComputer vision, object detection, machine learning, statistical modelling, data analysis, security",
            "activities.md": "Queen’s Aerospace Design Team — Computer Vision Sub-team | Oct 2025–present\nBuilding AprilTag-based visual localization so a ground payload drone can locate its carrier drone.\n\nQueen’s Sports Analytics Organization — Football Analyst | Sep 2025–May 2026\nPython, data analysis, statistical modelling, and machine learning on large datasets. Second place, 2026 Case Competition."
        },
        "projects": {
            "darts.md": "Darts Computer-Vision Scoring Prototype\nPython · OpenCV · YOLOv8\n\nDetects dartboard keypoints, corrects perspective using homography, and maps dart locations to standard scores, using a YOLOv8-pose model trained on a ~2,000-image synthetic dataset and fine-tuned on real board images. Includes standalone 501 logic: double-out rules, busts, turn management, and checkout hints.\n\nGitHub: https://github.com/LucasYaskowich/Darts",
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
        const prompt = inputLine.textContent
        const commandText = inputValue.value
        const returned = handleEnter(commandText)

        const promptSpan = document.createElement("span")
        promptSpan.textContent = prompt
        promptSpan.classList = "prompt"

        const commandSpan = document.createElement("span")
        commandSpan.textContent = commandText

        const commandLine = document.createElement("p")
        commandLine.appendChild(promptSpan)
        commandLine.appendChild(commandSpan)

        const p = document.createElement("p")
        p.textContent = returned

        if (commandText !== "clear") {
            outputSpace.appendChild(commandLine)
            if (p !== "") {    
                outputSpace.appendChild(p)
            }
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
