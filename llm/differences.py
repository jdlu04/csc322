import re
from difflib import SequenceMatcher, Differ
import json

def tokenize(text):
    # Keeps contractions (e.g., doesn't), words, and punctuation
    return re.findall(r"\b\w+(?:'\w+)?\b|[^\w\s]", text, re.UNICODE)

def compare_words(o_word, c_word):
    differ = Differ()
    diff = list(differ.compare(list(o_word), list(c_word)))
    return any(line[0] in ('-', '+') for line in diff), diff

def get_word_diffs(original, corrected):
    original_words = tokenize(original)
    corrected_words = tokenize(corrected)

    matcher = SequenceMatcher(None, original_words, corrected_words)
    changes = []

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == 'equal':
            continue

        # Handle replacements
        if tag == 'replace':
            for o_index, c_index in zip(range(i1, i2), range(j1, j2)):
                o_word = original_words[o_index] if o_index < len(original_words) else ""
                c_word = corrected_words[c_index] if c_index < len(corrected_words) else ""
                has_change, char_diff = compare_words(o_word, c_word)
                if has_change:
                    changes.append({
                        "word_index": o_index,
                        "original": o_word,
                        "corrected": c_word,
                        "char_diff": char_diff
                    })

        # Handle insertions
        if tag == 'insert':
            for c_index in range(j1, j2):
                changes.append({
                    "word_index": i1,  # position of insertion
                    "original": "",
                    "corrected": corrected_words[c_index],
                    "char_diff": []
                })

        # Handle deletions
        if tag == 'delete':
            for o_index in range(i1, i2):
                changes.append({
                    "word_index": o_index,
                    "original": original_words[o_index],
                    "corrected": "",
                    "char_diff": []
                })

    return changes

# Optional test runner
if __name__ == "__main__":
    print("Enter original text:")
    original = input("> ").strip()
    print("Enter corrected text:")
    corrected = input("> ").strip()

    diffs = get_word_diffs(original, corrected)
    print("\nDifferences found:")
    print(json.dumps(diffs, indent=2))
