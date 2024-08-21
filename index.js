const enableMatrix = true;
const maxOpacity = 0.6;
const fps = 10;
const cellSize = { w: 14, h: 20 };
const tailLength = 8;
const alphabet = "#$%&0123456789?@ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const heightScrolloff = 20;

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
const colStates = [];
let cols;
let rows;
let overflow;

function init() {
	const dpr = window.devicePixelRatio;

	const { width, height } = {
		width: document.body.clientWidth,
		height: document.body.clientHeight,
	};
	canvas.width = width * dpr;
	canvas.height = height * dpr;

	cols = Math.ceil(width / cellSize.w);
	rows = Math.ceil(height / cellSize.h);
	overflow = {
		w: width - cols * cellSize.w,
		h: height - rows * cellSize.h,
	};

	colStates.length = 0;
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
	const dpr = window.devicePixelRatio;
	const bg = getComputedStyle(document.body).getPropertyValue("--bg");
	const fg = getComputedStyle(document.body).getPropertyValue("--fg");
	const accent = getComputedStyle(document.body).getPropertyValue("--accent");

	ctx.font = `${16 * dpr}px 'DM Mono'`;
	ctx.textBaseline = "middle";
	ctx.globalAlpha = 1;
	ctx.fillStyle = bg;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const dist = colStates[j].y - i;
			const x = (j * cellSize.w + overflow.w / 2) * dpr;
			const y = (i * cellSize.h + overflow.h / 2 + cellSize.h / 2) * dpr;

			ctx.globalAlpha = maxOpacity;
			if (dist < 0 || dist > tailLength) {
				continue;
			} else if (dist === 0) {
				ctx.fillStyle = fg;
				ctx.fillText(colStates[j].c, x, y);
			} else {
				ctx.fillStyle = accent;
				ctx.globalAlpha = (1 - (dist / tailLength) ** 1.5) * maxOpacity;
				ctx.fillText(genChar(), x, y);
			}
		}
	}

	for (const state of colStates) {
		if (state.y >= rows + tailLength) {
			state.y = -Math.ceil(Math.random() * heightScrolloff);
			state.c = genChar();
			state.speed = genSpeed();
		} else {
			state.y += state.speed;
		}
	}
}

function genChar() {
	return alphabet[Math.floor(Math.random() * alphabet.length)];
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
