import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { changePage, getAllApis } from "src/features/allApis/allApisSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";
import Wrapper from "../assets/wrappers/PageBtnContainer";

const PageBtnContainer = () => {
  const dispatch = useAppDispatch();
  const { numOfPages, page } = useAppSelector((store) => store.allApis);

  const pages = Array.from({ length: numOfPages }, (_, index) => index + 1);

  const nextPage = () => {
    let newPage = page + 1;
    if (newPage > numOfPages) {
      newPage = 1;
    }
    dispatch(changePage(newPage));
    dispatch(getAllApis());
  };

  const prevPage = () => {
    let newPage = page - 1;
    if (newPage < 1) {
      newPage = numOfPages;
    }
    dispatch(changePage(newPage));
    dispatch(getAllApis());
  };

  return (
    <Wrapper>
      <button type="button" className="prev-btn" onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {pages.map((pageNumber) => (
          <button
            type="button"
            className={pageNumber === page ? "pageBtn active" : "pageBtn"}
            key={pageNumber}
            onClick={() => {
              dispatch(changePage(pageNumber));
              dispatch(getAllApis());
            }}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button type="button" className="next-btn" onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
