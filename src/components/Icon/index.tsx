export type IconProps = {
  src: string;
  alt?: string;
};

const Icon = ({ src, alt }: IconProps) => {
  return <img src={src} alt={alt} />;
};

export default Icon;
