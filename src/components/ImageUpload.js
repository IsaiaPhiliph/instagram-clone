import { Button, Input } from "@material-ui/core";
import React, { useState } from "react";
import "./ImageUpload.css";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { storage, db } from "../firebase";
import firebase from "firebase/app";

function ImageUpload({ username }) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
            },
            (err) => {
                console.log(err.message);
            },
            () => {
                //complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                        });
                        setProgress(0);
                    })
                    .catch((err) => console.log(err.message));
            }
        );
    };

    return (
        <div className="ImageUpload__container">
            <Input type="file" onChange={handleChange} />
            <Input
                type="text"
                placeholder="Comentario"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
            />
            <Button
                type="submit"
                onClick={handleUpload}
                startIcon={<CloudUploadIcon />}
            />
        </div>
    );
}

export default ImageUpload;
