import { useState } from "react";
import { toast } from "react-toastify";
import { updateUser } from "src/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { FormRow } from "../../components";

const Profile = () => {
  const { user, isLoading } = useAppSelector((store) => store.user);

  const dispatch = useAppDispatch();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please provide all values");
      return;
    }
    dispatch(updateUser({ name, email }));
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        <div className="form-center">
          <FormRow
            labelText="Name"
            type="text"
            name="name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <FormRow
            labelText="Email"
            type="email"
            name="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please Wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
