import { Button } from "@/components/ui/button";

function TablePagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex items-center justify-between mt-6 w-11/12 mx-auto">
      <p className="text-sm text-primary-foreground font-bold">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="cursor-pointer"
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default TablePagination;
