const FormNoInput = ({ type, name, value, handleChange, labelText, text }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <span
        type={type}
        value={value}
        name={name}
        text={text}
        onChange={handleChange}
        className="form-no-input"
      />
    </div>
  );
};

export default FormNoInput;
