import React from "react";

const PageHeader = () => {
	return (
		<div id="header" className='bg-[#1e1e1e]/[.58] w-screen h-16 flex gap-x-3 text-center font-semibold'>
			<img src="/Experian-Logo.png" className="w-[7.6rem] h-[3.8rem]" />
			<a href="/" className="cursor-pointer my-4 mr-6 text-2xl text-white hover:underline">Resumes</a>
			<a href="/job" className="cursor-pointer my-4 mx-6 text-2xl text-white hover:underline">Jobs</a>
		</div>
	)
}

export default PageHeader
