import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
};

type FormRowProps = InferProps<typeof propTypes>;

const FormRow: React.FC<FormRowProps> = ({
  type,
  name,
  value,
  handleChange,
  labelText,
}) => (
  <div className="form-row">
    <label htmlFor={name} className="form-label">
      {labelText || name}
    </label>
    <input
      type={type}
      value={value}
      name={name}
      onChange={handleChange}
      className="form-input"
    />
  </div>
);

FormRow.propTypes = propTypes;

export default FormRow;
