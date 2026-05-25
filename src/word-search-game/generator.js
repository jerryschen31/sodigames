// One-shot puzzle generator. Run with: node generator.js
// Produces grids.json containing 15 puzzles per difficulty.
const fs = require('fs');

const themes = {
  easy: [
    { theme: 'Animals',  words: ['CAT','DOG','PIG','COW','OWL','BEE','FOX','DUCK'] },
    { theme: 'Colors',   words: ['RED','BLUE','PINK','GOLD','GREEN','BROWN'] },
    { theme: 'Food',     words: ['PIZZA','CAKE','BREAD','EGG','MILK','RICE','SOUP'] },
    { theme: 'Fruits',   words: ['APPLE','GRAPE','PEAR','KIWI','LIME','PLUM','LEMON'] },
    { theme: 'Toys',     words: ['DOLL','KITE','CAR','BIKE','TRAIN','ROBOT','BALL'] },
    { theme: 'Nature',   words: ['TREE','LEAF','ROCK','SAND','RAIN','SNOW','MOON'] },
    { theme: 'Bugs',     words: ['BEE','ANT','BUG','WASP','MOTH','FLEA','FLY'] },
    { theme: 'Sea',      words: ['FISH','CRAB','SEAL','SHELL','REEF','WAVE'] },
    { theme: 'Music',    words: ['SING','BAND','DRUM','NOTE','BEAT','SONG','PIANO'] },
    { theme: 'Body',     words: ['ARM','LEG','EYE','EAR','HAND','FOOT','HEAD','HAIR'] },
    { theme: 'Tools',    words: ['SAW','NAIL','BOLT','FORK','RULER'] },
    { theme: 'Weather',  words: ['SUN','RAIN','SNOW','WIND','FOG','ICE','CLOUD'] },
    { theme: 'Sports',   words: ['BALL','GAME','RUN','GOAL','KICK','JUMP','RACE'] },
    { theme: 'Sky',      words: ['SUN','MOON','STAR','CLOUD','SKY','COMET'] },
    { theme: 'Family',   words: ['MOM','DAD','AUNT','SON','BABY','KID'] },
  ],
  medium: [
    { theme: 'Animals',    words: ['TIGER','LION','BEAR','RABBIT','MONKEY','PANDA','ZEBRA','HORSE'] },
    { theme: 'Ocean',      words: ['DOLPHIN','OCTOPUS','SHARK','WHALE','CORAL','JELLY','LOBSTER'] },
    { theme: 'Space',      words: ['PLANET','COMET','GALAXY','ROCKET','NEBULA','ORBIT','METEOR','EARTH'] },
    { theme: 'Food',       words: ['NOODLES','BURRITO','BURGER','COOKIE','MUFFIN','CHEESE','PANCAKE','PASTA'] },
    { theme: 'Fruits',     words: ['BANANA','ORANGE','CHERRY','PEACH','MANGO','LEMON','MELON','APRICOT'] },
    { theme: 'Vegetables', words: ['CARROT','POTATO','ONION','TOMATO','CELERY','PEPPER','GARLIC','RADISH'] },
    { theme: 'School',     words: ['TEACHER','PENCIL','READING','SCHOOL','ERASER','RULER','CRAYON','MATH'] },
    { theme: 'Sports',     words: ['SOCCER','TENNIS','HOCKEY','RUNNING','JUMPING','SKATING','BOXING','GOLF'] },
    { theme: 'Music',      words: ['GUITAR','PIANO','DRUMS','VIOLIN','TRUMPET','MELODY','RHYTHM','FLUTE'] },
    { theme: 'Weather',    words: ['SUNNY','RAINY','CLOUDY','SNOWY','WINDY','THUNDER','STORMY','FOGGY'] },
    { theme: 'Insects',    words: ['LADYBUG','BEETLE','SPIDER','CRICKET','FIREFLY','MOTH','HORNET'] },
    { theme: 'Birds',      words: ['EAGLE','PARROT','ROBIN','FALCON','PENGUIN','HAWK','FINCH','SPARROW'] },
    { theme: 'Jobs',       words: ['DOCTOR','TEACHER','ARTIST','BAKER','WRITER','PILOT','FARMER','NURSE'] },
    { theme: 'Travel',     words: ['AIRPLANE','BICYCLE','TRAIN','SUBWAY','BOAT','ROCKET','FERRY','TRUCK'] },
    { theme: 'Garden',     words: ['FLOWER','GARDEN','TULIP','DAISY','ORCHID','LILY','PETAL','SEED'] },
  ],
  hard: [
    { theme: 'Dinosaurs',    words: ['RAPTOR','DIPLODOCUS','IGUANODON','SAUROPOD','ALLOSAUR','HADROSAUR','PTEROSAUR','EORAPTOR'] },
    { theme: 'Countries',    words: ['BRAZIL','JAPAN','FRANCE','GERMANY','AUSTRALIA','CANADA','MEXICO','ARGENTINA'] },
    { theme: 'Mythology',    words: ['PEGASUS','MEDUSA','MINOTAUR','CYCLOPS','CENTAUR','PHOENIX','KRAKEN','GRIFFIN'] },
    { theme: 'Continents',   words: ['EUROPE','AFRICA','AUSTRALIA','ANTARCTICA','AMERICA','OCEANIA','EURASIA'] },
    { theme: 'Sciences',     words: ['BIOLOGY','CHEMISTRY','PHYSICS','GEOLOGY','ASTRONOMY','ECOLOGY','ANATOMY','ZOOLOGY'] },
    { theme: 'Wild Animals', words: ['GIRAFFE','ELEPHANT','LEOPARD','CHEETAH','GORILLA','JAGUAR','BUFFALO','ANTELOPE'] },
    { theme: 'Music',        words: ['ORCHESTRA','SYMPHONY','CONCERTO','MELODY','HARMONY','RHYTHM','SONATA','COMPOSER'] },
    { theme: 'Cars',         words: ['FERRARI','MUSTANG','CORVETTE','BUGATTI','PORSCHE','TESLA','TOYOTA','CAMARO'] },
    { theme: 'Vacations',    words: ['VACATION','MOUNTAIN','CAMPING','FISHING','HIKING','SAILING','CRUISE','RESORT'] },
    { theme: 'Cooking',      words: ['KITCHEN','RECIPE','BAKING','FRYING','BOILING','ROASTING','GRILLING','BLENDER'] },
    { theme: 'Technology',   words: ['COMPUTER','INTERNET','KEYBOARD','MONITOR','LAPTOP','TABLET','PROGRAM','BROWSER'] },
    { theme: 'Construction', words: ['HAMMER','BUILDING','FOUNDATION','CONCRETE','BLUEPRINT','BULLDOZER','EXCAVATOR','CEMENT'] },
    { theme: 'Olympics',     words: ['MARATHON','SWIMMING','GYMNAST','DIVING','ARCHERY','JAVELIN','CYCLING','FENCING'] },
    { theme: 'Galaxies',     words: ['GALAXY','ASTEROID','METEOR','SATELLITE','TELESCOPE','NEBULA','COMET','COSMOS'] },
    { theme: 'Adventure',    words: ['TREASURE','JUNGLE','EXPLORER','PIRATE','COMPASS','ISLAND','VOYAGE','JOURNEY'] },
  ],
};

const sizes = { easy: 8, medium: 12, hard: 16 };
const ranges = { easy: [3, 5], medium: [4, 8], hard: [5, 10] };

function filterWords(words, [min, max]) {
  return words.filter(w => w.length >= min && w.length <= max);
}

function tryPlace(grid, word, size) {
  const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]];
  for (let t = 0; t < 400; t++) {
    const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    const endR = row + dr * (word.length - 1);
    const endC = col + dc * (word.length - 1);
    if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

    let fits = true;
    const cells = [];
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (grid[r][c] !== null && grid[r][c] !== word[i]) { fits = false; break; }
      cells.push([r, c]);
    }
    if (fits) {
      for (let i = 0; i < word.length; i++) grid[cells[i][0]][cells[i][1]] = word[i];
      return cells;
    }
  }
  return null;
}

function generatePuzzle(themeName, words, size) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    const placements = [];
    let ok = true;
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    for (const word of sortedWords) {
      const cells = tryPlace(grid, word, size);
      if (!cells) { ok = false; break; }
      placements.push({ word, cells });
    }
    if (ok) {
      const finalGrid = grid.map(row => row.map(c => c || String.fromCharCode(65 + Math.floor(Math.random() * 26))));
      return {
        theme: themeName,
        size,
        grid: finalGrid,
        words: placements.map(p => p.word).sort(),
        placements,
      };
    }
  }
  return null;
}

const out = {};
for (const diff of ['easy', 'medium', 'hard']) {
  const size = sizes[diff];
  const range = ranges[diff];
  out[diff] = [];
  for (const { theme, words } of themes[diff]) {
    const filtered = filterWords(words, range).slice(0, 8);
    const puzzle = generatePuzzle(theme, filtered, size);
    if (!puzzle) {
      console.error(`FAILED: ${diff} / ${theme}`);
      process.exit(1);
    }
    out[diff].push(puzzle);
  }
  console.log(`${diff}: ${out[diff].length} puzzles`);
}

fs.writeFileSync('grids.json', JSON.stringify(out, null, 2));
console.log('Wrote grids.json');
