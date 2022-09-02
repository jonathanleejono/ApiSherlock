import Wrapper from "assets/wrappers/DashboardFormPage";
import { FormRowSelect } from "components";
import {
  createMonitorErrorMsg,
  createMonitorSuccessMsg,
  deleteMonitorErrorMsg,
  deleteMonitorSuccessMsg,
  editMonitorErrorMsg,
  editMonitorSuccessMsg,
  getMonitorErrorMsg,
  pleaseFillOutAllValues,
  removeQueueErrorMsg,
  removeQueueSuccessMsg,
  startQueueErrorMsg,
  startQueueSuccessMsg,
} from "constants/messages";
import {
  validMonitorDateAMorPMOptions,
  validMonitorDateDayOfWeekOptions,
  validMonitorDateHourOptions,
  validMonitorDateMinuteOptions,
  validMonitorIntervalScheduleOptions,
  validMonitorScheduleTypeOptions,
  validMonitorSettingOptions,
} from "constants/options/monitor";
import {
  MonitorDateDayOfWeekOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import {
  clearMonitorForm,
  handleMonitorInput,
  resetMonitorState,
} from "features/monitor/monitorSlice";
import {
  createMonitor,
  deleteMonitor,
  editMonitor,
  getMonitor,
  removeQueue,
  startQueue,
} from "features/monitor/monitorThunk";
import { handleToast, handleToastErrors } from "notifications/toast";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "state/hooks";

const Monitoring = () => {
  const dispatch = useAppDispatch();

  const handleFetchMonitor = async () => {
    const resultAction = await dispatch(getMonitor());

    handleToastErrors(resultAction, getMonitor, getMonitorErrorMsg);
  };

  useEffect(() => {
    handleFetchMonitor();
  }, []);

  const {
    isLoading,
    monitorSetting,
    scheduleType,
    intervalSchedule,
    dateDayOfWeek,
    dateHour,
    dateMinute,
    dateAMOrPM,
  } = useAppSelector((store) => store.monitor);

  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();

    if (!monitorSetting) {
      toast.error("Please select monitor setting");
      return;
    }

    if (!scheduleType) {
      toast.error("Please select schedule type");
      return;
    }

    if (
      scheduleType === MonitorScheduleTypeOptions.INTERVAL &&
      !intervalSchedule
    ) {
      toast.error(pleaseFillOutAllValues);
      return;
    }

    if (scheduleType === MonitorScheduleTypeOptions.DATE) {
      if (
        !dateDayOfWeek ||
        !dateHour ||
        !dateAMOrPM ||
        //zero is a falsy value, so if the default dateMinute
        //is used, which is 0, an error would be returned
        (dateMinute !== 0 && !dateMinute)
      ) {
        toast.error(pleaseFillOutAllValues);
        return;
      }
    }

    if (monitorSetting === MonitorSettingOptions.ON) {
      // check if monitor is in database
      const getMonitorResultAction = await dispatch(getMonitor());

      const resp = handleToastErrors(
        getMonitorResultAction,
        getMonitor,
        getMonitorErrorMsg
      );

      if (resp.data === "success") {
        const monitor = {
          monitorSetting,
          scheduleType,
          intervalSchedule,
          dateDayOfWeek: parseInt(MonitorDateDayOfWeekOptions[dateDayOfWeek]),
          // parseInt(dateHour) - 1 because the frontend hours are from 1 to 12,
          // but the backend uses 0 to 11 for cron
          // the greater than 0 condition is to not go under and have -1
          dateHour:
            parseInt(dateHour) > 0
              ? parseInt(dateHour) - 1
              : parseInt(dateHour),
          dateMinute: parseInt(dateMinute),
          dateAMOrPM,
        };

        // if monitor is already in database and turned on, make edits/patch
        if (resp.payload.monitorSetting === MonitorSettingOptions.ON) {
          const editMonitorResultAction = await dispatch(editMonitor(monitor));

          const resp = handleToast(
            editMonitorResultAction,
            editMonitor,
            editMonitorSuccessMsg,
            editMonitorErrorMsg
          );

          if (resp.data === "success") {
            await dispatch(getMonitor()); // get the updated monitor

            const startQueueResultAction = await dispatch(startQueue());

            handleToast(
              startQueueResultAction,
              startQueue,
              startQueueSuccessMsg,
              startQueueErrorMsg
            );
          }
        } else {
          // else, add the new monitor
          const resultAction = await dispatch(createMonitor(monitor));

          handleToast(
            resultAction,
            createMonitor,
            createMonitorSuccessMsg,
            createMonitorErrorMsg
          );

          if (resp.data === "success") {
            await dispatch(getMonitor()); // get the updated monitor

            const startQueueResultAction = await dispatch(startQueue());

            handleToast(
              startQueueResultAction,
              startQueue,
              startQueueSuccessMsg,
              startQueueErrorMsg
            );
          }
        }
      }
    }
  };

  const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (monitorSetting === MonitorSettingOptions.ON) {
      if (
        name === Object.keys({ monitorSetting })[0] &&
        value === MonitorSettingOptions.OFF
      ) {
        //monitor must be turned off before deleted
        const editMonitorResultAction = await dispatch(
          editMonitor({ monitorSetting: MonitorSettingOptions.OFF })
        );

        handleToastErrors(
          editMonitorResultAction,
          editMonitor,
          editMonitorErrorMsg
        );

        const deleteMonitorResultAction = await dispatch(deleteMonitor());

        const resp = handleToast(
          deleteMonitorResultAction,
          deleteMonitor,
          deleteMonitorSuccessMsg,
          deleteMonitorErrorMsg
        );

        if (resp.data === "success") {
          dispatch(resetMonitorState());

          const removeQueueResultAction = await dispatch(removeQueue());

          handleToast(
            removeQueueResultAction,
            removeQueue,
            removeQueueSuccessMsg,
            removeQueueErrorMsg
          );
        }
      }
    }
    dispatch(handleMonitorInput({ name, value }));
  };

  let body = null;

  if (monitorSetting === MonitorSettingOptions.ON) {
    body = (
      <>
        {/* Schedule Type - Interval or Date */}
        <FormRowSelect
          labelText="Schedule Type"
          name="scheduleType"
          value={scheduleType}
          handleChange={handleInput}
          list={validMonitorScheduleTypeOptions}
        />

        {/* useInterval -> Interval Setting */}
        {scheduleType === MonitorScheduleTypeOptions.INTERVAL ? (
          <FormRowSelect
            labelText="Interval Setting"
            name="intervalSchedule"
            value={intervalSchedule}
            handleChange={handleInput}
            list={validMonitorIntervalScheduleOptions}
          />
        ) : null}

        {scheduleType === MonitorScheduleTypeOptions.DATE ? (
          <>
            {/* useDate -> Day of Week */}
            <FormRowSelect
              labelText="Day of Week"
              name="dateDayOfWeek"
              value={dateDayOfWeek}
              handleChange={handleInput}
              list={validMonitorDateDayOfWeekOptions}
            />
            {/* useDate -> Hour */}
            <FormRowSelect
              labelText="Hour"
              name="dateHour"
              value={dateHour}
              handleChange={handleInput}
              list={validMonitorDateHourOptions}
            />
            {/* useDate -> Minute */}
            <FormRowSelect
              labelText="Minute"
              name="dateMinute"
              value={dateMinute}
              handleChange={handleInput}
              list={validMonitorDateMinuteOptions}
            />
            {/* useDate -> AM or PM */}
            <FormRowSelect
              labelText="AM or PM"
              name="dateAMOrPM"
              value={dateAMOrPM}
              handleChange={handleInput}
              list={validMonitorDateAMorPMOptions}
            />
          </>
        ) : null}
      </>
    );
  }

  let monitoringTime;

  const zero = dateMinute < 10 ? 0 : null;

  //this has to be here for the frontend day to update
  const index = validMonitorDateDayOfWeekOptions.indexOf(dateDayOfWeek);

  const day = MonitorDateDayOfWeekOptions[index]
    ? MonitorDateDayOfWeekOptions[index]
    : MonitorDateDayOfWeekOptions[dateDayOfWeek];

  if (
    monitorSetting === MonitorSettingOptions.ON &&
    scheduleType === MonitorScheduleTypeOptions.DATE
  ) {
    monitoringTime = (
      <h5>
        Monitoring Time: {day} {dateHour}:{zero}
        {dateMinute} {dateAMOrPM}
      </h5>
    );
  }
  return (
    <Wrapper>
      <form className="form">
        <h3>Monitoring</h3>
        {monitoringTime}
        <div className="form-center">
          {/* Monitoring - ON or OFF */}
          <FormRowSelect
            labelText="Monitoring Setting"
            name="monitorSetting"
            value={monitorSetting}
            handleChange={handleInput}
            list={validMonitorSettingOptions}
          />
          {body}
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Confirm
            </button>
            <button
              type="reset"
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();

                if (monitorSetting === MonitorSettingOptions.ON) {
                  dispatch(clearMonitorForm());
                }
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default Monitoring;
