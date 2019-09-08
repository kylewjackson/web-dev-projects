# Rawr You the One?

[Play Now!](https://www.kylejackson.dev/rawr)

This browser game is inspired by the MTV reality program *Are You the One?*.

Made with vanilla:

* *HTML*
* *CSS (Grid)*
* *Javascript*

Rules
--

In this game, you'll have a number of rounds to match owners with their *"Pawfect"* pet companion. At the beginning of each round, you may send a pair formed from a random selection of 3 owner and 3 pets into the *Woof Booth,* which will reveal if they are a match or no-match. You can keep track of potential pairings by White or Blacklisting combinations you think may or may not be a match. The round is complete after you select a pet for each owner and submit. You are presented with a *Stats* table and told how many matches you found, *but not what those matches are*. If you don't get any matches, that's a *Blackout* and all pairings are marked as no match. Continue this process of elimination until the game ends, telling you the correct matches and how many blackouts you had.

Features
--

* All code is from scratch* and completely **vanilla**
  * Javascript code is annotated
* Layout is **responsive**, and optimized for both **mobile** and **desktop** play
* Styled primarily using **CSS Grid**
* **Auto-prefixed** and **cross-browser** tested.
* Pawprint and bone **SVG icons** were personally designed using [Figma](https://www.figma.com)
* Click to cycle through bone icons to *Whitelist/Blacklist* pairs
    * The game is designed to only alert the player to Woof Booth results and Blackouts. It doesn't play itself, so making use of listings is key, especially at higher rounds.
* Reset your selections or lists at any point
* Selections are color-coordinated to indicate when unique, duplicate, potential woof, confirmed match/no-match, and whitelisted/blacklisted
* Selection boxes are **collapsible** for visibility, specifically on mobile
* Fixed **navbar** includes:
  * anchors for quick traversal through page sections
  * restart game with a new number of rounds/pairs
  * a **modal window** that displays the game's rules.
  * a message display informing the player of what they need to do next
* The *Stats* table dynamically **resizes** and redistributes its cells based on viewport width.
  * Table will also highlight all instances of that pairing that occur in your selections on hover

\*CDNs were used for [Normalize CSS](https://necolas.github.io/normalize.css/), [Google Fonts](https://fonts.google.com/), and [FontAwesome](https://fontawesome.com/) Icons

---

***Future Updates***

* Improved Accessibility, especially for keyboard players
* Animated transitions and styles for added visual flourish
* Enhanced navigation and collapsable message banner
* SVG compatibility with Safari
* Additional design tweaks


---

## Version History

### Version 1

* ***1.0***

  * *Code made public on August 24th, 2019*
  * Completed over the course of 2 months
  * Public hosting and player testing coming soon

* ***1.1***

  * *August 28th, 2019*
  * Bug fixes:
    * Added additional empty cell in stat chart during endgame
    * Marked pawfect matches in other owner stat charts as no-match
    * Higher specifity for Safari-only query when positioning inputs
    * Fixed duplicate marker in stats chart to be readable
  * Message container now shakes to alert users of game changing events.
  * Round submit jumps to Stats chart anchor
  * White/Blacklist bone icons can be seen in stat chart entries
  * Stat chart backgrounds for match/no-matches is more apparent
  * Adjusted stat chart highlight colors

* ***1.1.1***
  * *September 7th, 2019*
  * Added ```noscript``` fallback messge
  * Added ```lang``` attribute to ```html``` tag
