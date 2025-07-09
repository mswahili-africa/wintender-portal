import { Puff } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div className="flex justify-center items-center space-x-2">
            <Puff
                color="#00A651"
                height={50}
                width={50}
            />
            {/* <div className="text-gray-600">Loading...</div> */}
        </div>
    );
};

export default Loader;
