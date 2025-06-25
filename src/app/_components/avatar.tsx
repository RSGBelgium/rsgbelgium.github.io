/**
 * User avatar display component.
 *
 * Renders a circular avatar image or a fallback with the user's initial.
 */

type Props = {
  name?: string;
  picture?: string;
};

/**
 * Renders a user avatar with optional image and name.
 *
 * @param name - The user's name (used for alt text and fallback initial)
 * @param picture - The URL of the user's avatar image
 */
const Avatar = ({ name = 'Anonymous', picture }: Props) => {
  return (
    <div className="flex items-center">
      {picture ? (
        <img src={picture} className="w-12 h-12 rounded-full mr-4" alt={name} />
      ) : (
        <div className="w-12 h-12 rounded-full mr-4 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-lg">{name.charAt(0)}</span>
        </div>
      )}
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
};

export default Avatar;
