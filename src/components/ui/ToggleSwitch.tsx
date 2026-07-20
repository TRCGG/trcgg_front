interface Props {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const ToggleSwitch = ({ checked, onChange, disabled = false, ariaLabel }: Props) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      className={`relative w-[42px] h-6 rounded-full shrink-0 transition-colors ${
        checked ? "bg-bluePrimary" : "bg-rankBg1 border border-border1"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-[2px] w-[18px] h-[18px] rounded-full transition-all ${
          checked ? "right-[2px] bg-white" : "left-[2px] bg-primary2"
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
