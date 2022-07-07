import React, { useState, useRef } from 'react'
import { Typography, TextField, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import useStyles from './styles'
import { commentPost } from '../../actions/posts'


const CommentSection = ({ post }) => {
 
    const classes = useStyles()
    const [comments, setComments] = useState(post?.comments)
    const [comment, setComment] = useState('')
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'))


    const handleClick = () => {
        const finalComment = `${comment}`
        dispatch(commentPost(finalComment, post._id))
       console.log(finalComment, post._id) 
    }

  
    return (

      
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant='h6'>Comments</Typography>
                       {comments?.map((c, i) =>  (
                
                        <Typography key={i} gutterBottom variant='subtitle1'>comment {i}:  {c} </Typography>
                        // <Typography gutterBottom variant='subtitle1'>comment</Typography> 
                     )   
                          
                        
                       )}
                       
                </div>
                {/* {user?.result?.name && ( */}
                <div style={{ width: '70%' }}>
                <Typography gutterBottom variant='h6'>Write a Comment</Typography>
                <TextField 
                    fullWidth
                    rows={4}
                    variant='outlined'
                    label='Comment'
                    multiline
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <Button style={{ marginTop: '10px', backgroundColor: 'blue', color: 'white' }} fullWidth disabled={!comment} variant='contained' color='primary' onClick={handleClick}>
                    Comment
                </Button>
                </div>
                {/* )}   */}
            </div>
        </div>
    )
}

export default CommentSection