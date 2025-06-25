/**
 * Author interface for post and member authors.
 *
 * Represents an author with a name and picture.
 */

/**
 * Represents an author (person) for posts or members.
 *
 * @property name - Author's full name
 * @property picture - Path to author's photo
 */
export type Author = {
  name: string;
  picture: string;
};
