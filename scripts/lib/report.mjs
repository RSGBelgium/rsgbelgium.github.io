/**
 * Collects and prints the problems found by the check scripts in scripts/.
 *
 * Problems are printed as `file:line: error: message`, which editors and
 * terminals turn into clickable links. On GitHub Actions they are also
 * emitted as workflow commands, so they show up as annotations on the
 * pull request's changed files.
 *
 * Errors make the script fail (exit code 1); warnings are only printed.
 */

const IN_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === "true";

/**
 * Escapes a value for a GitHub Actions workflow command.
 * https://docs.github.com/actions/reference/workflow-commands-for-github-actions
 *
 * @param {string} value - Message or property value
 * @param {boolean} isProperty - Properties also escape ":" and ","
 */
function escapeCommand(value, isProperty = false) {
  let escaped = value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  if (isProperty) escaped = escaped.replace(/:/g, "%3A").replace(/,/g, "%2C");
  return escaped;
}

export class Report {
  /** @param {string} title - What is being checked, for the summary line */
  constructor(title) {
    this.title = title;
    /** @type {{ level: "error" | "warning", file: string, line?: number, message: string }[]} */
    this.problems = [];
  }

  /**
   * Records an error: the check fails.
   *
   * @param {string} file - Path relative to the repository root (or the checked folder)
   * @param {number | undefined} line - 1-based line number, when known
   * @param {string} message - What is wrong and how to fix it
   */
  error(file, line, message) {
    this.problems.push({ level: "error", file, line, message });
  }

  /** Records a warning: printed, but the check still passes. Same parameters as {@link error}. */
  warn(file, line, message) {
    this.problems.push({ level: "warning", file, line, message });
  }

  /** Number of errors recorded so far. */
  get errorCount() {
    return this.problems.filter((problem) => problem.level === "error").length;
  }

  /**
   * Prints every problem and a summary, then sets the process exit code:
   * 1 when there is at least one error, 0 otherwise.
   *
   * @param {string} checkedSummary - What was checked, e.g. "20 posts and 9 member profiles"
   */
  finish(checkedSummary) {
    const sorted = [...this.problems].sort(
      (a, b) => a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0),
    );
    for (const { level, file, line, message } of sorted) {
      const location = line ? `${file}:${line}` : file;
      const print = level === "error" ? console.error : console.warn;
      print(`${location}: ${level}: ${message}`);
      if (IN_GITHUB_ACTIONS) {
        const properties = [`file=${escapeCommand(file, true)}`, ...(line ? [`line=${line}`] : [])];
        print(`::${level} ${properties.join(",")},title=${escapeCommand(this.title, true)}::${escapeCommand(message)}`);
      }
    }

    const errors = this.errorCount;
    const warnings = this.problems.length - errors;
    const counts = `${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"}`;
    if (errors > 0) {
      console.error(`\n✖ ${this.title}: ${counts} in ${checkedSummary}.`);
      process.exitCode = 1;
    } else {
      console.log(`${sorted.length ? "\n" : ""}✔ ${this.title}: ${checkedSummary} checked, ${counts}.`);
    }
  }
}

/**
 * Converts a character offset in `text` to a 1-based line number.
 *
 * @param {string} text
 * @param {number} offset
 */
export function lineAt(text, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < text.length; i++) if (text[i] === "\n") line++;
  return line;
}
