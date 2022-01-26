import { useState, useContext } from 'react';
import { AppContext } from '../AppContextProvider';
import { Typography, TextField, Grid, Button } from '@material-ui/core';
import Main from '../components/Main';
import ImageUpload from '../components/ImageUpload';
import { useHistory } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import { EditorState, convertToRaw } from 'draft-js';

export default function NewArticlePage() {

    const [hasErrors, setHasErrors] = useState(false);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const history = useHistory();
    const { addArticle } = useContext(AppContext);

    const isError = (condition) => hasErrors && condition;

    async function handleOk() {
        setHasErrors(true);

        if (title.length > 0 && image != null && editorState.getCurrentContent().getPlainText().length > 0) {

            // We're ready to add the article!
            // TODO Some form of error handling?
            const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
            const newArticle = await addArticle(title, image, content);
            console.log(newArticle);
            history.replace(`/articles/${newArticle._id}`);
        }
    }

    function handleCancel() {
        history.goBack();
    }

    return (
        <Main title="Tell us your story!">
            <Grid container spacing={3} justify="space-between">
                <Grid item xs={12}>
                    <Typography variant="h6" component="h6">Enter a title for your article:</Typography>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="new-article-name"
                        label="Title"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        error={isError(title.length === 0)}
                        helperText={isError(title.length === 0) && "Please enter a title!"}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6" component="h6">Choose a main image:</Typography>
                    <ImageUpload
                        onChange={e => setImage(e.target.files[0])}
                        error={isError(image === null)}
                        helperText={isError(image === null) && "Please choose an image!"}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6" component="h6">Share your ideas here:</Typography>
                    <RichTextEditor
                        editorState={editorState}
                        error={isError(editorState.getCurrentContent().getPlainText().length === 0)}
                        onChange={(state) => setEditorState(state)}
                    />
                </Grid>

                <Grid item />
                <Grid item>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button color="primary" variant="contained" onClick={handleOk}>Post article 😀</Button>
                        </Grid>
                        <Grid item>
                            <Button color="secondary" variant="contained" onClick={handleCancel}>Cancel 😥</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Main>
    );
}