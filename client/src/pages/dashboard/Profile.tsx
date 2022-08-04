import Wrapper from "assets/wrappers/DashboardFormPage";
import { FormRow } from "components";
import {
  pleaseFillOutAllValues,
  updateUserErrorMsg,
  updateUserSuccessMsg,
} from "constants/messages";
import { clearStore, updateUser } from "features/user/userThunk";
import { handleToast } from "notifications/toast";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "state/hooks";
import {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
} from "utils/localStorage";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((store) => store.user);

  if (!user) {
    dispatch(clearStore());
    toast.error("Unauthenticated");
  }

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();

    if (!name || !email) {
      toast.error(pleaseFillOutAllValues);
      return;
    }

    const resultAction = await dispatch(updateUser({ name, email }));

    const resp = handleToast(
      resultAction,
      updateUser,
      updateUserSuccessMsg,
      updateUserErrorMsg
    );

    if (resp.data === "success") {
      const { user, token } = resp.payload;
      addUserToLocalStorage({ user, token });
    } else if (resp.data === "error") {
      removeUserFromLocalStorage();
      dispatch(clearStore());
    }
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
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <FormRow
            labelText="Email"
            type="email"
            name="email"
            value={email}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
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
