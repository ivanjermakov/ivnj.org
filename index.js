const enableMatrix = true;
const fps = 8;
const cellSize = { w: 12, h: 20 };
const tailLength = 8;
const alphabet = "#$%&0123456789?@ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const heightScrolloff = 20;

const overlay = document.getElementById("overlay");
const colStates = [];
const grid = [];

function init() {
	overlay.innerHTML = "";
	grid.length = 0;
	colStates.length = 0;

	const cols = Math.ceil(overlay.clientWidth / cellSize.w);
	const rows = Math.ceil(overlay.clientHeight / cellSize.h);

	overlay.style["grid-template-columns"] = `repeat(${cols}, ${cellSize.w}px)`;
	overlay.style["grid-template-rows"] = `repeat(${rows}, ${cellSize.h}px)`;
	const overflow = {
		w: overlay.clientWidth - cols * cellSize.w,
		h: overlay.clientHeight - rows * cellSize.h,
	};
	overlay.style["margin-left"] = `${overflow.w / 2}px`;
	overlay.style["margin-top"] = `${overflow.h / 2}px`;

	for (let i = 0; i < rows; i++) {
		const row = [];
		grid.push(row);
		for (let j = 0; j < cols; j++) {
			const c = document.createElement("span");
			c.className = "cell";
			row.push(c);
			overlay.appendChild(c);
		}
	}

	for (let j = 0; j < cols; j++) {
		colStates.push({
			y:
				Math.floor(Math.random() * (rows + 2 * heightScrolloff)) -
				heightScrolloff,
			c: genChar(),
			speed: genSpeed(),
		});
	}
}

function update() {
	for (let i = 0; i < grid.length; i++) {
		const row = grid[i];
		for (let j = 0; j < row.length; j++) {
			const c = row[j];
			const dist = colStates[j].y - i;

			c.style.opacity = 1;
			if (dist < 0 || dist > tailLength) {
				c.textContent = "";
			} else if (dist === 0) {
				c.textContent = colStates[j].c;
				c.style.color = "var(--fg)";
			} else {
				c.textContent = genChar();
				c.style.color = "var(--accent)";
				c.style["font-weight"] = "bold";
				c.style.opacity = 1 - (dist / tailLength) ** 1.5;
			}
		}
	}
	for (let i = 0; i < colStates.length; i++) {
		const rows = grid.length;
		if (colStates[i].y >= rows + tailLength) {
			colStates[i].y = -Math.ceil(Math.random() * heightScrolloff);
			colStates[i].c = genChar();
			colStates[i].speed = genSpeed();
		} else {
			colStates[i].y += colStates[i].speed;
		}
	}
}

function genChar() {
	return alphabet[Math.ceil(Math.random() * alphabet.length)];
}

function genSpeed() {
	return Math.floor(Math.random() * 2) + 1;
}

if (enableMatrix) {
	init();
	update();
	setInterval(update, 1000 / fps);
	window.addEventListener("resize", init);
}
