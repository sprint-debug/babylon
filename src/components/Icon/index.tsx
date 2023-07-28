import { ReactSVG } from 'react-svg';
// import { BASE_IMG_URL } from '@/common/constants';

export type IconProps = {
  name: string;
  baseUrl?: string;
};

// const Icon = ({ name, baseUrl = '/icons-new' }: IconProps) => {
//   return <ReactSVG src={`${baseUrl}/${name}.svg`} />;
// };
const Icon = ({ name, baseUrl }: IconProps) => {
  return <ReactSVG src={`/${name}.svg`} />;
  // if (baseUrl) {
  //   return <ReactSVG src={`${baseUrl}/${name}.svg`} />;
  // } else {
  //   return <ReactSVG src={`${BASE_IMG_URL}/${name}.svg`} />;
  // }
};

export default Icon;

