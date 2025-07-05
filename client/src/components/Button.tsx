import { cva } from "class-variance-authority";
import clsx from "clsx";

const button = cva(
  "px-4 py-2 rounded-default transition-colors text-sm cursor-pointer",
  {
    variants: {
      intent: {
        primary: "bg-primary hover:bg-tertiary cursor-pointer text-white",
        secondary:
          "hover:bg-gray-200 hover:text-black text-primary bg-white border border-primary",
        tertiary:
          "bg-transparent hover:bg-gray-300 text-text-secondary border border-text-secondary",
      },
      disabled: {
        true: "bg-gray-400 cursor-not-allowed hover:bg-gray-400",
        false: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      disabled: false,
    },
  }
);

interface ButtonProps {
  label: string;
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
  intent?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  className?: string;
}

const Button = ({
  label,
  onClick,
  intent,
  disabled = false,
  className,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(button({ intent, disabled }), className)}
    >
      {label}
    </button>
  );
};

export default Button;
