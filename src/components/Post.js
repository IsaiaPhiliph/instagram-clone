import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase/app";
import ButtonOnlyText from "./ButtonOnlyText";

function Post({ postId, imageUrl, username, caption, currentUser }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsuscribe;
        if (postId) {
            unsuscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                    setComments(
                        snapshot.docs.map((doc) => {
                            return { data: doc.data(), id: doc.id };
                        })
                    );
                });
        }
        return () => unsuscribe();
    }, [postId]);

    const uploadComment = (e) => {
        e.preventDefault();
        if (currentUser) {
            if (comment === "") {
                alert("No puedes enviar un comentario vacio!!");
            } else {
                db.collection("posts").doc(postId).collection("comments").add({
                    text: comment,
                    username: currentUser,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
        } else {
            alert("Necesitas estar registrado para postear un comentario");
        }
    };
    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="IsaiaPhiliph" />
                <h3>Username</h3>
            </div>
            <div className="post__imageWrapper">
                <img className="post__image" src={imageUrl} alt="" />
            </div>
            <h4 className="post__text">
                <strong>{username}:</strong>
                {caption}
            </h4>
            <ul className="post__comments">
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <p>
                            <strong>{comment.data.username}: </strong>
                            {comment.data.text}
                        </p>
                    </li>
                ))}
            </ul>
            <form className="post__addComent">
                <input
                    type="text"
                    placeholder="Añadir comentario"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <ButtonOnlyText
                    title="Enviar"
                    onClick={uploadComment}
                    color="#0095f6"
                    opacity={comment ? "1" : ".3"}
                    disabled={comment ? false : true}
                />
            </form>
        </div>
    );
}

export default Post;
