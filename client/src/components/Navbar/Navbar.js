import React, { useState, useEffect } from 'react'

import { Link, useHistory, useLocation } from 'react-router-dom'
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core'
// import memories from '../../images/memories.PNG'
import memoriesLogo from '../../images/memoriesLogo.PNG'
import memoriesText from '../../images/memoriesText.PNG'
import { useDispatch } from 'react-redux'
import decode from 'jwt-decode'

import useStyles from './styles'

const Navbar = () => {
   const classes = useStyles()
   const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
   const dispatch = useDispatch()
   const history = useHistory()
   const location = useLocation()

   const logout = () => {
       dispatch({ type: 'LOGOUT' })

     history.push('/')
       setUser(null)
   }

   

   useEffect(() => {
       const token = user?.token

       //JWT...
       if(token) {
           const decodedToken = decode(token)
      
           if(decodedToken.exp = 1000 < new Date().getTime()) logout()

       }


       setUser(JSON.parse(localStorage.getItem('profile')))
   },[location])

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
        <Link to='/' className={classes.brandContainer}>
            <img src={memoriesText} alt='icon' height='45px' />
            <img className={classes.image} src={memoriesLogo} alt='memories' height='40px' />
        </Link>
        <Toolbar className={classes.toolbar}>
            {user ? (
                <div className={classes.profile}>
                     <Avatar className={classes.purple} alt={user.result.name} src={user.result.name.slice(0,1)}>{user.result.imageURL}</Avatar> 
                    <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography>
                    <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>Logout</Button>
                </div>
            ) : (
                <Button component={Link} className={classes.signin} to='/auth' variant='contained' color='primary'>
                    Sign In
                </Button>
            )}
        </Toolbar>
   </AppBar>
  )
}

export default Navbar