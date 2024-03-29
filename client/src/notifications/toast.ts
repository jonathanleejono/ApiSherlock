import { AsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Id, toast, TypeOptions } from "react-toastify";

const showToast = (prevToast: Id, toastType: TypeOptions, msg: string) => {
  toast.update(prevToast, {
    render: `${msg}`,
    type: `${toastType}`,
    isLoading: false,
    autoClose: 2000,
    closeOnClick: true,
  });
};

const handleToast = (
  resultAction:
    | PayloadAction<
        any,
        any,
        {
          arg: any;
          requestId: any;
          requestStatus: any;
        },
        never
      >
    | PayloadAction<any>,
  asyncThunk: AsyncThunk<
    any,
    any,
    { rejectValue: any; dispatch: any; state: any }
  >,
  defaultSuccessMsg: string,
  defaultErrorMsg: string
) => {
  toast.loading("Please wait...");
  if (asyncThunk.fulfilled.match(resultAction)) {
    toast.dismiss();

    const { msg, message } = resultAction.payload;

    if (msg || message) {
      toast.success(`${msg || message}`);
    }

    if (!(msg || message) && defaultSuccessMsg) {
      toast.success(`${defaultSuccessMsg}`);
    }

    return { data: "success", payload: resultAction.payload };
  }

  toast.dismiss();

  const { error, msg, detail } = resultAction.payload;

  if (error || msg || detail) {
    toast.error(`${error || msg || detail}`);
  }

  if (!(error || msg || detail) && defaultErrorMsg) {
    toast.error(`${defaultErrorMsg}`);
  }

  return { data: "error" };
};

const handleToastErrors = (
  resultAction:
    | PayloadAction<
        any,
        any,
        {
          arg: any;
          requestId: any;
          requestStatus: any;
        },
        never
      >
    | PayloadAction<any>,
  asyncThunk: AsyncThunk<
    any,
    any,
    { rejectValue: any; dispatch: any; state: any }
  >,
  defaultErrorMsg: string
) => {
  if (!asyncThunk.fulfilled.match(resultAction)) {
    const { error, msg, detail } = resultAction.payload;

    if (error || msg || detail) {
      toast.error(`${error || msg || detail}`);
    }

    if (defaultErrorMsg) {
      toast.error(`${defaultErrorMsg}`);
    }

    return { data: "error" };
  }

  return { data: "success", payload: resultAction.payload };
};

export { showToast, handleToast, handleToastErrors };
