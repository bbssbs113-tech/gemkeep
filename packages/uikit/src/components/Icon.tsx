import React, { createContext } from 'react';

export const DarkThemeContext = createContext<boolean>(true);

export interface IconProps {
    className?: string;
    size?: string | number;
    color?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
}

export const ChevronRightIcon: React.FC<IconProps> = ({
    className,
    size = 16,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M6 12L10 8L6 4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({
    className,
    size = 16,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M10 12L6 8L10 4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({
    className,
    size = 16,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M4 6L8 10L12 6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M12 5V19M5 12H19"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M12 19V5M12 5L5 12M12 5L19 12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ReceiveIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SwapIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M7 10L12 5L17 10M17 14L12 19L7 14"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const BuyIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M12 4V20M4 12H20"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.4 15A1.65 1.65 0 0 0 20 12A1.65 1.65 0 0 0 19.4 9L21 7.5L19.5 6L17.8 7.3A1.65 1.65 0 0 0 15 6.6V4.5H13V6.6A1.65 1.65 0 0 0 10.2 7.3L8.5 6L7 7.5L8.6 9A1.65 1.65 0 0 0 8 12A1.65 1.65 0 0 0 8.6 15L7 16.5L8.5 18L10.2 16.7A1.65 1.65 0 0 0 13 17.4V19.5H15V17.4A1.65 1.65 0 0 0 17.8 16.7L19.5 18L21 16.5L19.4 15Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const WalletIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M4 7V5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V7"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M12 8V12L15 15"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3.05 11A9 9 0 1 1 5 18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3 5V11H9"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const CopyIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M20 6L9 17L4 12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M18 6L6 18M6 6L18 18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const QrCodeIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <rect x="14" y="14" width="3" height="3" fill={color} />
        <rect x="18" y="14" width="3" height="3" fill={color} />
        <rect x="14" y="18" width="3" height="3" fill={color} />
        <rect x="18" y="18" width="3" height="3" fill={color} />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
        <path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const LockIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2" />
        <path
            d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
            stroke={color}
            strokeWidth="2"
        />
    </svg>
);

export const TonIcon: React.FC<IconProps> = ({ className, size = 24, style, onClick }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <circle cx="16" cy="16" r="16" fill="#0088CC" />
        <path
            d="M16 6L23 11.5L16 26L9 11.5L16 6Z"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
        />
        <path d="M16 6V26" stroke="white" strokeWidth="1.5" />
    </svg>
);

export const UsdtIcon: React.FC<IconProps> = ({ className, size = 24, style, onClick }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <circle cx="16" cy="16" r="16" fill="#26A17B" />
        <path
            d="M10 10H22V13H17.5V17.5C17.5 17.5 21 17.2 21 15.5V14.5H23V16.5C23 19 18.5 19.8 17.5 19.9V23H14.5V19.9C13.5 19.8 9 19 9 16.5V14.5H11V15.5C11 17.2 14.5 17.5 14.5 17.5V13H10V10Z"
            fill="white"
        />
    </svg>
);

export const MoreIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <circle cx="12" cy="12" r="2" fill={color} />
        <circle cx="12" cy="5" r="2" fill={color} />
        <circle cx="12" cy="19" r="2" fill={color} />
    </svg>
);

export const EditIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56263 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M3 6H5H21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M23 4V10H17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1 20V14H7"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3.51 9A9 9 0 0 1 20.49 15L23 10M1 14L3.51 9"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const InfoIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <path d="M12 16V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const TradingIcon: React.FC<IconProps> = ({
    className,
    size = 20,
    color = 'currentColor',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M3 3V21H21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19 9L14 14L10 10L7 13"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15 9H19V13"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = '#34c759',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M23 6L13.5 15.5L8.5 10.5L1 18"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17 6H23V12"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const TrendingDownIcon: React.FC<IconProps> = ({
    className,
    size = 18,
    color = '#ff3b30',
    style,
    onClick
}) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        onClick={onClick}
    >
        <path
            d="M23 18L13.5 8.5L8.5 13.5L1 6"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17 18H23V12"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
