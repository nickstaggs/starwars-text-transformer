const characterMap = new Map<string, string>([
  ["Luke Skywalker", "LUKE"],
  ["Princess Leia", "LEIA"],
  ["Han Solo", "HAN"],
  ["Obi-wan Kenobi", "BEN"],
  ["Yoda", "YODA"],
  ["Darth Vader", "VADER"],
  ["Emperor Palpatine", "EMPEROR"],
  ["C-3PO", "THREEPIO"],
  ["Lando Calrissian", "LANDO"],
]);

/**
 * Maps a character name from the dropdown to its corresponding name in the dialogue text files.
 * @param dropdownName The character name from the dropdown.
 * @returns The character name as found in the dialogue text files, or undefined if no mapping exists.
 */
export function mapDropdownNameToDialogueName(dropdownName: string): string | undefined {
  return characterMap.get(dropdownName);
}
