const DeveloperCardSkeleton = () => {
    return (
        <div className="bg-white/[0.05] rounded-2xl overflow-hidden
                      border border-white/[0.05] backdrop-blur-xl">
            <div className="p-6 flex flex-col items-center">
             
                <div className="w-20 h-20 rounded-full bg-white/[0.05] mb-4 
                              animate-pulse" />

    
                <div className="w-32 h-4 bg-white/[0.05] rounded mb-2 
                              animate-pulse" />

 
                <div className="w-24 h-3 bg-white/[0.05] rounded mb-4 
                              animate-pulse" />


                <div className="w-full h-8 bg-white/[0.05] rounded-xl 
                              animate-pulse" />

                <div className="flex justify-center space-x-4 mt-4">
                    <div className="w-4 h-4 bg-white/[0.05] rounded 
                                  animate-pulse" />
                    <div className="w-4 h-4 bg-white/[0.05] rounded 
                                  animate-pulse" />
                    <div className="w-4 h-4 bg-white/[0.05] rounded 
                                  animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default DeveloperCardSkeleton;