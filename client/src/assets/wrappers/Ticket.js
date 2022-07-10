import styled from "styled-components";

const Wrapper = styled.article`
  background: var(--white);
  border-radius: var(--borderRadius);
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: var(--shadow-2);

  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    h5 {
      letter-spacing: 0;
    }
  }
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary-500);
    border-radius: var(--borderRadius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }
  .info {
    h4 {
      margin-bottom: 0.25rem;
    }
    p {
      margin: 0;
      color: var(--grey-600);
      letter-spacing: var(--letterSpacing);
    }
  }
  .status {
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: center;
    width: 100px;
    height: 30px;
    // margin-top: 0.5rem;
  }
  .Open {
    background: #fcefc7; //yellow
    color: #b57c03;
  }
  .Pending {
    background: #e0e8f9; //blue
    color: #647acb;
  }
  .Done {
    color: var(--green-dark);
    background: var(--green-light);
  }
  .Low {
    background: #ededed; //gray
    color: #4d4d4d;
  }
  .Medium {
    background: #fce7c7; //orange
    color: #f3893d;
  }
  .High {
    color: #ffffff; //red
    background: #d66a6a;
  }
  .content {
    padding: 1rem 1rem 1.5rem 2rem;
  }
  .content-center {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.75rem;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (min-width: 992px) {
      grid-template-columns: 1fr;
    }
    @media (min-width: 1120px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  footer {
    margin-top: 1rem;
  }
  .edit-btn,
  .delete-btn {
    letter-spacing: var(--letterSpacing);
    cursor: pointer;
    // height: 30px;
    padding: 0.75rem 1.5rem;
    margin-top: 0.5rem;
  }
  .edit-btn {
    color: var(--green-dark);
    background: var(--green-light);
    margin-right: 0.5rem;
  }
  .delete-btn {
    color: var(--red-dark);
    background: var(--red-light);
  }
  &:hover .actions {
    visibility: visible;
  }
`;

export default Wrapper;
