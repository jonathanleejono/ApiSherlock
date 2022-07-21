import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

type FormRowSelectProps = InferProps<typeof propTypes>;

const FormRowSelect: React.FC<FormRowSelectProps> = ({
  labelText,
  name,
  value,
  handleChange,
  list,
}) => (
  <div className="form-row">
    <label htmlFor={name} className="form-label">
      {labelText || name}
    </label>
    <select
      name={name}
      value={value}
      onChange={handleChange}
      className="form-select"
    >
      {list.map((itemValue, index) => (
        <option key={index} value={itemValue}>
          {itemValue}
        </option>
      ))}
    </select>
  </div>
);

FormRowSelect.propTypes = propTypes;

export default FormRowSelect;
