// PostList.js 

import React from "react";

import Post from "../components/Post";

import post from "../redux/modules/post";

// redux에 있는 데이터를 페이지에서 불러오기 위해서 
import {useSelector, useDispatch} from "react-redux";
import {actionCreators as postActions} from "../redux/modules/post";

const PostList = (props) => {
    const dispatch = useDispatch();
    // PostList에서 목록 받기 
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);
    console.log(post_list);
    console.log(user_info);

    // React.useEffect(() => {

    //     //post를 가지고 오는 순간에 dispatch를 해주기 때문에 순서가 뒤죽박죽됨.
    //     //dispatch(postActions.getPostFB());
    //     if (post_list.length === 0) {
    //       dispatch(postActions.getPostFB());
    //     }

    // }, []);

    // // Post에 값 넘겨주기 
    // return (
    //     <React.Fragment>
    //         {post_list.map((p, idx) => {
    //             return <Post key={p.id} {...p}/>
    //         })}
    //     </React.Fragment>
    // )

    React.useEffect(() => {
        console.log('in list');

        dispatch(postActions.getPostFB());

    }, []);

    return (
        <React.Fragment>
            {post_list.map((p, idx) => {

                console.log(p);
                
                if(p.user_info.user_id === user_info?.uid){
                    return <Post key={p.id} {...p} is_me/>
                }
                return <Post key={p.id} {...p} />
            })}
        </React.Fragment>
    )
}

export default PostList;