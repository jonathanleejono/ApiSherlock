import React, { useReducer, useContext } from "react";

import reducer from "./reducer";
import axios from "axios";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_TICKET_BEGIN,
  CREATE_TICKET_SUCCESS,
  CREATE_TICKET_ERROR,
  GET_TICKETS_BEGIN,
  GET_TICKETS_SUCCESS,
  SET_EDIT_TICKET,
  DELETE_TICKET_BEGIN,
  EDIT_TICKET_BEGIN,
  EDIT_TICKET_SUCCESS,
  EDIT_TICKET_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
} from "./actions";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  showSidebar: false,
  isEditing: false,
  editTicketId: "",
  ticketTitle: "",
  ticketDescription: "",
  ticketDueDate: "",
  ticketAssignees: "",
  ticketPriorityOptions: ["High", "Medium", "Low"],
  ticketPriority: "High",
  ticketStatusOptions: ["Open", "Pending", "Done"],
  ticketStatus: "Open",
  ticketTypeOptions: ["Issue", "Bug", "Feature Request"],
  ticketType: "Issue",
  tickets: [],
  totalTickets: 0,
  numOfPages: 1,
  page: 1,
  statsStatus: {},
  statsPriority: {},
  statsType: {},
  monthlyApplications: [],
  search: "",
  searchTicketStatus: "All",
  searchTicketPriority: "All",
  searchTicketType: "All",
  sort: "Latest",
  sortOptions: ["Latest", "Oldest", "A-Z", "Z-A"],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  // request
  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // response
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log(error.response)
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const addUserToLocalStorage = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, token } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, alertText },
      });
      addUserToLocalStorage({ user, token });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);

      const { user, token } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token },
      });

      addUserToLocalStorage({ user, token });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const createTicket = async () => {
    dispatch({ type: CREATE_TICKET_BEGIN });
    try {
      const {
        ticketTitle,
        ticketDescription,
        ticketAssignees,
        ticketDueDate,
        ticketPriority,
        ticketType,
        ticketStatus,
      } = state;
      await authFetch.post("/tickets", {
        ticketTitle,
        ticketDescription,
        ticketAssignees,
        ticketDueDate,
        ticketPriority,
        ticketType,
        ticketStatus,
      });
      dispatch({ type: CREATE_TICKET_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_TICKET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getTickets = async () => {
    const {
      page,
      search,
      searchTicketStatus,
      searchTicketPriority,
      searchTicketType,
      sort,
    } = state;

    let url = `/tickets?page=${page}&ticketStatus=${searchTicketStatus}&ticketPriority=${searchTicketPriority}&ticketType=${searchTicketType}&sort=${sort}`;

    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_TICKETS_BEGIN });

    try {
      const { data } = await authFetch(url);
      const { tickets, totalTickets, numOfPages } = data;
      dispatch({
        type: GET_TICKETS_SUCCESS,
        payload: {
          tickets,
          totalTickets,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditTicket = (id) => {
    dispatch({ type: SET_EDIT_TICKET, payload: { id } });
  };
  const editTicket = async () => {
    dispatch({ type: EDIT_TICKET_BEGIN });

    try {
      const {
        ticketTitle,
        ticketDescription,
        ticketAssignees,
        ticketDueDate,
        ticketPriority,
        ticketType,
        ticketStatus,
      } = state;
      await authFetch.patch(`/tickets/${state.editTicketId}`, {
        ticketDescription,
        ticketTitle,
        ticketAssignees,
        ticketDueDate,
        ticketPriority,
        ticketType,
        ticketStatus,
      });
      dispatch({ type: EDIT_TICKET_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_TICKET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const deleteTicket = async (ticketId) => {
    dispatch({ type: DELETE_TICKET_BEGIN });
    try {
      await authFetch.delete(`/tickets/${ticketId}`);
      getTickets();
    } catch (error) {
      logoutUser();
    }
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch("/tickets/stats");
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          statsStatus: data.defaultStats,
          statsPriority: data.defaultStats,
          statsType: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createTicket,
        getTickets,
        setEditTicket,
        deleteTicket,
        editTicket,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
