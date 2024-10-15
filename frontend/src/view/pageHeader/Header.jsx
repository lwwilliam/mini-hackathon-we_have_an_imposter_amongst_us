import React from "react";

const PageHeader = () => {
	return (
		<div id="header" className='bg-[#1e1e1e]/[.58] w-screen h-16 flex gap-x-8 text-center font-semibold'>
			<div className="ml-[50px]"></div>
			<a href="/" className="cursor-pointer my-4 mx-6 text-2xl text-white hover:underline">Resume</a>
			<a href="/job" className="cursor-pointer my-4 mx-6 text-2xl text-white hover:underline">Job Descriptions</a>
		</div>
	)
}

export default PageHeader
