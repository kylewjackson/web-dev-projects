function _createForOfIteratorHelper(a, b) {
	var c;
	if ("undefined" == typeof Symbol || null == a[Symbol.iterator]) {
		if (
			Array.isArray(a) ||
			(c = _unsupportedIterableToArray(a)) ||
			(b && a && "number" == typeof a.length)
		) {
			c && (a = c);
			var d = 0,
				e = function () {};
			return {
				s: e,
				n: function n() {
					return d >= a.length ? { done: !0 } : { done: !1, value: a[d++] };
				},
				e: function e(a) {
					throw a;
				},
				f: e,
			};
		}
		throw new TypeError(
			"Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
		);
	}
	var f,
		g = !0,
		h = !1;
	return {
		s: function s() {
			c = a[Symbol.iterator]();
		},
		n: function n() {
			var a = c.next();
			return (g = a.done), a;
		},
		e: function e(a) {
			(h = !0), (f = a);
		},
		f: function f() {
			try {
				g || null == c["return"] || c["return"]();
			} finally {
				if (h) throw f;
			}
		},
	};
}
function _unsupportedIterableToArray(a, b) {
	if (a) {
		if ("string" == typeof a) return _arrayLikeToArray(a, b);
		var c = Object.prototype.toString.call(a).slice(8, -1);
		return (
			"Object" === c && a.constructor && (c = a.constructor.name),
			"Map" === c || "Set" === c
				? Array.from(a)
				: "Arguments" === c ||
				  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)
				? _arrayLikeToArray(a, b)
				: void 0
		);
	}
}
function _arrayLikeToArray(a, b) {
	(null == b || b > a.length) && (b = a.length);
	for (var c = 0, d = Array(b); c < b; c++) d[c] = a[c];
	return d;
} //browser detection
var subtitlePos,
	navOff,
	ua = window.navigator.userAgent,
	ie = /MSIE|Trident/.test(ua);
console.log(
	"10/01/19: Hey, it's Kyle. Thanks for checking out my portfolio! Just wanted to let you know if there is a warning in the Chrome dev console about createClass being deprecated, that's an issue with my use of create-react-app for my Product Page demo, which I'm looking into. It shouldn't be causing any issues."
),
	document
		.querySelector(".header-content")
		.insertAdjacentHTML(
			"afterbegin",
			'\n    <nav class="navbar">\n        <ul class="navigation">\n            <li id="home-link" class="nav-link">\n                <button class="home-button" tabindex="-1">\n                    <a href="/">\n                        <img src="images/icons/navigation-home-icon.svg" alt="home-page button" id="home-icon" class="icon">\n                    </a>\n                </button>\n            </li>\n            <li id="about-link" class="nav-link">\n                <a href="/about">About Me</a>\n            </li>\n            <li id="projects-link" class="nav-link">\n                <a href="/projects">Projects</a>\n            </li>\n        </ul>\n    </nav>\n'
		),
	"index" === document.body.id &&
		(document.querySelector(".navbar").classList.add("hidden"),
		(subtitlePos = document.querySelector("#subtitle").offsetTop),
		(navOff = !0)); //tools
var tools = {
	code: {
		html: {
			abbr: "html",
			name: "HTML 5",
			symbol: "5",
			full: "HyperText Markup Language 5",
			url: "https://www.w3.org/html/",
		},
		css: {
			abbr: "css",
			name: "CSS 3",
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
		react: {
			abbr: "react",
			name: "React.JS",
			symbol: "R",
			full: "React.JS",
			url: "https://reactjs.org/",
		},
		jquery: {
			abbr: "jquery",
			name: "jQuery",
			symbol: "jQ",
			full: "jQuery",
			url: "https://jquery.com/",
		},
		bootstrap: {
			abbr: "bootstrap",
			name: "Bootstrap 4",
			symbol: "B",
			full: "Bootstrap 4",
			url: "https://getbootstrap.com/",
		},
		sass: {
			abbr: "sass",
			name: "Sass",
			symbol: "S",
			full: "Sass",
			url: "https://sass-lang.com/",
		},
	},
	design: {
		photoshop: {
			abbr: "photoshop",
			name: "Photoshop",
			symbol: "Ps",
			full: "PhotoShop CS6 / Creative Cloud",
			url: "https://www.adobe.com/products/photoshop.html",
		},
		figma: {
			abbr: "figma",
			name: "Figma",
			symbol: "F",
			full: "Figma",
			url: "https://www.figma.com",
		},
	},
	version: {
		vscode: {
			abbr: "vscode",
			name: "VSCode",
			symbol: "VSC",
			full: "Visual Studio Code",
			url: "https://code.visualstudio.com/",
		},
		git: {
			abbr: "git",
			name: "Git",
			symbol: "G",
			full: "Git",
			url: "https://git-scm.com/",
		},
		macos: {
			abbr: "macos",
			name: "MacOS",
			symbol: "M",
			full: "Apple MacOS",
			url: "https://www.apple.com/macos/",
		},
	},
}; //add tools
function addTool(a, b, c, d) {
	a.insertAdjacentHTML(
		"beforeend",
		'\n        <span id="'
			.concat(b, '-box" class="tool-box faded">\n            <b id="')
			.concat(b, '-symbol" class="tool-symbol">')
			.concat(d, '</b>\n            <i id="')
			.concat(b, '-name" class="tool-name">')
			.concat(c, "</i>\n        </span>\n    ")
	);
}
"index" === document.body.id &&
	(Object.keys(tools.code).forEach(function (a) {
		addTool(
			document.querySelector("#code-container"),
			tools.code[a].abbr,
			tools.code[a].name,
			tools.code[a].symbol
		);
	}),
	Object.keys(tools.design).forEach(function (a) {
		addTool(
			document.querySelector("#design-container"),
			tools.design[a].abbr,
			tools.design[a].name,
			tools.design[a].symbol
		);
	}),
	Object.keys(tools.version).forEach(function (a) {
		addTool(
			document.querySelector("#editing-vc-container"),
			tools.version[a].abbr,
			tools.version[a].name,
			tools.version[a].symbol
		);
	}));
"about" === document.body.id &&
	Object.keys(tools).forEach(function (a) {
		Object.keys(tools[a]).forEach(function (b) {
			addTool(
				document.querySelector("#tool-container"),
				tools[a][b].abbr,
				tools[a][b].name,
				tools[a][b].symbol
			),
				document
					.querySelector("#".concat(tools[a][b].abbr, "-box"))
					.insertAdjacentHTML(
						"afterend",
						'\n                <a href="'
							.concat(tools[a][b].url, '" target="_blank" id="')
							.concat(tools[a][b].abbr, '-link" class="links faded">')
							.concat(tools[a][b].full, "</a>\n            ")
					);
		});
	}); //projects
var projects = {
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
}; //add projects
function addProject(a, b, c, d, e, f, g) {
	document
		.querySelector("#projects")
		.insertAdjacentHTML(
			"beforeend",
			'\n        <div id="'
				.concat(
					a,
					'-container" class="project-container faded">\n        <a href="'
				)
				.concat(e, '" target="_blank" id="')
				.concat(
					a,
					'-thumbnail" class="thumbnail-link">\n            <figure id="'
				)
				.concat(
					a,
					'-thumbnail-preview" class="thumbnail-preview active-phone"></figure>\n        </a>\n        <div id="'
				)
				.concat(
					a,
					'-description-container" class="project-description-container">\n            <h4 id="'
				)
				.concat(a, '-title" class="project-title">')
				.concat(b, '</h4>\n                <p id="')
				.concat(a, '-description" class="project-description">')
				.concat(c, '</p>\n                <p id="')
				.concat(a, '-tools" class="project-tools">')
				.concat(d, '</p>\n                <span id="')
				.concat(
					a,
					'-link-container" class="project-link-container">\n                    <a href="'
				)
				.concat(g, '" target="_blank" id="')
				.concat(
					a,
					'-source-link" class="source-link">Source</a>\n                    <a href="'
				)
				.concat(f, '" target="_blank" id="')
				.concat(
					a,
					'-live-preview-link" class="live-preview-link">Live</a>\n                </span>\n        </div>\n        </div>\n    '
				)
		);
}
"index" === document.body.id
	? (addProject(
			projects.rawr.abbr,
			projects.rawr.title,
			projects.rawr.description,
			projects.rawr.tools,
			projects.rawr.thumb,
			projects.rawr.live,
			projects.rawr.source
	  ),
	  addProject(
			projects.portfolio.abbr,
			projects.portfolio.title,
			projects.portfolio.description,
			projects.portfolio.tools,
			projects.portfolio.thumb,
			projects.portfolio.live,
			projects.portfolio.source
	  ),
	  addProject(
			projects.productMock.abbr,
			projects.productMock.title,
			projects.productMock.description,
			projects.productMock.tools,
			projects.productMock.thumb,
			projects.productMock.live,
			projects.productMock.source
	  ))
	: "all-projects" === document.body.id &&
	  Object.keys(projects).forEach(function (a) {
			addProject(
				projects[a].abbr,
				projects[a].title,
				projects[a].description,
				projects[a].tools,
				projects[a].thumb,
				projects[a].live,
				projects[a].source
			),
				projects[a].srcText &&
					(document.querySelector(
						"#".concat(projects[a].abbr, "-source-link")
					).innerText = projects[a].srcText);
			projects[a].liveText &&
				(document.querySelector(
					"#".concat(projects[a].abbr, "-live-preview-link")
				).innerText = projects[a].liveText);
	  }); //use intersection observer if not internet explorer
if (
	(document
		.querySelector(".footer-content")
		.insertAdjacentHTML(
			"beforeend",
			'\n    <h2 id="contact-heading" class="content-heading faded">Let\'s get in touch!</h2>\n    <address id="email-container" class="container faded">\n        <a href="mailto:kylewalkerjackson@gmail.com" target="_blank" id="email-link" class="contact-link">\n            <img src="images/icons/contact-mail-icon.svg" alt="" id="email-icon" class="icon">\n            <span>kylewalkerjackson@gmail.com</span>\n        </a>\n    </address>\n    <address id="phone-container" class="container faded">\n        <a href="tel:682-438-1847" id="phone-link" class="contact-link">\n            <img src="images/icons/contact-phone-icon.svg" alt="" id="phone-icon" class="icon">\n            <span>682.438.1847</span>\n        </a>\n    </address>\n    <div id="social-profiles-container" class="container faded">\n        <a href="https://www.linkedin.com/in/kylewalkerjackson/" target="_blank" id="contact-linkedin-link" class="link-box">\n            <b id="contact-linkedin-symbol" class="link-symbol">li</b>\n            <i id="contact-linkedin-icon" class="link-name">LinkedIn</i>\n        </a>\n        <a href="https://github.com/kylewjackson" target="_blank" id="github-link" class="link-box">\n            <b id="contact-github-symbol" class="link-symbol">gh</b>\n            <i id="contact-github-name" class="link-name">Github</i>\n        </a>\n    </div>\n    <small class="copyright">Site \xA9 Kyle Jackson 2019. All rights reserved.</small>\n'
		),
	"index" === document.body.id &&
		window.addEventListener(
			"scroll",
			function () {
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
				0 === window.scrollY
					? (navOff ||
							(document.querySelector(".navbar").classList.toggle("hidden"),
							(navOff = !0)),
					  0 === document.querySelectorAll(".top-faded").length &&
							(document
								.querySelector("#self-portrait-icon")
								.classList.add("top-faded"),
							document
								.querySelector("#intro-heading")
								.classList.add("top-faded"),
							document.querySelector("#intro-icons").classList.add("top-faded"),
							document
								.querySelector(".intro-paragraph")
								.classList.add("top-faded"),
							document
								.querySelector(".employ-paragraph")
								.classList.add("top-faded")))
					: (navOff &&
							(document.querySelector(".navbar").classList.toggle("hidden"),
							(navOff = !1)),
					  0 < document.querySelectorAll(".top-faded").length &&
							(document
								.querySelector("#self-portrait-icon")
								.classList.remove("top-faded"),
							document
								.querySelector("#intro-heading")
								.classList.remove("top-faded"),
							document
								.querySelector("#intro-icons")
								.classList.remove("top-faded"),
							document
								.querySelector(".intro-paragraph")
								.classList.remove("top-faded"),
							document
								.querySelector(".employ-paragraph")
								.classList.remove("top-faded")));
			},
			!1
		),
	!ie)
) {
	//reveal content on scroll
	var fadeIn = new IntersectionObserver(function (a, b) {
		var c,
			d = _createForOfIteratorHelper(a);
		try {
			for (d.s(); !(c = d.n()).done; ) {
				var e = c.value; //check if element is in view
				e.isIntersecting &&
					(e.target.classList.remove("faded"),
					b.unobserve(e.target),
					1 > document.querySelectorAll(".faded").length && b.disconnect());
			}
		} catch (a) {
			d.e(a);
		} finally {
			d.f();
		}
	});
	"index" === document.body.id &&
		window.addEventListener(
			"scroll",
			function () {
				document.querySelectorAll(".faded").forEach(function (a) {
					fadeIn.observe(a);
				});
			},
			{ once: !0 }
		),
		"index" !== document.body.id &&
			document.querySelectorAll(".faded").forEach(function (a) {
				fadeIn.observe(a);
			});
} //add transition class to faded elements for page load
document.addEventListener(
	"keydown",
	function (a) {
		//reveal navbar if tabbed
		"Tab" === a.key &&
			document.querySelector(".navbar").classList.contains("hidden") &&
			document.querySelector(".navbar").classList.remove("hidden");
	},
	!1
),
	document.querySelectorAll(".faded").forEach(function (a) {
		a.classList.add("transition-1s");
	});
