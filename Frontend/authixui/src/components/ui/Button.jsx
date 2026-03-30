function Button({ children, className = '', variant = 'primary', ...props }) {
  const merged = `button ${variant === 'secondary' ? 'secondary' : ''} ${className}`.trim();
  return (
    <button type="button" className={merged} {...props}>
      {children}
    </button>
  );
}

export default Button;
