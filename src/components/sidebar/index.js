import React from 'react'
import Newfile from './Newfile'
import SidebarItem from './SideBarItem';
import '../../styles/Sidebar.css';


import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import StorageIcon from '@material-ui/icons/Storage';


const index = () => {
  return (
    <div className='sideBar'>
        <Newfile/>

        <div className='sidebar__itemsContainer'>

            <SidebarItem arrow icon={(<InsertDriveFileIcon />)} label={'My Files'} />
            <SidebarItem arrow icon={(<ImportantDevicesIcon />)} label={'Permanent storage'} />
            <SidebarItem icon={(<PeopleAltIcon />)} label={'Shared with me'} />
            <SidebarItem icon={(<QueryBuilderIcon />)} label={'Recent'} />
            <SidebarItem icon={(<StarBorderIcon />)} label={'Starred'} />
            <SidebarItem icon={(<DeleteOutlineIcon />)} label={'Bin'} />
            <hr/>

            <SidebarItem icon={(<StorageIcon />)} label={'Storage'} />



        </div>
    </div>
  )
}

export default index