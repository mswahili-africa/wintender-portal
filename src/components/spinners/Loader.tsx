const Loader = ({ message = "Loading data..." }: { message?: string }) => (
    <div className="flex justify-center items-center my-8">
      <div className="loader w-8 h-8"></div>
      <span className="ml-2 text-gray-500">{message}</span>
    </div>
  );
  
  export default Loader;
  