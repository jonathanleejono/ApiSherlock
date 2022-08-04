import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]).isRequired,
  handleChange: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
};

interface FormRowProps {
  type: string;
  name: string;
  value: string | number | readonly string[] | undefined;
  handleChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  labelText: string;
}

export type InferFormRowProps = InferProps<typeof propTypes>;

const FormRow: React.FC<FormRowProps> = ({
  type,
  name,
  value,
  handleChange,
  labelText,
}) => (
  <div className="form-row">
    <label htmlFor={name} className="form-label">
      {/* leave this as a single value */}
      {labelText}
    </label>
    <input
      id={name} //this id is necessary for testing
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
