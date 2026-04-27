export default function AppLogoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="20" cy="20" r="20" fill="currentColor" />
            <text
                x="50%"
                y="50%"
                dominantBaseline="central"
                textAnchor="middle"
                fill="white"
                fontSize="20"
                fontWeight="bold"
                fontFamily="sans-serif"
            >
                LS
            </text>
        </svg>
    );
}
