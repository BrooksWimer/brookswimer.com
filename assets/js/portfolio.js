/* =========================================================================
   Portfolio — Brooks Wimer
   Interactions: typewriter, reveals, mouse-aware glow, sticky nav,
   smooth scroll, command palette.
   Vanilla JS, no dependencies.
   ========================================================================= */
(function () {
	"use strict";

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	/* ---------- Year ---------- */
	const yearEl = document.getElementById("year");
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	/* ---------- Sticky-nav border on scroll ---------- */
	const nav = document.getElementById("nav");
	if (nav) {
		const onScroll = () => {
			if (window.scrollY > 12) nav.classList.add("is-scrolled");
			else nav.classList.remove("is-scrolled");
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
	}

	/* ---------- Mouse-aware ambient glow ---------- */
	const glow = document.querySelector(".bg-glow");
	if (glow && !reduceMotion) {
		let raf = 0;
		let tx = 50, ty = 30;
		document.addEventListener(
			"pointermove",
			(e) => {
				tx = (e.clientX / window.innerWidth) * 100;
				ty = (e.clientY / window.innerHeight) * 100;
				if (!raf) {
					raf = requestAnimationFrame(() => {
						glow.style.setProperty("--mx", tx + "%");
						glow.style.setProperty("--my", ty + "%");
						raf = 0;
					});
				}
			},
			{ passive: true }
		);
	}

	/* ---------- Typewriter (rotating role) ---------- */
	const typedEl = document.getElementById("role-typed");
	if (typedEl) {
		const phrases = [
			"modernizing legacy systems",
			"orchestrating AI agents",
			"building real-time hardware",
			"shipping APIs that hold up",
			"making distributed systems legible",
		];

		if (reduceMotion) {
			typedEl.textContent = phrases[0];
		} else {
			let i = 0; // phrase index
			let j = 0; // char index
			let deleting = false;

			const typeSpeed = 55;
			const deleteSpeed = 28;
			const holdMs = 1600;

			const tick = () => {
				const phrase = phrases[i];
				if (!deleting) {
					typedEl.textContent = phrase.slice(0, ++j);
					if (j >= phrase.length) {
						deleting = true;
						setTimeout(tick, holdMs);
						return;
					}
					setTimeout(tick, typeSpeed + Math.random() * 30);
				} else {
					typedEl.textContent = phrase.slice(0, --j);
					if (j <= 0) {
						deleting = false;
						i = (i + 1) % phrases.length;
						setTimeout(tick, 320);
						return;
					}
					setTimeout(tick, deleteSpeed);
				}
			};
			tick();
		}
	}

	/* ---------- Intersection-observer reveals ---------- */
	const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
	if ("IntersectionObserver" in window && revealEls.length) {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						io.unobserve(entry.target);
					}
				});
			},
			{ rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
		);
		revealEls.forEach((el) => io.observe(el));
	} else {
		revealEls.forEach((el) => el.classList.add("is-visible"));
	}

	/* ---------- Smooth-scroll for internal anchors ---------- */
	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener("click", (e) => {
			const id = link.getAttribute("href");
			if (!id || id === "#") return;
			const target = document.querySelector(id);
			if (!target) return;
			e.preventDefault();
			const navH = nav ? nav.offsetHeight : 0;
			const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
			window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
		});
	});

	/* ---------- Command palette ---------- */
	const cmdkEl = document.getElementById("cmdk");
	const cmdkInput = document.getElementById("cmdk-input");
	const cmdkList = document.getElementById("cmdk-list");
	const cmdkTrigger = document.getElementById("cmdk-trigger");

	const cmdkItems = [
		// Featured projects
		{ group: "Featured", label: "Maverick — AI Agent Orchestration", href: "projects/maverick/maverick.html", tag: "01" },
		{ group: "Featured", label: "SyncSonic — Bluetooth Audio", href: "projects/syncsonic/syncsonic.html", tag: "02" },
		{ group: "Featured", label: "Astra — Network Scanner", href: "projects/astra/astra.html", tag: "03" },
		// More work
		{ group: "Work", label: "Kitbash — Wireless Controller", href: "projects/kitbash/kitbash.html", tag: "04" },
		{ group: "Work", label: "Control Room Display", href: "projects/control-room/control-room-display.html", tag: "05" },
		{ group: "Work", label: "FoodPal — Restaurant Discovery", href: "projects/foodpal/foodpal.html", tag: "06" },
		{ group: "Work", label: "Emergency Contact Automation", href: "projects/emergency-contact/emergency-contact-automation.html", tag: "07" },
		{ group: "Work", label: "Real-Time Face Filter", href: "projects/face-filter/face-filter.html", tag: "08" },
		{ group: "Work", label: "3D Model Viewer", href: "projects/3d-models/3D_models.html", tag: "09" },
		{ group: "Work", label: "Wind & Solar Forecast API", href: "projects/api-docs/api-documentation.html", tag: "10" },
		// Sections
		{ group: "Navigate", label: "About", href: "#about", tag: "§" },
		{ group: "Navigate", label: "Experience", href: "#experience", tag: "§" },
		{ group: "Navigate", label: "Contact", href: "#contact", tag: "§" },
		// Actions
		{ group: "Actions", label: "Download résumé (PDF)", href: "Brooks Wimer Resume.pdf", tag: "↓", external: true },
		{ group: "Actions", label: "Email me — wimerbrooks@gmail.com", href: "mailto:wimerbrooks@gmail.com", tag: "@" },
		{ group: "Actions", label: "GitHub — @BrooksWimer", href: "https://github.com/BrooksWimer", tag: "↗", external: true },
		{ group: "Actions", label: "LinkedIn", href: "https://www.linkedin.com/in/brooks-wimer-258232210/", tag: "↗", external: true },
	];

	let activeIndex = 0;
	let filteredItems = cmdkItems.slice();

	function renderCmdk() {
		if (!cmdkList) return;
		cmdkList.innerHTML = "";
		const groups = {};
		filteredItems.forEach((it) => {
			(groups[it.group] = groups[it.group] || []).push(it);
		});

		let flatIndex = 0;
		Object.keys(groups).forEach((groupName) => {
			const groupLabel = document.createElement("div");
			groupLabel.className = "cmdk__group-label";
			groupLabel.textContent = groupName;
			cmdkList.appendChild(groupLabel);

			groups[groupName].forEach((it) => {
				const row = document.createElement("div");
				row.className = "cmdk__item" + (flatIndex === activeIndex ? " is-active" : "");
				row.setAttribute("role", "option");
				row.dataset.index = String(flatIndex);
				row.innerHTML = `
					<span>${it.label}</span>
					<span class="cmdk__item-tag">${it.tag}</span>
				`;
				row.addEventListener("mouseenter", () => {
					activeIndex = parseInt(row.dataset.index, 10);
					updateActive();
				});
				row.addEventListener("click", () => activate(it));
				cmdkList.appendChild(row);
				flatIndex++;
			});
		});

		if (filteredItems.length === 0) {
			const empty = document.createElement("div");
			empty.className = "cmdk__group-label";
			empty.style.padding = "20px 12px";
			empty.style.color = "var(--text-faint)";
			empty.style.letterSpacing = "0";
			empty.style.textTransform = "none";
			empty.style.fontSize = "13px";
			empty.textContent = "No matches.";
			cmdkList.appendChild(empty);
		}
	}

	function updateActive() {
		const items = cmdkList.querySelectorAll(".cmdk__item");
		items.forEach((el) => {
			if (parseInt(el.dataset.index, 10) === activeIndex) {
				el.classList.add("is-active");
				el.scrollIntoView({ block: "nearest" });
			} else {
				el.classList.remove("is-active");
			}
		});
	}

	function activate(item) {
		closeCmdk();
		if (!item) return;
		if (item.href.startsWith("#")) {
			const target = document.querySelector(item.href);
			if (target) {
				const navH = nav ? nav.offsetHeight : 0;
				const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
				window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
			}
		} else if (item.external) {
			window.open(item.href, "_blank", "noopener");
		} else {
			window.location.href = item.href;
		}
	}

	function openCmdk() {
		if (!cmdkEl) return;
		cmdkEl.classList.add("is-open");
		filteredItems = cmdkItems.slice();
		activeIndex = 0;
		renderCmdk();
		setTimeout(() => cmdkInput && cmdkInput.focus(), 30);
	}

	function closeCmdk() {
		if (!cmdkEl) return;
		cmdkEl.classList.remove("is-open");
		if (cmdkInput) cmdkInput.value = "";
	}

	if (cmdkTrigger) cmdkTrigger.addEventListener("click", openCmdk);

	if (cmdkEl) {
		cmdkEl.addEventListener("click", (e) => {
			if (e.target === cmdkEl) closeCmdk();
		});
	}

	if (cmdkInput) {
		cmdkInput.addEventListener("input", () => {
			const q = cmdkInput.value.trim().toLowerCase();
			if (!q) {
				filteredItems = cmdkItems.slice();
			} else {
				filteredItems = cmdkItems.filter((it) =>
					(it.label + " " + it.group).toLowerCase().includes(q)
				);
			}
			activeIndex = 0;
			renderCmdk();
		});
	}

	document.addEventListener("keydown", (e) => {
		// Open
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
			e.preventDefault();
			if (cmdkEl && cmdkEl.classList.contains("is-open")) closeCmdk();
			else openCmdk();
			return;
		}
		// Slash to open (when not typing in another field)
		if (e.key === "/" && document.activeElement === document.body) {
			e.preventDefault();
			openCmdk();
			return;
		}
		if (!cmdkEl || !cmdkEl.classList.contains("is-open")) return;

		if (e.key === "Escape") {
			e.preventDefault();
			closeCmdk();
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			activeIndex = Math.min(activeIndex + 1, filteredItems.length - 1);
			updateActive();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			activeIndex = Math.max(activeIndex - 1, 0);
			updateActive();
		} else if (e.key === "Enter") {
			e.preventDefault();
			const item = filteredItems[activeIndex];
			activate(item);
		}
	});

	/* ---------- Hide preload class ASAP (legacy main.css safety) ---------- */
	document.body.classList.remove("is-preload");

})();
