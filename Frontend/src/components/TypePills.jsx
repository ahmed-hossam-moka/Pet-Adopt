import styles from "./TypePills.module.css";

/*
  TYPE PILLS — Animal Filter Buttons
  ------------------------------------
  These are the clickable pill buttons (All / Dog / Cat / Bird / Rabbit...)
  that filter the pet grid by animal type.

  PROPS:
  - onSelect(type) → called by parent to update the active type
  - active         → the currently selected type (string)

  HOW DOES CONTROLLED FILTERING WORK?
  -------------------------------------
  The TypePills component is "controlled" — it doesn't own the
  filter state. The PARENT (HomePage) owns it via useState.

  TypePills just receives the current value (active) and
  a callback (onSelect) to update it. This is called
  "lifting state up" — the state lives at the level that needs it.
*/

const TYPES = [
  { label: "All",     value: "all",    emoji: "🐾" },
  { label: "Dogs",    value: "dog",    emoji: "🐶" },
  { label: "Cats",    value: "cat",    emoji: "🐱" },
  { label: "Birds",   value: "bird",   emoji: "🐦" },
  { label: "Rabbits", value: "rabbit", emoji: "🐰" },
  { label: "Other",   value: "other",  emoji: "✨" },
];

function TypePills({ onSelect, active }) {
  return (
    <div className={styles.pills} role="group" aria-label="Filter by animal type">
      {TYPES.map((type) => (
        <button
          key={type.value}
          className={`${styles.pill} ${active === type.value ? styles.active : ""}`}
          onClick={() => onSelect(type.value)}
          aria-pressed={active === type.value}
        >
          <span className={styles.pill__emoji}>{type.emoji}</span>
          {type.label}
        </button>
      ))}
    </div>
  );
}

export default TypePills;