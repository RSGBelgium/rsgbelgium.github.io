/**
 * Layout utility component for consistent page width and horizontal padding.
 *
 * Wraps content in a responsive container centered on the page.
 */

type Props = {
  children?: React.ReactNode;
};

/**
 * Renders a responsive, centered container for page content.
 *
 * @param children - Content to display inside the container
 */
const Container = ({ children }: Props) => {
  return <div className="container mx-auto px-5">{children}</div>;
};

export default Container;
