/*
  Wadeball's Mod Collection: the one data file.

  To add a mod, copy the template at the bottom of this file into the MODS list,
  fill it in, and put its files in mods/<id>/. Nothing else needs changing:
  the home grid and the mod's own page (mod.html?id=<id>) are built from this.
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

window.MODS = [
  {
    id: "viltrumite-powers",              // folder name in mods/ and the page address
    name: "Viltrumite Powers",
    game: "WorldBox",
    version: "1.2.0",
    released: "2026-10-24",
    pitch: "Possess anyone in WorldFall and fly, punch and boom through the world like a Viltrumite.",
    accent: "#e0262b",                    // optional: colour for this mod's page and card
    unofficial: "Unofficial fan mod. Not affiliated with or endorsed by the creators of Invincible, Skybound, Image Comics, or Amazon / Prime Video. All characters belong to their owners.",
    cover: "mods/viltrumite-powers/media/human.jpg",
    heroVideo: "mods/viltrumite-powers/media/human.mp4",
    trailer: { video: "mods/viltrumite-powers/media/trailer.mp4", poster: "mods/viltrumite-powers/media/trailer.jpg" },

    download: { url: "mods/viltrumite-powers/Viltrumite Powers 1.2.0.zip", label: "Viltrumite Powers 1.2.0.zip", size: "12.8 MB" },

    requirements: [
      "WorldBox (Steam, PC)",
      "The WorldFall mod, version 0.9.8.9, already installed and working",
      "Single-player only"
    ],

    features: [
      { title: "Flight, three gears", text: "Hover, fast flight, and supersonic flight that breaks the sound barrier with a sonic boom." },
      { title: "Boost stacks", text: "Stack up to 5 boosts in supersonic flight: 46 to 349 tiles a second, each with its own boom." },
      { title: "Smash through towns", text: "Buildings you hit go up like WorldBox bombs, fire and craters included. At 5 stacks: a 20-tile blast under a mushroom cloud." },
      { title: "Meteor burn", text: "From stack 1 you glow with heat, from stack 2 you burn like a meteor entering the atmosphere." },
      { title: "Cratering dives", text: "Dive straight down from fast flight and leave a crater where you land." },
      { title: "Punches that launch", text: "Combos, plus a charged punch that blows up like a bomb where it lands. Bigger the longer you hold." },
      { title: "Grab and throw", text: "Grab anything up to cow size by the neck, throw it, or charge a throw that slams it into the ground." },
      { title: "Super run", text: "A 20-tile-a-second run that starts with a sonic boom and ploughs through people, buildings and trees." },
      { title: "The Omni-Man look", text: "With powers on you're drawn as Omni-Man: white suit, red cape, gloves, boots and belt. The cape sways and streams out as you fly." },
      { title: "Invincible", text: "Nothing can hurt you while the powers are on, and a third-person camera follows you." },
      { title: "Surface trails", text: "Skim low and supersonic to tear up dust over land and spray over water." },
      { title: "Tweakable", text: "Speeds, damage, camera and shake live in viltrumite.json, re-read every time you power up." }
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
      ["Q", "Grab the creature you're aiming at / let go"]
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
      "By hand: copy Viltrumite.dll and the Viltrumite folder from the download's mods folder into worldbox_Data\\StreamingAssets\\mods.",
      "Updating: install the new version the same way. Your viltrumite.json settings are kept.",
      "Uninstalling: delete Viltrumite.dll and the Viltrumite folder from WorldBox's mods folder."
    ],


    changelog: [
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
  }

  /* Template for the next mod (copy everything between the braces, add a comma after the mod above):
  ,{
    id: "my-next-mod",
    name: "",
    game: "",
    version: "1.0.0",
    released: "YYYY-MM-DD",
    pitch: "",
    accent: "#4f8cff",               // optional
    unofficial: "",                  // optional disclaimer
    cover: "mods/my-next-mod/media/cover.jpg",
    heroVideo: "",                   // optional
    trailer: null,                   // optional { video, poster }
    download: { url: "mods/my-next-mod/file.zip", label: "file.zip", size: "" },
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
