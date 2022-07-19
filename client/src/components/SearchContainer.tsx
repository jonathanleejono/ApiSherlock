import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";
import React from "react";

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchTicketStatus,
    searchTicketPriority,
    searchTicketType,
    sort,
    sortOptions,
    handleChange,
    clearFilters,
    ticketPriorityOptions,
    ticketStatusOptions,
    ticketTypeOptions,
  } = useAppContext();

  const handleSearch = (e) => {
    if (isLoading) return;
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters();
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          {/* search for ticket */}
          <FormRow
            type="text"
            labelText="ID search"
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          {/* search by status */}
          <FormRowSelect
            labelText="status"
            name="searchTicketStatus"
            value={searchTicketStatus}
            handleChange={handleSearch}
            list={["All", ...ticketStatusOptions]}
          />
          {/* search by priority */}
          <FormRowSelect
            labelText="priority"
            name="searchTicketPriority"
            value={searchTicketPriority}
            handleChange={handleSearch}
            list={["All", ...ticketPriorityOptions]}
          />
          {/* search by type */}
          <FormRowSelect
            labelText="type"
            name="searchTicketType"
            value={searchTicketType}
            handleChange={handleSearch}
            list={["All", ...ticketTypeOptions]}
          />
          {/* sort */}
          <FormRowSelect
            labelText="sort"
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
