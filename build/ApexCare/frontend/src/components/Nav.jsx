
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import '../styles.css';
import homeIcon from "../assets/home.png";
import tasksIcon from "../assets/tasks.png";
import serviceIcon from "../assets/service.png";
import clientIcon from "../assets/client.png";
import phoneIcon from "../assets/phone.png";
import toolsIcon from "../assets/tools.png";

const Nav = () => {

const [isNavVisible, setIsNavVisible] = useState(false);
const [isToolOpen, setIsToolOpen] = useState(false);

const toggleNav = () => {
  setIsNavVisible(!isNavVisible);
};
const toggleTool = () => {
  setIsToolOpen(!isToolOpen);
}

const navigate = useNavigate();

  return (
    <div className="nav">
      <div id="toolbox" alt="Toolbox"  onClick={() => {toggleNav(); toggleTool();}} className={isToolOpen ? 'open' : 'close'}></div>
      <div id="navigation" className={isNavVisible ? 'show' : 'hide'}>
        <div className="group" onClick={() => navigate('/home')}>
        <img className="navimg" alt="Home" src={homeIcon} />
          <div className="textHeader">Home</div>
        </div>
        <div className="group" onClick={() => navigate('/jobs-scheduled')}>
        <img className="navimg" alt="Tasks" src={tasksIcon} />
          <div className="textHeader">Jobs Scheduled</div>
        </div>
        <div className="group" onClick={() => navigate('/service-packages')}>
        <img className="navimg" alt="Service" src={serviceIcon} />
          <div className="textHeader">Service Packages</div>
        </div>
        <div className="group" onClick={() => navigate('/client-management')}>
        <img className="navimg" alt="Client" src={clientIcon} />
          <div className="textHeader">Client Management</div>
        </div>
        <div className="group" onClick={() => navigate('/call-desk')}>
        <img className="navimg" alt="Phone" src={phoneIcon} />
          <div className="textHeader">Call Desk</div>
        </div>
        <div className="group" onClick={() => navigate('/technicians')}>
        <img className="navimg" alt="Tools" src={toolsIcon} />
          <div className="textHeader">Technicians</div>
        </div>
      </div>
    </div>
  );
};


export default Nav;