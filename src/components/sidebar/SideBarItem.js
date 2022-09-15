import { ArrowRightIcon } from '@chakra-ui/icons'
import { ArrowRight } from '@material-ui/icons'
import React from 'react'
import '../../styles/SidebarItem.css'



const SidebarItem = ({arrow, icon, label}) => {
  return (
    <div className='sidebarItem'>
        <div className='sidebarItem__arrow'>
            {arrow && (<ArrowRightIcon/>)}
        </div>

        <div className='sidebarItem__main'>
            {icon}
            <p>{label}</p>
        </div>

        
    </div>
    
  )
}

export default SidebarItem