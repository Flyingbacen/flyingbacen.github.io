
const border = {
    minX: -5071,
    maxX: 8045,
    minZ: -6106,
    maxZ: 5225
};

const majorLocations = {
    "Moosewood": [350, -250],
    "Statue of Sovereignty": [50, 1000],
    "Sunstone Island": [-920, 1100],
    "Roslit Bay": [-1450, -750],
    "Terrapin Island": [-200, -1925],
    "Snowcap Island": [2600, -2400],
    "Mushgrove Swamp": [2450, 675],
    "Forsaken Shores": [-2425, -1555]
};

const minorLocations = {
    "The Arch": [1000, 1250],
    "Haddock Rock": [-530, 425],
    "Harvester's Spire": [-1270, -1580],
    "Earmark Island": [1230, -500],
    "Birch Cay": [1735, 2435],
    "The Buoy": [-750, 3100]
};

let inputCount = 0;

function addInput(): boolean {
    if (inputCount >= 25) return false;

    const div = document.createElement("div");

    div.innerHTML = `
        X: <input type="number" id="x${inputCount}" style="width:70px" oninput="draw()">
        Z: <input type="number" id="z${inputCount}" style="width:70px" oninput="draw()">
        <span class="delete" onclick="deleteInput(${inputCount})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5v7h1v-7h-1zm4 0v7h1v-7h-1z"></path>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1h-1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-1a1 1 0 0 1 0-2h3.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1H14a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11z"></path>
            </svg>
        </span>
    `;

    document.getElementById("inputs")?.appendChild(div);

    inputCount++;

    return true;
}

function addMaxInputs() {
    while (addInput()) continue;
}

function deleteInput(inputNum: number) {
    let currentElem = (document.getElementById("x" + inputNum) as HTMLInputElement);
    currentElem.parentElement?.remove();

    for (let i = inputNum + 1; i < inputCount; i++) {
        const nextX = document.getElementById("x" + i) as HTMLInputElement;
        const nextZ = document.getElementById("z" + i) as HTMLInputElement;

        if (nextX) nextX.id = "x" + (i - 1);
        if (nextZ) nextZ.id = "z" + (i - 1);

        const parentDiv = nextX.parentElement;
        const deleteBtn = parentDiv?.querySelector(".delete") as HTMLElement;
        if (deleteBtn) {
            deleteBtn.setAttribute("onclick", `deleteInput(${i - 1})`);
        }
    }

    inputCount--;

    draw()
}

for (let i = 0; i < 8; i++) addInput();

const canvas = document.getElementById("map") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D ;

function worldToCanvas(x: number, z: number) {

    const scaleX = canvas.width / (border.maxX - border.minX);
    const scaleZ = canvas.height / (border.maxZ - border.minZ);

    const cx = (x - border.minX) * scaleX;
    const cz = canvas.height - (z - border.minZ) * scaleZ;

    return [cx, cz];
}

function drawPoint(x: number, z: number, color: string | CanvasGradient | CanvasPattern, label: string, scale: number = 5) {

    const [cx, cz] = worldToCanvas(x, z);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cz, scale, 0, Math.PI * 2);
    ctx.fill();

    if (label) {
        ctx.fillStyle = "black";
        ctx.fillText(label, cx + 6, cz - 6);
    }
}

function draw() {
    
    if (canvas === null) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradiant = ctx.createLinearGradient(canvas.width/2, 0, canvas.width/2, canvas.height);
    gradiant.addColorStop(0, "#dad87a");
    gradiant.addColorStop(0.4, "#fced9c");
    gradiant.addColorStop(1, "#dad87a");
    ctx.fillStyle = gradiant;
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = "12px Arial";

    for (const [name, coords] of Object.entries(majorLocations)) {
        const [x, z] = coords;
        drawPoint(x, z, "blue", name);
    }

    for (const [name, coords] of Object.entries(minorLocations)) {
        const [x, z] = coords;
        drawPoint(x, z, "green", name);
    }

    for (let i = 0; i < inputCount; i++) {

        const x = Number((document.getElementById("x" + i) as HTMLInputElement).value);
        const z = Number((document.getElementById("z" + i) as HTMLInputElement).value);

        if (isNaN(x) || isNaN(z)) continue;
        if (x === 0 && z === 0) continue;

        if (
            x < border.minX || x > border.maxX ||
            z < border.minZ || z > border.maxZ
        ) {
            alert("Coordinate " + i + " outside map borders");
            continue;
        }
        let labelsEnabled = (document.getElementById("labelsEnabled") as HTMLInputElement).checked;
        let dotScale = parseFloat((document.getElementById("chestDotScale") as HTMLInputElement).value) / 100
        
        drawPoint(x, z, "red", labelsEnabled ? "Chest " + (i + 1) : "", dotScale);
    }
}

draw();

throw new Error("meow"); // to get easy access to the code in the browser