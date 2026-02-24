export function TableLoading() {
  return (
    <>
            <tbody className=" w-full animate-pulse">
              {[...Array(4)].map((_, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-6 py-4">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-4"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  </td>
                </tr>
              ))}
              </tbody>
         
    </>
  );
}
