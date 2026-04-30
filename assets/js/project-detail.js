/* =========================================================================
   Project detail pages — injects shared back-bar so individual page
   markup doesn't need to change.
   ========================================================================= */
(function () {
	"use strict";

	function inject() {
		if (document.querySelector(".pd-back-bar")) return;
		const bar = document.createElement("div");
		bar.className = "pd-back-bar";
		bar.innerHTML = `
			<a class="pd-back" href="/" aria-label="Back to portfolio">
				<span class="arr">←</span>
				<span>brooks_wimer</span>
			</a>
			<div class="pd-meta">
				<span class="dot" aria-hidden="true"></span>
				<span>case study</span>
			</div>
		`;
		document.body.insertBefore(bar, document.body.firstChild);

		// Strip the legacy preload class quickly
		document.body.classList.remove("is-preload");
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", inject);
	} else {
		inject();
	}
})();
