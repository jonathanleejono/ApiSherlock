import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleChange: PropTypes.func.isRequired,
  list: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.number.isRequired),
  ]).isRequired,
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
      id={name} //need this id prop for testing
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
