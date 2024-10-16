import React from "react"

const TagDivs = ({tagData, clicked, onClick}) => {
	const clickHandler = () => {
		onClick()
	}

	return (
	<div 
		className={`px-3 border-1 border-black border-solid rounded-xl ${clicked ? 'bg-green-500' : 'bg-white'}`}
		onClick={clickHandler}
	>
		{tagData.tag_name}
	</div>
	)
}

export default TagDivs