/*
  Wadeball's Mod Collection: the one data file.

  To add a mod or game, copy the template at the bottom of this file into the MODS list,
  fill it in, and put its files in mods/<id>/ (or games/<id>/). Nothing else needs changing:
  the home page sections and the entry's own page (mod.html?id=<id>) are built from this.
*/

window.SITE = {
  name: "Wadeball's Mod Collection",
  tagline: "Free mods I make for the games I love.",
  support: {
    venmoName: "Liam Wade",
    venmoUser: "@l_w21",
    venmoUrl: "https://venmo.com/u/l_w21"
  }
};

// Sections of the home page, in order. Each entry below names one with category:.
window.CATEGORIES = [
  { id: "mods",  title: "Mods",  noun: "mod",  badge: "Unofficial fan mod",     soon: "New mods for more games are coming." },
  { id: "games", title: "Games", noun: "game", badge: "Unofficial fan project", soon: "More games are on the way." }
];

window.MODS = [
  {
    id: "viltrumite-powers",              // folder name in mods/ and the page address
    category: "mods",
    name: "Viltrumite Powers",
    game: "WorldBox",
    version: "1.4.0",
    released: "2026-10-26",
    pitch: "Possess anyone in WorldFall and fly, punch and boom through the world like a Viltrumite.",
    accent: "#e0262b",                    // optional: colour for this mod's page and card
    unofficial: "Unofficial fan mod. Not affiliated with or endorsed by the creators of Invincible, Skybound, Image Comics, or Amazon / Prime Video. All characters belong to their owners.",
    cover: "mods/viltrumite-powers/media/human.jpg",
    heroVideo: "mods/viltrumite-powers/media/human.mp4",
    trailer: { video: "mods/viltrumite-powers/media/trailer.mp4", poster: "mods/viltrumite-powers/media/trailer.jpg" },

    download: { url: "mods/viltrumite-powers/Viltrumite Powers 1.4.0.zip", label: "Viltrumite Powers 1.4.0.zip", size: "12.9 MB" },

    requirements: [
      "WorldBox (Steam, PC)",
      "The WorldFall mod, version 0.9.8.9, already installed and working",
      "Multiplayer: everyone who wants powers needs the same version (guests can get it through WorldFall's own mod download)"
    ],

    features: [
      { title: "Flight, three gears", text: "Hover, fast flight, and supersonic flight that breaks the sound barrier with a sonic boom." },
      { title: "Boost stacks", text: "Stack up to 5 boosts in supersonic flight, 0.7 seconds each: 46 to 349 tiles a second, each with its own boom." },
      { title: "Smash through towns", text: "Buildings you hit go up like WorldBox bombs, fire and craters included, and you keep your speed. From stack 2: a 20-tile atomic blast under a mushroom cloud, one every 4 seconds." },
      { title: "Meteor burn", text: "From stack 1 you glow with heat, from stack 2 you burn like a meteor entering the atmosphere." },
      { title: "Cratering dives", text: "Dive straight down from fast flight and leave a crater where you land." },
      { title: "Punches that launch", text: "Combos, plus a charged punch that blows up like a bomb where it lands. Bigger the longer you hold." },
      { title: "Grab and throw", text: "Grab anything up to cow size by the neck, throw it, or charge a throw that slams it into the ground." },
      { title: "Super run", text: "A 20-tile-a-second run that starts with a sonic boom and ploughs through people, buildings and trees." },
      { title: "The Omni-Man look", text: "With powers on you're drawn as Omni-Man: white suit, red cape, gloves, boots and belt. The cape sways and streams out as you fly." },
      { title: "Invincible", text: "Nothing can hurt you while the powers are on. A third-person camera follows you, and gold corners mark who you'd grab." },
      { title: "Surface trails", text: "Skim low and supersonic to tear up dust over land and spray over water." },
      { title: "Tweakable", text: "Speeds, damage, camera and shake live in viltrumite.json, re-read every time you power up." },
      { title: "Multiplayer", text: "Works in WorldFall multiplayer games: every player with the mod can power up, and everyone sees everyone's look, cape, poses, trails and booms." },
      { title: "Player vs player", text: "Punch, grab and throw other players. Powered players get knocked back but never hurt. Held with powers on, Space breaks free." },
      { title: "Host in control", text: "The host decides who gets powers (everyone, host only or nobody), everyone plays by the host's settings, and the world's damage happens in the host's world." }
    ],

    controls: [
      ["T", "Powers on / off (change in F2 > Game > Powers key)"],
      ["Space", "Ground: tap to take off, hold to charge a launch. Air: tap to drop, hold to charge a boost"],
      ["W twice / S twice", "Hover to fast flight / fast flight to hover"],
      ["W / S", "Speed up / slow down in fast flight. S also drops all boost stacks"],
      ["WASD + mouse", "Hovering: move where you look"],
      ["Mouse", "Fast flight: steer"],
      ["Ctrl", "Fast flight: dive into a cratering landing (let go to pull up)"],
      ["Shift + W", "Run. Shift + W twice: super run (Space mid-run to take off)"],
      ["Left mouse", "Punch, quick clicks chain a combo. Hold and release: charged punch. While holding someone: throw"],
      ["Q", "Grab the creature or player you're aiming at (gold corners show who) / let go"],
      ["Space (held by a player)", "Break free into a hover, with your powers on"]
    ],

    install: [
      "Make sure WorldBox with WorldFall 0.9.8.9 already works.",
      "Back up your world. Smashed towns, craters and fires stay when the world saves, and there's no undo.",
      "Unzip the whole download: right-click the zip > Extract All. Don't run anything from inside the zip.",
      "Close WorldBox.",
      "Open the unzipped folder and double-click INSTALL.bat. If Windows says \"Windows protected your PC\", click More info, then Run anyway.",
      "It finds WorldBox, checks WorldFall is there, copies the mod in and says \"Done!\". If it can't find WorldBox, it asks for the folder (Steam: right-click WorldBox > Manage > Browse local files).",
      "Start WorldBox, possess a person with WorldFall (G), and press T."
    ],
    installNotes: [
      "By hand: copy Viltrumite.dll and the Viltrumite folder (just viltrumite.json) from the download's mods folder into worldbox_Data\\StreamingAssets\\mods.",
      "Updating: install the new version the same way. Your viltrumite.json settings are kept. From 1.4.0 the sounds, animations and model are inside Viltrumite.dll, and the installer removes the old loose files.",
      "Multiplayer: the host picks who gets powers in F2 > Game > Powers in multiplayer. Guests joining a host with the mod can get it from WorldFall's mod download (tick \"I trust this host\").",
      "Uninstalling: delete Viltrumite.dll and the Viltrumite folder from WorldBox's mods folder."
    ],


    changelog: [
      { version: "1.4.0", date: "2026-10-26", notes: [
        "Multiplayer: the powers work in WorldFall multiplayer games, for the host and every guest with the same version.",
        "Everyone sees everyone's powers: the Omni-Man look, cape, flying poses, burn, trails, sonic booms and sounds.",
        "Smashes, bombs, fires and craters happen in the host's world for everyone, and the host's game checks every guest's request.",
        "Punch, grab and throw other players. Powered players are knocked back but never hurt; with powers on, Space breaks free.",
        "The host chooses who gets powers: F2 > Game > Powers in multiplayer (Everyone, Host only, Nobody).",
        "The mod is now one DLL plus its settings file, so guests can get it through WorldFall's mod download."
      ]},
      { version: "1.3.0", date: "2026-10-25", notes: [
        "Target marker: gold corners frame the creature Q would grab. Can be turned off in F2 > Game > Target marker.",
        "Boost stacks charge twice as fast (0.7 seconds), and smashing trees and buildings no longer costs a stack.",
        "The atomic bomb goes off from stack 2 instead of 5, at most one every 4 seconds.",
        "Fixed: the centre cross, charge bar and controls line show again.",
        "Fixed: winding up a punch while running keeps your legs running instead of sliding.",
        "Four new settings in viltrumite.json for stack charge time, stack cost, bomb stack and bomb cooldown."
      ]},
      { version: "1.2.0", date: "2026-10-24", notes: [
        "The Omni-Man look: with powers on you're drawn as Omni-Man, with a cape that hangs, sways and streams out in flight.",
        "Switching powers on or off swaps the look in a flash of white and a ring of dust. Can be turned off in F2 > Game."
      ]},
      { version: "1.1.3", date: "2026-10-23", notes: [
        "Boost stacks: up to 5 in supersonic flight, each x1.5 speed with its own sonic boom.",
        "At 5 stacks, the first tree or building you hit is a 20-tile fiery blast under a mushroom cloud.",
        "Meteor burn: a heat glow from stack 1, flames and a fire trail from stack 2.",
        "Dust and spray trails when skimming low and supersonic.",
        "Fixed: flying low over water no longer hides you under the surface."
      ]},
      { version: "1.1.2", date: "2026-10-23", notes: [
        "New super run (Shift + W twice): 20 tiles a second, ploughs through towns.",
        "Supersonic blasts are twice the size, and buildings go up as fiery WorldBox bombs.",
        "Supersonic turns are twice as sharp; camera shakes harder as you charge a launch.",
        "Fixed: no hop before a charged take-off, no invisible walls while hovering."
      ]},
      { version: "1.1.1", date: "2026-10-23", notes: [
        "Charged throws that leave a crater.",
        "Real straight punches on the ground and in the air.",
        "Flying supersonic into buildings and trees blows them apart without slowing you down.",
        "The controls guide moved to a small line at the bottom of the screen."
      ]},
      { version: "1.1.0", date: "2026-10-23", notes: [
        "Seven play-test fixes: no more falling into house interiors, Q holds people by the neck, the charged punch is a no-fire bomb that grows with charge, and more."
      ]},
      { version: "1.0.0", date: "2026-10-22", notes: [
        "First release: hover, fast and supersonic flight, cratering dives, punches, grab and throw, invincibility and a third-person camera."
      ]}
    ],

    credits: "Flying, punching and landing sounds and animations come from the GTA V mod \"Superman V2.2\" by JulioNIB (NIB Mods). Runs on top of the WorldFall mod for WorldBox."
  },

  {
    id: "sandbox-engine",
    category: "games",
    name: "Sandbox Engine",
    game: "SpaceEngine",                  // the game it's built on (you need to own it)
    label: "Open-source game",            // optional: replaces the "<game> mod" tag
    version: "1.0.1",
    released: "2026-11-09",
    pitch: "SpaceEngine rewritten from the ground up in Rust, with volumetric clouds, alien civilizations and mods built in.",
    accent: "#8b6cff",
    unofficial: "Unofficial fan project. Not affiliated with or endorsed by SpaceEngine or Cosmographic Software. You need your own copy of SpaceEngine to play.",
    cover: "games/sandbox-engine/media/cover.jpg",

    // The playable build is a GitHub Release zip; the repo itself is source code only
    download: { url: "https://github.com/liamwade21-lab/Sandbox-Engine/releases/download/v1.0.1/Sandbox-Engine-1.0.1-windows.zip", label: "Sandbox-Engine-1.0.1-windows.zip", size: "72.6 MB" },
    source: "https://github.com/liamwade21-lab/Sandbox-Engine",   // optional: "Source code" button

    requirements: [
      "Your own copy of SpaceEngine (sold on Steam). Sandbox Engine won't run without it.",
      "A Windows PC that can run SpaceEngine",
      "Nothing else: it finds SpaceEngine through Steam by itself (or asks you once where SpaceEngine.exe is)"
    ],

    features: [
      { title: "Rewritten in Rust", text: "A ground-up rewrite of SpaceEngine in the Rust programming language." },
      { title: "The whole universe", text: "Fly from a planet's surface out past moons, stars and nebulae to whole galaxies." },
      { title: "Volumetric clouds", text: "Real 3D clouds and nebulae you can fly into, through and above." },
      { title: "Alien civilizations", text: "Inhabited worlds: city lights from orbit and alien megacities down on the surface." },
      { title: "Mods built in", text: "Comes with mods added on top of the original SpaceEngine experience." },
      { title: "Open source", text: "The full source code is free to read, learn from, change and build on." }
    ],

    gallery: [
      { image: "games/sandbox-engine/media/eclipse.jpg",           caption: "Eclipse over a nebula" },
      { image: "games/sandbox-engine/media/civilized-world.jpg",   caption: "A civilized world from orbit" },
      { image: "games/sandbox-engine/media/megacity.jpg",          caption: "Alien megacity under a gas giant" },
      { image: "games/sandbox-engine/media/city-streets.jpg",      caption: "Alien city streets" },
      { image: "games/sandbox-engine/media/magenta-moon.jpg",      caption: "A moon in a magenta nebula" },
      { image: "games/sandbox-engine/media/red-sunset.jpg",        caption: "Red sunset on an alien world" },
      { image: "games/sandbox-engine/media/nebula.jpg",            caption: "Flying through a nebula" },
      { image: "games/sandbox-engine/media/cloud-tops.jpg",        caption: "Above the cloud layer" },
      { image: "games/sandbox-engine/media/city-lights.jpg",       caption: "City lights on the night side" }
    ],

    changelog: [
      { version: "1.0.1", date: "2026-11-09", notes: [
        "Fixed the black universe on other people's PCs.",
        "Everything the game needs except SpaceEngine is now built in. The first start takes a few extra seconds while it unpacks.",
        "Finds SpaceEngine through Steam by itself, in any Steam library, and only asks for SpaceEngine.exe if it can't.",
        "Tells you what's missing instead of showing a black screen."
      ]},
      { version: "1.0.0", date: "2026-11-07", notes: [ "First public release." ] }
    ]
  },

  {
    id: "axiom-wall-e",
    category: "mods",
    name: "Axiom from WALL-E",
    game: "SpaceEngine",
    version: "1.0.0",
    released: "2026-11-08",
    pitch: "The Buy n Large starliner from WALL-E at its true 4,540 m scale. Build it and fly it in SpaceEngine.",
    accent: "#9153f3",                    // the film's engine violet
    unofficial: "Unofficial fan mod. Not affiliated with or endorsed by Disney or Pixar. WALL-E, the Axiom and Buy n Large belong to Disney/Pixar.",
    cover: "mods/axiom-wall-e/media/cover.jpg",

    download: { url: "mods/axiom-wall-e/Axiom from WALL-E 1.0.0.zip", label: "Axiom from WALL-E 1.0.0.zip", size: "3.8 MB" },

    requirements: [
      "SpaceEngine (Steam, PC), tested with version 0.991.50.2155"
    ],

    features: [
      { title: "True scale", text: "4,540 m long, 1,203 m wide and about 2,350 m tall, the size the film gives it." },
      { title: "Placed from the film", text: "The AXIOM lettering, windows and hull lights are placed from film stills, not repeating patterns." },
      { title: "Lit decks", text: "Cabin decks, lounge windows and lower-hull lights glow on the dark side." },
      { title: "The bridge", text: "The bridge glass across the top front is lit from inside, with a cockpit camera on the bridge." },
      { title: "PBR hull", text: "Panel plating where every panel catches the light a little differently, with subtle reflections." },
      { title: "Violet engines", text: "Twenty glowing engine nozzles in the film's violet, with SpaceEngine's engine flares and sound." },
      { title: "Beacon lights", text: "Red and white beacons on the antenna, the keel and the stern." },
      { title: "Heavy-liner handling", text: "Flies like a 300-billion-kilo cruise liner, with warp drive for the long trips." },
      { title: "Light on your PC", text: "About 74,000 triangles and 6 MB of files." }
    ],

    controls: [
      ["Mouse wheel", "Throttle, in the ship view"],
      ["Z", "Stop the engines"]
    ],

    install: [
      "Unzip the download: right-click the zip > Extract All.",
      "Open SpaceEngine's folder (Steam: right-click SpaceEngine > Manage > Browse local files) and open the addons folder.",
      "Copy the AxiomWallE folder from the download into addons.",
      "Start SpaceEngine. In the Flight Simulator open Build, pick WALL-E > Buy n Large > Axiom, build it and take control."
    ],
    installNotes: [
      "Updating: replace the AxiomWallE folder with the new one.",
      "Uninstalling: delete the AxiomWallE folder from addons."
    ],

    gallery: [
      { image: "mods/axiom-wall-e/media/side.jpg",   caption: "Side view at full length" },
      { image: "mods/axiom-wall-e/media/rear.jpg",   caption: "The twin engine rings" },
      { image: "mods/axiom-wall-e/media/bridge.jpg", caption: "The bridge windows on the top tiers" }
    ],

    changelog: [
      { version: "1.0.0", date: "2026-11-08", notes: [ "First release." ] }
    ],

    credits: "3D base model: Florian Maurer (cuddleburrito.com, 2016). Details, textures, lights and SpaceEngine setup by Wadeball."
  },

  {
    id: "blocksworld",
    category: "games",
    name: "Blocksworld",
    game: "Blocksworld",
    label: "Plays in your browser",
    version: "1.2.0",
    released: "2026-11-10",
    pitch: "The original Blocksworld building game, rebuilt from scratch. Build, script and play your own worlds right in your browser, on a PC, phone or tablet.",
    accent: "#2f8fff",
    unofficial: "Unofficial fan rebuild. Not affiliated with or endorsed by Linden Lab or Boldai. Blocksworld and its art, sounds and music belong to their owners. The original game was free and has been shut down.",
    cover: "games/blocksworld/media/cover.jpg",

    // Runs in the browser: the button opens games/blocksworld/play/ in a new tab.
    // That folder is made by "Build Web Version.bat" in the game's project (Downloads\blocksworld-rust).
    play: { url: "games/blocksworld/play/", label: "Plays in your browser", size: "24 MB to start" },

    requirements: [
      "A current browser: Chrome, Edge, Firefox or Safari",
      "A PC, or a phone or tablet from the last few years",
      "About 24 MB to load before the menu shows. Sounds, music and pictures load as you play",
      "Your worlds are saved in that browser, on that device. Clearing the browser's site data deletes them",
      "iPhone and iPad: for full screen, use Share > Add to Home Screen and start the game from its icon"
    ],

    features: [
      { title: "The whole game", text: "Menu, build mode and play mode of the original Blocksworld (iOS 1.47), rebuilt in Rust from the original game's own data." },
      { title: "Nothing to install", text: "Press Play and it opens in a new tab. It starts with a short loading bar and fetches the rest when it's needed." },
      { title: "Build with blocks", text: "Drag blocks out of the panel, snap them together, move, turn and stretch them, paint them and give them textures." },
      { title: "Make them do things", text: "Drop action tiles on a block to script it: wheels drive, motors turn, rockets fire, and buttons and sensors trigger it all." },
      { title: "Play your world", text: "Press play to drive, fly and walk around what you built, with the original physics, on-screen buttons and D-pad." },
      { title: "Your worlds are kept", text: "Worlds, their pictures and your saved models stay in your browser and are there when you come back." },
      { title: "Phones and tablets", text: "Touch controls like the original: one finger turns the camera, two fingers zoom and slide, and the game always shows in landscape." },
      { title: "Original sounds and music", text: "The original sound effects and music tracks, shrunk for the web." },
      { title: "Ready-made starts", text: "Begin on empty land, sky or water, on the Starter Island, or in the Classic Demo with its monorail." },
      { title: "Community worlds", text: "Play the worlds players published before the servers closed: over 15,000 of them, with What's Hot, categories and search." },
      { title: "Community models", text: "Browse over 6,000 models players shared and add them to your own collection for free." },
      { title: "Full screen on phones", text: "Add the game to your phone's Home Screen and it opens like an app, without the browser's bars." }
    ],

    controls: [
      ["Drag from the panel", "Put a block, colour, texture or action tile into the world"],
      ["Click / tap a block", "Select it. Again: select its whole model"],
      ["Drag a selected block", "Move it. Drop it on the panel to delete it"],
      ["Hold a block", "Make a copy and drag it"],
      ["Drag empty space / one finger", "Turn the camera"],
      ["Mouse wheel / pinch", "Zoom"],
      ["Ctrl + drag / two fingers", "Slide the camera"],
      ["W A S D, E, Q", "Fly the camera (keyboard)"],
      ["R, T", "Rotate and tilt the selected block (keyboard)"],
      ["Ctrl + Z / Ctrl + Y", "Undo / redo (also the round arrows bottom left)"],
      ["Triangle button / P", "Play the world"],
      ["W A S D or arrows, Space, Shift", "In play: the D-pad and the R and L buttons"],
      ["F1", "Show every key (build mode)"]
    ],

    gallery: [
      { image: "games/blocksworld/media/monorail.jpg",        caption: "Riding the monorail in the Classic Demo" },
      { image: "games/blocksworld/media/build-demo.jpg",      caption: "Build mode with the block panel" },
      { image: "games/blocksworld/media/starter-island.jpg",  caption: "The Starter Island" },
      { image: "games/blocksworld/media/place-block.jpg",     caption: "A new block with its move, turn and stretch handles and its script row" },
      { image: "games/blocksworld/media/new-world.jpg",       caption: "Pick how a new world starts" },
      { image: "games/blocksworld/media/phone.jpg",           caption: "Touch controls: the on-screen D-pad and buttons for phones and tablets" }
    ],

    changelog: [
      { version: "1.2.0", date: "2026-11-10", notes: [
        "Big community worlds run many times faster.",
        "Hats, hair, glasses, beards and backpacks now stay on animated characters while they move.",
        "The close button on world pages is bigger and easier to tap on phones."
      ] },
      { version: "1.1.0", date: "2026-11-10", notes: [
        "Community worlds and models: the Play and Shop pages now work in the browser.",
        "Phones: the picture keeps clear of the camera island and rounded corners, and the game can be added to the Home Screen to run full screen.",
        "The Reset Camera button sits at the bottom of the screen, where the original had it."
      ] },
      { version: "1.0.0", date: "2026-11-10", notes: [ "First browser version." ] }
    ],

    credits: "Blocksworld was made by Boldai and Linden Lab. This rebuild is a fan project by Wadeball, written in Rust with the Bevy engine and the Rapier physics engine. The community worlds and models were made by Blocksworld's players and come from the fan-server archive."
  },

  {
    id: "final-earth-2",
    category: "games",
    name: "The Final Earth 2",
    titleTail: 2,                         // big title: "The Final" / "Earth 2"
    nameTag: "Expanded",                  // the small tag beside the name (the game's title screen has it too)
    nameTagNote: "Comes with the Expansion: optional extra features on top of the original game",
    game: "The Final Earth 2",
    label: "Plays in your browser",
    version: "1.0.2",
    released: "2026-11-11",
    pitch: "The vertical city builder, rebuilt from scratch. Grow a colony on a tiny floating island, stack it sky-high and spread to other worlds, right in your browser on a PC, phone or tablet.",
    accent: "#7a5cff",
    unofficial: "Unofficial fan rebuild. Not affiliated with or endorsed by Florian van Strien. The Final Earth 2 is a game by Florian van Strien with music by Stijn Cappetijn; its art, sounds and music belong to their owners. The original game is sold on Steam.",
    cover: "games/final-earth-2/media/cover.jpg",

    // Runs in the browser: the button opens games/final-earth-2/play/ in a new tab.
    // That folder is made by "Build Web Version.bat" in the game's project (Documents\Work\TheFinalEarth2Rust).
    play: { url: "games/final-earth-2/play/", label: "Plays in your browser", size: "11 MB to start" },

    requirements: [
      "A current browser: Chrome, Edge, Firefox or Safari",
      "A PC, or a phone or tablet from the last few years",
      "About 11 MB to load before the title screen shows. The music loads while you play",
      "Your cities are saved in that browser, on that device. Clearing the browser's site data deletes them; Export in the Game Menu saves a city as a file you can keep",
      "iPhone and iPad: for full screen, use Share > Add to Home Screen and start the game from its icon"
    ],

    features: [
      { title: "The whole game", text: "The scenarios and Free Play maps of The Final Earth 2 with its buildings, upgrades, policies, rockets, trains and festivals, rebuilt in Rust from the original game's own data." },
      { title: "Expanded", text: "Comes with the Expansion, an optional layer of 24 extra features on top of the original game: research, trade, districts, disasters, challenges and more. It is off until you switch it on in Advanced Settings, and its big windows want a PC or tablet screen." },
      { title: "Nothing to install", text: "Press Play and it opens in a new tab. A short loading bar, then the title screen; the music comes in while you play." },
      { title: "Build upward", text: "Stack houses, farms, labs and factories on a small floating island, then reach other worlds with landing pads, teleporters and bridges." },
      { title: "A living city", text: "Every citizen has a home, a job, school years, favourite places and a mood. Follow one around or read the whole city's numbers." },
      { title: "Your cities are kept", text: "Save slots like the original, with an autosave every two seconds. Cities stay in your browser and are there when you come back." },
      { title: "Take a city with you", text: "Export saves a city as a file and Import loads it again, also between the browser and the Windows version of this rebuild." },
      { title: "Phones and tablets", text: "One finger moves the view, two fingers pinch to zoom, a tap builds. Phones get the game's own phone layout with a Build button and bigger close buttons." },
      { title: "Original sounds, music and languages", text: "The original sound effects and the four music tracks, shrunk for the web, and all seven languages, picked from your browser's language and changeable in the settings." }
    ],

    controls: [
      ["Click / tap a building button", "Pick it, then click / tap a spot to build. It stays picked for the next one"],
      ["Drag / one finger", "Move the view"],
      ["Mouse wheel / pinch", "Zoom"],
      ["Click / tap a building", "Open its window"],
      ["Right-click (PC)", "Stop building. On a phone or tablet: tap the picked building again"],
      ["Hold a finger on a button", "Show what it does (phones and tablets)"],
      ["Space or P", "Pause"],
      ["S", "Change the game speed"],
      ["M or Esc", "Game Menu: save, load, settings"]
    ],

    gallery: [
      { image: "games/final-earth-2/media/city-day.jpg",   caption: "A city stacked high on its floating island" },
      { image: "games/final-earth-2/media/city-dusk.jpg",  caption: "The same city at dusk, with flying saucers on the roofs" },
      { image: "games/final-earth-2/media/scenarios.jpg",  caption: "Pick a scenario or a Free Play map" },
      { image: "games/final-earth-2/media/upgrades.jpg",   caption: "Upgrades and policies" },
      { image: "games/final-earth-2/media/happiness.jpg",  caption: "What makes the citizens happy" },
      { image: "games/final-earth-2/media/phone.jpg",      caption: "On a phone: the Build bar, the outlined building spot and the building's cost" }
    ],

    changelog: [
      { version: "1.0.2", date: "2026-11-11", notes: [ "Phones: the Expansion's warning icons no longer sit on top of the materials list. They now stay in the top-right corner, clear of the game's own panels, at every screen size." ] },
      { version: "1.0.1", date: "2026-11-11", notes: [ "The title screen now carries a small \"Expanded\" tag: this rebuild comes with the optional Expansion." ] },
      { version: "1.0.0", date: "2026-11-11", notes: [ "First browser version." ] }
    ],

    credits: "The Final Earth 2 was made by Florian van Strien, with music by Stijn Cappetijn. This rebuild is a fan project by Wadeball, written in Rust with the Bevy engine."
  }

  /* Template for the next entry (copy everything between the braces, add a comma after the entry above):
  ,{
    id: "my-next-mod",
    category: "mods",                // "mods" or "games" (see CATEGORIES above)
    name: "",
    game: "",
    label: "",                       // optional tag text, e.g. "Open-source game"
    version: "1.0.0",
    released: "YYYY-MM-DD",
    pitch: "",
    accent: "#4f8cff",               // optional
    unofficial: "",                  // optional disclaimer
    cover: "mods/my-next-mod/media/cover.jpg",
    heroVideo: "",                   // optional
    trailer: null,                   // optional { video, poster }
    download: { url: "mods/my-next-mod/file.zip", label: "file.zip", size: "" },
    source: "",                      // optional: link to the source code
    requirements: [],
    features: [ { title: "", text: "" } ],
    controls: [],                    // optional [ ["Key", "What it does"] ]
    install: [],
    installNotes: [],                // optional
    gallery: [ { image: "mods/my-next-mod/media/1.jpg", caption: "" } ],   // optional; or { video, poster, caption }
    changelog: [ { version: "1.0.0", date: "YYYY-MM-DD", notes: [""] } ],
    credits: ""                      // optional
  }
  */
];
