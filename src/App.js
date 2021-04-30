import { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";
import ButtonOnlyText from "./components/ButtonOnlyText";
import firebase from "firebase/app";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));
function App() {
    const [posts, setPosts] = useState([]);

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [toDo, setToDo] = useState("");
    const [toDoList, setToDoList] = useState([]);

    useEffect(() => {
        const unsuscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser);
                setUser(authUser);
            } else {
                setUser(null);
            }
        });
        return () => {
            unsuscribe();
        };
    }, [user, username]);

    useEffect(() => {
        const unsuscribe = db

            .collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setPosts(
                    snapshot.docs.map((doc) => ({
                        post: doc.data(),
                        id: doc.id,
                    }))
                );
            });
        return () => unsuscribe();
    }, []);
    useEffect(() => {
        const unsuscribe = db

            .collection("toDo")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setToDoList(
                    snapshot.docs.map((doc) => ({
                        data: doc.data(),
                        id: doc.id,
                    }))
                );
            });
        return () => unsuscribe();
    }, []);

    const signUp = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: username,
                });
            })
            .catch((err) => alert(err.message));
        setOpen(false);
    };

    const signIn = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password).catch((err) =>
            alert(err.message)
        );
        setOpenSignIn(false);
    };
    const addNewToDo = (e) => {
        e.preventDefault();
        db.collection("toDo").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            toDo: toDo,
        });
    };

    return (
        <div className="app">
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <img
                            className="app__headerImage"
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                            alt=""
                        />
                        <Input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signUp}>
                            Enviar
                        </Button>
                    </form>
                </div>
            </Modal>
            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <img
                            className="app__headerImage"
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                            alt=""
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signIn}>
                            Enviar
                        </Button>
                    </form>
                </div>
            </Modal>
            <div className="app__header">
                <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                />
                {user ? (
                    <Button onClick={() => auth.signOut()}>Log out</Button>
                ) : (
                    <div className="app__loginContainer">
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                        <Button onClick={() => setOpenSignIn(true)}>
                            Sign In
                        </Button>
                    </div>
                )}
            </div>
            <ul className="app__toDo">
                <li>Añadir option para borrar comentarios</li>
                <li>Añadir opcion para borrar posts</li>
                <li>
                    Extraer codigo a componentes separados y custom hooks para
                    las operaciones de firebase
                </li>
                {toDoList.map((toDo, index) => (
                    <li key={toDo.id}>{toDo.data.toDo}</li>
                ))}
                <form>
                    <input
                        type="text"
                        value={toDo}
                        onChange={(e) => setToDo(e.target.value)}
                    />
                    <ButtonOnlyText
                        title="Añadir"
                        color="#0095f6"
                        onClick={addNewToDo}
                    />
                </form>
            </ul>
            {user ? (
                user.displayName ? (
                    <ImageUpload username={user.displayName} />
                ) : (
                    <p>You dont have a displayname</p>
                )
            ) : (
                <p>You need to be logged in to upload an image</p>
            )}

            {posts.map(({ id, post }) => {
                return (
                    <Post
                        key={id}
                        postId={id}
                        imageUrl={post.imageUrl}
                        username={post.username}
                        caption={post.caption}
                        currentUser={user?.displayName}
                    />
                );
            })}
        </div>
    );
}

export default App;
