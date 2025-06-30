//browser detection
const ua = window.navigator.userAgent;
const ie = /MSIE|Trident/.test(ua);

let subtitlePos, navOff;

//add navbar
document.querySelector(".header-content").insertAdjacentHTML(
	"afterbegin",
	`
    <nav class="navbar">
        <ul class="navigation">
            <li id="home-link" class="nav-link">
                <button class="home-button" tabindex="-1">
                    <a href="/">
                        <img src="images/icons/navigation-home-icon.svg" alt="home-page button" id="home-icon" class="icon">
                    </a>
                </button>
            </li>
            <li id="about-link" class="nav-link">
                <a href="/about">About Me</a>
            </li>
            <li id="projects-link" class="nav-link">
                <a href="/projects">Projects</a>
            </li>
        </ul>
    </nav>
`
);

//hide navbar at beginning on index page
if (document.body.id === "index") {
	document.querySelector(".navbar").classList.add("hidden");
	subtitlePos = document.querySelector("#subtitle").offsetTop;
	navOff = true;
}

//tools
const tools = {
	code: {
		html: {
			abbr: "html",
			name: "HTML5",
			symbol: "5",
			full: "HyperText Markup Language 5",
			url: "https://www.w3.org/html/",
		},
		css: {
			abbr: "css",
			name: "CSS3",
			symbol: "3",
			full: "Cascading StyleSheets 3",
			url: "https://www.w3.org/Style/CSS/",
		},
		js: {
			abbr: "js",
			name: "JavaScript",
			symbol: "JS",
			full: "JavaScript EcmaScript6",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
		},
		typescript: {
			abbr: "typescript",
			name: "TypeScript",
			symbol: "TS",
			full: "TypeScript",
			url: "https://www.typescriptlang.org/",
		},
	},
	frameworks: {
		react: {
			abbr: "react",
			name: "React",
			symbol: "R",
			full: "React.JS",
			url: "https://reactjs.org/",
		},
		scss: {
			abbr: "scss",
			name: "SCSS",
			symbol: "S",
			full: "Sass / SCSS",
			url: "https://sass-lang.com/",
		},
		bootstrap: {
			abbr: "bootstrap",
			name: "Bootstrap 5",
			symbol: "Bs",
			full: "Bootstrap 4 / 5",
			url: "https://getbootstrap.com/",
		},
		sfcc: {
			abbr: "sfcc",
			name: "SalesForce",
			symbol: "SF",
			full: "SalesForce Commerce Cloud (SFRA)",
			url: "https://www.salesforce.com/commerce/",
		},
		storybook: {
			abbr: "storybook",
			name: "Storybook",
			symbol: "Sb",
			full: "Storybook",
			url: "https://storybook.js.org/",
		},
		jquery: {
			abbr: "jquery",
			name: "jQuery",
			symbol: "jQ",
			full: "jQuery",
			url: "https://jquery.com/",
		},
	},
	version: {
		git: {
			abbr: "git",
			name: "Git",
			symbol: "G",
			full: "Git",
			url: "https://git-scm.com/",
		},
		github: {
			abbr: "github",
			name: "GitHub",
			symbol: "GH",
			full: "GitHub",
			url: "https://github.com/kylewjackson",
		},
		bitbucket: {
			abbr: "bitbucket",
			name: "Bitbucket",
			symbol: "Bb",
			full: "Bitbucket",
			url: "https://bitbucket.org/",
		},
		agile: {
			abbr: "agile",
			name: "Agile",
			symbol: "Ag",
			full: "Agile Methodologies",
			url: "https://en.wikipedia.org/wiki/Agile_software_development",
		},
		scrum: {
			abbr: "scrum",
			name: "Scrum",
			symbol: "Sc",
			full: "Scrum Framework",
			url: "https://www.scrum.org/resources/what-scrum-module",
		},
		kanban: {
			abbr: "kanban",
			name: "Kanban",
			symbol: "Kb",
			full: "Kanban Framework",
			url: "https://www.atlassian.com/agile/kanban",
		},
		jira: {
			abbr: "jira",
			name: "Jira",
			symbol: "Ji",
			full: "Jira Project Management",
			url: "https://www.atlassian.com/software/jira",
		},
	},
	design: {
		figma: {
			abbr: "figma",
			name: "Figma",
			symbol: "F",
			full: "Figma",
			url: "https://www.figma.com",
		},
		photoshop: {
			abbr: "photoshop",
			name: "Photoshop",
			symbol: "Ps",
			full: "PhotoShop CS6 / Creative Cloud",
			url: "https://www.adobe.com/products/photoshop.html",
		},
	},
	testing: {
		ab: {
			abbr: "ab",
			name: "A/B Testing",
			symbol: "AB",
			full: "A/B Split Testing",
			url: "https://www.oracle.com/cx/marketing/what-is-ab-testing/",
		},
		ga: {
			abbr: "ga",
			name: "Google Analytics",
			symbol: "GA",
			full: "Google Analytics 3 / 4",
			url: "https://marketingplatform.google.com/about/analytics/",
		},
		qm: {
			abbr: "qm",
			name: "Quantum Metric",
			symbol: "QM",
			full: "Quantum Metric",
			url: "https://www.quantummetric.com/",
		},
		mt: {
			abbr: "mt",
			name: "Monetate",
			symbol: "Mt",
			full: "Monetate Personalization",
			url: "https://monetate.com/",
		},
	},
	additional: {
		vscode: {
			abbr: "vscode",
			name: "VSCode",
			symbol: "VSC",
			full: "Visual Studio Code",
			url: "https://code.visualstudio.com/",
		},
		macos: {
			abbr: "macos",
			name: "MacOS",
			symbol: "M",
			full: "Apple MacOS",
			url: "https://www.apple.com/macos/",
		},
		sheets: {
			abbr: "sheets",
			name: "Google Sheets",
			symbol: "GS",
			full: "Google Sheets",
			url: "https://workspace.google.com/products/sheets/",
		},
	}
};

//add tools
function addTool(selector, abbr, name, symbol) {
	selector.insertAdjacentHTML(
		"beforeend",
		`
        <span id="${abbr}-box" class="tool-box faded">
            <b id="${abbr}-symbol" class="tool-symbol">${symbol}</b>
            <i id="${abbr}-name" class="tool-name">${name}</i>
        </span>
    `
	);
}

if (document.body.id === "index") {
	Object.keys(tools.code).forEach((key) => {
		addTool(
			document.querySelector("#code-container"),
			tools.code[key].abbr,
			tools.code[key].name,
			tools.code[key].symbol
		);
	});
	Object.keys(tools.frameworks).forEach((key) => {
		addTool(
			document.querySelector("#frameworks-container"),
			tools.frameworks[key].abbr,
			tools.frameworks[key].name,
			tools.frameworks[key].symbol
		);
	});
	Object.keys(tools.version).forEach((key) => {
		addTool(
			document.querySelector("#editing-vc-container"),
			tools.version[key].abbr,
			tools.version[key].name,
			tools.version[key].symbol
		);
	});
	Object.keys(tools.design).forEach((key) => {
		addTool(
			document.querySelector("#design-container"),
			tools.design[key].abbr,
			tools.design[key].name,
			tools.design[key].symbol
		);
	});
	Object.keys(tools.testing).forEach((key) => {
		addTool(
			document.querySelector("#testing-container"),
			tools.testing[key].abbr,
			tools.testing[key].name,
			tools.testing[key].symbol
		);
	});
}

if (document.body.id === "about") {
	Object.keys(tools).forEach((category) => {
		Object.keys(tools[category]).forEach((key) => {
			addTool(
				document.querySelector("#tool-container"),
				tools[category][key].abbr,
				tools[category][key].name,
				tools[category][key].symbol
			);
			document
				.querySelector(`#${tools[category][key].abbr}-box`)
				.insertAdjacentHTML(
					"afterend",
					`
                <a href="${tools[category][key].url}" target="_blank" id="${tools[category][key].abbr}-link" class="links faded">${tools[category][key].full}</a>
            `
				);
		});
	});
}

//projects
const projects = {
	movie: {
		abbr: "movie",
		title: "Movie Watchlist",
		description:
			"A movie search and watchlist app.",
		tools: "React, TypeScript, Bootstrap, API",
		thumb: "/movie",
		live: "/movie",
		source: "https://github.com/kylewjackson/web-dev-projects/tree/master/Movie-Project",
	},
	work: {
		abbr: "work",
		title: "Work Portfolio",
		description:
			"Showcase of development work at Sally Beauty Holdings.",
		tools: "Front End Development, SFCC, SEO, Accessibility",
		thumb: "/work",
		live: "/work",
		source: "https://github.com/kylewjackson/web-dev-projects/tree/master/portfolio/public/work.html",
	},
	rawr: {
		abbr: "rawr",
		title: "Rawr You the One?",
		description:
			"A browser-based logic game inspired by MTV's <em>Are You the One?</em>.",
		tools: "Vanilla HTML, CSS, JS",
		thumb: "/rawr",
		live: "/rawr",
		source:
			"https://github.com/kylewjackson/web-dev-projects/tree/master/Rawr-You-The-One",
	},
	portfolio: {
		abbr: "portfolio",
		title: "Front-End Portfolio",
		description: "My portfolio. Custom svg icons, responsive with Flexbox.",
		tools: "HTML, CSS, Sass, Vanilla JS",
		thumb: "/",
		live: "/",
		source:
			"https://github.com/kylewjackson/web-dev-projects/tree/master/portfolio",
	},
	productMock: {
		abbr: "product",
		title: "React Product Page",
		description: "Product page demo built with React.JS",
		tools: "React, CSS",
		thumb:
			"https://github.com/kylewjackson/programming-projects/tree/master/React/Product%20Demo",
		live: "/productpage",
		source:
			"https://github.com/kylewjackson/web-dev-projects/tree/master/React-Product-Page",
	},
	robo: {
		abbr: "robo",
		title: "Robo-Trek",
		description: "Travelling robot app made for an interview",
		tools: "React, CSS",
		thumb: "https://naughty-rosalind-487bdf.netlify.app/",
		live: "https://naughty-rosalind-487bdf.netlify.app/",
		source: "https://github.com/kylewjackson/robot",
	},
	resumecss: {
		abbr: "resumecss",
		title: "CSS Resume",
		description:
			"Custom resume for the CSS Essentials Training Lynda Course. 2018.",
		tools: "Vanilla HTML, CSS",
		thumb: "/Lynda/CSS%20Essential%20Training%20-%20Resume",
		live: "/Lynda/CSS%20Essential%20Training%20-%20Resume",
		source:
			"https://github.com/kylewjackson/web-dev-projects/tree/master/Lynda/CSS%20Essential%20Training%20-%20Resume",
	},
	jtodo: {
		abbr: "jtodo",
		title: "jQuery To-Do List",
		description:
			"Udemy course to-do list. Custom design, favorite/sort functions.",
		tools: "HTML, CSS, jQuery",
		thumb:
			"/Udemy/Web%20Developer%20Bootcamp/Javascript%20Projects/jQuery%20Projects/to-do-list",
		live: "/Udemy/Web%20Developer%20Bootcamp/Javascript%20Projects/jQuery%20Projects/to-do-list",
		source:
			"https://github.com/kylewjackson/web-dev-projects/tree/master/Udemy/Web%20Developer%20Bootcamp/Javascript%20Projects/jQuery%20Projects/to-do-list",
	},
	bootcamp: {
		abbr: "bootcamp",
		title: "Web Developer Bootcamp",
		description: "Projects from Colt Steele's Udemy course.",
		tools: "jQuery, Bootstrap, MongoDB, Express",
		thumb:
			"https://github.com/kylewjackson/web-dev-projects/tree/master/Udemy/Web%20Developer%20Bootcamp",
		live: "https://www.udemy.com/certificate/UC-GCOQR6MA/",
		source:
			"https://github.com/kylewjackson/web-dev-projects/tree/master/Udemy/Web%20Developer%20Bootcamp",
	},
	retro: {
		abbr: "retro",
		title: "Retro Projects",
		description: "Sites made as a hobby from 2006 - 2009.",
		tools: "HTML, CSS",
		thumb: "https://github.com/kylewjackson/web-dev-projects/tree/master/retro",
		live: "https://github.com/kylewjackson/web-dev-projects/tree/master/retro",
		source:
			"https://github.com/kylewjackson/web-dev-projects/tree/master/retro",
	},
};

//add projects
function addProject(abbr, title, description, tools, thumb, live, source) {
	document.querySelector("#projects").insertAdjacentHTML(
		"beforeend",
		`
        <div id="${abbr}-container" class="project-container faded">
        <a href="${thumb}" target="_blank" id="${abbr}-thumbnail" class="thumbnail-link">
            <figure id="${abbr}-thumbnail-preview" class="thumbnail-preview active-phone"></figure>
        </a>
        <div id="${abbr}-description-container" class="project-description-container">
            <h4 id="${abbr}-title" class="project-title">${title}</h4>
                <p id="${abbr}-description" class="project-description">${description}</p>
                <p id="${abbr}-tools" class="project-tools">${tools}</p>
                <span id="${abbr}-link-container" class="project-link-container">
                    <a href="${source}" target="_blank" id="${abbr}-source-link" class="source-link">Source</a>
                    <a href="${live}" target="_blank" id="${abbr}-live-preview-link" class="live-preview-link">Live</a>
                </span>
        </div>
        </div>
    `
	);
}

//specific projects for index page
if (document.body.id === "index") {
	//movie
	addProject(
		projects["movie"].abbr,
		projects["movie"].title,
		projects["movie"].description,
		projects["movie"].tools,
		projects["movie"].thumb,
		projects["movie"].live,
		projects["movie"].source
	);
	//work
	addProject(
		projects["work"].abbr,
		projects["work"].title,
		projects["work"].description,
		projects["work"].tools,
		projects["work"].thumb,
		projects["work"].live,
		projects["work"].source
	);
	//rawr
	addProject(
		projects["rawr"].abbr,
		projects["rawr"].title,
		projects["rawr"].description,
		projects["rawr"].tools,
		projects["rawr"].thumb,
		projects["rawr"].live,
		projects["rawr"].source
	);
	//product mockup
	addProject(
		projects["productMock"].abbr,
		projects["productMock"].title,
		projects["productMock"].description,
		projects["productMock"].tools,
		projects["productMock"].thumb,
		projects["productMock"].live,
		projects["productMock"].source
	);
} else if (document.body.id === "all-projects") {
	//projects page
	Object.keys(projects).forEach((project) => {
		addProject(
			projects[project].abbr,
			projects[project].title,
			projects[project].description,
			projects[project].tools,
			projects[project].thumb,
			projects[project].live,
			projects[project].source
		);
		//change inner text if custom
		if (projects[project].srcText) {
			document.querySelector(
				`#${projects[project].abbr}-source-link`
			).innerText = projects[project].srcText;
		}
		if (projects[project].liveText) {
			document.querySelector(
				`#${projects[project].abbr}-live-preview-link`
			).innerText = projects[project].liveText;
		}
	});
}

//add footer
document.querySelector(".footer-content").insertAdjacentHTML(
	"beforeend",
	`
    <h2 id="contact-heading" class="content-heading faded">Let's get in touch!</h2>
    <address id="email-container" class="container faded">
        <a href="mailto:kylewalkerjackson@gmail.com" target="_blank" id="email-link" class="contact-link">
            <img src="images/icons/contact-mail-icon.svg" alt="" id="email-icon" class="icon">
            <span>kylewalkerjackson@gmail.com</span>
        </a>
    </address>
    <address id="phone-container" class="container faded">
        <a href="tel:682-438-1847" id="phone-link" class="contact-link">
            <img src="images/icons/contact-phone-icon.svg" alt="" id="phone-icon" class="icon">
            <span>682.438.1847</span>
        </a>
    </address>
    <div id="social-profiles-container" class="container faded">
        <a href="https://www.linkedin.com/in/kylewalkerjackson/" target="_blank" id="contact-linkedin-link" class="link-box">
            <b id="contact-linkedin-symbol" class="link-symbol">li</b>
            <i id="contact-linkedin-icon" class="link-name">LinkedIn</i>
        </a>
        <a href="https://github.com/kylewjackson" target="_blank" id="github-link" class="link-box">
            <b id="contact-github-symbol" class="link-symbol">gh</b>
            <i id="contact-github-name" class="link-name">Github</i>
        </a>
    </div>
    <small class="copyright">Site © Kyle Jackson ${new Date().getFullYear()}. All rights reserved.</small>
`
);

//hide/show navbar and reveal content on first scroll of index page
if (document.body.id === "index") {
	window.addEventListener(
		"scroll",
		(e) => {
			//check scroll position
			// console.log('scrollY ' + window.scrollY + ' and element ' + subtitlePos);
			//if further than element, reveal navbar if hidden
			// if (window.scrollY > subtitlePos + 75 && navOff) {
			//     // console.log('show');
			//     document.querySelector('.navbar').classList.toggle('hidden');
			//     navOff = false;
			// };
			// //if navbar is visible and position is less than element, hide navbar
			// if (window.scrollY < subtitlePos && !navOff) {
			//     // console.log('hide');
			//     document.querySelector('.navbar').classList.toggle('hidden');
			//     navOff = true;
			// };
			// if scrolled to top
			if (window.scrollY === 0) {
				//hide navbar if visible
				if (!navOff) {
					document.querySelector(".navbar").classList.toggle("hidden");
					navOff = true;
				}
				//fade top section of content
				if (document.querySelectorAll(".top-faded").length === 0) {
					document
						.querySelector("#self-portrait-icon")
						.classList.add("top-faded");
					document.querySelector("#intro-heading").classList.add("top-faded");
					document.querySelector("#intro-icons").classList.add("top-faded");
					document.querySelector(".intro-paragraph").classList.add("top-faded");
					document
						.querySelector(".employ-paragraph")
						.classList.add("top-faded");
				}
			} else {
				//unfade
				if (navOff) {
					document.querySelector(".navbar").classList.toggle("hidden");
					navOff = false;
				}
				if (document.querySelectorAll(".top-faded").length > 0) {
					document
						.querySelector("#self-portrait-icon")
						.classList.remove("top-faded");
					document
						.querySelector("#intro-heading")
						.classList.remove("top-faded");
					document.querySelector("#intro-icons").classList.remove("top-faded");
					document
						.querySelector(".intro-paragraph")
						.classList.remove("top-faded");
					document
						.querySelector(".employ-paragraph")
						.classList.remove("top-faded");
				}
			}
		},
		false
	);
}

//use intersection observer if not internet explorer
if (!ie) {
	//reveal content on scroll
	const fadeIn = new IntersectionObserver((entries, self) => {
		for (const entry of entries) {
			//check if element is in view
			if (entry.isIntersecting) {
				//remove faded class to reveal
				entry.target.classList.remove("faded");
				//stop observing element
				self.unobserve(entry.target);
				//if all faded elements are in view
				if (document.querySelectorAll(".faded").length < 1) {
					//disconnect observer
					self.disconnect();
				}
			}
		}
	});

	if (document.body.id === "index") {
		window.addEventListener(
			"scroll",
			(e) => {
				document.querySelectorAll(".faded").forEach((element) => {
					fadeIn.observe(element);
				});
			},
			{ once: true }
		);
	}

	if (document.body.id !== "index") {
		document.querySelectorAll(".faded").forEach((element) => {
			fadeIn.observe(element);
		});
	}
}

document.addEventListener(
	"keydown",
	(e) => {
		//reveal navbar if tabbed
		if (e.key === "Tab") {
			if (document.querySelector(".navbar").classList.contains("hidden")) {
				document.querySelector(".navbar").classList.remove("hidden");
			}
		}
	},
	false
);

//add transition class to faded elements for page load
document.querySelectorAll(".faded").forEach((element) => {
	element.classList.add("transition-1s");
});

//scroll function
function scrollToSection(id) {
	const el = document.getElementById(id);
	if (!el) return;

	const yOffset = -82; // Offset in pixels (navbar height)
	const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

	window.scrollTo({
		top: y,
		behavior: 'smooth'
	});
}