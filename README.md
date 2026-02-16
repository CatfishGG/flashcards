# FlashMaster 11

A responsive, single-page React web app for studying 11th-grade English flashcards via CSV upload.

## Features

- **CSV Upload**: Drag and drop support.
- **Study Mode**: One card at a time with 3D flip animation.
- **Controls**: Swipe gestures, keyboard navigation (Arrows, Space/Enter), and Shuffle.
- **Progress**: Mark cards as "Learned" and filter them out.
- **Persistence**: Remembers learned cards via LocalStorage.
- **Theme**: Modern Dark Mode with Tailwind CSS.

## CSV Format

The application expects a standard CSV file with headers. It is case-insensitive and flexible with column names.

**Recommended Format:**
```csv
question,answer
"Ephemeral","Lasting for a very short time."
"Superfluous","Unnecessary, especially through being more than enough."
```

**Alternative Headers Accepted:**
- Question column: `question`, `front`, `term`
- Answer column: `answer`, `back`, `definition`
