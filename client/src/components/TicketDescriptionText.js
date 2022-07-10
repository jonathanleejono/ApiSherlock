const TicketDescriptionText = ({
  type,
  name,
  value,
  handleChange,
  labelText,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      {/* Testing out css to make textbox area resizable */}
      {/* <div className="form-expand"> */}
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
      />
      {/* </div> */}
    </div>
  );
};

export default TicketDescriptionText;
