

const Home = () => {
  return (
    <div className="container max-w-full bg-[#000000c7]  mx-auto p-4 min-h-screen flex items-center justify-center ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-full">
        <div className="flex flex-col gap-4">
          <div className="p-6 bg-[#131729] min-h-[80vh] text-white rounded-lg shadow-md h-40 flex items-center justify-center">
          Container 1
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-6 bg-[#131729] min-h-[80vh] text-white rounded-lg shadow-md h-40 flex items-center justify-center">
          Container 2
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
