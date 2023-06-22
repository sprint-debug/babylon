import Content from './Content';
import Footer from './Footer';
import Header from './Header';

type ScrollViewProps = {
  children: React.ReactNode | React.ReactNode[];
};

const ScrollView = ({ children }: ScrollViewProps) => {
  return <main>{children}</main>;
};

ScrollView.Header = Header;
ScrollView.Content = Content;
ScrollView.Footer = Footer;

export default ScrollView;
