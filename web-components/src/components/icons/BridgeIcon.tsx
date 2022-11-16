import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

interface IconProps extends SvgIconProps {}

export default function BridgeIcon({
  sx = [],
  ...props
}: IconProps): JSX.Element {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 24"
      sx={[{ fill: 'none' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 13V4.25C5 4.11193 4.88807 4 4.75 4H3.25C3.11193 4 3 4.11193 3 4.25V13H1.25C1.11193 13 1 13.1119 1 13.25V14.75C1 14.8881 1.11193 15 1.25 15H3V18H2.25C2.11193 18 2 18.1119 2 18.25V19.75C2 19.8881 2.11193 20 2.25 20H3.25H4.75H5.75C5.88807 20 6 19.8881 6 19.75V18.25C6 18.1119 5.88807 18 5.75 18H5V15H21V18H20.25C20.1119 18 20 18.1119 20 18.25V19.75C20 19.8881 20.1119 20 20.25 20H21.25H22.75H23.75C23.8881 20 24 19.8881 24 19.75V18.25C24 18.1119 23.8881 18 23.75 18H23V15H24.75C24.8881 15 25 14.8881 25 14.75V13.25C25 13.1119 24.8881 13 24.75 13H23V4.25C23 4.11193 22.8881 4 22.75 4H21.25C21.1119 4 21 4.11193 21 4.25V13H17.9999V8.25C17.9999 8.11193 17.8879 8 17.7499 8H17.2499C17.1118 8 16.9999 8.11193 16.9999 8.25V13H13.4999V9.25C13.4999 9.11193 13.3879 9 13.2499 9H12.7499C12.6118 9 12.4999 9.11193 12.4999 9.25V13H8.99988V8.25C8.99988 8.11193 8.88795 8 8.74988 8H8.24988C8.11181 8 7.99988 8.11193 7.99988 8.25V13H5Z"
        fill="#7BC796"
      />
      <path
        d="M4 4.5C4 4.5 6 9 13 9C20 9 22 4.5 22 4.5"
        stroke="#7BC796"
        strokeWidth="2"
      />
      <path
        d="M22 4.5C22 4.5 22.7421 6.48473 25 8"
        stroke="#7BC796"
        strokeWidth="2"
      />
      <path
        d="M4 4.5C4 4.5 4.01054 6.48473 1 8"
        stroke="#7BC796"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}
