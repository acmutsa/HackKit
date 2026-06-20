type ThreadOptions = {
	threadSrc?: string;
	segmentWidth?: number;
	segmentHeight?: number;
	stepRatio?: number;
	extraTrim?: number;
	opacity?: number;
	blur?: number;
};

export function connectElementsWithThread(
	className: string,
	options: ThreadOptions = {},
): void {
	"use client";
	const {
		threadSrc = "./thread.svg",
		segmentWidth = 32,
		segmentHeight = 12,
		stepRatio = 0.55,
		extraTrim = 1,
		opacity = 0.95,
		blur = 0,
	} = options;

	let svg = document.getElementById(
		"pixel-string-overlay",
	) as SVGSVGElement | null;

	if (!svg) {
		svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("id", "pixel-string-overlay");

		Object.assign(svg.style, {
			position: "absolute",
			left: "0",
			top: "0",
			pointerEvents: "none",
			zIndex: "30",
			overflow: "visible",
		});

		document.body.appendChild(svg);
	}

	const documentWidth = document.documentElement.scrollWidth;
	const documentHeight = document.documentElement.scrollHeight;
	svg.setAttribute("viewBox", `0 0 ${documentWidth} ${documentHeight}`);
	svg.setAttribute("width", String(documentWidth));
	svg.setAttribute("height", String(documentHeight));
	svg.style.width = `${documentWidth}px`;
	svg.style.height = `${documentHeight}px`;
	svg.innerHTML = "";
	svg.style.filter = blur > 0 ? `blur(${blur}px)` : "";

	const elements = [
		...document.querySelectorAll<HTMLElement>(`.${className}`),
	].filter((element) => {
		const style = window.getComputedStyle(element);
		const rect = element.getBoundingClientRect();
		return (
			style.display !== "none" &&
			style.visibility !== "hidden" &&
			rect.width > 0 &&
			rect.height > 0
		);
	});
	if (elements.length < 2) return;

	const points = elements.map((el) => {
		const rect = el.getBoundingClientRect();
		return {
			x: rect.left + window.scrollX + rect.width / 2,
			y: rect.top + window.scrollY + rect.height / 2,
			r: Math.max(rect.width, rect.height) / 2,
		};
	});

	for (let i = 0; i < points.length - 1; i++) {
		const a = points[i];
		const b = points[i + 1];

		let dx = b.x - a.x;
		let dy = b.y - a.y;
		let length = Math.hypot(dx, dy);
		if (!length) continue;

		const ux = dx / length;
		const uy = dy / length;
		const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

		// Trim only to the dot edge, plus a tiny extra amount
		const trimStart = a.r + extraTrim;
		const trimEnd = b.r + extraTrim;

		if (length <= trimStart + trimEnd) continue;

		const startX = a.x + ux * trimStart;
		const startY = a.y + uy * trimStart;
		const endX = b.x - ux * trimEnd;
		const endY = b.y - uy * trimEnd;

		dx = endX - startX;
		dy = endY - startY;
		length = Math.hypot(dx, dy);

		const step = segmentWidth * stepRatio;
		const count = Math.max(1, Math.ceil(length / step));

		for (let j = 0; j <= count; j++) {
			const dist = Math.min(j * step, length);
			const t = dist / length;

			const x = startX + dx * t;
			const y = startY + dy * t;

			const img = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"image",
			);
			img.setAttributeNS(
				"http://www.w3.org/1999/xlink",
				"href",
				threadSrc,
			);
			img.setAttribute("href", threadSrc);
			img.setAttribute("width", segmentWidth as unknown as string);
			img.setAttribute("height", segmentHeight as unknown as string);
			img.setAttribute("preserveAspectRatio", "none");
			img.setAttribute("opacity", String(opacity));

			// Center each thread segment on the sampled point
			img.setAttribute(
				"transform",
				`translate(${x}, ${y}) rotate(${angle}) translate(${-segmentWidth / 2}, ${-segmentHeight / 2})`,
			);

			svg.appendChild(img);
		}
	}
}

export function redrawThread(): void {
	connectElementsWithThread("pin", {
		threadSrc: "/img/assets/red-thread.svg",
		segmentWidth: 32,
		segmentHeight: 20,
		stepRatio: 0.5,
		extraTrim: 7,
		opacity: 0.95,
		blur: 0,
	});
}

//! This is how to use it
export function mountLandingThread(): () => void {
	let animationFrame: number | null = null;
	let mounted = true;
	const scheduleRedraw = () => {
		if (animationFrame !== null) return;
		animationFrame = window.requestAnimationFrame(() => {
			animationFrame = null;
			redrawThread();
		});
	};

	scheduleRedraw();
	window.addEventListener("resize", scheduleRedraw);

	const resizeObserver = new ResizeObserver(scheduleRedraw);
	resizeObserver.observe(document.documentElement);
	document
		.querySelectorAll<HTMLElement>(".pin")
		.forEach((pin) => resizeObserver.observe(pin));
	document.fonts.ready.then(() => {
		if (mounted) scheduleRedraw();
	});

	return () => {
		mounted = false;
		window.removeEventListener("resize", scheduleRedraw);
		resizeObserver.disconnect();
		if (animationFrame !== null)
			window.cancelAnimationFrame(animationFrame);
		document.getElementById("pixel-string-overlay")?.remove();
	};
}
