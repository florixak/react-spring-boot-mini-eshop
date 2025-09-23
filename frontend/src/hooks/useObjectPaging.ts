import type { PagingObjectResponse } from "@/types/responses";

const useObjectPaging = <T>(data: PagingObjectResponse<T> | undefined) => {
  const items = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.page || 0;

  return {
    items,
    totalItems,
    totalPages,
    currentPage: currentPage + 1,
  };
};

export default useObjectPaging;
