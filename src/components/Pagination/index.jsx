

import React from "react";
import Pagination from "react-js-pagination";
import "./pagination.css"

export default function CustomPagination({
  currentPage,
  totalItem,
  totalPages,
  onPageChange,
}) {
  const itemsPerPage = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE) || 10; // Items per page from environment or default 10

  if (totalItem <= itemsPerPage) {
    return null; // Don't render pagination if items are less than per page limit
  }

  return (
    <div className="lg:flex grid gap-3 justify-between items-center mt-5 mb-5">
      {/* Displaying the item range */}
      <p className="text-sm text-gray-700">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItem)} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItem)} of{" "}
        <span className="font-medium">{totalItem}</span> results
      </p>

      {/* React-JS Pagination */}
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={totalItem}
        pageRangeDisplayed={5} // Adjust number of pages to display
        onChange={onPageChange} // Change the page on click
        itemClass="page-item" // Bootstrap class for item
        linkClass="page-link" // Bootstrap class for links
        prevPageText="‹"
        nextPageText="›"
        firstPageText="«"
        lastPageText="»"
      />
    </div>
  );
}



//Custom paginate

// import React from 'react';

// export default function Pagination({
// 	currentPage,
// 	totalItem,
// 	totalPages,
// 	onPageChange,
// }) {
// 	const itemPerPage = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE) || 10;

// 	if (totalItem <= itemPerPage) {
// 		return null;
// 	}

// 	const handlePageChange = (page) => {
// 		if (page > 0 && page <= totalPages) {
// 			onPageChange(page);
// 		}
// 	};
// 	const getPaginationItems = () => {
// 		const paginationItems = [];
// 		const totalPagesToShow = 5; // Number of page buttons to show
// 		const range = Math.floor(totalPagesToShow / 2); // Half the range on either side of the current page

// 		if (totalPages <= totalPagesToShow) {
// 			// If there are fewer pages than the total pages to show, display all pages
// 			for (let i = 1; i <= totalPages; i++) {
// 				paginationItems.push(i);
// 			}
// 		} else {
// 			// Always add the first page
// 			paginationItems.push(1);

// 			let start = Math.max(2, currentPage - range);
// 			let end = Math.min(totalPages - 1, currentPage + range);

// 			if (start > 2) {
// 				paginationItems.push('...');
// 			}

// 			for (let i = start; i <= end; i++) {
// 				paginationItems.push(i);
// 			}

// 			if (end < totalPages - 1) {
// 				paginationItems.push('...');
// 			}

// 			// Always add the last page
// 			paginationItems.push(totalPages);
// 		}

// 		return paginationItems;
// 	};

// 	const paginationItems = getPaginationItems();

// 	return (
// 		<div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
// 			<div className='flex flex-1 justify-between sm:hidden'>
// 				<button
// 					onClick={() => handlePageChange(currentPage - 1)}
// 					disabled={currentPage === 1}
// 					className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
// 				>
// 					Previous
// 				</button>
// 				<button
// 					onClick={() => handlePageChange(currentPage + 1)}
// 					disabled={currentPage === totalPages}
// 					className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
// 				>
// 					Next
// 				</button>
// 			</div>
// 			<div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
// 				<div>
// 					<p className='text-sm text-gray-700'>
// 						Showing{' '}
// 						<span className='font-medium'>
// 							{(currentPage - 1) * itemPerPage + 1}
// 						</span>{' '}
// 						to{' '}
// 						<span className='font-medium'>
// 							{Math.min(currentPage * itemPerPage, totalItem)}
// 						</span>{' '}
// 						of <span className='font-medium'>{totalItem}</span>{' '}
// 						results
// 					</p>
// 				</div>
// 				<div>
// 					<nav
// 						aria-label='Pagination'
// 						className='isolate inline-flex -space-x-px rounded-md shadow-sm'
// 					>
// 						<button
// 							onClick={() => handlePageChange(currentPage - 1)}
// 							disabled={currentPage === 1}
// 							className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
// 						>
// 							<span className='sr-only'>Previous</span>
// 							{/* <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" /> */}
// 						</button>
// 						{paginationItems.map((item, index) =>
// 							item === '...' ? (
// 								<span
// 									key={index}
// 									className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300'
// 								>
// 									...
// 								</span>
// 							) : (
// 								<button
// 									key={item}
// 									onClick={() => handlePageChange(item)}
// 									aria-current={
// 										currentPage === item
// 											? 'page'
// 											: undefined
// 									}
// 									className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
// 										currentPage === item
// 											? 'bg-indigo-600 text-white'
// 											: 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
// 									} focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
// 								>
// 									{item}
// 								</button>
// 							)
// 						)}
// 						<button
// 							onClick={() => handlePageChange(currentPage + 1)}
// 							disabled={currentPage === totalPages}
// 							className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
// 						>
// 							<span className='sr-only'>Next</span>
// 							{/* <ChevronRightIcon aria-hidden="true" className="h-5 w-5" /> */}
// 						</button>
// 					</nav>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
