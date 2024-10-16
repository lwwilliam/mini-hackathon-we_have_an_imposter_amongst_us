import React from "react";

const PageHeader: React.FC = () => {
    return (
        <div id="header" className='bg-[#1e1e1e]/[.58] w-screen h-16 flex gap-x-8 text-center font-semibold pl-[50px]'>
            <a href="/" className="cursor-pointer my-4 mx-6 text-2xl text-white hover:underline">Resumes</a>
            <a href="/job" className="cursor-pointer my-4 mx-6 text-2xl text-white hover:underline">Jobs</a>
        </div>
    );
}

export default PageHeader;
