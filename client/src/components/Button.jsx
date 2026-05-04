const variantClasses = {
  primary: 'ds-btn-primary',
  secondary: 'ds-btn-secondary',
  outline: 'ds-btn-outline',
};

const sizeClasses = {
  small: 'px-3 py-2 text-xs',
  medium: '',
  large: 'px-6 py-3.5 text-base',
};

const mergeClasses = (...classes) => classes.filter(Boolean).join(' ');

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}) => {
  const resolvedVariant = variantClasses[variant] || variantClasses.primary;
  const resolvedSize = sizeClasses[size] ?? sizeClasses.medium;
  const classes = mergeClasses(
    'ds-btn',
    resolvedVariant,
    resolvedSize,
    disabled && 'opacity-60 cursor-not-allowed',
    className
  );

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
