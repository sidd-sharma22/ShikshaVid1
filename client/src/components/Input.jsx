const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  name,
  error,
  className = '',
  ...props
}) => {
  const inputId = name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="ds-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className={`ds-input ${error ? 'ds-input-error' : ''} ${className}`.trim()}
        {...props}
      />
      {error ? <p className="ds-input-error-text">{error}</p> : null}
    </div>
  );
};

export default Input;
