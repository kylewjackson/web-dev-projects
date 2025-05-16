const backToTopBtn = document.getElementById('backToTopBtn');
let scrollTimeout;
let isInteracting = false;

function showBackToTop() {
	backToTopBtn.classList.add('visible');

	clearTimeout(scrollTimeout);
	if (!isInteracting) {
		scrollTimeout = setTimeout(() => {
			backToTopBtn.classList.remove('visible');
		}, 1500);
	}
}

window.addEventListener('scroll', () => {
	if (window.scrollY > 300) {
		showBackToTop();
	} else {
		backToTopBtn.classList.remove('visible');
	}
});

// Pause timeout on hover/focus
backToTopBtn.addEventListener('mouseenter', () => {
	isInteracting = true;
	clearTimeout(scrollTimeout);
});
backToTopBtn.addEventListener('focus', () => {
	isInteracting = true;
	clearTimeout(scrollTimeout);
});

// Resume timeout on leave/blur
backToTopBtn.addEventListener('mouseleave', () => {
	isInteracting = false;
	scrollTimeout = setTimeout(() => {
		backToTopBtn.classList.remove('visible');
	}, 1500);
});
backToTopBtn.addEventListener('blur', () => {
	isInteracting = false;
	scrollTimeout = setTimeout(() => {
		backToTopBtn.classList.remove('visible');
	}, 1500);
});

