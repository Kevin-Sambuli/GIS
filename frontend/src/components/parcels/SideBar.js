import "./SideBar.css";
import {useState} from "react";

const SideBar = () => {
    const [isActive, setIsActive] = useState(false);


    const handleClick = event => {
        // 👇️ toggle isActive state variable
        setIsActive(current => !current);
        //  event.currentTarget.classList.toggle('open');
    };

    return (
        <div id="sidebar" className={isActive ? 'open' : ''}>
            <div className='content' onClick={handleClick}>
                <span>Table&nbsp;Attributes</span>
            </div>
            <div id="contentList">
                <h2 className="header">Attributes</h2>
                <ul>
                </ul>
            </div>
        </div>
)
};

export default SideBar;